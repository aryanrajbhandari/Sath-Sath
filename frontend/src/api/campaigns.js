import apiClient from "./client";

export const getCampaigns = async () => {
    const response = await apiClient.get('campaigns/');
    return response.data;
};

export const getCampaignsById = async (id) =>{
    const response = await apiClient.get(`campaigns/${id}/`);
    return response.data;
};