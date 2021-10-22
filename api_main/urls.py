from django.urls import path
from api_auth.views import ListTechnicians
from .views import (CreateOrderView, CreateCategoryView, OrdersApiView, CreateOfferView,
                    OrderDetailView, OfferDetailView, CreateContractView)


urlpatterns = [
    path('orders/', OrdersApiView.as_view()),
    path('create/order/', CreateOrderView.as_view()),
    path('create/category/', CreateCategoryView.as_view()),
    path('create/offer/', CreateOfferView.as_view()),
    path('order/<int:order_id>', OrderDetailView.as_view()),
    path('offer/<int:offer_id>', OfferDetailView.as_view()),
    path('technicians/', ListTechnicians.as_view()),
    path('offer/accept/', CreateContractView.as_view())
]
