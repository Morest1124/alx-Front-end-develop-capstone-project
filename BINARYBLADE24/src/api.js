import axios from "axios";

// Create a pre-configured axios instance
const apiClient = axios.create({
  // baseURL:    import.meta.env.VITE_API_BASE_URL ||    "https://binaryblade2411.pythonanywhere.com/api/",
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
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
      console.error("Authentication Error from backend:", error.response.data);
      // Only show specific login message if we are actually logging in, 
      // otherwise it might be an expired token or unauthorized access to a resource.
      // For now, we'll keep it generic or check the URL if possible, 
      // but to be safe and avoid confusing "Invalid email" on logout/home page:
      if (error.config && error.config.url.includes("/auth/login/")) {
        message = "Invalid email or password. Please try again.";
      } else {
        message = "You are not authorized. Please log in.";
      }
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
  const data = await apiClient.post("/auth/register/", userData);
  if (data.access) {
    localStorage.setItem("token", data.access);
  }
  return data;
};

export const getGig = (gigId) => {
  return apiClient.get(`/projects/${gigId}/`);
};

export const createProject = async (projectData) => {
  try {
    const response = await apiClient.post("/projects/", projectData);
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

// Get all projects (OPEN only - for Find Work)
export const getProjects = () => {
  return apiClient.get("/projects/");
};

// Get client's own projects
export const getClientProjects = () => {
  return apiClient.get("/projects/my_projects/");
};

// Get freelancer's active jobs
export const getFreelancerJobs = () => {
  return apiClient.get("/projects/my_jobs/");
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




// ===== MESSAGING API =====

// Get all conversations for the authenticated user
export const getConversations = () => {
  return apiClient.get("/messages/conversations/");
};

// Get messages for a specific conversation
export const getMessages = (conversationId) => {
  return apiClient.get(`/messages/messages/?conversation=${conversationId}`);
};

// Send a new message
export const sendMessage = (conversationId, body) => {
  return apiClient.post("/messages/messages/", {
    conversation: conversationId,
    body: body
  });
};

// Mark conversation as read
export const markConversationRead = (conversationId) => {
  return apiClient.post(`/messages/conversations/${conversationId}/mark_read/`);
};

// Approve completed work and release payment
export const approveProject = (projectId) => {
  return apiClient.post(`/projects/${projectId}/approve_work/`);
};

// Get all categories with subcategories
export const getCategories = () => {
  return apiClient.get("/projects/categories/");
};

// Create a milestone for a project
export const createMilestone = (milestoneData) => {
  return apiClient.post("/projects/milestones/", milestoneData);
};

// Get all public proposals (for Find Work page)
export const getPublicProposals = () => {
  return apiClient.get("/proposals/public/");
};
