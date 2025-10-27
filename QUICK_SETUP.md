# Quick Setup Guide - Backend Integration

Follow these steps to set up the backend API integration for the admin dashboard.

## Prerequisites

- Node.js 18+ installed
- Bun or npm/yarn package manager
- Access to the backend API (local or hosted)

## Step 1: Clone and Install

```bash
# Navigate to project directory
cd mahajana-dash-pro

# Install dependencies
bun install
# or
npm install
```

## Step 2: Configure Environment

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and set your API URL:

```env
# For production (hosted backend)
VITE_API_BASE_URL=https://mhjapi.up.railway.app/v1

# OR for local development
# VITE_API_BASE_URL=http://localhost:3000/v1
```

## Step 3: Start Development Server

```bash
bun dev
# or
npm run dev
```

The app will be available at `http://localhost:5173`

## Step 4: Test Login

1. Navigate to `http://localhost:5173/login`
2. Enter your credentials:
   - Email: `admin@supermarket.com`
   - Password: (your backend admin password)
3. Click "Login"

If successful, you'll be redirected to the dashboard!

## Troubleshooting

### "Network Error" on Login

**Cause:** Cannot connect to backend API

**Solutions:**

1. Check if backend is running (if local)
2. Verify `VITE_API_BASE_URL` in `.env`
3. Check CORS settings in backend
4. Verify backend API is accessible

**Test backend connection:**

```bash
curl https://mhjapi.up.railway.app/v1/products
```

### "Invalid Credentials"

**Cause:** Wrong email or password

**Solutions:**

1. Verify email format
2. Check password is correct
3. Ensure staff account exists in backend
4. Try password reset (if available)

### Token Expired

**Cause:** JWT token has expired

**Solution:**

1. Simply log in again
2. Check "Remember me" for persistence

### CORS Error in Browser Console

**Cause:** Backend doesn't allow frontend origin

**Solution:**
Update backend CORS configuration to allow your frontend URL:

```typescript
// In backend
cors: {
  origin: ["http://localhost:5173", "https://your-domain.com"];
}
```

## Verify Integration

✅ Can access login page  
✅ Can submit login form  
✅ Successful login redirects to dashboard  
✅ Token stored in localStorage  
✅ Can access protected routes  
✅ Logout clears token  
✅ Page refresh keeps user logged in

## Next Steps

Now that authentication is working, you can:

1. **Test the Dashboard**

   - View dashboard metrics
   - Check user profile

2. **Implement Product Management**

   - Connect product CRUD operations
   - Add product image upload

3. **Implement Other Features**
   - Categories
   - Branches
   - Brands
   - Orders
   - Promotions
   - Notifications

## Files Modified

```
mahajana-dash-pro/
├── .env                          # NEW - Environment config
├── .env.example                  # NEW - Environment template
├── .gitignore                    # UPDATED - Ignore .env files
├── API_INTEGRATION.md            # NEW - Integration guide
├── BACKEND_INTEGRATION_SUMMARY.md # NEW - Summary doc
├── QUICK_SETUP.md                # NEW - This file
├── src/
│   ├── lib/
│   │   └── api.ts                # NEW - API client
│   ├── contexts/
│   │   └── AuthContext.tsx       # UPDATED - Real API
│   └── pages/
│       ├── Login.tsx             # NO CHANGES
│       ├── Register.tsx          # UPDATED - Admin-only
│       └── Profile.tsx           # UPDATED - User props
```

## Development Workflow

1. **Backend First**

   ```bash
   cd mhjapi
   pnpm dev
   # Backend runs on http://localhost:3000
   ```

2. **Then Frontend**

   ```bash
   cd mahajana-dash-pro
   bun dev
   # Frontend runs on http://localhost:5173
   ```

3. **Update .env for local development**
   ```env
   VITE_API_BASE_URL=http://localhost:3000/v1
   ```

## Production Deployment

1. **Set environment variable:**

   ```env
   VITE_API_BASE_URL=https://mhjapi.up.railway.app/v1
   ```

2. **Build the app:**

   ```bash
   bun run build
   ```

3. **Preview production build:**

   ```bash
   bun run preview
   ```

4. **Deploy to hosting:**
   - Vercel, Netlify, or your preferred host
   - Set `VITE_API_BASE_URL` in host environment variables

## Support

- 📚 API Documentation: `mhjapi/API_ADMIN_DASHBOARD.md`
- 🔧 Integration Guide: `API_INTEGRATION.md`
- 📝 Summary: `BACKEND_INTEGRATION_SUMMARY.md`
- 🐛 Issues: Contact your backend team

## Success! 🎉

You're now running the admin dashboard with real backend integration!

Login with your credentials and start managing your supermarket data.
