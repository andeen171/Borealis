from .models import Profile, Role
from rest_framework import serializers
from django.conf import settings
from django.contrib.auth import authenticate


User = settings.AUTH_USER_MODEL


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_staff')


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'is_staff')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'],
                                        validated_data['password'], is_staff=validated_data['is_staff'])
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('description', 'role')


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ('name', 'description')

    def create(self, validated_data):
        role = Role(name=validated_data['name'], description=validated_data['description'])
        role.save()
        return role


class ListTechniciansSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name')
