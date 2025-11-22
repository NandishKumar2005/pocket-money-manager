# 🔑 Gemini API Key Setup Guide

## Step 1: Get Your Free Gemini API Key

1. **Visit Google AI Studio**: https://aistudio.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click "Create API Key"** or "Get API Key"
4. **Copy your API key** (it will look like: `AIzaSy...`)

## Step 2: Add API Key to Your Project

### For Local Development:

1. **Create a `.env` file** in the `frontend-code` folder (if it doesn't exist)
2. **Add this line** to the `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
3. **Replace `your_actual_api_key_here`** with the API key you copied from Google AI Studio

### Example `.env` file:
```
VITE_GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
```

## Step 3: Restart Your Dev Server

After adding the API key:

1. **Stop your dev server** (press `Ctrl+C` in the terminal)
2. **Start it again**:
   ```bash
   npm run dev
   ```

## Step 4: Test the Chatbot

1. **Open your app** in the browser
2. **Click the chatbot button** (bottom right corner)
3. **Type a message** and send it
4. **The chatbot should now work!** 🎉

## For Production (Vercel Deployment)

If you're deploying to Vercel:

1. **Go to your Vercel project dashboard**
2. **Navigate to Settings → Environment Variables**
3. **Add a new variable**:
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Value**: Your actual API key
   - **Environment**: Production, Preview, Development (select all)
4. **Redeploy your application**

## Troubleshooting

### Chatbot shows "API key not configured" message:
- ✅ Make sure your `.env` file is in the `frontend-code` folder
- ✅ Make sure the variable name is exactly `VITE_GEMINI_API_KEY`
- ✅ Make sure you restarted the dev server after adding the key
- ✅ Check that there are no extra spaces or quotes around the API key

### API key not working:
- ✅ Verify your API key is correct (copy it again from Google AI Studio)
- ✅ Make sure you haven't exceeded the free tier limits
- ✅ Check the browser console for any error messages

## Security Note

⚠️ **Important**: 
- Never commit your `.env` file to Git (it's already in `.gitignore`)
- Never share your API key publicly
- The `.env` file is for local development only
- For production, use environment variables in your hosting platform (Vercel, etc.)

