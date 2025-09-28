# Pocket Money Manager - Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Set up a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
3. **Git Repository**: Push your code to GitHub, GitLab, or Bitbucket

## Deployment Steps

### 1. Deploy Backend API

1. **Create New Project in Vercel**
   - Go to Vercel Dashboard
   - Click "New Project"
   - Import your repository
   - Select the `backend` folder as root directory

2. **Configure Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add the following variables:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pocket-money-manager
     JWT_SECRET=your-super-secure-jwt-secret-key-here
     NODE_ENV=production
     FRONTEND_URL=https://your-frontend-app.vercel.app
     ```
   - **IMPORTANT**: Replace `https://your-frontend-app.vercel.app` with your actual frontend URL after deployment

3. **Deploy Backend**
   - Vercel will automatically deploy your backend
   - Note the deployment URL (e.g., `https://your-backend.vercel.app`)

### 2. Deploy Frontend

1. **Create Another New Project in Vercel**
   - Import the same repository
   - Select the `frontend-code` folder as root directory

2. **Configure Environment Variables**
   - Add the following variable:
     ```
     VITE_API_BASE_URL=https://your-backend.vercel.app/api
     ```

3. **Deploy Frontend**
   - Vercel will build and deploy your React app
   - Your app will be available at the provided URL

### 3. Update CORS Configuration

After both deployments:

1. **Update Backend Environment Variables**
   - Go to your backend Vercel project settings
   - Update `FRONTEND_URL` with your actual frontend URL
   - Redeploy the backend

## MongoDB Atlas Setup

1. **Create Cluster**
   - Sign up for MongoDB Atlas
   - Create a free M0 cluster
   - Choose a cloud provider and region

2. **Database Access**
   - Create a database user
   - Set username and password
   - Grant read/write access

3. **Network Access**
   - Add IP address `0.0.0.0/0` (allow from anywhere)
   - Or add Vercel's IP ranges for better security

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Environment Variables Summary

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pocket-money-manager
JWT_SECRET=your-super-secure-jwt-secret-key-here
NODE_ENV=production
FRONTEND_URL=https://your-frontend-app.vercel.app
```

### Frontend (.env.local)
```
VITE_API_BASE_URL=https://your-backend.vercel.app/api
```

## Troubleshooting

### Common Issues

1. **CORS Errors / Login/Signup Not Working**
   - **Most Common Issue**: Ensure `FRONTEND_URL` in backend environment variables matches your frontend URL exactly
   - Check that CORS is properly configured in server.js
   - Verify the frontend URL includes the protocol (https://) and no trailing slash
   - After updating `FRONTEND_URL`, redeploy the backend for changes to take effect

2. **Database Connection**
   - Verify MongoDB URI is correct
   - Check network access settings in MongoDB Atlas
   - Ensure database user has proper permissions

3. **API Not Found**
   - Verify `VITE_API_BASE_URL` points to correct backend URL
   - Check that backend is deployed and running

4. **Build Failures**
   - Check that all dependencies are in package.json
   - Verify Node.js version compatibility

### Vercel Logs

- Check deployment logs in Vercel dashboard
- Use `vercel logs` command for real-time logs
- Monitor function logs for API errors

## Post-Deployment

1. **Test All Features**
   - User registration and login
   - Transaction CRUD operations
   - Analytics and export functionality

2. **Set Up Custom Domain** (Optional)
   - Add custom domain in Vercel project settings
   - Update environment variables if needed

3. **Monitor Performance**
   - Use Vercel Analytics
   - Monitor API response times
   - Check error rates

## Security Considerations

1. **Environment Variables**
   - Never commit .env files to git
   - Use strong JWT secrets
   - Rotate secrets periodically

2. **Database Security**
   - Use specific IP allowlists when possible
   - Enable MongoDB Atlas security features
   - Regular backup your data

3. **HTTPS**
   - Vercel provides HTTPS by default
   - Ensure all API calls use HTTPS in production

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints directly
4. Check MongoDB Atlas connection

Your Pocket Money Manager should now be live and accessible worldwide! 🚀
