from django.urls import path
from .views import (OrdersAPI, OrderInstanceAPI, OffersAPI, OfferInstanceAPI,
                    ContractsAPI, ContractInstanceAPI, ProfileView)


urlpatterns = [
    path('orders/', OrdersAPI.as_view()),
    path('offers/', OffersAPI.as_view()),
    path('order/<int:order_id>/', OrderInstanceAPI.as_view()),
    path('offer/<int:offer_id>/', OfferInstanceAPI.as_view()),
    path('contract/<int:contract_id>/', ContractInstanceAPI.as_view()),
    path('offer/accept/', ContractsAPI.as_view()),
    path('profile/<int:user_id>/', ProfileView.as_view()),
]
