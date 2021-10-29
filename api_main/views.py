from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Order, Category, Offer, Contract
from Borealis.permissions import IsClient, IsTechnician
from .serializers import (OrderListSerializer, CreateOrderSerializer, CategorySerializer,
                          CreateOfferSerializer, OfferListSerializer, OrderSerializer, OfferSerializer,
                          ContractSerializer)


class OrdersApiView(generics.ListAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderListSerializer


class CreateOrderView(generics.CreateAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsClient,
    ]
    queryset = Order.objects.all()
    serializer_class = CreateOrderSerializer

    def create(self, request, *args, **kwargs):
        request.data['user'] = request.user.id
        return super(CreateOrderView, self).create(request, *args, **kwargs)


class CreateCategoryView(generics.CreateAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CreateOfferView(generics.CreateAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsTechnician,
    ]
    queryset = Offer.objects.all()
    serializer_class = CreateOfferSerializer

    def create(self, request, *args, **kwargs):
        request.data['user'] = request.user.id
        return super(CreateOfferView, self).create(request, *args, **kwargs)


class OrderDetailView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, order_id, *args, **kwargs):
        order = Order.objects.filter(id=order_id)
        if not order.exists():
            return Response({'Not found': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        order = order[0]
        offers = Offer.objects.filter(order=order)
        order_serializer = OrderSerializer(order)
        order = order_serializer.data
        order['image'] = [{'src': order['image']}]
        if offers.exists() and not request.user.is_staff:
            offers_serializer = OfferListSerializer(offers, many=True)
            offers = offers_serializer.data
            return Response({
                'order': order,
                'offers': offers,
            }, status=status.HTTP_200_OK)
        return Response({'order': order}, status=status.HTTP_200_OK)


class OfferDetailView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = OfferSerializer

    def get(self, request, offer_id, *args, **kwargs):
        offer = Offer.objects.filter(id=offer_id)
        if not offer.exists():
            return Response({'Not found': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
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


class CreateContractView(generics.CreateAPIView):
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
        request.data['client'] = request.user.id
        request.data['order'] = offer.order.id
        request.data['value'] = offer.value_estimate
        request.data['technician'] = offer.user.id
        return super(CreateContractView, self).create(request, *args, **kwargs)
