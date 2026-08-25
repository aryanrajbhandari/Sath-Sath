from django.db import transaction
from rest_framework import viewsets, permissions, status, mixins
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Campaign, Donation
from .serializers import (
    CampaignSerializer, 
    DonationSerializer, 
    RegisterSerializer, 
    UserProfileSerializer
)
from .permissions import IsCampaignOwnerOrReadOnly


class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly,
        IsCampaignOwnerOrReadOnly
    ]

    def perform_create(self, serializer):
        # Automatically sets the logged-in user as the creator
        serializer.save(creator=self.request.user)

    # Endpoint: GET /api/campaigns/my_campaigns/
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_campaigns(self, request):
        user_campaigns = Campaign.objects.filter(creator=request.user)
        serializer = self.get_serializer(user_campaigns, many=True)
        return Response(serializer.data)


class DonationViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet
):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [permissions.AllowAny]  # Allows both logged-in and guest donors
    
    def perform_create(self, serializer):
        with transaction.atomic():
            # If user is logged in, attach donor; otherwise save as guest
            if self.request.user.is_authenticated:
                donation = serializer.save(donor=self.request.user)
            else:
                donation = serializer.save()         
            
            # Update campaign progress
            campaign = donation.campaign
            campaign.raised_amount += donation.amount
            
            # Auto-close campaign if goal is achieved
            if campaign.raised_amount >= campaign.target_amount:
                campaign.is_active = False
                
            campaign.save()

    # Endpoint: GET /api/donations/my_donations/
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_donations(self, request):
        user_donations = Donation.objects.filter(donor=request.user)
        serializer = self.get_serializer(user_donations, many=True)
        return Response(serializer.data)


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )   
        

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)