export const mockUsers = [
  {
    id: 1,
    name: "Alex Chen",
    role: "FREELANCER",
    title: "Full Stack Developer",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=800&q=80",
    skills: ["React", "Node.js", "Python"],
    rating: 4.8,
    hourlyRate: 45,
    completedProjects: 32,
    portfolio: {
      codeProject: "https://images.unsplash.com/photo-1566837945700-30057527ade0",
      dashboardProject: "https://images.unsplash.com/photo-1531403009284-440f080d1e12",
      setupProject: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d",
    },
    // Additional fields from backend
    email: "alex.chen@example.com",
    country_origin: "Canada",
    phone_number: "+1234567890",
    bio: "Full stack developer with 5+ years of experience in web and mobile development",
    skill_level: "SENIOR",
    availability: "AVAILABLE",
    reviews_received: [
      {
        rating: 5,
        comment: "Excellent work on our mobile app project",
        project_id: 1
      }
    ]
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "CLIENT",
    title: "Project Manager",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    company: "TechSolutions Inc.",
    projectsPosted: 15,
    rating: 4.9,
    activeProjects: [
      {
        title: "Mobile App Development",
        thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c"
      },
      {
        title: "Web Platform Upgrade",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
      }
    ],
    // Additional fields from backend
    email: "sarah.williams@example.com",
    country_origin: "United States",
    phone_number: "+1987654321",
    reviews_given: [
      {
        rating: 5,
        comment: "Very professional and delivered on time",
        project_id: 1
      }
    ]
  },
  {
    id: 3,
    name: "Marcus Johnson",
    role: "FREELANCER",
    title: "UI/UX Designer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
    skills: ["Figma", "Adobe XD", "Sketch"],
    rating: 4.7,
    hourlyRate: 55,
    completedProjects: 28,
    portfolio: {
      designProject: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d",
      appDesign: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
      brandingWork: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
    },
    // Additional fields from backend
    email: "marcus.johnson@example.com",
    country_origin: "UK",
    phone_number: "+44123456789",
    bio: "Passionate UI/UX designer with a focus on user-centered design",
    skill_level: "EXPERT",
    availability: "AVAILABLE"
  },
  {
    id: 4,
    name: "Emily Parker",
    role: "CLIENT",
    title: "Startup Founder",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80",
    company: "InnovateTech",
    projectsPosted: 8,
    rating: 4.6,
    activeProjects: [
      {
        title: "Brand Identity Design",
        thumbnail: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d"
      }
    ],
    // Additional fields from backend
    email: "emily.parker@example.com",
    country_origin: "Australia",
    phone_number: "+61123456789"
  },
  {
    id: 5,
    name: "David Kim",
    role: "FREELANCER",
    title: "Mobile Developer",
    avatar: "https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?auto=format&fit=crop&w=800&q=80",
    skills: ["React Native", "iOS", "Android"],
    rating: 4.9,
    hourlyRate: 60,
    completedProjects: 45,
    portfolio: {
      mobileApp: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
      appInterface: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      userFlow: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d"
    },
    // Additional fields from backend
    email: "david.kim@example.com",
    country_origin: "South Korea",
    phone_number: "+82123456789",
    bio: "Mobile development expert specializing in cross-platform solutions",
    skill_level: "EXPERT",
    availability: "AVAILABLE"
  }
];

export const mockProjects = [
  {
    id: 1,
    title: "Mobile App Development",
    description: "Develop a cross-platform mobile app for our fitness tracking service",
    price: 5000.00,
    budget: 7000.00,
    project_id: 1001,
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
    delivery_days: "2024-01-15T00:00:00Z",
    created_at: "2023-10-23T10:00:00Z",
    updated_at: "2023-10-23T10:00:00Z",
    category: "Mobile Development",
    status: "IN_PROGRESS",
    client_id: 2, // Sarah Williams
    proposals: [
      {
        id: 1,
        bid_amount: 4800.00,
        cover_letter: "I have extensive experience in mobile development and would love to help build your fitness app.",
        freelancer_id: 1, // Alex Chen
        status: "ACCEPTED",
        created_at: "2023-10-23T11:00:00Z"
      }
    ],
    reviews: [
      {
        rating: 5,
        comment: "Excellent work and great communication throughout the project",
        reviewer_id: 2, // Sarah Williams
        reviewee_id: 1, // Alex Chen
        created_at: "2023-10-23T15:00:00Z"
      }
    ],
    comments: [
      {
        user_id: 2,
        text: "Looking forward to seeing the first prototype!",
        created_at: "2023-10-23T12:00:00Z"
      }
    ]
  },
  {
    id: 2,
    title: "Web Platform Upgrade",
    description: "Modernize our existing web platform with latest technologies",
    price: 8000.00,
    budget: 10000.00,
    project_id: 1002,
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    delivery_days: "2024-02-28T00:00:00Z",
    created_at: "2023-10-23T09:00:00Z",
    updated_at: "2023-10-23T09:00:00Z",
    category: "Web Development",
    status: "OPEN",
    client_id: 2, // Sarah Williams
    proposals: [
      {
        id: 2,
        bid_amount: 7500.00,
        cover_letter: "I specialize in platform modernization and have worked on similar projects.",
        freelancer_id: 5, // David Kim
        status: "PENDING",
        created_at: "2023-10-23T10:30:00Z"
      }
    ]
  },
  {
    id: 3,
    title: "Brand Identity Design",
    description: "Create a complete brand identity for our tech startup",
    price: 3000.00,
    budget: 4000.00,
    project_id: 1003,
    thumbnail: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d",
    delivery_days: "2024-01-30T00:00:00Z",
    created_at: "2023-10-22T14:00:00Z",
    updated_at: "2023-10-22T14:00:00Z",
    category: "Design",
    status: "OPEN",
    client_id: 4, // Emily Parker
    proposals: [
      {
        id: 3,
        bid_amount: 3500.00,
        cover_letter: "I would love to help create a unique brand identity for your startup.",
        freelancer_id: 3, // Marcus Johnson
        status: "PENDING",
        created_at: "2023-10-23T09:15:00Z"
      }
    ]
  }
];

export const mockMessages = [
  {
    id: 1,
    sender_id: 2, // Sarah Williams
    recipient_id: 1, // Alex Chen
    subject: "Mobile App Project Discussion",
    body: "Hi Alex, I'd like to discuss some features for the mobile app project.",
    timestamp: "2023-10-23T13:00:00Z",
    is_read: false
  },
  {
    id: 2,
    sender_id: 4, // Emily Parker
    recipient_id: 3, // Marcus Johnson
    subject: "Brand Identity Proposal",
    body: "Hello Marcus, I'm interested in your proposal for our brand identity project.",
    timestamp: "2023-10-23T14:00:00Z",
    is_read: true
  }
];