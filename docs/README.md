# Authentication Module

This module provides a secure, maintainable, and scalable authentication system for the frontend.

## Features

- Centralized authentication state using React Context
- API abstraction for login, register, and logout
- Persistent user and token storage
- Protected routes for authenticated access
- Custom hooks for easy integration
- Centralized error handling

## Directory Structure

```
src/
  api/
    auth.ts
  components/
    auth/
      LoginForm.tsx
      RegisterForm.tsx
    ProtectedRoute.tsx
  context/
    AuthContext.tsx
  hooks/
    useAuth.ts
```

## Usage

### 1. API Layer
All authentication API calls are in `src/api/auth.ts`.

### 2. Auth Context
Wrap your app with the `AuthProvider` in `src/context/AuthContext.tsx`:

```tsx
import { AuthProvider } from '@/context/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* ... */}
    </AuthProvider>
  );
}
```

### 3. Using Auth State
Use the `useAuth` hook to access user, token, and auth methods:

```tsx
import { useAuth } from '@/hooks/useAuth';

const { user, token, login, logout } = useAuth();
```

### 4. Protected Routes
Wrap protected pages with `ProtectedRoute`:

```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### 5. Environment Variables
Set your API base URL in `.env`:

```
VITE_API_BASE_URL=https://your-api-url.com
```

## Best Practices

- Never store sensitive data in plain text.
- Always clear user/token on logout.
- Use HTTPS for all API requests.

---

**For more details, see the code comments and each file's documentation.** 