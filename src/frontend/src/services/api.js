import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const authAPI = {
    register: (userData) => api.post('/auth/register/', userData),
    login: (credentials) => api.post('/auth/login/', credentials),
};

export const jobRequestAPI = {
    createJobRequest: (jobData) => api.post('/recruiter/job-request/', jobData),
    getPendingRequests: () => api.get('/hr/pending-requests/'),
};

export default api;
