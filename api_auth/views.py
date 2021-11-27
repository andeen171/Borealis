from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from knox.models import AuthToken
from .serializers import (UserSerializer, ClientRegisterSerializer, TechnicianRegisterSerializer, LoginSerializer)

User = get_user_model()


class RegisterAPI(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        is_staff = request.data.get('is_staff')
        if is_staff:
            serializer = TechnicianRegisterSerializer
        else:
            serializer = ClientRegisterSerializer
        serializer = serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        }, status=status.HTTP_201_CREATED)


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        _, token = AuthToken.objects.create(user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token
        }, status=status.HTTP_202_ACCEPTED)


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

