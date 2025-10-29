import axios from "axios";

// Create a pre-configured axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://binaryblade2411.pythonanywhere.com/api",
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
    let message;
    if (error.response?.status === 401) {
      message = "Invalid email or password. Please try again.";
    } else if (error.response?.status === 400) {
      const errorData = error.response.data;
      if (errorData.email) {
        message = "Email error: " + errorData.email[0];
      } else if (errorData.password) {
        message = "Password error: " + errorData.password[0];
      } else if (errorData.username) {
        message = "Username error: " + errorData.username[0];
      } else {
        message =
          errorData.detail ||
          errorData.message ||
          "Please check your input and try again.";
      }
    } else if (error.response?.status === 409) {
      message =
        "This email or username is already registered. Please try another one.";
    } else if (error.response?.status >= 500) {
      message = "Server error. Please try again later.";
    } else {
      message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";
    }
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
  try {
    const data = await apiClient.post("/auth/register/", userData);
    if (data.access) {
      localStorage.setItem("token", data.access);
    }
    return data;
  } catch (error) {
    // Re-throw the error so the interceptor can handle it
    throw error;
  }
};

export const getGig = (gigId) => {
  return apiClient.get(`/projects/${gigId}/`);
};

export const createJob = async (jobDetails) => {
  try {
    const response = await apiClient.post("/projects/", jobDetails);
    if (!response) {
      throw new Error("No response received from server");
    }
    return response;
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to create project. Please try again."
    );
  }
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

// Get all freelancers
export const getFreelancers = () => {
  return apiClient.get("/users/freelancers/");
};

// Get all clients
export const getClients = () => {
  return apiClient.get("/users/clients/");
};

// Get all projects
export const getProjects = () => {
  return apiClient.get("/projects/projects/");
};

// Get project by id with all details
export const getProjectDetails = (projectId) => {
  return apiClient.get(`/projects/${projectId}/`);
};

// Update user profile
export const updateUserProfile = (userId, profileData) => {
  return apiClient.put(`/users/${userId}/`, profileData);
};

export const updateUserProfilePicture = (userId, file) => {
  const formData = new FormData();
  formData.append("profile_picture", file);

  return apiClient.patch(`/users/${userId}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const createGig = async (gigData) => {
  try {
    const response = await apiClient.post("/projects/gigs/", gigData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (!response) {
      throw new Error("No response received from server");
    }
    return response;
  } catch (error) {
    console.error("Error creating gig:", error);
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to create gig. Please try again."
    );
  }
};
