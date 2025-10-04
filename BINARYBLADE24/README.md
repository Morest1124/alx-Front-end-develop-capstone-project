# BINARYBLADE24


## Project Overview
BINARYBLADE24 is a front-end capstone project built with React and Vite, styled using Tailwind CSS. The application provides a platform for freelancers and clients to connect, post jobs, find talent, and manage projects.

This repository contains the front-end code for a modern, responsive **Freelance Marketplace** single-page application (SPA). The project is built using **React** for a dynamic user interface and **Tailwind CSS** for utility-first styling.

The core concept is inspired by a "Book Library," where users can search for projects and freelancer profiles instead of books. A central focus of this platform is building **trust** and **security** through mandatory **identity verification** for all users, aiming to reduce spam and fraudulent activities.

---

## Features Implemented So Far
- **Component Structure Refactored:**
	- Created new components for Login, Profile, Projects, Register, SignUp, and Talent pages.
	- Removed obsolete and duplicate components for a cleaner codebase.
- **Navigation System:**
	- Dynamic navigation links for public, client, and freelancer roles.
	- Responsive Navbar with role-based links and profile dropdown.
- **Routing:**
	- Integrated `react-router-dom` for client-side routing.
	- Set up routes for all main pages (dashboard, projects, proposals, messages, earnings, etc.).
- **Styling:**
	- Tailwind CSS used for rapid UI development.
	- Custom styles for navigation links and layout.
- **Authentication Context:**
	- Context API used for managing authentication state and role switching.
- **Project Configuration:**
	- Vite for fast development and build.
	- ESLint for code quality.
	- PostCSS/Tailwind setup for CSS processing.
- **General Cleanup:**
	- Removed unused assets and files.
	- Updated `.gitignore` and configuration files.

	---

	## Key Features 🔒

	The platform is designed to provide a seamless experience for both clients and freelancers, emphasizing security and ease of use.

	- **Secure User Authentication:**
		- Multi-step registration and login pages.
		- Supports third-party login (e.g., Google, LinkedIn).
		- **Crucial Feature:** Users are required to use their **real names** and **verify their identity with an ID** before engaging with other users.
	- **Project Browsing & Search:**
		- View a comprehensive list of all available projects.
		- Powerful search and filtering by project **title, required skills, or budget**.
	- **User Profiles:**
		- **Freelancer Profiles:** Display portfolio, skills, and client reviews.
		- **Client Profiles:** Showcase a history of past projects.
	- **Proposals and Bidding:**
		- Freelancers can easily submit a proposal directly from the project detail page.

	---

	## Tech Stack & Architecture 🛠️

	| Technology | Purpose |
	| :--- | :--- |
	| **React** | Core JavaScript library for building the SPA user interface. |
	| **Tailwind CSS** | Utility-first CSS framework for rapid and responsive styling. |
	| **React Router** | For client-side routing and seamless page navigation. |
	| **Context API** | (See `AuthContext.jsx`) For global state management, specifically authentication. |

	### Project Structure Overview

	| Folder/File | Purpose |
	| :--- | :--- |
	| **`components/`** | Reusable UI elements (`Navbar`, `ProposalForm`, `Login`, `SignUp`, etc.) |
	| **`contexts/`** | Global state management (e.g., `AuthContext.jsx` for user session). |
	| **`pages/`** | Top-level views corresponding to routes (e.g., `ClientDashboard`, `PublicHome`). |
	| `App.jsx` | The main application component that renders the layout and routers. |
	| `Routers.jsx` | Houses the main routing logic using **React Router**. |

	---

	## API Endpoints (For Future Integration) 🌐

	This front-end application is being built to consume data from a separate back-end API. The following endpoints will be used to create the dynamic experience:

	| Endpoint | Method | Description |
	| :--- | :--- | :--- |
	| `/api/projects/` | `GET` | Retrieve a list of all available projects. |
	| `/api/projects/?search=...` | `GET` | Search and filter projects based on criteria. |
	| `/api/projects/<id>/` | `GET` | Fetch detailed information for a specific project. |
	| `/api/profiles/<id>/` | `GET` | Get a user's profile details. |
	| `/api/register/` & `/api/login/` | `POST` | User authentication. |

	---

	## 5-Week Development Roadmap (Front-End Design Focus) 🗓️

	This phase focuses purely on the front-end design, component creation, and structure using React and Tailwind CSS. **No actual API integration or data fetching will be implemented yet.** All dynamic areas will be populated with **dummy/placeholder data**.

	### Week 1 & 2: Planning and Core Pages (Foundation)

	- ✅ Set up the React project structure and configure **Tailwind CSS**.
	- ✅ Implement `Routers.jsx` using **React Router** for navigation.
	- ✅ Build the foundational components: `Navbar.jsx`, `Login.jsx`, and `SignUp.jsx`/`Register.jsx`.
		- *Focus:* Designing the UI and creating the form structures.

	### Week 3: Project Browsing Component Design (Core Structure)

	- ➡️ Design the UI for the main project list, utilizing the `Projects.jsx` component.
	- ➡️ Build the reusable **`ProjectCard`** (likely a component within `components/`) populated with **dummy data** for layout demonstration.
	- ➡️ Finalize the responsive layout for the public browsing and search pages (`PublicHome.jsx` and `Projects.jsx`).

	### Week 4: Advanced Component Design (Interactivity Simulation)

	- ➡️ Design the search and filtering UI (likely within `Projects.jsx`).
	- ➡️ Build the **`Project`** component, using **dummy data** to demonstrate the full layout, including the description and proposals section.
	- ➡️ Create the component to display proposal listings.

	### Week 5: User Profiles and Forms (Completion)

	- ➡️ Build and style the **Profile Page** (using `Profile.jsx` and potentially `RatingsPage.jsx`) with **placeholder content**.
	- ➡️ Design the **`ProposalForm.jsx`** component, including all necessary input fields.
	- ➡️ Design the layouts for the Dashboards (`ClientDashboard.jsx` and `FreelancerDashboard.jsx`).

	---

	## Next Steps
	- Integrate API calls to connect the front end with external data sources (no backend system yet).
	- Add more advanced features (notifications, messaging, earnings tracking).
	- Improve UI/UX and accessibility.
	- Backend development will be handled separately and combined later as needed.

	## Getting Started
	1. Install dependencies:
	   ```sh
	   npm install
	   ```
	2. Start the development server:
	   ```sh
	   npm run dev
	   ```

	---

	Feel free to contribute or suggest improvements!
