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
    updateJobRequestStatus: (id, action) => api.put(`/hr/job-request/${id}/${action}/`),
};

export const candidateAPI = {
    createCandidate: (candidateData) => api.post('/hr/candidate/', candidateData),
    getCandidatesForJob: (jobId) => api.get(`/hr/candidates/${jobId}/`),
    getAllCandidates: () => api.get('/hr/all-candidates/'),
    updateCandidateStatus: (candidateId, status) => api.put(`/hr/candidate/${candidateId}/${status}/`),
    updateCandidateStatusToSelected: (candidateId) => api.put(`/hr/candidate-selected/${candidateId}/`),
    updateCandidateStatusToAccepted: (candidateId) => api.put(`/hr/candidate-accepted/${candidateId}/`),
};

export const interviewAPI = {
    createInterview: (interviewData) => api.post('/hr/interview/', interviewData),
    getInteviewsForCandidate: (candidateId) => api.get(`/hr/interviews/${candidateId}/`),
    getAllInterviews: () => api.get('/hr/all-interviews/'),
};

export const systemAPI = {
    getActionLogs: () => api.get('/logs/'),
    getSummaryReport: () => api.get('/summary/'),
};

export default api;
