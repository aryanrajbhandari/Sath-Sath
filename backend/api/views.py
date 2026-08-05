from django.shortcuts import render
from .models import Campaign, Donation
from .serializers import CampaignSerializer, DoantionSerializer

class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
class DonationViewSet(Viewsets.ModelViewSet):
    queryset = Donation.objects.all()
    serializer_class = DoantionSerializer
    