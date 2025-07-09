# Authentication Refactor To-Do List

## 1. Environment Setup
- [ ] Add `VITE_API_BASE_URL` to your `.env` file.

## 2. API Layer
- [ ] Create `src/api/auth.ts` for all authentication-related API calls (login, register, etc.).

## 3. Auth Context
- [ ] Create `src/context/AuthContext.tsx` to manage user/token state and provide login/logout methods.
- [ ] Use `localStorage` to persist user and token.

## 4. Custom Hooks
- [ ] Create `src/hooks/useAuth.ts` to easily access authentication state and methods.

## 5. UI Components
- [ ] Refactor login and register forms to use the context/hook for authentication logic.
- [ ] Remove direct API calls from UI components.

## 6. Protected Routes
- [ ] Create `src/components/ProtectedRoute.tsx` to restrict access to authenticated users.

## 7. Logout
- [ ] Implement logout functionality using the context/hook.
- [ ] Ensure all sensitive data is cleared on logout.

## 8. Error Handling
- [ ] Centralize error handling for authentication (e.g., show toast notifications).

## 9. Testing
- [ ] Test login, logout, and protected routes.
- [ ] Test persistence (refresh, new tab). 