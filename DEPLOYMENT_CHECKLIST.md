# Deployment Checklist - Fix Login/Signup Issue

## ❌ Current Problem
Login/signup is not working after frontend deployment due to CORS configuration issues.

## ✅ Solution Steps

### 1. Update Backend Environment Variables
In your Vercel backend project settings:

1. Go to **Settings** → **Environment Variables**
2. Update or add `FRONTEND_URL` with your **exact** frontend URL:
   ```
   FRONTEND_URL=https://your-actual-frontend-app.vercel.app
   ```
   ⚠️ **Replace with your real frontend URL** (no trailing slash)

### 2. Redeploy Backend
After updating the environment variable:
1. Go to **Deployments** tab in your backend project
2. Click **Redeploy** on the latest deployment
3. Wait for deployment to complete

### 3. Verify Frontend Environment
In your frontend Vercel project:
1. Check that `VITE_API_BASE_URL` points to your backend:
   ```
   VITE_API_BASE_URL=https://your-backend.vercel.app/api
   ```

### 4. Test the Fix
1. Open browser developer tools (F12)
2. Go to your deployed frontend app
3. Try to login/register
4. Check console for any CORS errors

## 🔍 How to Find Your URLs

### Frontend URL
- Go to your frontend Vercel project dashboard
- Copy the URL from the "Domains" section
- Example: `https://pocket-money-frontend-abc123.vercel.app`

### Backend URL  
- Go to your backend Vercel project dashboard
- Copy the URL from the "Domains" section
- Example: `https://pocket-money-backend-def456.vercel.app`

## 🚨 Common Mistakes
- ❌ Including trailing slash in FRONTEND_URL
- ❌ Using http:// instead of https://
- ❌ Forgetting to redeploy backend after changing environment variables
- ❌ Wrong API URL format (missing /api at the end)

## ✅ Expected Result
After following these steps:
- Login should work and redirect to dashboard
- Registration should work and redirect to dashboard  
- No CORS errors in browser console
