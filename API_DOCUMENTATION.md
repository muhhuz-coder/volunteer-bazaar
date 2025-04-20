# Volunteer Bazaar API Documentation

This document provides detailed information about the Volunteer Bazaar REST API endpoints, request/response formats, and authentication requirements.

## Base URL

```
http://localhost:3000
```

For production, replace with your actual domain.

## Authentication

Most endpoints require authentication. The API uses JWT (JSON Web Token) for authentication.

### Getting a Token

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "user_id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "volunteer",
    "gender": "male",
    "age": 28
    // other user fields
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Using the Token

Include the token in the Authorization header for all protected endpoints:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## API Endpoints

### Authentication

#### Register a New User

```
POST /auth/signup
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "volunteer",
  "gender": "male",
  "age": 28,
  "bio": "I love volunteering!"
}
```

**Response:**
```json
{
  "user": {
    "user_id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "volunteer",
    // other user fields
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as above

### Users

#### Get All Users

```
GET /users
```

**Response:**
```json
[
  {
    "user_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "volunteer",
    // other user fields
  },
  {
    "user_id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "organization",
    // other user fields
  }
]
```

#### Search Users

```
GET /users/search?name=John&role=volunteer
```

**Query Parameters:**
- `name`: Filter by name (partial match)
- `gender`: Filter by gender
- `age`: Filter by age
- `city_id`: Filter by city ID
- `province`: Filter by province/state
- `degree_id`: Filter by degree ID
- `field_id`: Filter by field ID

**Response:** Same format as Get All Users

#### Get User Statistics

```
GET /users/stats/:id
```

**Response:**
```json
{
  "totalEvents": 5,
  "skillsCount": 3,
  "rating": 4.8,
  "hoursCompleted": 25
}
```

#### Get User Profile

```
GET /users/profile/:id
```

**Response:**
```json
{
  "user_id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "volunteer",
  "gender": "male",
  "age": 28,
  "bio": "I love volunteering!",
  "city": {
    "city_id": 1,
    "name": "New York"
  },
  "userSkills": [
    {
      "user_skill_id": 1,
      "skill": {
        "skill_id": 1,
        "name": "Teaching"
      }
    }
  ],
  // other related data
}
```

#### Update User Profile

```
PUT /users/profile/:id
```

**Request Body:**
```json
{
  "name": "John Smith",
  "gender": "male",
  "age": 29,
  "bio": "Updated bio information",
  "province": "California"
}
```

**Response:** Updated user object

#### Get Users by Role

```
GET /users/volunteers
GET /users/organizations
GET /users/admin
```

**Response:** List of users with the specified role

### Events

#### Get All Events

```
GET /events?page=1&limit=10
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 10)

**Response:**
```json
[
  {
    "event_id": 1,
    "title": "Beach Cleanup",
    "start_date": "2023-08-15",
    "end_date": "2023-08-15",
    "start_time": "09:00:00",
    "end_time": "12:00:00",
    "organization": {
      "organization_id": 1,
      "organization_name": "Green Earth"
    },
    "city": {
      "city_id": 1,
      "name": "Miami"
    },
    // other event details
  },
  // more events
]
```

#### Get Event by ID

```
GET /events/:id
```

**Response:** Detailed event object

#### Get Upcoming Events

```
GET /events/upcoming
```

**Response:** List of upcoming events

#### Get Popular Events

```
GET /events/popular
```

**Response:** List of most popular events

#### Create Event

```
POST /events
```

**Request Body:**
```json
{
  "title": "Beach Cleanup",
  "event_type_id": 1,
  "start_date": "2023-08-15",
  "end_date": "2023-08-15",
  "start_time": "09:00:00",
  "end_time": "12:00:00",
  "city_id": 1,
  "organization_id": 1
}
```

**Response:** Created event object

#### Update Event

```
PUT /events/:id
```

**Request Body:** Event fields to update

**Response:** Updated event object

#### Delete Event

```
DELETE /events/:id
```

**Response:** Success message

#### Register for Event

```
POST /events/:eventId/register/:userId
```

**Response:**
```json
{
  "event_id": 1,
  "user_id": 1
}
```

#### Unregister from Event

```
DELETE /events/:eventId/unregister/:userId
```

**Response:** Success message

#### Check User Participation

```
GET /events/:eventId/user/:userId/participation
```

**Response:**
```json
{
  "isRegistered": true
}
```

#### Get User Events

```
GET /events/user/:userId
```

**Response:** List of events the user is registered for

### Organizations

#### Get All Organizations

```
GET /organizations
```

**Response:** List of organizations

#### Get Organization by ID

```
GET /organizations/:id
```

**Response:** Detailed organization object

#### Create Organization

```
POST /organizations
```

**Request Body:**
```json
{
  "organization_name": "Green Earth",
  "description": "Environmental conservation organization",
  "logo_url": "https://example.com/logo.png",
  "website": "https://greenearth.org",
  "email": "contact@greenearth.org",
  "phone": "123-456-7890",
  "address": "123 Green St, Eco City"
}
```

**Response:** Created organization object

#### Update Organization

```
PUT /organizations/:id
```

**Request Body:** Organization fields to update

**Response:** Updated organization object

#### Delete Organization

```
DELETE /organizations/:id
```

**Response:** Success message

#### Get Organization Events

```
GET /organizations/:id/events
```

**Response:** List of events for the organization

### Admin

#### Get Dashboard Statistics

```
GET /admin/dashboard
```

**Response:**
```json
{
  "totalUsers": 150,
  "totalVolunteers": 120,
  "totalOrganizations": 25,
  "totalEvents": 75,
  "totalRegistrations": 350
}
```

#### Get Pending Organizations

```
GET /admin/organizations/pending
```

**Response:** List of organizations with pending status

#### Approve Organization

```
POST /admin/organizations/:id/approve
```

**Response:** Updated organization with approved status

#### Reject Organization

```
POST /admin/organizations/:id/reject
```

**Response:** Updated organization with rejected status

#### Get Most Active Volunteers

```
GET /admin/volunteers/most-active
```

**Response:** List of most active volunteers

#### Get Most Popular Events

```
GET /admin/events/most-popular
```

**Response:** List of most popular events

## Error Handling

The API returns standard HTTP status codes and error messages in the following format:

```json
{
  "statusCode": 400,
  "message": "Error message here",
  "error": "Bad Request"
}
```

Common status codes:
- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authentication succeeded but user lacks permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Pagination

Endpoints that return multiple items support pagination with the following parameters:

- `page`: Page number (default: 1)
- `limit`: Number of items per page (default varies by endpoint)

Example:
```
GET /events?page=2&limit=20
```

## Rate Limiting

The API implements rate limiting to prevent abuse. If you exceed the rate limit, you'll receive a 429 Too Many Requests response with a Retry-After header indicating when you can make requests again. 