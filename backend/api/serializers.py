from rest_framework import serializers
from .models import Campaign, Donation

class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fileds = '__all__'
class CampaignSerializer(serializers.ModelSerializer):
    donations = DonationSerializer(many=True, read_only=True)
    class Meta:
        model = Campaign
        fields = '__all__'