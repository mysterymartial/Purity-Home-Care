# Railway Deployment Fix - Root Directory Issue

## Problem
Railway is analyzing root directory (`./`) instead of `backend/` where `package.json` exists.

## Solution: Set Root Directory in Railway UI

### Step-by-Step Instructions

1. **Open Railway Dashboard**
   - Go to https://railway.app
   - Log in to your account

2. **Open Your Service**
   - Click on your project
   - Click on the failing service (Purity-Home-Care)

3. **Go to Settings**
   - Click **"Settings"** tab (gear icon or Settings link)

4. **Find Root Directory Setting**
   Look for it in ONE of these locations:
   
   **Option A: Settings → Deploy**
   - In Settings page, scroll down
   - Find **"Deploy"** section
   - Look for **"Root Directory"** field
   
   **Option B: Settings → General**
   - In Settings page
   - Find **"General"** section
   - Look for **"Root Directory"** or **"Source Root"** field

5. **Set Root Directory**
   - Click the input field
   - Type exactly: `backend`
   - **Important**: No slash, no dot - just: `backend`
   - Press Enter or click outside the field

6. **Save Changes**
   - Click **"Save"** or **"Update"** button
   - Wait for confirmation (green checkmark or success message)

7. **Verify It's Saved**
   - Check that the field still shows: `backend`
   - If it's empty or shows `.`, set it again

8. **Trigger New Deployment**
   - Go to **"Deployments"** tab
   - Click **"Redeploy"** button
   - Or delete the failed deployment and trigger a new one

## Alternative: Environment Variable Method

If you can't find Root Directory in Settings:

1. **Go to Variables Tab**
   - Click **"Variables"** tab in your service

2. **Add Environment Variable**
   - Click **"New Variable"**
   - Name: `RAILWAY_SOURCE_DIR`
   - Value: `backend`
   - Click **"Add"**

3. **Redeploy**
   - Go to Deployments → Redeploy

## What Should Happen After Fix

Build logs should show:
```
✅ Analyzing directory: backend/     ← NOT ./
✅ Found package.json               ← This is key!
✅ Detected Node.js project
✅ Using pnpm
✅ Installing dependencies...
✅ Building...
✅ Starting...
```

## Still Not Working?

1. **Delete and Recreate Service**
   - Settings → General → Delete Service
   - Create new service from GitHub
   - **IMMEDIATELY** set Root Directory = `backend` before first build
   - Save and deploy

2. **Check Railway Docs**
   - https://docs.railway.app/develop/deploy#root-directory

## Verification Checklist

- [ ] Root Directory set to exactly `backend` (no slash)
- [ ] Changes saved successfully
- [ ] New deployment triggered
- [ ] Build logs show "Analyzing directory: backend/"
- [ ] Build logs show "Found package.json"
