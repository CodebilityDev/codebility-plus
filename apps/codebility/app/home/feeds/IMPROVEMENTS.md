# Feeds Feature - Improvement Opportunities

This document outlines potential improvements for the feeds feature based on code analysis.

## Performance & Optimization

<!-- 1. **Implement infinite scroll** instead of traditional pagination
   - Better UX for feed browsing
   - Reduces cognitive load on users
   - More engaging scrolling experience -->

2. **Add optimistic updates** for upvotes/comments
   - Instant UI feedback before server response
   - Improves perceived performance
   - Better user experience

3. **Implement React Query/TanStack Query** for server state management
   - Better caching strategy than current Zustand-only approach
   - Automatic background refetching
   - Built-in stale-while-revalidate pattern

4. **Optimize image loading**
   - Add blur placeholders (Next.js Image component supports this)
   - Lazy loading for images below the fold
   - Progressive image loading

5. **Memoize filtered posts computation**
   - Already using `useMemo` in Feed.tsx:25-41
   - Could optimize further with better dependency keys
   - Consider moving heavy filtering to server-side

## UX & Features

7. **Add post categories/tags**
   - Allow filtering by topic (announcement, discussion, help, etc.)
   - Multiple categories per post
   - Visual category badges

<!-- 8. **Sort options**
   - Newest first (current default)
   - Most upvoted
   - Trending (combination of recent + upvotes)
   - Most commented -->

9. **Bookmark/save posts**
   - Let users save posts for later reading
   - Personal collection of saved posts
   - Quick access from user profile

10. **Rich text preview** in PostCard
    - Currently only shows title (PostCard.tsx:107-109)
    - Show content excerpt with "Read more..."
    - Better preview of post content

<!-- 11. **Comment count display** on PostCard
    - Show engagement metrics at a glance
    - Currently only shows upvote count
    - Display next to upvote button -->

12. **Share functionality**
    - Copy link to clipboard
    - Share to social platforms
    - Generate preview cards for sharing

13. **User mentions** in comments
    - @username autocomplete
    - Notify mentioned users
    - Highlight mentions in text

14. **Draft posts**
    - Save work in progress before publishing
    - Auto-save functionality
    - Resume editing later

## Code Quality & Architecture

<!-- 16. **Fix hardcoded admin check** (page.tsx:13)
    - Currently: `const [isAdmin, setIsAdmin] = useState(true);`
    - Should initialize as `false`
    - Security risk if not properly validated -->

17. **Consolidate duplicate user role fetching**
    - Used in page.tsx:20-27 and PostView.tsx:48-52
    - Extract to custom hook: `useUserRole()`
    - Single source of truth for role logic

18. **Extract search logic** into custom hook
    - Create `usePostSearch(posts, query)` hook
    - Reusable across components
    - Cleaner component code

19. **Type safety improvements**
    - `PostType` could include computed fields
    - Add `upvote_count: number`
    - Add `comment_count: number`
    - Reduce runtime calculations

20. **Error boundaries**
    - Add error handling UI for failed post loads
    - Graceful degradation
    - User-friendly error messages

<!-- 21. **Loading skeletons** for individual post cards
    - Currently only in PostView.tsx:110-115
    - Add to Feed.tsx while posts are loading
    - Better loading states -->

<!-- 22. **Extract magic numbers** to constants
    - `postsPerPage: 6` (Feed.tsx:43)
    - Debounce delay `500ms` (page.tsx:32)
    - Create `constants.ts` file -->

23. **Consistent async/await error handling**
    - Some functions use try/catch, others don't
    - Standardize error handling pattern
    - Centralized error reporting

## Accessibility

24. **Keyboard navigation**
    - Arrow keys to navigate between posts
    - Enter to open post
    - Escape to close modals

25. **ARIA labels** for interactive elements
    - Upvote buttons need descriptive labels
    - Delete buttons (PostCard.tsx:77-84)
    - Search input

26. **Focus management** in modals
    - Trap focus inside modal
    - Return focus on close
    - Focus first interactive element

27. **Screen reader announcements** for live updates
    - Announce new posts
    - Announce upvote changes
    - Use ARIA live regions

## Analytics & Insights

28. **Post view tracking**
    - Track which posts are most viewed
    - Engagement analytics
    - Popular content insights

29. **Read time estimation**
    - Calculate based on content length
    - Display "X min read" on posts
    - Help users decide what to read

30. **User engagement metrics**
    - Most active contributors
    - Trending topics
    - Peak activity times

## Security & Data Integrity

31. **Rate limiting** for post creation/upvotes
    - Prevent spam and abuse
    - Server-side enforcement
    - Clear user feedback when limited

32. **Content moderation flags**
    - Report inappropriate posts
    - Admin review queue
    - Community standards enforcement

33. **Sanitize markdown input**
    - Prevent XSS through markdown (PostView.tsx:149-151)
    - Validate image URLs
    - Strip dangerous HTML

34. **Image upload size limits**
    - Currently no visible validation in uploadPostContentImage
    - Client-side file size check
    - Clear error messages

## Mobile Experience

35. **Pull-to-refresh** gesture support
    - Native mobile pattern
    - Refresh posts list
    - Visual feedback during refresh

36. **Bottom sheet for post view** instead of modal
    - Better mobile UX
    - Native app-like experience
    - Easier one-handed use

37. **Swipe gestures** for navigation
    - Swipe to go back
    - Swipe between posts
    - Natural mobile interaction

38. **Improved fixed positioning** for SocialPointsCard
    - Currently uses responsive positioning (SocialPointsCard.tsx:36)
    - May overlap content on some mobile devices
    - Consider sticky positioning alternative

## Data & State Management

39. **Cache invalidation strategy**
    - Refresh posts after create/edit/delete
    - Intelligent cache updates
    - Reduce unnecessary refetches

40. **Prefetch next page** for pagination
    - Load next page in background
    - Instant page transitions
    - Better perceived performance

41. **Persist search query** in URL params
    - Shareable search results
    - Browser back/forward support
    - Deep linking to filtered views

42. **Local storage backup** for draft posts
    - Prevent data loss
    - Auto-save as user types
    - Restore on page refresh

## Quick Wins (Easy to Implement)

These improvements can be implemented quickly and provide immediate value:

<!-- - ✅ **Fix the `isAdmin` initialization bug** (page.tsx:13)
  - Change `useState(true)` to `useState(false)`
  - 1-line fix, important security improvement

- ✅ **Add comment count to PostCard component**
  - Query comment count in getPosts
  - Display next to upvote count
  - ~20 lines of code -->

<!-- - ✅ **Extract constants**
  - Create `_constants/index.ts`
  - Move magic numbers: `POSTS_PER_PAGE = 6`, `SEARCH_DEBOUNCE_MS = 500`
  - Better maintainability -->

<!-- - ✅ **Add loading skeleton for post cards**
  - Reuse existing Skeleton component
  - Show while `fetchPosts()` is loading
  - ~15 lines of code -->

<!-- - ✅ **Add empty state when no posts match search**
  - Simple conditional in Feed.tsx
  - Better UX than empty grid
  - ~10 lines of code -->

## File References

- Main page: `apps/codebility/app/home/feeds/page.tsx`
- Feed component: `apps/codebility/app/home/feeds/_components/Feed.tsx`
- Post card: `apps/codebility/app/home/feeds/_components/PostCard.tsx`
- Actions: `apps/codebility/app/home/feeds/_services/action.ts`
- Queries: `apps/codebility/app/home/feeds/_services/query.ts`
- Store: `apps/codebility/store/feeds-store.ts`
