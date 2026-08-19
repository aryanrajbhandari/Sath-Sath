import apiClient from "./client";

export const loginApi = async (username, password) => {
    const response = await apiClient.post('auth/login/',{
        username: username,
        password: password
    });
    return response.data;

};

export const registerApi = async(userData) => {
    const response = await apiClient.post('auth/register/',userData);
    return response.data;
};