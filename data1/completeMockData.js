// Mock data with complete database schema fields

export const mockUsers = [
  {
    // User Basic Info
    id: 1,
    username: "alexchen",
    email: "alex.chen@example.com",
    first_name: "Alex",
    last_name: "Chen",
    country_origin: "Canada",
    phone_number: "+1234567890",
    identity_number: "ID_12345",
    profile_picture: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=800&q=80",
    
    // Roles & Permissions
    roles: ["FREELANCER"],
    groups: ["verified_freelancers"],
    user_permissions: ["can_submit_proposal", "can_receive_payments"],
    
    // Profile Fields
    profile: {
      bio: "Full stack developer with 5+ years of experience in web and mobile development",
      skills: ["React", "Node.js", "Python", "Django", "MongoDB"],
      hourly_rate: 45.00,
      rating: 4.8,
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=800&q=80",
      skill_level: "senior",
      availability: "AVAILABLE",
      title: "Full Stack Developer",
    },

    // Related Data (for UI)
    completed_projects_count: 32,
    active_projects_count: 2,
    portfolio_projects: [
      {
        id: 1,
        title: "E-commerce Platform",
        thumbnail: "https://images.unsplash.com/photo-1566837945700-30057527ade0",
        status: "COMPLETED"
      },
      {
        id: 2,
        title: "Dashboard Development",
        thumbnail: "https://images.unsplash.com/photo-1531403009284-440f080d1e12",
        status: "COMPLETED"
      }
    ]
  },
  {
    // User Basic Info
    id: 2,
    username: "sarahwilliams",
    email: "sarah.williams@example.com",
    first_name: "Sarah",
    last_name: "Williams",
    country_origin: "United States",
    phone_number: "+1987654321",
    identity_number: "ID_67890",
    profile_picture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    
    // Roles & Permissions
    roles: ["CLIENT"],
    groups: ["verified_clients"],
    user_permissions: ["can_post_project", "can_hire_freelancers"],
    
    // Profile Fields
    profile: {
      bio: "Project Manager at TechSolutions Inc.",
      title: "Project Manager",
      company: "TechSolutions Inc.",
      rating: 4.9,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80"
    }
  }
];

export const mockProjects = [
  {
    // Basic Info
    id: 1,
    title: "Mobile App Development",
    description: "Develop a cross-platform mobile app for our fitness tracking service",
    price: 5000.00,
    budget: 7000.00,
    project_id: "PROJ_001",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
    delivery_days: "2024-01-15T00:00:00Z",
    
    // Metadata
    created_at: "2023-10-23T10:00:00Z",
    updated_at: "2023-10-23T10:00:00Z",
    category: {
      id: 1,
      name: "Mobile Development",
      slug: "mobile-dev"
    },
    client: 2, // Reference to Sarah Williams
    status: "IN_PROGRESS",
    
    // Related Data
    proposals: [
      {
        id: 1,
        bid_amount: 4800.00,
        cover_letter: "I have extensive experience in mobile development...",
        project: 1,
        freelancer: 1, // Reference to Alex Chen
        status: "ACCEPTED",
        created_at: "2023-10-23T11:00:00Z"
      }
    ],
    
    payments: [
      {
        id: 1,
        user: 2, // Sarah Williams
        project: 1,
        amount: 2400.00, // 50% upfront
        payment_date: "2023-10-23T12:00:00Z",
        transaction_id: "TRX_12345",
        payment_method: "stripe",
        status: "completed"
      }
    ],
    
    reviews: [
      {
        id: 1,
        project: 1,
        reviewer: 2, // Sarah Williams
        reviewee: 1, // Alex Chen
        rating: 5,
        comment: "Excellent work on the initial phase",
        created_at: "2023-10-23T15:00:00Z"
      }
    ],
    
    comments: [
      {
        id: 1,
        project: 1,
        user: 2, // Sarah Williams
        text: "Looking forward to seeing the first prototype!",
        created_at: "2023-10-23T12:00:00Z"
      }
    ]
  }
];

export const mockMessages = [
  {
    id: 1,
    sender: 2, // Sarah Williams
    recipient: 1, // Alex Chen
    subject: "Project Milestone Discussion",
    body: "Hi Alex, can we discuss the upcoming milestone deliverables?",
    timestamp: "2023-10-23T14:00:00Z",
    is_read: false
  }
];

export const mockPayments = [
  {
    id: 1,
    user: 2, // Sarah Williams
    project: 1,
    amount: 2400.00,
    payment_date: "2023-10-23T12:00:00Z",
    transaction_id: "TRX_12345",
    payment_method: "stripe",
    status: "completed"
  }
];

export const mockProposals = [
  {
    id: 1,
    bid_amount: 4800.00,
    cover_letter: "I have extensive experience in mobile development and would love to help build your fitness app.",
    project: 1,
    freelancer: 1, // Alex Chen
    status: "ACCEPTED",
    created_at: "2023-10-23T11:00:00Z"
  }
];

export const mockReviews = [
  {
    id: 1,
    project: 1,
    reviewer: 2, // Sarah Williams
    reviewee: 1, // Alex Chen
    rating: 5,
    comment: "Excellent work and great communication throughout the project",
    created_at: "2023-10-23T15:00:00Z"
  }
];

export const mockComments = [
  {
    id: 1,
    project: 1,
    user: 2, // Sarah Williams
    text: "Looking forward to seeing the first prototype!",
    created_at: "2023-10-23T12:00:00Z"
  }
];

// For convenience, adding references for looking up related data
export const mockCategories = [
  {
    id: 1,
    name: "Mobile Development",
    slug: "mobile-dev"
  },
  {
    id: 2,
    name: "Web Development",
    slug: "web-dev"
  },
  {
    id: 3,
    name: "UI/UX Design",
    slug: "ui-ux-design"
  }
];