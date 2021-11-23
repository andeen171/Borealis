from django.urls import path
from api_auth.views import ListTechnicians
from .views import (CreateOrderAPI, CreateCategoryAPI, ListOrdersAPI, CreateOfferAPI,
                    OrderDetailAPI, OfferDetailAPI, CreateContractAPI, ContractDetailsAPI,
                    CreateStageInfoAPI)


urlpatterns = [
    path('orders/', ListOrdersAPI.as_view()),
    path('order/create/', CreateOrderAPI.as_view()),
    path('category/create/', CreateCategoryAPI.as_view()),
    path('offer/create/', CreateOfferAPI.as_view()),
    path('order/<int:order_id>/', OrderDetailAPI.as_view()),
    path('offer/<int:offer_id>/', OfferDetailAPI.as_view()),
    path('contract/<int:contract_id>/', ContractDetailsAPI.as_view()),
    path('technicians/', ListTechnicians.as_view()),
    path('offer/accept/', CreateContractAPI.as_view()),
    path('contract/stage/<int:contract_id>/', CreateStageInfoAPI.as_view()),
]
