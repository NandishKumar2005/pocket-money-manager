# 🚨 Fix Vercel Deployment Login/Signup Issue

## Problem
Your deployed frontend on Vercel cannot login/signup due to CORS and environment configuration issues.

## 🔧 Step-by-Step Fix

### Step 1: Fix Backend Environment Variables on Vercel

1. **Go to your Backend Vercel Project**
   - Open [vercel.com](https://vercel.com) → Your backend project
   - Go to **Settings** → **Environment Variables**

2. **Add/Update these environment variables:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pocket-money-manager
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-app.vercel.app
   ```

3. **⚠️ CRITICAL: Update FRONTEND_URL**
   - Replace `https://your-frontend-app.vercel.app` with your **actual frontend URL**
   - Find your frontend URL in your frontend Vercel project dashboard
   - Example: `https://pocket-money-frontend-abc123.vercel.app`
   - **NO trailing slash!**

### Step 2: Redeploy Backend
1. In your backend Vercel project
2. Go to **Deployments** tab
3. Click **Redeploy** on the latest deployment
4. Wait for deployment to complete

### Step 3: Verify Frontend Environment
1. **Check your frontend Vercel project**
2. Go to **Settings** → **Environment Variables**
3. Ensure you have:
   ```
   VITE_API_BASE_URL=https://pocket-money-server.vercel.app/api
   ```
4. If missing, add it and redeploy frontend

### Step 4: Redeploy Frontend
1. In your frontend Vercel project
2. Go to **Deployments** tab  
3. Click **Redeploy** on the latest deployment

## 🔍 How to Find Your URLs

### Backend URL
- Go to your backend Vercel project
- Copy the URL from the project dashboard
- Should look like: `https://pocket-money-server.vercel.app`

### Frontend URL
- Go to your frontend Vercel project
- Copy the URL from the project dashboard
- Should look like: `https://pocket-money-frontend-abc123.vercel.app`

## 🧪 Testing the Fix

1. **Open your deployed frontend URL**
2. **Open browser developer tools (F12)**
3. **Try to login with demo credentials:**
   - Email: `test@example.com`
   - Password: `password123`
4. **Check console for errors:**
   - Should see no CORS errors
   - Should see successful API calls

## 🚨 Common Issues & Solutions

### Issue: Still getting CORS errors
**Solution:** 
- Double-check `FRONTEND_URL` in backend environment variables
- Ensure it matches your frontend URL exactly (no trailing slash)
- Redeploy backend after changes

### Issue: API calls failing
**Solution:**
- Verify `VITE_API_BASE_URL` in frontend environment variables
- Should end with `/api`
- Example: `https://pocket-money-server.vercel.app/api`

### Issue: Database connection errors
**Solution:**
- Check `MONGODB_URI` is correct
- Verify MongoDB Atlas network access allows all IPs (0.0.0.0/0)
- Check database user permissions

## ✅ Expected Result
After following these steps:
- ✅ Login should work and redirect to dashboard
- ✅ Registration should work and redirect to dashboard
- ✅ No CORS errors in browser console
- ✅ API calls should be successful

## 📞 Quick Verification Commands

Test your backend API directly:
```bash
# Test if backend is running
curl https://pocket-money-server.vercel.app/

# Test login endpoint (replace with your backend URL)
curl -X POST https://pocket-money-server.vercel.app/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
