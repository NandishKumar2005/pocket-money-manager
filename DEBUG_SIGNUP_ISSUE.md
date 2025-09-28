# 🐛 Debug Signup Issue on Vercel Deployment

## Step-by-Step Debugging Guide

### Step 1: Check Browser Console Logs
1. **Open your deployed frontend** (e.g., `https://your-app.vercel.app`)
2. **Open Developer Tools** (F12)
3. **Go to Console tab**
4. **Try to signup** with test data:
   - Name: `Test User`
   - Email: `test2@example.com` 
   - Password: `password123`
5. **Look for errors** in console

### Step 2: Check Network Tab
1. **Go to Network tab** in Developer Tools
2. **Try signup again**
3. **Look for the signup request** (should be POST to `/api/users/register`)
4. **Check the response:**
   - Status code (200, 400, 500, etc.)
   - Response body
   - Request headers

### Step 3: Common Error Scenarios

#### Scenario A: CORS Error
**Symptoms:** Console shows CORS error
**Solution:** 
- Verify `FRONTEND_URL` in backend Vercel environment variables
- Must match your frontend URL exactly
- Redeploy backend after changes

#### Scenario B: 400 Bad Request
**Symptoms:** Network tab shows 400 status
**Possible causes:**
- Missing required fields (name, email, password)
- User already exists
- Invalid email format

#### Scenario C: 500 Internal Server Error  
**Symptoms:** Network tab shows 500 status
**Possible causes:**
- Database connection issues
- Missing JWT_SECRET
- MongoDB Atlas network access problems

#### Scenario D: Network Request Failed
**Symptoms:** Request doesn't reach server
**Possible causes:**
- Wrong API URL in frontend
- Backend not deployed properly

### Step 4: Test Backend API Directly

Open a new browser tab and test your backend directly:

```
# Test if backend is running
https://pocket-money-server.vercel.app/

# Should return: {"message":"Pocket Money Manager API is running"}
```

### Step 5: Check Vercel Function Logs

1. **Go to your backend Vercel project**
2. **Click on Functions tab**
3. **Look for recent invocations**
4. **Check logs for errors**

### Step 6: Verify Environment Variables

**Backend Vercel Project - Required Variables:**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=production
FRONTEND_URL=https://your-frontend-app.vercel.app
```

**Frontend Vercel Project - Required Variables:**
```
VITE_API_BASE_URL=https://your-backend.vercel.app/api
```

### Step 7: Test with Different Email

Try signup with a completely new email that definitely doesn't exist:
- Email: `newuser-$(Date.now())@example.com`
- This eliminates "user already exists" errors

## 🔧 Quick Fixes

### Fix 1: Redeploy Both Applications
1. Redeploy backend first
2. Then redeploy frontend
3. Clear browser cache

### Fix 2: Check MongoDB Atlas
1. **Network Access:** Allow 0.0.0.0/0 (all IPs)
2. **Database User:** Has read/write permissions
3. **Connection String:** Correct in MONGODB_URI

### Fix 3: Verify API URL Format
Frontend environment should have:
```
VITE_API_BASE_URL=https://your-backend.vercel.app/api
```
Note the `/api` at the end!

## 📋 Information to Collect

When reporting the issue, please provide:

1. **Frontend URL:** `https://your-frontend.vercel.app`
2. **Backend URL:** `https://your-backend.vercel.app`
3. **Console Error Messages:** Copy exact error text
4. **Network Request Details:** Status code and response
5. **Signup Data Used:** Name, email (no password)

## 🧪 Test Commands

Test your backend API with these commands:

```bash
# Test backend health
curl https://your-backend.vercel.app/

# Test signup endpoint
curl -X POST https://your-backend.vercel.app/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test-$(date +%s)@example.com", 
    "password": "password123"
  }'
```

Replace `your-backend.vercel.app` with your actual backend URL.

## ✅ Expected Successful Response

A successful signup should return:
```json
{
  "_id": "...",
  "name": "Test User", 
  "email": "test@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
