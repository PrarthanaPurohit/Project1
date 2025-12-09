# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are obtained through the login endpoint and expire after 7 days (configurable).

---

## Public Endpoints

### Projects

#### Get All Projects

Retrieves all projects for display on the landing page.

**Endpoint:** `GET /api/projects`

**Authentication:** Not required

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "E-Commerce Platform",
      "description": "A full-featured online shopping platform with payment integration",
      "image": "/uploads/projects/image-1234567890.jpg",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "Error fetching projects"
}
```

---

### Clients

#### Get All Clients

Retrieves all client testimonials for display on the landing page.

**Endpoint:** `GET /api/clients`

**Authentication:** Not required

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "description": "Working with this team was an absolute pleasure. They delivered beyond expectations!",
      "designation": "CEO, Tech Corp",
      "image": "/uploads/clients/image-1234567891.jpg",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "Error fetching clients"
}
```

---

### Contact Form

#### Submit Contact Form

Submits a contact form from a visitor.

**Endpoint:** `POST /api/contact`

**Authentication:** Not required

**Request Body:**

```json
{
  "fullName": "Jane Smith",
  "email": "jane.smith@example.com",
  "mobileNumber": "+1234567890",
  "city": "New York"
}
```

**Validation Rules:**
- `fullName`: Required, 1-100 characters
- `email`: Required, valid email format
- `mobileNumber`: Required, 10-15 characters
- `city`: Required, 1-100 characters

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "fullName": "Jane Smith",
    "email": "jane.smith@example.com",
    "mobileNumber": "+1234567890",
    "city": "New York",
    "submittedAt": "2024-01-15T10:30:00.000Z",
    "isRead": false
  }
}
```

**Error Response:** `400 Bad Request`

```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

---

### Newsletter

#### Subscribe to Newsletter

Subscribes an email address to the newsletter.

**Endpoint:** `POST /api/newsletter/subscribe`

**Authentication:** Not required

**Request Body:**

```json
{
  "email": "subscriber@example.com"
}
```

**Validation Rules:**
- `email`: Required, valid email format, unique

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "email": "subscriber@example.com",
    "subscribedAt": "2024-01-15T10:30:00.000Z",
    "isActive": true
  }
}
```

**Error Response:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Email already subscribed"
}
```

---

## Authentication Endpoints

### Login

#### Admin Login

Authenticates an admin user and returns a JWT token.

**Endpoint:** `POST /api/auth/login`

**Authentication:** Not required

**Request Body:**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "_id": "507f1f77bcf86cd799439015",
    "username": "admin",
    "email": "admin@showcase.com"
  }
}
```

**Error Response:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## Protected Admin Endpoints

All endpoints below require authentication via JWT token.

### Admin Projects

#### Get All Projects (Admin)

Retrieves all projects with full details for admin management.

**Endpoint:** `GET /api/admin/projects`

**Authentication:** Required

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "E-Commerce Platform",
      "description": "A full-featured online shopping platform",
      "image": "/uploads/projects/image-1234567890.jpg",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

#### Create Project

Creates a new project with image upload.

**Endpoint:** `POST /api/admin/projects`

**Authentication:** Required

**Content-Type:** `multipart/form-data`

**Request Body:**
- `name`: String (required, max 200 characters)
- `description`: String (required, max 1000 characters)
- `image`: File (required, image file, max 5MB)

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "name": "New Project",
    "description": "Project description",
    "image": "/uploads/projects/image-1234567892.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response:** `400 Bad Request`

```json
{
  "success": false,
  "errors": [
    {
      "field": "name",
      "message": "Project name is required"
    }
  ]
}
```

---

#### Update Project

Updates an existing project.

**Endpoint:** `PUT /api/admin/projects/:id`

**Authentication:** Required

**Content-Type:** `multipart/form-data`

**Request Body:**
- `name`: String (optional, max 200 characters)
- `description`: String (optional, max 1000 characters)
- `image`: File (optional, image file, max 5MB)

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "name": "Updated Project Name",
    "description": "Updated description",
    "image": "/uploads/projects/image-1234567893.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Error Response:** `404 Not Found`

```json
{
  "success": false,
  "message": "Project not found"
}
```

---

#### Delete Project

Deletes a project and its associated image.

**Endpoint:** `DELETE /api/admin/projects/:id`

**Authentication:** Required

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

**Error Response:** `404 Not Found`

```json
{
  "success": false,
  "message": "Project not found"
}
```

---

### Admin Clients

#### Get All Clients (Admin)

Retrieves all clients with full details for admin management.

**Endpoint:** `GET /api/admin/clients`

**Authentication:** Required

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "description": "Great experience working together!",
      "designation": "CEO, Tech Corp",
      "image": "/uploads/clients/image-1234567891.jpg",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

#### Create Client

Creates a new client testimonial with image upload.

**Endpoint:** `POST /api/admin/clients`

**Authentication:** Required

**Content-Type:** `multipart/form-data`

**Request Body:**
- `name`: String (required, max 100 characters)
- `description`: String (required, max 500 characters)
- `designation`: String (required, max 100 characters)
- `image`: File (required, image file, max 5MB)

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Client created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439017",
    "name": "Jane Smith",
    "description": "Excellent service and quality!",
    "designation": "CTO, Innovation Labs",
    "image": "/uploads/clients/image-1234567894.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### Update Client

Updates an existing client testimonial.

**Endpoint:** `PUT /api/admin/clients/:id`

**Authentication:** Required

**Content-Type:** `multipart/form-data`

**Request Body:**
- `name`: String (optional, max 100 characters)
- `description`: String (optional, max 500 characters)
- `designation`: String (optional, max 100 characters)
- `image`: File (optional, image file, max 5MB)

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Client updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439017",
    "name": "Jane Smith",
    "description": "Updated testimonial",
    "designation": "CTO, Innovation Labs",
    "image": "/uploads/clients/image-1234567895.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

#### Delete Client

Deletes a client testimonial and its associated image.

**Endpoint:** `DELETE /api/admin/clients/:id`

**Authentication:** Required

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Client deleted successfully"
}
```

---

### Admin Contact Submissions

#### Get All Contact Submissions

Retrieves all contact form submissions.

**Endpoint:** `GET /api/admin/contacts`

**Authentication:** Required

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "fullName": "Jane Smith",
      "email": "jane.smith@example.com",
      "mobileNumber": "+1234567890",
      "city": "New York",
      "submittedAt": "2024-01-15T10:30:00.000Z",
      "isRead": false
    }
  ]
}
```

---

#### Delete Contact Submission

Deletes a contact form submission.

**Endpoint:** `DELETE /api/admin/contacts/:id`

**Authentication:** Required

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Contact submission deleted successfully"
}
```

---

### Admin Newsletter Subscriptions

#### Get All Newsletter Subscriptions

Retrieves all newsletter subscriptions.

**Endpoint:** `GET /api/admin/subscriptions`

**Authentication:** Required

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "email": "subscriber@example.com",
      "subscribedAt": "2024-01-15T10:30:00.000Z",
      "isActive": true
    }
  ]
}
```

---

#### Delete Newsletter Subscription

Deletes a newsletter subscription.

**Endpoint:** `DELETE /api/admin/subscriptions/:id`

**Authentication:** Required

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Subscription deleted successfully"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Authentication required or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Image Upload Specifications

### Supported Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

### Size Limits
- Maximum file size: 5MB
- Automatic cropping to: 450 x 350 pixels

### Storage
- Images are stored in the `/uploads` directory
- Organized by type: `/uploads/projects/` and `/uploads/clients/`
- Filenames are automatically generated with timestamps

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting in production to prevent abuse.

---

## CORS Configuration

The API accepts requests from the configured frontend origin. Update CORS settings in production to match your domain.
