from rest_framework import permissions


class IsClient(permissions.BasePermission):
    def has_permission(self, request, view):
        is_staff = request.user.is_staff
        return not is_staff


class IsTechnician(permissions.BasePermission):
    def has_permission(self, request, view):
        is_staff = request.user.is_staff
        return is_staff
