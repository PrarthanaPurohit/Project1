# Implementation Plan

- [x] 1. Initialize project structure and setup







  - Create root directory with separate folders for backend and frontend
  - Initialize Node.js project for backend with package.json
  - Initialize React project for frontend using Create React App or Vite
  - Set up Git repository with appropriate .gitignore files
  - Create .env.example files for both backend and frontend
  - _Requirements: 11.1, 11.2_

- [x] 2. Set up backend core infrastructure





  - Install required dependencies (express, mongoose, dotenv, cors, bcrypt, jsonwebtoken, multer, sharp, express-validator)
  - Create server.js entry point with Express app configuration
  - Set up MongoDB connection with Mongoose
  - Configure CORS middleware for cross-origin requests
  - Create folder structure (models, routes, controllers, middleware, utils)
  - _Requirements: 11.1, 11.2, 11.5_

- [x] 3. Implement database models





  - Create Project model with schema (name, description, image, timestamps)
  - Create Client model with schema (name, description, designation, image, timestamps)
  - Create Contact model with schema (fullName, email, mobileNumber, city, submittedAt, isRead)
  - Create Newsletter model with schema (email, subscribedAt, isActive)
  - Create Admin model with schema (username, password, email, createdAt, lastLogin)
  - Add validation rules and indexes to models
  - _Requirements: 1.1, 2.1, 3.3, 4.3, 5.3, 6.3, 10.2_

- [ ]* 3.1 Write property test for data model persistence
  - **Property 3: Contact form data persistence round-trip**
  - **Property 5: Newsletter subscription persistence round-trip**
  - **Property 7: Project creation persistence round-trip**
  - **Property 10: Client creation persistence round-trip**
  - **Validates: Requirements 3.3, 4.3, 5.3, 6.3**

- [x] 4. Implement authentication system





  - Create authentication middleware to verify JWT tokens
  - Create admin controller with login functionality
  - Implement password hashing with bcrypt
  - Create JWT token generation and verification utilities
  - Create POST /api/auth/login endpoint
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ]* 4.1 Write property tests for authentication
  - **Property 15: Unauthenticated access redirects to login**
  - **Property 16: Valid credentials grant access**
  - **Property 17: Invalid credentials deny access**
  - **Validates: Requirements 10.1, 10.2, 10.3**

- [x] 5. Implement image upload and processing





  - Configure Multer middleware for file uploads with size and type restrictions
  - Create image processing utility using Sharp to crop images to 450x350
  - Create file storage structure for uploaded images
  - Implement error handling for invalid file types and sizes
  - _Requirements: 9.1, 9.2, 9.3_

- [ ]* 5.1 Write property test for image cropping
  - **Property 14: Image cropping to specified dimensions**
  - **Validates: Requirements 9.1, 9.2, 9.3**

- [x] 6. Create public API endpoints





  - Create GET /api/projects endpoint to fetch all projects
  - Create GET /api/clients endpoint to fetch all clients
  - Create POST /api/contact endpoint to submit contact form
  - Create POST /api/newsletter/subscribe endpoint for newsletter subscription
  - Implement input validation middleware for POST endpoints
  - Add error handling for all endpoints
  - _Requirements: 1.1, 2.1, 3.2, 3.3, 4.2, 4.3, 11.1, 11.2, 11.3, 11.4_

- [ ]* 6.1 Write property tests for public API endpoints
  - **Property 18: API returns valid JSON responses**
  - **Property 19: API returns appropriate status codes**
  - **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**

- [ ]* 6.2 Write property tests for form validation
  - **Property 4: Contact form validation prevents empty submissions**
  - **Property 6: Email format validation**
  - **Validates: Requirements 3.5, 4.5**

- [x] 7. Create protected admin API endpoints for projects





  - Create POST /api/admin/projects endpoint with authentication middleware
  - Create GET /api/admin/projects endpoint for admin view
  - Create PUT /api/admin/projects/:id endpoint for updating projects
  - Create DELETE /api/admin/projects/:id endpoint for deleting projects
  - Integrate image upload and cropping for project images
  - Implement validation for project data
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 7.1 Write property tests for project management
  - **Property 8: Project appears in list after creation**
  - **Property 9: Project validation prevents empty submissions**
  - **Validates: Requirements 5.4, 5.5**

- [x] 8. Create protected admin API endpoints for clients





  - Create POST /api/admin/clients endpoint with authentication middleware
  - Create GET /api/admin/clients endpoint for admin view
  - Create PUT /api/admin/clients/:id endpoint for updating clients
  - Create DELETE /api/admin/clients/:id endpoint for deleting clients
  - Integrate image upload and cropping for client images
  - Implement validation for client data
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]* 8.1 Write property tests for client management
  - **Property 11: Client appears in list after creation**
  - **Property 12: Client validation prevents empty submissions**
  - **Validates: Requirements 6.4, 6.5**

- [x] 9. Create protected admin API endpoints for contact and newsletter management





  - Create GET /api/admin/contacts endpoint to fetch all contact submissions
  - Create DELETE /api/admin/contacts/:id endpoint to delete contact submissions
  - Create GET /api/admin/subscriptions endpoint to fetch all newsletter subscriptions
  - Create DELETE /api/admin/subscriptions/:id endpoint to delete subscriptions
  - Add authentication middleware to all admin endpoints
  - _Requirements: 7.1, 7.2, 8.1, 8.2_

- [x] 10. Checkpoint - Ensure backend tests pass





  - Ensure all tests pass, ask the user if questions arise

- [x] 11. Set up React frontend structure





  - Create folder structure (components, pages, services, utils, styles)
  - Install required dependencies (react-router-dom, axios)
  - Set up React Router for navigation
  - Create API service utility for making HTTP requests
  - Configure environment variables for API URL
  - _Requirements: 1.1, 2.1, 3.1, 4.1_

- [x] 12. Create landing page layout and navigation





  - Create main landing page component
  - Implement responsive navigation header
  - Create footer component
  - Set up basic styling structure (CSS modules or styled-components)
  - _Requirements: 1.1, 2.1, 3.1, 4.1_

- [x] 13. Implement Projects Section component





  - Create ProjectsSection component to fetch and display projects
  - Create ProjectCard component to render individual project with image, name, description, and "Read More" button
  - Implement loading state while fetching data
  - Implement error handling for failed API requests
  - Add responsive grid layout for project cards
  - Style components according to reference images
  - _Requirements: 1.1, 1.2, 1.3_

- [ ]* 13.1 Write property test for project rendering
  - **Property 1: Complete project rendering**
  - **Validates: Requirements 1.2, 1.3**

- [x] 14. Implement Happy Clients Section component





  - Create HappyClientsSection component to fetch and display clients
  - Create ClientCard component to render individual client with image, name, description, and designation
  - Implement loading state while fetching data
  - Implement error handling for failed API requests
  - Add responsive grid layout for client cards
  - Style components according to reference images
  - _Requirements: 2.1, 2.2, 2.3_

- [ ]* 14.1 Write property test for client rendering
  - **Property 2: Complete client rendering**
  - **Validates: Requirements 2.2, 2.3**

- [x] 15. Implement Contact Form component





  - Create ContactForm component with input fields (fullName, email, mobileNumber, city)
  - Implement form state management
  - Add client-side validation for required fields and email format
  - Implement form submission handler to POST data to backend
  - Display success message after successful submission
  - Display error messages for validation failures or API errors
  - Clear form after successful submission
  - Style form according to reference images
  - _Requirements: 3.1, 3.2, 3.4, 3.5_


- [x] 16. Implement Newsletter Subscription component




  - Create NewsletterSection component with email input field and subscribe button
  - Implement form state management
  - Add client-side email validation
  - Implement subscription handler to POST email to backend
  - Display success message after successful subscription
  - Display error messages for validation failures or API errors
  - Clear input after successful subscription
  - Style component according to reference images
  - _Requirements: 4.1, 4.2, 4.4, 4.5_

- [x] 17. Implement admin authentication





  - Create LoginPage component with username/email and password fields
  - Implement login form state management
  - Create authentication service to handle login API calls
  - Store JWT token in localStorage upon successful login
  - Implement ProtectedRoute component to guard admin routes
  - Redirect unauthenticated users to login page
  - Display error messages for invalid credentials
  - _Requirements: 10.1, 10.2, 10.3_

- [x] 18. Create admin panel layout





  - Create AdminLayout component with navigation sidebar
  - Implement navigation links for Projects, Clients, Contacts, and Subscriptions
  - Add logout functionality to clear token and redirect to login
  - Create responsive layout for admin panel
  - Style admin panel with clean, professional design
  - _Requirements: 5.1, 6.1, 7.1, 8.1_

- [x] 19. Implement admin project management





  - Create ProjectManagement page component
  - Create form to add new projects with image upload, name, and description fields
  - Integrate image cropper library (react-cropper or similar) for 450x350 ratio
  - Implement form validation for required fields
  - Create project list view showing all existing projects
  - Add delete functionality for projects
  - Add edit functionality for projects (optional)
  - Display success/error messages for operations
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 20. Implement admin client management










  - Create ClientManagement page component
  - Create form to add new clients with image upload, name, description, and designation fields
  - Integrate image cropper for 450x350 ratio
  - Implement form validation for required fields
  - Create client list view showing all existing clients
  - Add delete functionality for clients
  - Add edit functionality for clients (optional)
  - Display success/error messages for operations
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 21. Implement admin contact submissions view





  - Create ContactSubmissions page component
  - Fetch and display all contact form submissions in a table
  - Display fullName, email, mobileNumber, and city for each submission
  - Add delete functionality for individual submissions
  - Implement search/filter functionality (optional)
  - Add pagination for large datasets (optional)
  - Style table with responsive design
  - _Requirements: 7.1, 7.2, 7.3_

- [ ]* 21.1 Write property test for contact submission rendering
  - **Property 13: Complete contact submission rendering**
  - **Validates: Requirements 7.2, 7.3**

- [x] 22. Implement admin newsletter subscriptions view





  - Create NewsletterSubscriptions page component
  - Fetch and display all subscribed email addresses in a table
  - Display email and subscription date for each entry
  - Add delete functionality for individual subscriptions
  - Implement search functionality (optional)
  - Add export to CSV functionality (optional)
  - Style table with responsive design
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 23. Add loading states and error handling across frontend





  - Implement consistent loading spinners for all API calls
  - Create reusable error message components
  - Add toast notifications for success/error messages
  - Implement retry mechanisms for failed requests
  - Add empty state messages when no data is available
  - _Requirements: 1.1, 2.1, 3.4, 4.4_


- [x] 24. Implement responsive design and styling









  - Ensure all components are mobile-responsive
  - Test on different screen sizes (mobile, tablet, desktop)
  - Optimize images for different screen sizes
  - Ensure consistent styling across all pages
  - Match reference images for UI design
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1_


- [x] 25. Final checkpoint - Ensure all tests pass




  - Ensure all tests pass, ask the user if questions arise

- [x] 26. Create seed data and admin user









  - Create database seeding script for initial admin user
  - Add sample projects and clients for demonstration (optional)
  - Document default admin credentials in README
  - _Requirements: 10.2_

- [x] 27. Create documentation





  - Write README.md with project setup instructions
  - Document API endpoints and request/response formats
  - Add environment variable configuration guide
  - Include screenshots of landing page and admin panel
  - Document how to run the application locally
  - _Requirements: All_

- [ ] 28. Final testing and bug fixes
  - Test complete user flow on landing page (view projects, clients, submit forms)
  - Test complete admin flow (login, add/edit/delete projects and clients, view submissions)
  - Test image upload and cropping functionality
  - Test form validations on both frontend and backend
  - Test authentication and protected routes
  - Fix any bugs discovered during testing
  - _Requirements: All_
