import apiClient from "./client";

export const getCampaigns = async () => {
    const response = await apiClient.get('campaigns/');
    return response.data;
};

export const getCampaignsById = async (id) =>{
    const response = await apiClient.get(`campaigns/${id}/`);
    return response.data;
};

export const createCampaign = async (campaignData) => {
    const response = await apiClient.post(`campaigns/`,campaignData);
    return response.data;
};

export const updateCampaign = async (id, updateData) => {
    const response = await apiClient.patch(`campaigns/${id}/`, updateData);
    return response.data;
};

export const deleteCampaign = async (id) => {
    const response = await apiClient.delete(`campaigns/${id}/`);
    return response.data
};