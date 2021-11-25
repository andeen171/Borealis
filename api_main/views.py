from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Order, Offer, Contract, Image
from Borealis.permissions import IsClient, IsTechnician
from .serializers import (OrderSerializer, OfferSerializer,
                          OrderImageSerializer, ContractSerializer)


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
        if request.user == contract.client or request.user == contract.technician:
            serializer = ContractSerializer(contract)
            contract = serializer.data
            return Response(contract, status=status.HTTP_200_OK)
        return Response({'Access denied': 'Only the client and technician have access to their contract'},
                        status=status.HTTP_401_UNAUTHORIZED)

    def delete(self, request, contract_id, *args, **kwargs):
        contract = Contract.objects.filter(id=contract_id)
        if not contract.exists():
            return Response({'Not found': 'Contract not found'}, status=status.HTTP_404_NOT_FOUND)
        contract = contract[0]
        if request.user == contract.client or request.user == contract.technician:
            contract.delete()
            return Response({'Success': 'Contract deleted successfully'}, status=status.HTTP_200_OK)
        return Response({'Access denied': 'Only the client and technician have access to their contract'},
                        status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, contract_id, *args, **kwargs):
        contract = Contract.objects.filter(id=contract_id)
        if not contract.exists():
            return Response({'Not found': 'Contract not found'}, status=status.HTTP_404_NOT_FOUND)
        contract = contract[0]
        if request.user == contract.client or request.user == contract.technician:
            for field, value in request.data.items():
                setattr(contract, field, value)
            contract.save()
            return Response({'Success': 'Contract info edited successfully'}, status=status.HTTP_200_OK)
        return Response({'Access denied': 'Only the client and technician have access to their contract'},
                        status=status.HTTP_401_UNAUTHORIZED)
