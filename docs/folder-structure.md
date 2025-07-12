# Project Folder Structure Documentation

This document outlines the organization and purpose of each directory in the interactive video call frontend project.

## Overview

The project follows a feature-based architecture with clear separation of concerns, making it scalable and maintainable.

## Root Structure

```
interactive-video-call-frontend/
├── docs/                    # Project documentation
├── public/                  # Static assets
├── src/                     # Source code
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── README.md               # Project overview
```

## Source Code Structure (`src/`)

### Core Directories

#### `/types`
**Purpose**: TypeScript type definitions and interfaces
```
src/types/
├── index.ts          # Re-exports all types for clean imports
├── user.ts           # User-related interfaces
└── sessions.ts       # Session-related interfaces
```

**Usage**:
```typescript
import { User } from "@/types";
import type { Session } from "@/types";
```

#### `/schemas`
**Purpose**: Zod validation schemas for form validation and data validation
```
src/schemas/
├── index.ts          # Re-exports all schemas for clean imports
└── user.ts           # User form validation schemas
```

**Usage**:
```typescript
import { addUserSchema, editUserSchema } from "@/schemas";
import type { AddUserData, EditUserData } from "@/schemas";
```

#### `/components`
**Purpose**: Reusable UI components organized by functionality
```
src/components/
├── ui/               # Base UI components (buttons, inputs, etc.)
├── auth/             # Authentication-related components
├── cards/            # Card-based components
├── characters/       # Character/avatar components
├── nav/              # Navigation components
└── ProtectedRoute.tsx # Route protection component
```

**Usage**:
```typescript
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/auth/login-form";
```

#### `/pages`
**Purpose**: Page-level components organized by user roles and features
```
src/pages/
├── Admin/            # Admin-specific pages
│   ├── dashboard/    # Admin dashboard
│   ├── statistics/   # Statistics and analytics
│   └── users/        # User management
├── Auth/             # Authentication pages
│   ├── login/        # Login page
│   └── register/     # Registration page
├── Client/           # Client-specific pages
│   ├── dashboard/    # Client dashboard
│   ├── mini-games/   # Interactive games
│   ├── sessions/     # Session management
│   └── stages/       # Multi-step form stages
└── Landing/          # Landing page components
```

#### `/features`
**Purpose**: Feature-specific components and logic
```
src/features/
├── avatar-character/     # Interactive avatar system
├── avatar-creator.tsx    # Avatar customization tool
├── bodymap.tsx          # Body mapping feature
├── drawing-pad.tsx      # Drawing functionality
├── music-player.tsx     # Music player feature
└── sidebar/             # Sidebar components
```

#### `/api`
**Purpose**: API client functions and data fetching logic
```
src/api/
├── auth.ts              # Authentication API calls
├── sessions.ts          # Session management API
└── users.ts             # User management API
```

#### `/hooks`
**Purpose**: Custom React hooks for reusable logic
```
src/hooks/
├── useAuth.ts           # Authentication hook
└── use-mobile.ts        # Mobile detection hook
```

#### `/store`
**Purpose**: Global state management using Zustand
```
src/store/
└── sessionStore.ts      # Session state management
```

#### `/context`
**Purpose**: React Context providers for global state
```
src/context/
├── AuthContext.tsx      # Authentication context
└── AvatarContext.tsx    # Avatar state context
```

#### `/layouts`
**Purpose**: Layout components and page structure
```
src/layouts/
├── AppLayout.tsx        # Main application layout
├── RoomLayout.tsx       # Room-specific layout
└── sidebars/            # Sidebar layouts
```

#### `/lib`
**Purpose**: Utility functions and configurations
```
src/lib/
├── firebase.ts          # Firebase configuration
└── utils.ts             # Utility functions
```

#### `/routes`
**Purpose**: Application routing configuration
```
src/routes/
└── AppRoutes.tsx        # Main routing setup
```

#### `/assets`
**Purpose**: Static assets like images, icons, and media
```
src/assets/
├── logo.svg             # Application logo
├── music/               # Audio files
└── react.svg            # React logo
```

## Import Conventions

### Type Imports
```typescript
// Import types from centralized location
import { User, Session } from "@/types";
```

### Schema Imports
```typescript
// Import validation schemas
import { addUserSchema, editUserSchema } from "@/schemas";
import type { AddUserData, EditUserData } from "@/schemas";
```

### Component Imports
```typescript
// Import UI components
import { Button, Input } from "@/components/ui";
import { LoginForm } from "@/components/auth";

// Import page components
import { Dashboard } from "@/pages/Admin/dashboard";
```

### API Imports
```typescript
// Import API functions
import { login, register } from "@/api/auth";
import { createSession } from "@/api/sessions";
```

## Best Practices

### 1. File Naming
- Use kebab-case for file names: `login-form.tsx`
- Use PascalCase for component names: `LoginForm`
- Use camelCase for functions and variables: `handleSubmit`

### 2. Import Organization
```typescript
// 1. External libraries
import React from "react";
import { useState } from "react";

// 2. Internal types and schemas
import { User } from "@/types";
import { addUserSchema } from "@/schemas";

// 3. Components
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/auth";

// 4. Hooks and utilities
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
```

### 3. Type Safety
- Always define proper TypeScript interfaces in `/types`
- Use Zod schemas for form validation in `/schemas`
- Avoid using `any` type - use proper type definitions

### 4. Component Structure
```typescript
// Component file structure
import { useState } from "react";
import { User } from "@/types";

interface ComponentProps {
  user: User;
  onSave: (data: User) => void;
}

export function Component({ user, onSave }: ComponentProps) {
  const [state, setState] = useState();
  
  const handleSubmit = () => {
    // Component logic
  };
  
  return (
    // JSX
  );
}
```

## Adding New Features

### 1. New Entity Type
1. Add interface to `/types/entity.ts`
2. Export from `/types/index.ts`
3. Create validation schema in `/schemas/entity.ts`
4. Export from `/schemas/index.ts`

### 2. New Feature Component
1. Create feature directory in `/features/`
2. Add components and logic
3. Import types and schemas as needed
4. Add to appropriate page in `/pages/`

### 3. New API Endpoint
1. Add function to appropriate file in `/api/`
2. Define request/response types in `/types/`
3. Add validation schemas if needed

## Common Patterns

### Form Validation
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addUserSchema, type AddUserData } from "@/schemas";

const form = useForm<AddUserData>({
  resolver: zodResolver(addUserSchema),
  defaultValues: {
    first_name: "",
    last_name: "",
    // ...
  },
});
```

### API Calls
```typescript
import { createUser } from "@/api/users";
import type { AddUserData } from "@/schemas";

const handleSubmit = async (data: AddUserData) => {
  try {
    const user = await createUser(data);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

This structure promotes maintainability, scalability, and developer experience while following React and TypeScript best practices. 