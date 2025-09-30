# 🚨 URGENT: Fix CORS and Backend URL Issues

## 🎯 Exact Problem Identified

**Frontend URL:** `https://pocket-money-manager-51egmqqif-nandish-kumars-projects.vercel.app/`
**Backend URL:** `https://pocket-money-server.vercel.app/`
**Issue:** Backend doesn't allow requests from your frontend URL

## 🚀 Step-by-Step Fix

### Step 1: Fix Backend CORS (CRITICAL)

1. **Go to Vercel Dashboard**
2. **Find your backend project** (pocket-money-server)
3. **Settings → Environment Variables**
4. **Add or update this variable:**
   ```
   FRONTEND_URL=https://pocket-money-manager-51egmqqif-nandish-kumars-projects.vercel.app
   ```
   ⚠️ **IMPORTANT: No trailing slash!**

### Step 2: Redeploy Backend

1. **Go to Deployments tab** in backend project
2. **Click "Redeploy"** on the latest deployment
3. **Wait for deployment to complete** (1-2 minutes)

### Step 3: Fix Frontend Environment Variable

1. **Go to your frontend Vercel project**
2. **Settings → Environment Variables**
3. **Add or update:**
   ```
   VITE_API_BASE_URL=https://pocket-money-server.vercel.app/api
   ```

### Step 4: Redeploy Frontend

1. **Go to Deployments tab** in frontend project
2. **Click "Redeploy"** on the latest deployment

## 🧪 Test the Fix

After both deployments complete:

1. **Open your frontend app:** `https://pocket-money-manager-51egmqqif-nandish-kumars-projects.vercel.app/`
2. **Open Developer Tools (F12)**
3. **Try to register/login**
4. **Check Network tab** - should see successful requests (status 200/201)

## 🔍 Verification Commands

Test in browser console:

```javascript
// Test 1: Check if backend is reachable
fetch('https://pocket-money-server.vercel.app/')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)

// Test 2: Test login with CORS
fetch('https://pocket-money-server.vercel.app/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({email: 'test@example.com', password: 'password123'})
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

## ⚡ Quick Emergency Fix

If you're still getting CORS errors after the above steps, temporarily make backend allow all origins:

**In your backend Vercel environment variables, add:**
```
CORS_ORIGIN=*
```

Then update your backend `server.js` to use this:
```javascript
origin: process.env.CORS_ORIGIN === '*' ? true : allowedOrigins,
```

**Don't leave this in production - it's just for testing!**

## ✅ Expected Result

After the fix:
- ✅ No more status 0 errors
- ✅ No more CORS errors
- ✅ Successful API calls (status 200/201)
- ✅ Login/signup works and redirects to dashboard

## 📋 Summary of URLs

- **Frontend:** `https://pocket-money-manager-51egmqqif-nandish-kumars-projects.vercel.app`
- **Backend:** `https://pocket-money-server.vercel.app`
- **API Endpoint:** `https://pocket-money-server.vercel.app/api`

## 🚨 Most Critical Step

**The most important step is adding your exact frontend URL to the backend environment variables and redeploying the backend.** This will fix the CORS issue causing status 0 errors.
