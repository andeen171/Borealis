from django.urls import path
from api_auth.views import ListTechnicians
from .views import (OrdersAPI, OrderInstanceAPI, OffersAPI, OfferInstanceAPI, ContractsAPI, ContractInstanceAPI)


urlpatterns = [
    path('orders/', OrdersAPI.as_view()),
    path('offers/', OffersAPI.as_view()),
    path('order/<int:order_id>/', OrderInstanceAPI.as_view()),
    path('offer/<int:offer_id>/', OfferInstanceAPI.as_view()),
    path('contract/<int:contract_id>/', ContractInstanceAPI.as_view()),
    path('technicians/', ListTechnicians.as_view()),
    path('offer/accept/', ContractsAPI.as_view()),
]
