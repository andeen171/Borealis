from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Order, Category, Offer, Contract, Image, DeliveryStage, DiagnosticStage, FixingStage
from Borealis.permissions import IsClient, IsTechnician
from .serializers import (OrderSerializer, CategorySerializer, OfferSerializer, ContractSerializer,
                          OrderImageSerializer, DeliveryStageSerializer, DiagnosticStageSerializer,
                          FixingStageSerializer, CreateContractSerializer)


class ListOrdersAPI(APIView):
    def get(self, request, *args, **kwargs):
        orders = Order.objects.all()
        results = []
        for order in orders:
            images = Image.objects.filter(order=order)
            if images.exists():
                order_image = OrderImageSerializer({'info': order, 'images': images})
                results.append(order_image.data)
        return Response(results, status=status.HTTP_200_OK)


class CreateOrderAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsClient,
    ]

    def post(self, request, *args, **kwargs):
        request.data['user'] = request.user.id
        serializer = OrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        image_objs = []
        images = request.FILES.getlist('images')
        for image in images:
            image = Image(src=image, order=order)
            image.save()
            image_objs.append(image)
        order_image = OrderImageSerializer({'info': order, 'images': image_objs})
        return Response(order_image.data, status=status.HTTP_200_OK)


class CreateCategoryAPI(generics.CreateAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CreateOfferAPI(generics.CreateAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsTechnician,
    ]
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer

    def create(self, request, *args, **kwargs):
        request.data['user'] = request.user.id
        return super(CreateOfferAPI, self).create(request, *args, **kwargs)


class OrderDetailAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, order_id, *args, **kwargs):
        order = Order.objects.filter(id=order_id)
        if not order.exists():
            return Response({'Not found': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        order = order[0]
        images = Image.objects.filter(order=order)
        offers = Offer.objects.filter(order=order)
        order = OrderImageSerializer({'images': images, 'info': order})
        order = order.data
        if offers.exists() and not request.user.is_staff:
            offers_serializer = OfferSerializer(offers, many=True)
            offers = offers_serializer.data
            return Response({
                'order': order,
                'offers': offers
            }, status=status.HTTP_200_OK)
        return Response({'order': order}, status=status.HTTP_200_OK)


class OfferDetailAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = OfferSerializer

    def get(self, request, offer_id, *args, **kwargs):
        offer = Offer.objects.filter(id=offer_id)
        if not offer.exists():
            return Response({'Not found': 'Offer not found'}, status=status.HTTP_404_NOT_FOUND)
        offer = offer[0]
        offer_owner = offer.user.id
        order = offer.order
        order_owner = order.user.id
        if request.user.id == offer_owner or request.user.id == order_owner:
            serializer = self.serializer_class(offer)
            return Response({
                "Offer": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({'PermissionDenied': 'Permission Denied'}, status=status.HTTP_401_UNAUTHORIZED)


class CreateContractAPI(generics.CreateAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsClient,
    ]
    queryset = Contract.objects.all()
    serializer_class = CreateContractSerializer

    def create(self, request, *args, **kwargs):
        offer = Offer.objects.get(id=request.data['offer'])
        if request.user != offer.order.user:
            return Response({'Permission Denied': 'Only the owner of the order can accept a offer'},
                            status=status.HTTP_401_UNAUTHORIZED)
        if offer.accepted:
            return Response({"Offer already Accepted": "Theres already a contract with this offer"},
                            status=status.HTTP_304_NOT_MODIFIED)
        offer.accepted = True
        offer.save()
        request.data['client'] = request.user.id
        request.data['order'] = offer.order.id
        request.data['value'] = offer.value_estimate
        request.data['technician'] = offer.user.id
        return super(CreateContractAPI, self).create(request, *args, **kwargs)


class ContractDetailsAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, contract_id, *args, **kwargs):
        contract = Contract.objects.filter(id=contract_id)
        if not contract.exists():
            return Response({'Not found': 'Contract not found'}, status=status.HTTP_404_NOT_FOUND)
        contract = contract[0]
        if request.user == contract.client or request.user == contract.technician:
            serializer = ContractSerializer(contract)
            contract = serializer.data
            return Response(contract, status=status.HTTP_200_OK)
        return Response({'Access denied': 'Only the client and technician have access to their contract'},
                        status=status.HTTP_401_UNAUTHORIZED)


class AdvanceStageAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsTechnician
    ]

    def post(self, request, *args, **kwargs):
        contract = Contract.objects.filter(id=request.POST.get('contract'))
        if not contract.exists():
            return Response({'Not found': 'Contract not found'}, status=status.HTTP_404_NOT_FOUND)
        contract = contract[0]
        if request.user != contract.technician:
            return Response({'Permission Denied': 'Only the technician working on the order can modify the contract'},
                            status=status.HTTP_401_UNAUTHORIZED)
        if contract.stage == 3:
            stage = FixingStage.objects.get(id=contract.third_stage)
            stage.finished = True
            stage.save()
            contract.finished = True
            contract.save()
            return Response({'Contract Finished': 'Contract completed it last stage'}, status=status.HTTP_200_OK)
        if contract.stage == 2:
            stage = DiagnosticStage.objects.get(id=contract.second_stage)
            stage.finished = True
            stage.save()
        elif contract.stage == 1:
            stage = DeliveryStage.objects.get(id=contract.first_stage)
            stage.finished = True
            stage.save()
        contract.stage += 1
        contract.save()
        return Response({'Success': f'Contract advanced to {contract.stage} stage'}, status=status.HTTP_200_OK)


class PreviousStageAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsTechnician
    ]

    def post(self, request, *args, **kwargs):
        contract = Contract.objects.filter(id=request.POST.get('contract'))
        if not contract.exists():
            return Response({'Not found': 'Contract not found'}, status=status.HTTP_404_NOT_FOUND)
        contract = contract[0]
        if request.user != contract.technician:
            return Response({'Permission Denied': 'Only the technician working on the order can modify the contract'},
                            status=status.HTTP_401_UNAUTHORIZED)
        if contract.stage == 1:
            return Response({'Bad Request': 'Contract already at initial stage'}, status=status.HTTP_400_BAD_REQUEST)
        contract.stage -= 1
        contract.save()
        return Response({'Success': f'Contract returned to {contract.stage} stage'}, status=status.HTTP_200_OK)


class CreateStageInfoAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsTechnician
    ]

    def post(self, request, contract_id, *args, **kwargs):
        contract = Contract.objects.filter(id=contract_id)
        if not contract.exists():
            return Response({'Not found': 'Contract not found'}, status=status.HTTP_404_NOT_FOUND)
        contract = contract[0]
        if request.user != contract.technician:
            return Response({'Permission Denied': 'Only the technician working on the order can modify the contract'},
                            status=status.HTTP_401_UNAUTHORIZED)
        stage = request.data.get('stage')
        request.data.pop('stage')
        if stage == 1:
            if contract.first_stage:
                first_stage = DeliveryStage.objects.get(id=contract.first_stage.id)
                for key, value in request.data.items():
                    first_stage[key] = value
                    first_stage.save()
                stage = DeliveryStageSerializer(contract.first_stage)
                return Response({'Success': 'First Stage info edited successfully', 'stage': stage},
                                status=status.HTTP_200_OK)
            serializer = DeliveryStageSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            stage = serializer.save()
            contract.first_stage = stage
            contract.save()
            return Response({'Success': 'First Stage info saved in the contract',
                             'stage': DeliveryStageSerializer(stage).data}, status=status.HTTP_201_CREATED)
        if stage == 2:
            if contract.second_stage:
                for key, value in request.data:
                    contract.second_stage[key] = value
                    contract.second_stage.save()
                stage = DiagnosticStageSerializer(contract.second_stage).data
                return Response({'Success': 'Second Stage info edited successfully', 'stage': stage},
                                status=status.HTTP_200_OK)
            serializer = DiagnosticStageSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            stage = serializer.save()
            contract.second_stage = stage
            contract.save()
            return Response({'Success': 'Second Stage info saved in the contract',
                             'stage': DiagnosticStageSerializer(stage).data}, status=status.HTTP_201_CREATED)
        if stage == 3:
            if contract.third_stage:
                for key, value in request.data:
                    contract.third_stage[key] = value
                    contract.third_stage.save()
                stage = FixingStageSerializer(contract.third_stage).data
                return Response({'Success': 'Third Stage info edited successfully', 'stage': stage},
                                status=status.HTTP_200_OK)
            serializer = FixingStageSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            stage = serializer.save()
            contract.third_stage = stage
            contract.save()
            return Response({'Success': 'Third Stage info saved in the contract',
                             'stage': FixingStageSerializer(stage).data}, status=status.HTTP_201_CREATED)
