# Railway Monorepo Fix - When Root Directory Doesn't Exist

## The Problem
Railway is analyzing root directory (`./`) instead of `backend/` folder where `package.json` exists. Railway UI doesn't have Root Directory setting in some versions.

## Solution: Use Custom Build Commands

Since Root Directory setting isn't available, we'll use custom build commands that change into the backend directory.

### Step 1: Go to Railway Service Settings

1. Open your Railway service
2. Click **Settings** tab
3. Look for **"Build"** or **"Deploy"** section
4. Find **"Build Command"** and **"Start Command"** fields

### Step 2: Set Custom Build Command

In the **Build Command** field, enter:
```bash
cd backend && pnpm install --frozen-lockfile && pnpm build
```

This will:
- Change to `backend/` directory
- Install dependencies with pnpm
- Build the TypeScript project

### Step 3: Set Custom Start Command

In the **Start Command** field, enter:
```bash
cd backend && pnpm start
```

This will:
- Change to `backend/` directory
- Run the start script from `backend/package.json`

### Step 4: Save and Deploy

1. Click **Save** or **Update**
2. Go to **Deployments** tab
3. Click **Redeploy** or trigger new deployment

## Alternative: Environment Variables Method

If Build Command fields don't exist either:

1. Go to **Variables** tab
2. Add these environment variables:

**Variable 1:**
- Name: `RAILWAY_BUILD_COMMAND`
- Value: `cd backend && pnpm install --frozen-lockfile && pnpm build`

**Variable 2:**
- Name: `RAILWAY_START_COMMAND`
- Value: `cd backend && pnpm start`

3. Save and redeploy

## Verification

After setting build/start commands, logs should show:
```
✅ Changed to backend directory
✅ Found package.json
✅ Installing dependencies...
✅ Building TypeScript...
✅ Starting server...
```
