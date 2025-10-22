import axios from "axios";

// Create a pre-configured axios instance
const apiClient = axios.create({
  baseURL: "https://binaryblade24-api.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses and errors globally
apiClient.interceptors.response.use(
  (response) => response.data, // Return the data part of the response
  (error) => {
    // Handle errors globally
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export const login = async (credentials) => {
  const data = await apiClient.post("/auth/login/", credentials);
  // Store the token in local storage after a successful login
  if (data.access) {
    localStorage.setItem("token", data.access);
  }
  return data;
};
//Export endpoints to dedicated pages
export const register = async (userData) => {
  const data = await apiClient.post("/auth/register/", userData);
  if (data.access) {
    localStorage.setItem("token", data.access);
  }
  return data;
};

export const getGigs = () => {
  return apiClient.get("/projects/");
};

export const getGig = (gigId) => {
  return apiClient.get(`/projects/${gigId}/`);
};

export const createJob = (jobDetails) => {
  return apiClient.post("/projects/", jobDetails);
};

export const getFreelancerDashboard = () => {
  return apiClient.get("/dashboard/freelancer/");
};

export const getClientDashboard = () => {
  return apiClient.get("/dashboard/client/");
};

export const getFreelancerProposals = (userId) => {
  return apiClient.get(`/users/${userId}/proposals/`);
};

export const getProposalsForProject = (projectId) => {
  return apiClient.get(`/projects/${projectId}/proposals/`);
};

export const updateProposalStatus = (proposalId, status) => {
  return apiClient.put(`/proposals/${proposalId}/status/`, { status });
};

export const getUserProfile = (userId) => {
  return apiClient.get(`/users/${userId}/`);
};
