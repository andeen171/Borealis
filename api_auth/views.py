from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from knox.models import AuthToken
from rest_framework.views import APIView
from .models import Profile, Role
from .serializers import (UserSerializer, ClientRegisterSerializer, TechnicianRegisterSerializer, LoginSerializer,
                          ProfileSerializer, ListTechniciansSerializer)

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


class ListTechnicians(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, *args, **kwargs):
        technicians = User.objects.filter(is_staff=True)
        technicians_profiles = []
        for tech in technicians:
            technician = ListTechniciansSerializer(tech)
            profile = Profile.objects.filter(user=tech)
            print('a')
            if profile.exists():
                profile = ProfileSerializer(tech.profile)
                tech_profile = technician.data | profile.data
                technicians_profiles.append(tech_profile)
        return Response({
            "Technicians": technicians_profiles
        }, status=status.HTTP_200_OK)


class EditProfileView(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = ProfileSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            description = serializer.data['description']
            role = Role.objects.get(id=serializer.data['role'])
            user = User.objects.get(id=self.request.user.id)
            user.profile.role = role
            user.profile.description = description
            user.save()
            return Response({
                "Profile": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({"Bad Request": "Invalid parameters"}, status=status.HTTP_400_BAD_REQUEST)
