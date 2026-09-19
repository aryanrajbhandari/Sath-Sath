// ─── Sath-Sath API Service Layer ───────────────────────────────────────────
const BASE_URL = 'http://127.0.0.1:8000/api';

// ── Helpers ──────────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem('sathsath_token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

async function apiRequest(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: authHeaders(),
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, data };
  return data;
}

// ── Campaigns ─────────────────────────────────────────────────────────────────
export const fetchCampaigns = () => apiRequest('/campaigns/');
export const fetchCampaignById = (id) => apiRequest(`/campaigns/${id}/`);
export const fetchMyCampaigns = () => apiRequest('/campaigns/my_campaigns/');
export const createCampaign = (payload) =>
  apiRequest('/campaigns/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

// ── Donations ─────────────────────────────────────────────────────────────────
export const makeDonation = (payload) =>
  apiRequest('/donations/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
export const fetchMyDonations = () => apiRequest('/donations/my_donations/');

// ── Auth ──────────────────────────────────────────────────────────────────────
export const loginUser = async ({ username, password }) => {
  const data = await apiRequest('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  if (data.access) localStorage.setItem('sathsath_token', data.access);
  return data;
};

export const registerUser = (payload) =>
  apiRequest('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getCurrentUser = () => apiRequest('/auth/me/');

export const logoutUser = () => {
  localStorage.removeItem('sathsath_token');
};
