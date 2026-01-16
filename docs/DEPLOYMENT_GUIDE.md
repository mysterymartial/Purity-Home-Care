# Purity Home Care - Deployment & Domain Setup Guide

## Table of Contents
1. [Buying a Domain in America](#buying-a-domain-in-america)
2. [Railway Deployment Setup](#railway-deployment-setup)
3. [Domain Configuration](#domain-configuration)
4. [Monthly Payment Setup](#monthly-payment-setup)
5. [Troubleshooting](#troubleshooting)

---

## Buying a Domain in America

### Recommended Domain Registrars (Cheap Options)

#### 1. **Namecheap** (Recommended - Best Value)
**Website**: https://www.namecheap.com
**Pricing**: ~$8-15/year for `.com` domains
**Why Choose:**
- Free WHOIS privacy protection
- Easy DNS management
- Good customer support
- No hidden fees

**How to Buy:**
1. Visit namecheap.com
2. Search for your desired domain (e.g., `purityhomecare.com`)
3. Add to cart and checkout
4. Create account and complete payment
5. Domain is yours immediately

#### 2. **Google Domains** (Simple & Reliable)
**Website**: https://domains.google
**Pricing**: ~$12/year for `.com` domains
**Why Choose:**
- Very simple interface
- Integrated with Google services
- Reliable DNS
- Easy to transfer if needed

#### 3. **Cloudflare Registrar** (Cheapest - Cost Price)
**Website**: https://www.cloudflare.com/products/registrar
**Pricing**: ~$8.57/year for `.com` domains (at cost, no markup)
**Why Choose:**
- Most affordable option
- No markup on domain prices
- Fast DNS
- Great security features

**Note**: Requires existing Cloudflare account

#### 4. **Porkbun** (Cheap Alternative)
**Website**: https://porkbun.com
**Pricing**: ~$8-9/year for `.com` domains
**Why Choose:**
- Very affordable
- Free SSL and privacy protection
- Simple interface
- Good for budget-conscious buyers

---

### Domain Buying Process (Step-by-Step)

#### Step 1: Choose a Domain Name
**Good Domain Names:**
- `purityhomecare.com`
- `purityfamilycare.com`
- `puritycareservices.com`
- `purityhomehealth.com`

**Tips:**
- Keep it short and memorable
- Use `.com` extension (most trusted)
- Avoid hyphens and numbers
- Make it relevant to your business

#### Step 2: Register the Domain
1. Go to chosen registrar (recommend Namecheap)
2. Search for your domain
3. Check if it's available
4. Add to cart
5. Create an account
6. Complete checkout with credit/debit card

#### Step 3: Verify Ownership
- Check your email for verification link
- Complete domain ownership verification
- Domain is now active

---

### How to Transfer Domain Ownership (For Client)

**Option A: Client Buys Directly**
1. Client creates account on registrar (e.g., Namecheap)
2. Client buys domain with their payment method
3. Client shares domain credentials with you
4. You configure DNS and deployment
5. Client pays monthly/yearly renewal automatically

**Option B: You Buy, Client Pays**
1. You buy domain initially
2. Transfer ownership to client later
3. Client takes over payments

**Option C: Shared Access**
1. Client buys domain
2. You request access for DNS management
3. Client adds you as admin/delegate
4. You manage technical setup
5. Client retains ownership and pays renewals

**Recommended**: **Option A** - Client buys directly, gives you access for setup

---

## Railway Deployment Setup

### What is Railway?

**Railway** is a modern hosting platform that makes deployment easy:
- Automatic deployments from GitHub
- Simple pricing ($5/month minimum)
- Built-in databases
- Free SSL certificates
- No server management needed

**Website**: https://railway.app

---

### Setting Up Railway Account (For Client)

#### Step 1: Create Account
1. Visit https://railway.app
2. Click **"Start a New Project"**
3. Sign up with:
   - **Email** (recommended: use same email as domain registrar)
   - Or **GitHub** account (easier integration)

#### Step 2: Choose Plan
**Starter Plan** (Recommended):
- **Cost**: $5/month + usage
- **Includes**: 
  - 500 hours of execution time
  - $5 credit per month
  - Perfect for small to medium apps

**Pro Plan**:
- **Cost**: $20/month + usage
- **Includes**:
  - More resources
  - Better for high traffic

**For this project**: Start with **Starter Plan** ($5/month)

---

### Deploying Frontend to Railway

#### Prerequisites
- GitHub repository with your code
- Railway account created
- Domain purchased (optional - Railway provides free subdomain)

#### Step-by-Step Deployment

**1. Prepare Frontend for Production**
```bash
cd frontend
# Update NEXT_PUBLIC_API_URL in .env.local or Railway environment variables
```

**2. Connect Railway to GitHub**
1. Log in to Railway dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Railway automatically detects Next.js

**3. Configure Environment Variables**
In Railway dashboard, add these variables:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
NEXT_PUBLIC_WHATSAPP_NUMBER=+12156178614
NEXT_PUBLIC_ADMIN_EMAIL=purityfamilyservicextonpa@yahoo.com
```

**4. Deploy**
- Railway automatically builds and deploys
- Wait 2-3 minutes for deployment
- Get your Railway URL (e.g., `frontend-production.up.railway.app`)

**5. Custom Domain Setup** (Optional)
- Go to project settings
- Click **"Settings"** → **"Domains"**
- Add your custom domain (e.g., `purityhomecare.com`)
- Railway provides DNS instructions

---

### Deploying Backend to Railway

#### Step 1: Prepare Backend
Ensure these files exist:
- `package.json`
- `tsconfig.json`
- Source code in `src/` directory

#### Step 2: Create New Railway Service
1. In Railway dashboard, click **"New"** → **"Service"**
2. Select **"Deploy from GitHub repo"**
3. Choose your backend repository
4. Railway detects Node.js automatically

#### Step 3: Add MongoDB Database
1. In Railway dashboard, click **"New"** → **"Database"** → **"MongoDB"**
2. Railway automatically creates MongoDB instance
3. Copy the connection string (MONGODB_URI)

#### Step 4: Configure Environment Variables
Add these in Railway → Your Service → Variables:

**Required Variables:**
```
PORT=3001
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/purity-care
CORS_ORIGIN=https://your-frontend-domain.com

# Firebase Admin
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=mystery-singer-library
SMTP_PASS=your-gmail-app-password
ADMIN_EMAIL=purityfamilyservicextonpa@yahoo.com
```

#### Step 5: Deploy Backend
- Railway automatically builds and deploys
- Check logs for "Server running on port 3001"
- Get your backend URL (e.g., `backend-production.up.railway.app`)

#### Step 6: Update Frontend API URL
1. Go to Frontend Railway service
2. Update `NEXT_PUBLIC_API_URL` to your backend Railway URL
3. Redeploy frontend

---

### Railway Pricing & Billing

#### How Billing Works

**Monthly Payment:**
- Railway charges automatically each month
- Charges are based on usage:
  - **$5 base credit** included in Starter plan
  - **Additional usage** charged per hour:
    - CPU time: ~$0.000463/hour
    - Memory: ~$0.000231/GB-hour
    - Bandwidth: First 100GB free, then ~$0.10/GB

**Typical Monthly Cost:**
- **Small app** (this project): **$5-15/month**
  - Includes: Frontend + Backend + MongoDB
  - Low traffic: ~$5-8/month
  - Medium traffic: ~$10-15/month

**Payment Methods:**
- Credit card
- Debit card
- Automatically charged monthly

**Client Payment Setup:**
1. Client adds payment method to Railway account
2. Railway charges monthly automatically
3. Client receives email receipts
4. Client can view usage and costs in Railway dashboard

---

### Domain Configuration (Connecting Domain to Railway)

#### Step 1: Get Railway DNS Records
1. In Railway dashboard → Your Frontend Service
2. Go to **"Settings"** → **"Domains"**
3. Click **"Add Custom Domain"**
4. Enter your domain (e.g., `purityhomecare.com`)
5. Railway shows DNS records needed:
   - **CNAME**: `www` → `cname.railway.app`
   - **A Record**: `@` → `IP address` (if provided)

#### Step 2: Configure DNS in Domain Registrar

**If using Namecheap:**
1. Log in to Namecheap
2. Go to **"Domain List"** → Click **"Manage"** next to your domain
3. Go to **"Advanced DNS"** tab
4. Add/Edit records:

**For Root Domain (purityhomecare.com):**
- Type: **CNAME Record**
- Host: `@`
- Value: `cname.railway.app`
- TTL: Automatic

**For WWW (www.purityhomecare.com):**
- Type: **CNAME Record**
- Host: `www`
- Value: `cname.railway.app`
- TTL: Automatic

**Save all records**

#### Step 3: SSL Certificate (Automatic)
- Railway automatically provisions SSL certificates
- Wait 5-10 minutes for DNS propagation
- Your site will have HTTPS automatically

#### Step 4: Verify Setup
1. Wait 10-30 minutes for DNS to propagate
2. Visit `https://purityhomecare.com`
3. Should see your site loading
4. Check SSL certificate is valid (lock icon in browser)

---

## Complete Deployment Checklist

### Before Deployment
- [ ] Domain purchased and verified
- [ ] Railway account created
- [ ] GitHub repository ready
- [ ] Environment variables documented
- [ ] Firebase project configured
- [ ] MongoDB Atlas database created (or Railway MongoDB)
- [ ] Gmail app password obtained for email

### Frontend Deployment
- [ ] Railway service created for frontend
- [ ] Connected to GitHub repository
- [ ] Environment variables added:
  - [ ] NEXT_PUBLIC_API_URL
  - [ ] NEXT_PUBLIC_WHATSAPP_NUMBER
  - [ ] NEXT_PUBLIC_ADMIN_EMAIL
- [ ] Deployment successful
- [ ] Custom domain configured
- [ ] SSL certificate active

### Backend Deployment
- [ ] Railway service created for backend
- [ ] Connected to GitHub repository
- [ ] MongoDB database added
- [ ] Environment variables added:
  - [ ] MONGODB_URI
  - [ ] FIREBASE credentials
  - [ ] SMTP credentials
  - [ ] ADMIN_EMAIL
- [ ] Deployment successful
- [ ] API accessible via Railway URL

### Post-Deployment
- [ ] Test frontend loads correctly
- [ ] Test API endpoints work
- [ ] Test admin login
- [ ] Test chat functionality
- [ ] Test email notifications
- [ ] Verify domain SSL certificate
- [ ] Monitor Railway logs for errors

---

## Monthly Payment Setup Guide (For Client)

### Railway Monthly Payments

#### Automatic Billing
1. **Add Payment Method:**
   - Log in to Railway account
   - Go to **"Account Settings"** → **"Billing"**
   - Click **"Add Payment Method"**
   - Enter credit/debit card details
   - Save payment method

2. **Monthly Charges:**
   - Railway charges automatically on the 1st of each month
   - Client receives email receipt
   - Can view invoices in Railway dashboard

3. **Budget Alerts:**
   - Set spending limits in Railway
   - Receive email alerts when approaching limit
   - Prevent unexpected charges

#### Recommended Setup for Client

**Step 1: Client Creates Railway Account**
- Client signs up at railway.app
- Client adds their payment method
- Client shares Railway account access with you (or gives you deploy access)

**Step 2: You Handle Deployment**
- You deploy the application to Railway
- You configure all settings
- Client's payment method is automatically charged

**Step 3: Client Manages Payments**
- Client receives monthly invoices via email
- Client can view usage and costs in Railway dashboard
- Client can update payment method anytime
- Client retains full control of billing

**Alternative: You Manage Deployment, Client Pays**
- You create Railway account
- Client adds their payment method to your Railway account
- You deploy and maintain
- Client receives invoices and pays

**Best Practice**: Client owns Railway account and payment method, grants you access for deployment.

---

## Domain Renewal & Maintenance

### Domain Renewal

**Automatic Renewal Setup:**
1. Log in to domain registrar (e.g., Namecheap)
2. Go to domain settings
3. Enable **"Auto-Renew"**
4. Domain renews automatically each year
5. Client's payment method is charged automatically

**Domain Costs:**
- Annual cost: $8-15/year (very affordable)
- Renewal is automatic if enabled
- Client receives renewal email 30 days before expiry

### Ongoing Maintenance

**Monthly Tasks:**
- Monitor Railway usage and costs
- Check application logs for errors
- Verify email notifications working
- Test key features

**Quarterly Tasks:**
- Review Railway costs and optimize if needed
- Update dependencies if needed
- Check domain renewal status
- Backup important data

---

## Cost Summary

### Initial Setup Costs
- **Domain**: $8-15/year (one-time per year)
- **Railway Setup**: Free (no setup fees)

### Monthly Operating Costs
- **Railway Starter Plan**: $5/month (base credit)
- **Additional Usage**: $0-10/month (depends on traffic)
- **MongoDB**: Included in Railway or separate ($0-9/month)
- **Total Estimated**: **$5-25/month**

### Annual Costs
- **Domain Renewal**: $8-15/year
- **Railway**: ~$60-300/year (depending on usage)
- **Total Estimated**: **$68-315/year**

**For a small-medium business**: Expect **$10-20/month** total

---

## Troubleshooting

### Domain Issues

**Domain not connecting:**
- Wait 24-48 hours for DNS propagation
- Verify DNS records are correct in registrar
- Check Railway domain settings
- Clear browser cache

**SSL Certificate issues:**
- Wait 10-30 minutes after adding domain
- Verify DNS records are correct
- Check Railway logs for SSL errors

### Railway Deployment Issues

**Build failures:**
- Check Railway build logs
- Verify all environment variables are set
- Ensure package.json dependencies are correct
- Check for TypeScript errors

**Application not starting:**
- Check Railway service logs
- Verify PORT environment variable
- Check MongoDB connection string
- Verify Firebase credentials

**High costs:**
- Review Railway usage metrics
- Optimize code to reduce CPU/memory usage
- Consider upgrading to Pro plan for better rates
- Set spending limits and alerts

### Email Notification Issues

**Not receiving emails:**
- Check ADMIN_EMAIL is set correctly
- Verify SMTP credentials are correct
- Check notification preferences in admin dashboard
- Review backend logs for email errors
- Verify Gmail app password is correct

---

## Quick Reference

### Important URLs
- **Railway**: https://railway.app
- **Namecheap**: https://www.namecheap.com
- **Cloudflare**: https://www.cloudflare.com/products/registrar

### Support Contacts
- **Railway Support**: support@railway.app or Discord
- **Domain Registrar**: Check their support page
- **Your Email**: purityfamilyservicextonpa@yahoo.com

### Environment Variables Checklist
- [ ] MONGODB_URI
- [ ] FIREBASE credentials (3 variables)
- [ ] SMTP credentials (4 variables)
- [ ] ADMIN_EMAIL
- [ ] NEXT_PUBLIC_API_URL
- [ ] CORS_ORIGIN

---

*Last Updated: 2024*
*Version: 1.0*
