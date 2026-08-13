from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Campaign, Donation, Profile

class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = '__all__'
class CampaignSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    donations = DonationSerializer(many=True, read_only=True)
    creator = serializers.ReadOnlyField(source='creator.username')
    class Meta:
        model = Campaign
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(max_length=50, write_only=True)
    class Meta:
        model = User
        fields = ["username", "email", "phone", "password"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        phone = validated_data.pop("phone")
        
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )
        Profile.objects.create(
            user=user,
            phone=phone
        )

        return user


