from rest_framework import permissions


class IsSuperAdmin(permissions.BasePermission):
    """Faqat superadmin"""

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (
                request.user.is_superuser or request.user.role == 'superadmin'
        )


class IsAdmin(permissions.BasePermission):
    """Admin yoki superadmin"""

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (
                request.user.role in ['admin', 'superadmin'] or request.user.is_superuser
        )


class IsTeacher(permissions.BasePermission):
    """Faqat o'qituvchi"""

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'teacher'


class IsOwnerOrAdmin(permissions.BasePermission):
    """Egasi yoki admin"""

    def has_object_permission(self, request, view, obj):
        if request.user.role in ['admin', 'superadmin'] or request.user.is_superuser:
            return True

        # Obyektning egasi
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'teacher'):
            return obj.teacher.user == request.user

        return False