from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Order, Offer, Contract, Image, Stage
from Borealis.permissions import IsClient, IsTechnician
from datetime import datetime
from django.contrib.auth import get_user_model
from api_auth.serializers import ProfileSerializer
from .serializers import (OrderSerializer, OfferSerializer, OrderImageSerializer,
                          ContractSerializer, StageSerializer, ContractStageSerializer)
User = get_user_model()

class OrdersAPI(APIView):
    def get(self, request, *args, **kwargs):
        orders = Order.objects.all()
        results = []
        for order in orders:
            images = Image.objects.filter(order=order)
            if images.exists():
                order_image = OrderImageSerializer({'info': order, 'images': images})
                results.append(order_image.data)
        return Response(results, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        self.permission_classes = [
            permissions.IsAuthenticated,
            IsClient,
        ]
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


class OrderInstanceAPI(APIView):
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

    def delete(self, request, order_id, *args, **kwargs):
        order = Order.objects.filter(id=order_id)
        if not order.exists():
            return Response({'Not found': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        order = order[0]
        if order.user != request.user:
            return Response({'PermissionDenied': 'Permission Denied'}, status=status.HTTP_401_UNAUTHORIZED)
        if order.closed:
            return Response({'Bad Request': 'Order have a contract in progress'}, status=status.HTTP_400_BAD_REQUEST)
        order.delete()
        return Response({'Success': 'Order deleted successfully'}, status=status.HTTP_200_OK)

    def put(self, request, order_id, *args, **kwargs):
        order = Order.objects.filter(id=order_id)
        if not order.exists():
            return Response({'Not found': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        order = order[0]
        if order.user != request.user:
            return Response({'PermissionDenied': 'Permission Denied'}, status=status.HTTP_401_UNAUTHORIZED)
        if order.closed:
            return Response({'Bad Request': 'Order have a contract in progress'}, status=status.HTTP_400_BAD_REQUEST)
        for field, value in request.data.items():
            setattr(order, field, value)
        order.save()
        return Response({'Success': 'Order edited successfully'}, status=status.HTTP_200_OK)


class OffersAPI(generics.CreateAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsTechnician,
    ]
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer

    def create(self, request, *args, **kwargs):
        request.data['user'] = request.user.id
        return super(OffersAPI, self).create(request, *args, **kwargs)


class OfferInstanceAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, offer_id, *args, **kwargs):
        offer = Offer.objects.filter(id=offer_id)
        if not offer.exists():
            return Response({'Not found': 'Offer not found'}, status=status.HTTP_404_NOT_FOUND)
        offer = offer[0]
        offer_owner = offer.user.id
        order = offer.order
        order_owner = order.user.id
        if request.user.id == offer_owner or request.user.id == order_owner:
            serializer = OfferSerializer(offer)
            return Response({
                "Offer": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({'PermissionDenied': 'Permission Denied'}, status=status.HTTP_401_UNAUTHORIZED)

    def delete(self, request, offer_id, *args, **kwargs):
        offer = Offer.objects.filter(id=offer_id)
        if not offer.exists():
            return Response({'Not found': 'Offer not found'}, status=status.HTTP_404_NOT_FOUND)
        offer = offer[0]
        if offer.user != request.user:
            return Response({'PermissionDenied': 'Permission Denied'}, status=status.HTTP_401_UNAUTHORIZED)
        if offer.accepted:
            return Response({'Bad Request': 'Offer is already accepted'}, status=status.HTTP_400_BAD_REQUEST)
        offer.delete()
        return Response({'Success': 'Offer deleted successfully'}, status=status.HTTP_200_OK)

    def put(self, request, offer_id, *args, **kwargs):
        offer = Offer.objects.filter(id=offer_id)
        if not offer.exists():
            return Response({'Not found': 'Offer not found'}, status=status.HTTP_404_NOT_FOUND)
        offer = offer[0]
        if offer.user != request.user:
            return Response({'PermissionDenied': 'Permission Denied'}, status=status.HTTP_401_UNAUTHORIZED)
        if offer.accepted:
            return Response({'Bad Request': 'Offer is already accepted'}, status=status.HTTP_400_BAD_REQUEST)
        for field, value in request.data.items():
            setattr(offer, field, value)
        offer.save()
        return Response({'Success': 'Offer edited successfully'}, status=status.HTTP_200_OK)


class ContractsAPI(generics.CreateAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsClient,
    ]
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer

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
        order = offer.order
        order.closed = True
        order.save()
        request.data['client'] = request.user.id
        request.data['order'] = offer.order.id
        request.data['value'] = offer.value_estimate
        request.data['technician'] = offer.user.id
        return super(ContractsAPI, self).create(request, *args, **kwargs)


class ContractInstanceAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, contract_id, *args, **kwargs):
        contract = Contract.objects.filter(id=contract_id)
        if not contract.exists():
            return Response({'Not found': 'Contract not found'}, status=status.HTTP_404_NOT_FOUND)
        contract = contract[0]
        if request.user != contract.client and request.user != contract.technician:
            return Response({'Access denied': 'Only the client and technician have access to their contract'},
                            status=status.HTTP_401_UNAUTHORIZED)
        stages = Stage.objects.filter(contract=contract_id)
        if stages.exists():
            serializer = ContractStageSerializer({'info': contract, 'stages': stages})
        else:
            serializer = ContractSerializer(contract)
        contract_stages = serializer.data
        return Response(contract_stages, status=status.HTTP_200_OK)

    def delete(self, request, contract_id, *args, **kwargs):
        contract = Contract.objects.filter(id=contract_id)
        if not contract.exists():
            return Response({'Not found': 'Contract not found'}, status=status.HTTP_404_NOT_FOUND)
        contract = contract[0]
        if request.user != contract.client and request.user != contract.technician:
            return Response({'Access denied': 'Only the client and technician have access to their contract'},
                            status=status.HTTP_401_UNAUTHORIZED)
        contract.delete()
        return Response({'Success': 'Contract deleted successfully'}, status=status.HTTP_200_OK)

    def put(self, request, contract_id, *args, **kwargs):
        contract = Contract.objects.filter(id=contract_id)
        if not contract.exists():
            return Response({'Not found': 'Contract not found'}, status=status.HTTP_404_NOT_FOUND)
        contract = contract[0]
        if request.user != contract.client and request.user != contract.technician:
            return Response({'Access denied': 'Only the client and technician have access to their contract'},
                            status=status.HTTP_401_UNAUTHORIZED)
        for field, value in request.data.items():
            setattr(contract, field, value)
        contract.save()
        return Response({'Success': 'Contract info edited successfully'}, status=status.HTTP_200_OK)

    def post(self, request, contract_id, *args, **kwargs):
        contract = Contract.objects.filter(id=contract_id)
        if not contract.exists():
            return Response({'Not found': 'Contract not found'}, status=status.HTTP_404_NOT_FOUND)
        contract = contract[0]
        if request.user != contract.technician:
            return Response({'Access denied': 'Only technician responsible for contract have permission to advance it'},
                            status=status.HTTP_401_UNAUTHORIZED)
        if contract.level == 4:
            contract.closed = True
            contract.closed_at = datetime.now()
            contract.save()
            return Response({'Finished': 'Contract completed successfully'}, status=status.HTTP_200_OK)
        contract.level += 1
        contract.save()
        request.data['level'] = contract.level
        request.data['contract'] = contract.id
        serializer = StageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        stage = serializer.save()
        return Response({'Success': 'Contract advanced successfully', 'stage': StageSerializer(stage).data},
                        status=status.HTTP_200_OK)


class ProfileView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, user_id, *args, **kwargs):
        user = User.objects.filter(id=user_id)
        if not user.exists():
            return Response({'Not found': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        user = user[0]
        profile = ProfileSerializer(user.profile).data
        body = {'info': profile}
        if user.staff:
            offers = Offer.objects.filter(user=user)
            serializer = OfferSerializer(offers, many=True)
            body['offers'] = serializer.data
            if request.user == user:
                contracts = Contract.objects.filter(technician=user)
                serializer = ContractSerializer(contracts, many=True)
                body["contracts"] = serializer.data
        else:
            orders = Order.objects.filter(user=user)
            serializer = OrderSerializer(orders, many=True)
            body['orders'] = serializer.data
            if request.user == user:
                contracts = Contract.objects.filter(client=user)
                serializer = ContractSerializer(contracts, many=True)
                body["contracts"] = serializer.data
        return Response(body, status=status.HTTP_200_OK)

    def put(self, request, user_id, *args, **kwargs):
        user = User.objects.filter(id=user_id)
        if not user.exists():
            return Response({'Not found': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        user = user[0]
        if user != request.user:
            return Response({'Permission denied': 'You dont have permission to edit this profile'},
                            status=status.HTTP_401_UNAUTHORIZED)
        profile = user.profile
        for field, value in request.data.items():
            setattr(profile, field, value)
        profile.save()
        return Response({'Success': 'Profile edited successfully', 'profile': ProfileSerializer(profile).data},
                        status=status.HTTP_200_OK)
