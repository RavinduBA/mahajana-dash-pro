# API Integration Guide

This document explains how the frontend integrates with the backend API.

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://mhjapi.up.railway.app/v1
```

For local development:

```env
VITE_API_BASE_URL=http://localhost:3000/v1
```

## API Client

The application uses a centralized API client (`src/lib/api.ts`) built with **Axios** that handles:

- Base URL configuration
- JWT token management
- Request/response interceptors
- Automatic token injection
- Error handling with proper status codes
- File upload support (multipart/form-data)
- Request timeout (30 seconds)
- 401 Unauthorized handling (auto token clear)

### Usage Example

```typescript
import { apiClient } from "@/lib/api";

// GET request
const data = await apiClient.get("/products");

// GET with query params
const products = await apiClient.get("/products", {
  params: { limit: 20, offset: 0 },
});

// POST request
const response = await apiClient.post("/auth/staff/login", {
  email: "admin@example.com",
  password: "password123",
});

// PUT request
await apiClient.put("/admin/products/1", {
  title: "Updated Product",
});

// PATCH request (partial update)
await apiClient.patch("/admin/products/1", {
  stock: 100,
});

// DELETE request
await apiClient.delete("/admin/products/1");

// File upload
const formData = new FormData();
formData.append("file", file);
await apiClient.uploadFile(
  "/admin/products/upload",
  formData,
  (progressEvent) => {
    const progress = (progressEvent.loaded / progressEvent.total) * 100;
    console.log(`Upload progress: ${progress}%`);
  }
);

// Advanced: Get axios instance for custom configurations
const axiosInstance = apiClient.getAxiosInstance();
```

## Authentication

### Staff Login

**Endpoint:** `POST /auth/staff/login`

**Request:**

```json
{
  "email": "admin@supermarket.com",
  "password": "your-password"
}
```

**Response:**

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@supermarket.com",
      "role": "admin",
      "branch": {
        "id": 1,
        "title": "Main Branch"
      }
    }
  }
}
```

**Rate Limit:** 5 requests per 15 minutes

### Get Current User

**Endpoint:** `GET /auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@supermarket.com",
    "role": "admin",
    "branch": {
      "id": 1,
      "title": "Main Branch"
    }
  }
}
```

### Token Storage

Tokens are stored in:

- `localStorage` key: `admin_token`
- User data in: `admin_user`

### Logout

Clears:

- API client token
- `admin_token` from localStorage
- `admin_user` from localStorage

## User Interface Changes

### User Object Structure

The frontend now uses the backend's user structure:

```typescript
interface User {
  id: number; // Changed from string
  name: string; // Changed from fullName
  email: string;
  role: string;
  branch?: {
    id: number;
    title: string;
  };
}
```

### Profile Page Updates

- Displays `user.name` instead of `user.fullName`
- Shows branch information if available
- Phone number removed (not provided by API)

## Staff Registration

**Important:** Staff accounts cannot be self-registered through the public interface. They must be created by system administrators through the admin panel.

The registration page now displays:

- Information message about admin-only registration
- Link to login page
- No registration form

## Error Handling

The API client uses Axios interceptors to automatically handle errors and provides meaningful error messages:

```typescript
try {
  await apiClient.post("/auth/staff/login", credentials);
  // Success handling
} catch (error) {
  // Error is already formatted with proper message from server
  // or a default message for network errors
  toast({
    title: "Login failed",
    description: error.message,
    variant: "destructive",
  });
}
```

**Error Handling Features:**

- Extracts error messages from API responses
- Handles 401 Unauthorized (clears token automatically)
- Network error detection
- Timeout handling (30 seconds default)
- Request/response logging (in development mode)

## Protected Routes

The application uses the `ProtectedRoute` component to guard authenticated routes:

```tsx
<Route
  path="/"
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  {/* Protected routes */}
</Route>
```

## API Endpoints Reference

### Products

- `GET /products` - List all products (public)
- `GET /products/:id` - Get product details
- `POST /admin/products` - Create product (admin)
- `PUT /admin/products/:id` - Update product (admin)
- `DELETE /admin/products/:id` - Delete product (admin)

### Categories

- `GET /categories` - List all categories
- `POST /admin/categories` - Create category (admin)
- `PUT /admin/categories/:id` - Update category (admin)
- `DELETE /admin/categories/:id` - Delete category (admin)

### Branches

- `GET /branches` - List all branches
- `POST /admin/branches` - Create branch (admin)
- `PUT /admin/branches/:id` - Update branch (admin)
- `DELETE /admin/branches/:id` - Delete branch (admin)

### Brands

- `GET /brands` - List all brands
- `POST /admin/brands` - Create brand (admin)
- `PUT /admin/brands/:id` - Update brand (admin)
- `DELETE /admin/brands/:id` - Delete brand (admin)

### Orders

- `GET /orders` - List orders (authenticated)
- `GET /orders/:id` - Get order details
- `POST /orders` - Create order (authenticated)
- `PUT /admin/orders/:id` - Update order status (admin)

## Testing the Integration

1. **Start the backend:**

   ```bash
   cd mhjapi
   pnpm dev
   ```

2. **Update frontend .env:**

   ```env
   VITE_API_BASE_URL=http://localhost:3000/v1
   ```

3. **Start the frontend:**

   ```bash
   cd mahajana-dash-pro
   bun dev
   ```

4. **Test login with credentials:**
   - Email: `admin@supermarket.com`
   - Password: (use the password from your backend setup)

## Next Steps

1. Implement product management API calls
2. Implement category management API calls
3. Implement branch management API calls
4. Implement brand management API calls
5. Implement order management API calls
6. Implement promotion/voucher API calls
7. Implement notification API calls
8. Add file upload for product images
9. Add data caching for improved performance
10. Add optimistic updates for better UX

## Support

For API documentation, see:

- `mhjapi/API_ADMIN_DASHBOARD.md`
- `mhjapi/API_QUICK_REFERENCE.md`
- Backend Swagger UI: `http://localhost:3000/doc` (when running locally)
