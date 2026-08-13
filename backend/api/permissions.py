from rest_framework import permissions

class IsCampaignOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        #Anyone can view campaign
        if request.method in permissions.SAFE_METHODS:
            return True
        #only creator can edit or delete it
        return obj.creator == request.user