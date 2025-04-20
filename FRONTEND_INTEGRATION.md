# Frontend Integration Guide

This document provides guidance on integrating a frontend application with the Volunteer Bazaar API.

## Technology Recommendations

For the frontend, we recommend using:

- **React** or **Angular** for the UI framework
- **Redux** or **Context API** for state management (React)
- **NgRx** for state management (Angular)
- **Axios** or **Fetch API** for API requests
- **React Router** or **Angular Router** for navigation
- **Material UI**, **Ant Design**, or **Bootstrap** for UI components

## Authentication Flow

1. Implement login and signup forms that post to `/auth/login` and `/auth/signup` endpoints
2. Store the JWT token in localStorage or a secure cookie
3. Include the token in all subsequent requests using the Authorization header
4. Implement JWT token expiration handling and refresh logic if needed

## Key Frontend Routes

Implement the following routes in your frontend application:

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/events` - Browse volunteer opportunities
- `/events/:id` - View specific volunteer opportunity details
- `/organizations` - Browse organizations

### Volunteer Routes (Authentication Required)
- `/dashboard` - Volunteer dashboard
- `/profile` - Volunteer profile management
- `/applications` - Track volunteer applications
- `/history` - View volunteering history

### Organization Routes (Authentication + Organization Role Required)
- `/org/dashboard` - Organization dashboard
- `/org/profile` - Organization profile management
- `/org/events` - Manage organization events
- `/org/events/new` - Create new volunteer opportunity
- `/org/events/:id/edit` - Edit volunteer opportunity
- `/org/events/:id/applications` - View applications for an opportunity

### Admin Routes (Authentication + Admin Role Required)
- `/admin/dashboard` - Admin dashboard with statistics
- `/admin/users` - Manage users
- `/admin/organizations` - Manage organizations
- `/admin/organizations/pending` - Review and approve/reject organization registrations
- `/admin/events` - Manage all events

## API Consumption Examples

### Authentication

```javascript
// Login example
async function login(email, password) {
  try {
    const response = await axios.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    // Store token and user data
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Set default Authorization header for future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return user;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}
```

### Fetching Events

```javascript
// Get upcoming events example
async function getUpcomingEvents() {
  try {
    const response = await axios.get('/events/upcoming');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch upcoming events:', error);
    throw error;
  }
}
```

### Registering for an Event

```javascript
// Register for an event example
async function registerForEvent(eventId, userId) {
  try {
    const response = await axios.post(`/events/${eventId}/register/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to register for event:', error);
    throw error;
  }
}
```

## Error Handling

Implement consistent error handling across your application:

```javascript
// Example of global Axios error interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    const { status, data } = error.response || {};
    
    // Handle authentication errors
    if (status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    
    // Handle forbidden errors
    if (status === 403) {
      // Show permission denied message
    }
    
    // Create user-friendly error message
    const errorMessage = data?.message || 'An unexpected error occurred';
    
    // Show error to user (using your preferred notification system)
    showNotification(errorMessage, 'error');
    
    return Promise.reject(error);
  }
);
```

## Responsive Design

Ensure your application is responsive and mobile-friendly. Consider using these breakpoints:

- Mobile: 320px - 480px
- Tablet: 481px - 768px
- Laptop: 769px - 1024px
- Desktop: 1025px and above

## Deployment

For frontend deployment, consider:

1. **Static hosting options**: Netlify, Vercel, GitHub Pages, or AWS S3
2. **Configuration management**: Use environment variables to manage API endpoints for different environments
3. **Build optimization**: Implement code splitting, lazy loading, and asset optimization 