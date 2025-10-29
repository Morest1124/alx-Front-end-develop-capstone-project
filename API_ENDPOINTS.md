# API Endpoints

The base URL for the live API is:
https://binaryblade2411.pythonanywhere.com

 **https://binaryblade24-api.onrender.com**


The following table outlines the RESTful API endpoints for the platform.

| Entity         | Method | Endpoint                               | Description                                                      |
| -------------- | ------ | -------------------------------------- | ---------------------------------------------------------------- |
| **Authentication** | POST   | `/api/auth/register/`                  | Creates a new user (Freelancer or Client).                       |
|                | POST   | `/api/auth/login/`                     | Authenticates a user and returns a token.                        |
|                | POST   | `/api/auth/login/role/`                | Authenticates a user with a specific role.                       |
| **User**           | GET    | `/api/users/`                          | Retrieves a list of all users.                                   |
|                | GET    | `/api/users/{id}/`                     | Retrieves a specific user's public profile.                      |
|                | PUT    | `/api/users/{id}/`                     | Updates the authenticated user's details.                        |
| **User Profile**   | GET    | `/api/users/{id}/profile/`             | Retrieves the detailed profile for a user.                       |
|                | PUT    | `/api/users/{id}/profile/`             | Creates or updates the detailed profile for the authenticated user.|
| **Project**        | GET    | `/api/projects/`                       | Retrieves a list of all open projects.                           |
|                | GET    | `/api/projects/{id}/`                  | Retrieves a specific project's details.                          |
|                | POST   | `/api/projects/`                       | Creates a new project (Client only).                             |
|                | PUT    | `/api/projects/{id}/`                  | Updates an existing project (Client only).                       |
|                | DELETE | `/api/projects/{id}/`                  | Deletes a project (Client only).                                 |
| **Proposal**       | GET    | `/api/projects/{project_pk}/proposals/`| Retrieves all proposals for a specific project.                  |
|                | POST   | `/api/projects/{project_pk}/proposals/`| Submits a new proposal to a project (Freelancer only).           |
|                | GET    | `/api/proposals/`                      | Retrieves a list of all proposals.                               |
|                | GET    | `/api/proposals/{id}/`                 | Retrieves a specific proposal's details.                         |
|                | PATCH  | `/api/projects/{project_pk}/proposals/{id}/status/` | Client accepts or rejects a proposal.               |
|                | GET    | `/api/users/{id}/proposals/`           | Retrieves all proposals submitted by a specific freelancer.      |
| **Review**         | POST   | `/api/projects/{project_pk}/reviews/`  | Client submits a review/rating for a freelancer.                 |
|                | GET    | `/api/users/{id}/reviews/`             | Retrieves all reviews received by a user.                        |
| **Comment**        | POST   | `/api/projects/{project_pk}/comments/` | Adds a comment to a specific project.                            |
|                | GET    | `/api/projects/{project_pk}/comments/` | Retrieves all comments for a specific project.                   |
| **Dashboard**      | GET    | `/api/dashboard/freelancer/`           | Retrieves metrics for the freelancer dashboard.                  |
|                | GET    | `/api/dashboard/client/`               | Retrieves metrics for the client dashboard.                      |
|                | GET    | `/api/dashboard/freelancer/{user_id}/` | Retrieves metrics for a specific freelancer.                     |
| **Message**        | GET    | `/api/messages/`                       | Retrieves the user's inbox.                                      |
|                | GET    | `/api/messages/sent/`                  | Retrieves the user's sent messages.                              |
|                | GET    | `/api/messages/{id}/`                  | Retrieves a single message and marks it as read.                 |
|                | POST   | `/api/messages/send/`                  | Sends a new message.                                             |
| **API Key**        | POST   | `/api/api-key/generate-key/`           | Generates a new API key for the authenticated user.              |

Additional profile fields (read-only/computed):

- `completed_projects` - list of completed projects for the user (id, title, thumbnail, status).
- `portfolio` - list of thumbnail URLs derived from completed projects.
- `active_projects` - list of projects currently in progress.
- `projects_posted` - integer count of projects the user has posted.
- `avg_rating` - average rating computed from `Review` records (falls back to `profile.rating` if present).

Authentication notes:

- The API uses SimpleJWT for token-based authentication. Login returns `access` and `refresh` tokens. Use the `access` token in the Authorization header as: `Authorization: Bearer <access>`.

