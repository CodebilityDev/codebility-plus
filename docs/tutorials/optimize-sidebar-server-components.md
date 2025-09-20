# Optimizing Client-Side Components with Server Components

This tutorial demonstrates how to optimize a client-side component that fetches data on every render by converting it to use React Server Components (RSC) pattern.

## Problem Statement

The original `LeftSidebar` component had several performance issues:

1. **Database queries on every render**: The component called `getSidebarData` which made database queries each time the role changed
2. **Client-side role checking**: All permission logic was handled client-side
3. **Unnecessary re-renders**: The component re-rendered whenever user data changed
4. **Loading states**: Users saw loading spinners while permissions were being fetched

## Solution: Server Component Pattern

We split the component into two parts:
- **Server Component**: Fetches data once on the server
- **Client Component**: Handles only UI interactions

## Implementation Steps

### Step 1: Create the Server Component

Create `LeftSidebarServer.tsx`:

```tsx
import { getSidebarData } from "@/constants/sidebar";
import { createClientServerComponent } from "@/utils/supabase/server";
import LeftSidebarClient from "./LeftSidebarClient";

export default async function LeftSidebarServer() {
  const supabase = await createClientServerComponent();
  
  // Get user data server-side
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: userData } = await supabase
    .from("codev")
    .select("role_id, internal_status, availability_status")
    .eq("id", user.id)
    .single();
    
  if (!userData) return null;
  
  // Calculate roleId server-side
  const roleId = userData.internal_status === "INACTIVE" || 
                 userData.availability_status === false
    ? -1 
    : userData.role_id;
    
  // Fetch sidebar data once server-side
  const sidebarData = await getSidebarData(roleId);
  
  return <LeftSidebarClient initialSidebarData={sidebarData} />;
}
```

### Step 2: Create the Client Component

Create `LeftSidebarClient.tsx` with only UI logic:

```tsx
"use client";

import { memo } from "react";
// ... other imports

interface LeftSidebarClientProps {
  initialSidebarData: Sidebar[];
}

const LeftSidebarClient = ({ initialSidebarData }: LeftSidebarClientProps) => {
  const { isToggleOpen, toggleNav } = useNavStore();
  const pathname = usePathname();

  // No data fetching, no role checking - just UI!
  
  return (
    <motion.aside>
      {/* Sidebar UI using initialSidebarData */}
    </motion.aside>
  );
};

export default memo(LeftSidebarClient);
```

### Step 3: Update the Layout

In your layout file, replace the client component with the server component:

```tsx
// Before
import LeftSidebar from "./_components/LeftSidebar";

// After
import LeftSidebarServer from "./_components/LeftSidebarServer";

// In the JSX
<LeftSidebarServer />
```

## Benefits

1. **Better Performance**
   - Role permissions are checked once on the server
   - No client-side database queries
   - Reduced JavaScript bundle size

2. **Improved UX**
   - No loading states
   - Sidebar renders immediately with correct permissions
   - Smoother navigation

3. **Simpler Architecture**
   - Clear separation of concerns
   - Server handles data fetching
   - Client handles UI interactions

4. **Security**
   - Permissions are calculated server-side
   - No sensitive data in client state

## Key Takeaways

1. **Identify data-fetching components**: Look for components that fetch data on mount or when props change
2. **Split responsibilities**: Create a server component for data and a client component for interactivity
3. **Pass data as props**: Server components fetch data and pass it to client components
4. **Minimize client-side state**: Keep only UI-related state on the client

## When to Use This Pattern

Consider this pattern when you have:
- Components that fetch data on every render
- Permission-based UI that requires database queries
- Components with complex data dependencies
- UI that shows loading states frequently

## Additional Optimizations

For even better performance, consider:

1. **Caching**: Add Redis caching to the server component
2. **Partial Prerendering**: Use Next.js PPR for static parts
3. **Parallel Data Fetching**: Fetch multiple data sources concurrently
4. **Deduplication**: Use React's built-in request deduplication

## Example Code Structure

```
app/home/_components/
├── LeftSidebar.tsx          # Original client component (deprecated)
├── LeftSidebarServer.tsx    # New server component
└── LeftSidebarClient.tsx    # New client component
```

This pattern can be applied to many other components in your application that currently fetch data client-side, resulting in significant performance improvements across your entire app.