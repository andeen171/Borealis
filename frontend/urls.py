from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('login/', index),
    path('register/', index),
    path('order/<int:orderCode>/', index),
    path('orders/create/', index),
    path('offers/create/', index),
    path('contract/<int:contractCode>/', index),
    path('profile/<int:userId>/', index),
]
