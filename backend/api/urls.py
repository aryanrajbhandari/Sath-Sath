from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CampaignViewSet, DoantionViewSet

router = DefaultRouter()
router.register(r'campaigns', CampaignViewSet)
router.register(r'donations', DoantionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
