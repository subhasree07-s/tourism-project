# Tourism Management System – React Frontend

## Setup

```bash
cd tourism-management-frontend
cp .env.example .env          # set REACT_APP_API_URL to your backend
npm install
npm start
```

## Architecture

```
src/
├── api/
│   ├── axiosInstance.js   ← Axios + JWT interceptor (attach token + 401 logout)
│   └── authApi.js         ← login / register calls
├── context/
│   └── AuthContext.jsx    ← Global auth state, login(), register(), logout()
├── routes/
│   ├── ProtectedRoute.jsx ← Redirects unauthenticated; supports requireAdmin prop
│   └── AppRouter.jsx      ← All app routes
├── components/
│   └── Navbar.jsx         ← Role-aware nav + logout button
└── pages/
    ├── LoginPage.jsx
    ├── RegisterPage.jsx
    ├── ForbiddenPage.jsx
    ├── user/              ← Dashboard, Destinations, Packages, Bookings
    └── admin/             ← AdminDashboard, ManageUsers, ManagePackages, ManageBookings
```

## Route Protection

| Route         | Access           |
|---------------|------------------|
| `/login`      | Public           |
| `/register`   | Public           |
| `/dashboard`  | Any logged-in user |
| `/destinations` | Any logged-in user |
| `/packages`   | Any logged-in user |
| `/bookings`   | Any logged-in user |
| `/admin/*`    | `role === 'admin'` only |

## JWT Flow

1. Login → backend returns `{ success: true, token }`.
2. Token stored in `localStorage` as `token`; decoded payload cached as `user`.
3. Every Axios request automatically gets `Authorization: Bearer <token>` via request interceptor.
4. Any 401 response clears storage and redirects to `/login` via response interceptor.
5. Logout clears `localStorage` and redirects to `/login`.
6. On page refresh, token is read from `localStorage`; if expired, user is treated as logged out.
