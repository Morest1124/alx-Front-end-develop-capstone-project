import axios from "axios";

// Create a pre-configured axios instance
const apiClient = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL || "https://binaryblade2411.pythonanywhere.com/api/",
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // 60 seconds timeout
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
      // Check if this is a login or register request
      const isAuthRequest = error.config?.url?.includes('/auth/login/') ||
        error.config?.url?.includes('/auth/register/');

      if (isAuthRequest) {
        // For login/register, show specific error without triggering logout
        message = "Invalid email or password. Please try again.";
      } else {
        // For other protected routes, trigger logout
        message = "Your session has expired. Please log in again.";
        // Only trigger global logout for 401 errors on protected routes
        setTimeout(() => {
          window.dispatchEvent(new Event("auth:logout"));
        }, 100);
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
  return apiClient.get(`/auth/users/${userId}/proposals/`);
};

export const getProposalsForProject = (projectId) => {
  return apiClient.get(`/projects/${projectId}/proposals/`);
};

// Submit a new proposal to a project
export const submitProposal = (projectId, proposalData) => {
  return apiClient.post(`/projects/${projectId}/proposals/`, proposalData);
};

// Update proposal status (accept/reject)
export const updateProposalStatus = (projectId, proposalId, status) => {
  return apiClient.patch(`/projects/${projectId}/proposals/${proposalId}/status/`, { status });
};

export const getUserProfile = (userId) => {
  return apiClient.get(`/auth/users/${userId}/`);
};

// Get all freelancers
export const getFreelancers = () => {
  return apiClient.get("/auth/users/freelancers/");
};

// Get all clients
export const getClients = () => {
  return apiClient.get("/auth/users/clients/");
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
  return apiClient.put(`/auth/users/${userId}/`, profileData);
};

export const updateUserProfilePicture = (userId, file) => {
  const formData = new FormData();
  formData.append("profile_picture", file);

  return apiClient.patch(`/auth/users/${userId}/`, formData, {
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

// Start a new conversation or get existing one
export const startConversation = (projectId, participantId) => {
  return apiClient.post("/messages/conversations/", {
    project: projectId,
    participant_2: participantId
  });
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

// Get all open projects (jobs) that freelancers can submit proposals to
export const getOpenJobs = () => {
  return apiClient.get("/projects/");
};

// ===== ORDER API =====

// Create a new order (purchase a gig)
export const createOrder = (orderData) => {
  return apiClient.post("/orders/orders/", orderData);
};

// Get all orders for the current user
export const getOrders = () => {
  return apiClient.get("/orders/orders/");
};

// Get specific order details
export const getOrderDetails = (orderId) => {
  return apiClient.get(`/orders/orders/${orderId}/`);
};

// Mark order as paid (simulate payment)
export const markOrderPaid = (orderId) => {
  return apiClient.post(`/orders/orders/${orderId}/mark_paid/`);
};

// Release payment from escrow to freelancer (client approves work)
export const releasePayment = (orderId) => {
  return apiClient.post(`/orders/orders/${orderId}/release_payment/`);
};

// Cancel order and refund if applicable
export const cancelOrder = (orderId) => {
  return apiClient.post(`/orders/orders/${orderId}/cancel_order/`);
};

// ===== COMMENTS API =====

// Get all comments for a project
export const getProjectComments = (projectId) => {
  return apiClient.get(`/comments/projects/${projectId}/comments/`);
};

// Create a new comment on a project
export const createComment = (projectId, text) => {
  return apiClient.post(`/comments/projects/${projectId}/comments/`, { text });
};

// ===== REVIEWS API =====

// Get all reviews for a user
export const getUserReviews = (userId) => {
  return apiClient.get(`/reviews/users/${userId}/`);
};

// Create a review for a project
export const createReview = (projectId, reviewData) => {
  return apiClient.post(`/reviews/projects/${projectId}/create/`, reviewData);
};

// ===== SETTINGS API =====

// Get user account information
export const getUserAccount = () => {
  return apiClient.get('/auth/settings/account/');
};

// Update user account information
export const updateUserAccount = (accountData) => {
  return apiClient.put('/auth/settings/account/', accountData);
};

// Change password
export const changePassword = (passwordData) => {
  return apiClient.put('/auth/settings/password/', passwordData);
};

// Get notification preferences
export const getNotificationPreferences = () => {
  return apiClient.get('/auth/settings/notifications/');
};

// Update notification preferences
export const updateNotificationPreferences = (preferences) => {
  return apiClient.put('/auth/settings/notifications/', preferences);
};

// Get user preferences
export const getUserPreferences = () => {
  return apiClient.get('/auth/settings/preferences/');
};

// Update user preferences
export const updateUserPreferences = (preferences) => {
  return apiClient.put('/auth/settings/preferences/', preferences);
};

// Get list of countries
export const getCountries = () => {
  return apiClient.get('/auth/countries/');
};

// Get list of timezones
export const getTimezones = () => {
  return apiClient.get('/auth/timezones/');
};
