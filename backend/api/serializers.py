from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Campaign, Donation

class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = '__all__'
class CampaignSerializer(serializers.ModelSerializer):
    donations = DonationSerializer(many=True, read_only=True)
    creator = serializers.ReadOnlyField(source='creator.username')
    class Meta:
        model = Campaign
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )
        return user