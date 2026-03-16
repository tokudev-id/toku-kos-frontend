# Session Expiry & Auth Redirect Fix

## Issues Fixed

### 1. **Infinite Redirect Loop on Session Expiry**
**Problem:** 
- User logs in → user becomes idle → backend rejects request with 401
- Axios interceptor removes token but Zustand store still has old user data
- Login page checks `isAuthenticated` which is still `true`
- Login page redirects back to dashboard → infinite loop

**Solution:**
- Axios interceptor now calls `useAuthStore.getState().logout()` to clear Zustand store completely
- `logout()` now explicitly removes both `toku_token` and `toku-auth-storage` from localStorage
- App.tsx now checks BOTH token AND user exist: `isAuthenticated = !!user && !!token`
- Added `replace` to all Navigate calls to prevent browser history issues

### 2. **Persistent Store Not Clearing**
**Problem:**
- Zustand persist middleware stores auth state
- When only token was removed from localStorage, the persisted store still had user data

**Solution:**
- Updated `useAuthStore.logout()` to explicitly clear both:
  - `toku_token` (JWT token)
  - `toku-auth-storage` (persisted Zustand state)

### 3. **User-Friendly Session Expiry Messages**
**Problem:**
- Users had no feedback when session expired
- No indication of why they were redirected to login

**Solution:**
- Created `src/utils/notification.ts` for centralized notification system
- Axios interceptor shows warning message: "Sesi Anda telah berakhir. Silakan login kembali."
- Notification service can be integrated with toast/notification UI components

## Files Modified

### Frontend

#### `src/App.tsx`
- **Change:** Authentication check now requires BOTH user AND token
- **Code:** `const isAuthenticated = !!user && !!token;`
- **Reason:** Prevents redirect loops when session expires
- **Added:** `replace` prop to all Navigate components

#### `src/api/axios.ts`
- **Change:** 401 handler now clears Zustand store
- **Code:** `useAuthStore.getState().logout()`
- **Added:** Session expiry notification
- **Improved:** Better path checking to prevent redirect loops

#### `src/store/useAuthStore.ts`
- **Change:** `logout()` now explicitly removes persisted storage
- **Code:** Added `localStorage.removeItem('toku-auth-storage')`
- **Reason:** Ensures complete cleanup of all auth data

#### `src/utils/notification.ts` (NEW)
- **Purpose:** Centralized notification system for auth errors
- **Exports:** `showNotification()`, `setNotificationCallback()`, message constants
- **Usage:** Can be integrated with Toast/Notification UI components

## How It Works Now

### Session Expiry Flow

```
1. User idle, backend JWT expires
   ↓
2. Next API call returns 401 (Unauthorized)
   ↓
3. Axios interceptor catches 401:
   a. Get current user role
   b. Clear toku_token from localStorage
   c. Call useAuthStore.logout() to clear store + storage
   d. Show warning notification to user
   e. Redirect to /login (or /resident/login for residents)
   ↓
4. Page loads with cleared auth state:
   - App.tsx checks: user = null, token = null
   - isAuthenticated = false
   ↓
5. User sees login page (NOT redirected back to dashboard)
   ↓
6. User can login again normally
```

### Protected Routes

```typescript
// All 3 conditions must be true:
isAuthenticated &&        // Token exists in localStorage
user?.role === 'OWNER'    // User object exists in store
<DashboardLayout />        // Show dashboard

// If ANY condition is false:
→ <Navigate to="/login" replace />
```

## Testing the Fix

### Test 1: Normal Login & Dashboard Access
1. Go to http://localhost:3000/login
2. Login with valid credentials
3. ✅ Dashboard should load
4. Verify: User data and token in browser DevTools
   - localStorage: `toku_token` exists
   - localStorage: `toku-auth-storage` has user data

### Test 2: Session Expiry While Idle
**Simulate session expiry:**

#### Option A: Manual Token Expiry
1. Login to dashboard
2. Open DevTools → Application tab
3. In localStorage, delete `toku_token`
4. Refresh page
5. ✅ Should automatically redirect to /login
6. ✅ Dashboard should NOT be shown

#### Option B: Wait for Backend Token Expiry
To test with actual token expiration (if you increase JWT_EXPIRES_IN):
1. Login to dashboard
2. Wait for token to expire (check backend JWT_EXPIRES_IN)
3. Try to click a link or fetch data (e.g., Properties)
4. ✅ Should show warning notification
5. ✅ Should redirect to /login
6. ✅ Login page should display (no redirect loop!)

#### Option C: Mock 401 Response
Using browser DevTools:
1. Login to dashboard
2. Open DevTools → Network tab
3. Find any API call
4. Right-click → Edit and Replay
5. Change response status to 401
6. Submit
7. ✅ Should handle gracefully

### Test 3: Clearing Auth State
1. Login to dashboard
2. Open DevTools → Application → localStorage
3. Verify `toku_token` and `toku-auth-storage` exist
4. Trigger session expiry (delete token or wait for 401)
5. ✅ Both `toku_token` and `toku-auth-storage` should be cleared
6. ✅ No user data in store

### Test 4: Resident Portal Session Expiry
1. Login to `/resident/login` 
2. Trigger session expiry (same as above)
3. ✅ Should redirect to `/resident/login` (not `/login`)
4. ✅ Should show session expiry warning

### Test 5: Multiple Rapid Requests with 401
1. Login to dashboard
2. Delete `toku_token` from DevTools
3. Quickly click multiple buttons/links
4. ✅ Should not create infinite redirects
5. ✅ Should show ONE warning notification
6. ✅ Should redirect to login cleanly

## Browser Verification

### DevTools → Application → Local Storage

**Before Login:**
```
(empty)
```

**After Login:**
```
toku_token: "eyJhbGciOiJIUzI1NiIs..."
toku-auth-storage: {"state": {"user": {"id": "...", "email": "..."}, ...}}
```

**After Session Expiry:**
```
(both cleared - empty)
```

## Integration with Notification Component

The notification system is ready to integrate with your toast/notification UI:

```typescript
// In your notification component (e.g., Toast.tsx)
import { setNotificationCallback } from '@/utils/notification';

export function App() {
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    // Register callback so axios can show notifications
    setNotificationCallback((message, type) => {
      setNotification({ message, type });
      // Auto-hide after 4 seconds
      setTimeout(() => setNotification(null), 4000);
    });
  }, []);

  return (
    <>
      {/* Your app */}
      {notification && (
        <Toast message={notification.message} type={notification.type} />
      )}
    </>
  );
}
```

## Common Issues & Solutions

### Issue: Still Getting Redirect Loop
**Check:**
- Verify `logout()` is removing `toku-auth-storage` key
- Check App.tsx has BOTH `!!user && !!token` check
- Look in DevTools → Network for multiple redirects
- Check browser console for errors

**Solution:**
```javascript
// In DevTools console, verify cleanup
localStorage.getItem('toku_token')        // Should be null
localStorage.getItem('toku-auth-storage') // Should be null
```

### Issue: Showing Dashboard After Session Expiry
**Cause:** Component cache or stale closures
**Solution:** 
- Hard refresh browser (Ctrl+F5 / Cmd+Shift+R)
- Clear browser cache
- Check that App.tsx authentication check is current

### Issue: Notification Not Showing
**Check:**
- Is `setNotificationCallback` called in your app?
- Check browser console for errors
- Verify notification component is mounted

## Security Implications

✅ **Fixes are secure:**
- No sensitive data remains in localStorage after logout
- Prevents token replay attacks
- No redirect loops that could be exploited
- Proper session termination

## Performance Impact

✅ **Minimal performance impact:**
- One extra localStorage write (clearing `toku-auth-storage`)
- One notification callback execution
- No additional API calls
- Faster login redirect (uses window.location.href)

## Future Enhancements

1. **Refresh Token Support**: Implement JWT refresh tokens for better UX
2. **Absolute Session Timeout**: Show dialog before session expires
3. **Activity Monitor**: Reset session timeout on user activity
4. **Multi-Tab Sync**: Logout across all tabs when single session expires

---

**Status:** ✅ Fixed and tested
