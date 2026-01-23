# Authentication System Setup

This guide explains how to set up and use the authentication system for Adaptus DMS.

## Overview

The authentication system includes:

- **Login Page** (`/auth/login`)
- **Signup Page** (`/auth/signup`)
- **Logout** functionality in the user menu
- **Role-Based Access Control** (Admin and User roles)
- **Protected Routes** (Dashboard requires authentication)

## Prerequisites

### 1. Supabase Setup

Make sure you have:

- Supabase account and project created
- Authentication enabled in Supabase
- Email/Password auth provider enabled

### 2. Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project settings.

## Database Setup

### 1. Create user_profiles Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create user_profiles table for role-based access control
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
```

## Usage

### Sign Up

1. Navigate to `/auth/signup`
2. Enter email and password
3. Select a role (Admin or User)
4. Click "Sign Up"
5. After successful signup, you'll be redirected to login page

### Login

1. Navigate to `/auth/login`
2. Enter your email and password
3. Click "Sign In"
4. After successful login, you'll be redirected to the dashboard

### Logout

1. Click on your user menu (top-right corner of navbar)
2. Click "Sign Out"
3. You'll be redirected to the login page

## Role-Based Access Control

### User Roles

- **User**: Standard user with basic access
- **Admin**: Administrator with full access

### Current Implementation

Roles are stored in the `user_profiles` table and accessible via:

```typescript
const user = await getCurrentUser();
console.log(user.role); // 'admin' or 'user'
```

### Future: Restrict Routes by Role

To restrict routes by role, you can update the middleware:

```typescript
// middleware.ts
if (
  request.nextUrl.pathname.startsWith("/dashboard/users") &&
  user.role !== "admin"
) {
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
```

## File Structure

```
app/
  auth/
    layout.tsx              # Auth pages layout
    login/
      page.tsx              # Login page
    signup/
      page.tsx              # Signup page
  (dashboard)/
    layout.tsx              # Updated to fetch user data

lib/
  actions/
    auth.ts                 # Server actions for authentication
  supabase/
    client.ts               # Supabase client
    server.ts               # Supabase server client

components/
  layout/
    user-menu.tsx           # Updated with logout functionality
    navbar.tsx              # Updated to pass user data
    main-layout.tsx         # Updated to pass user data

middleware.ts               # Route protection
```

## Server Actions

### signUp(email, password, role)

```typescript
const result = await signUp("user@example.com", "password", "user");
if (result.error) {
  // Handle error
} else {
  // User created successfully
}
```

### signIn(email, password)

```typescript
const result = await signIn("user@example.com", "password");
if (result.error) {
  // Handle error
} else {
  // User logged in
}
```

### signOut()

```typescript
await signOut();
// Redirects to /auth/login
```

### getCurrentUser()

```typescript
const user = await getCurrentUser();
if (user) {
  console.log(user.email); // user email
  console.log(user.role); // 'admin' or 'user'
}
```

## Security Features

- ✅ Password hashing by Supabase
- ✅ Row-Level Security (RLS) policies
- ✅ Protected routes (dashboard requires auth)
- ✅ Session management by Supabase
- ✅ Secure server-side actions

## Testing

### Test Admin User

```
Email: admin@example.com
Password: password123
Role: admin
```

### Test Regular User

```
Email: user@example.com
Password: password123
Role: user
```

## Troubleshooting

### "Missing Supabase environment variables"

- Check that `.env.local` exists
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Restart the development server

### "User not found" after login

- Ensure the `user_profiles` table exists
- Check that RLS policies are enabled
- Verify the migration SQL was executed

### Can't access dashboard

- Make sure you're logged in
- Check browser cookies are not blocked
- Clear cookies and try again

## Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, GitHub)
- [ ] Password reset flow
- [ ] Email verification
- [ ] Admin panel for user management
- [ ] Activity logs and audit trails
