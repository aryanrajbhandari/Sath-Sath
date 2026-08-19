import apiClient from "./client";

export const makeDonation = async (donationData) => {
    const response = await apiClient.post('donations/', donationData);
    return response.data;
};