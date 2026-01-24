# Purity Home Care - User Manual

## Table of Contents
1. [Customer Guide](#customer-guide)
2. [Admin Guide](#admin-guide)
3. [Getting Started](#getting-started)

---

## Customer Guide

### Landing Page (Home Page)

The landing page provides an overview of Purity Home Care services.

#### Navigation
- **Home** - Return to the landing page
- **Services** - View available care services
- **Why Us** - Learn about our care approach
- **Our Process** - Understand how we work
- **Patient Reviews** - Read testimonials from other families
- **Schedule Consultation** - Book a consultation

#### Main Actions
1. **Start Consultation** button - Opens the booking page
2. **Learn More** button - Scrolls to the services section
3. **Explore All Services** button - Opens the booking page
4. **Submit Your Review** button - Opens the review submission page

---

### Booking a Service

#### Step 1: Access Booking Page
- Click **"Schedule Consultation"** button from anywhere on the site
- Or click **"Start Consultation"** on the landing page
- Or use the **"Schedule Consultation"** button in the navigation bar

#### Step 2: Choose Communication Method

You have two options:

**Option A: In-App Chat**
- Click **"Book on App"**
- Opens a secure in-app chat interface
- No external apps required
- Chat history is saved automatically

**Option B: WhatsApp**
- Click **"Book on WhatsApp"**
- Opens WhatsApp with a pre-filled message
- Continue conversation on WhatsApp
- Great for booking on the go

---

### Using the In-App Chat

#### Starting a Chat
1. Click **"Book on App"** from the booking page
2. A chat session is automatically created
3. You'll see a welcome message from the support team

#### Sending Messages
1. Type your message in the input field at the bottom
2. Click the **Send** button (paper plane icon) or press **Enter**
3. Your message appears in a teal bubble on the right
4. Admin responses appear in white bubbles on the left

#### Features
- **Emoji Picker** - Click the 😊 icon to add emojis to your message
- **Attachment Button** - Click the **+** button (currently for future file uploads)
- **Continue on WhatsApp** - Option appears after first message to switch to WhatsApp
- **Real-time Updates** - Messages appear instantly when admin responds

#### Chat Tips
- Be specific about your care needs
- Mention preferred times and dates
- Ask questions about services
- The chat history is saved - you can return anytime

---

### Submitting a Review

#### Access Review Page
- Click **"Submit Your Review"** from the landing page
- Or use the navigation link to **"Patient Reviews"** section and click the button

#### Step-by-Step Process

**1. Rate Your Experience**
- Click 1-5 stars at the top
- Stars highlight as you hover
- Click the star rating you want to give

**2. Select Service Received** (Optional)
- Choose from the dropdown:
  - Companion Care
  - Personal Care
  - Medication Management
  - Specialized Care
  - Laundry Service

**3. Select Date of Service** (Optional)
- Click the date picker
- Select when you received the service

**4. Write Your Review** (Optional)
- Type your feedback in the text area
- Share what you appreciated
- Mention any suggestions for improvement

**5. Submit**
- Click **"Submit Review"** button
- Wait for confirmation message
- You'll be redirected to the home page after 2 seconds

#### Important Notes
- Reviews require admin approval before appearing on the website
- Approved reviews appear in the "Patient Reviews" section
- You can submit multiple reviews for different services

---

## Admin Guide

### Accessing the Admin Dashboard

#### Login Process
1. Click **"Admin Login"** in the navigation bar
2. Enter your **Email** address (e.g., `admin@purity.com`)
3. Enter your **Password**
4. Click **"Sign In"** button

#### Troubleshooting Login
- **"No account found"** - Check your email address
- **"Incorrect password"** - Verify your password or reset it in Firebase
- **"Invalid email format"** - Ensure email follows standard format (e.g., `user@example.com`)
- **"Too many attempts"** - Wait a few minutes before trying again

---

### Admin Dashboard Overview

After logging in, you'll see the main dashboard with:

#### Left Sidebar
- **Inbox** - View all chat sessions
- **Reviews** - Moderate submitted reviews
- **Settings** - Configure preferences

#### Top Bar
- **Search** - Filter chat sessions or reviews
- **Admin Name** - Your display name from settings
- **Logout** - Sign out of the dashboard

---

### Managing Chat Sessions (Inbox Tab)

#### Viewing Chat Sessions
1. Click **"Inbox"** in the sidebar
2. See a list of all chat sessions on the left
3. Each session shows:
   - Customer ID (first 20 characters)
   - Last activity time
   - Current status (Pending, Confirmed, Completed)

#### Opening a Chat
- Click on any session in the left panel
- The right panel shows the full conversation
- Customer messages appear in white bubbles (left-aligned)
- Your admin messages appear in teal bubbles (right-aligned)

#### Sending Messages
1. Type your message in the input field at the bottom
2. Click the **Send** button (message icon) or press **Enter**
3. Your message appears immediately in the chat

#### Managing Session Status
1. Select a session from the list
2. Use the **Status** dropdown in the top right:
   - **Pending** - New chat, awaiting response
   - **Confirmed** - Consultation confirmed
   - **Completed** - Service completed

#### Creating Google Meet
- Click **"Create Google Meet"** button next to the status dropdown
- Opens Google Meet in a new tab
- Copy the meeting link from Google Meet
- Share the meeting link with the customer via chat

#### Deleting Chat Sessions
1. Select the chat session you want to delete
2. Click the **"Delete"** button (red trash icon) next to the status dropdown
3. A confirmation dialog appears
4. Click **"OK"** to confirm deletion
5. The chat session and all its messages are soft-deleted
6. Deleted sessions no longer appear in the inbox
7. **Note:** Deleted sessions can be recovered from the database if needed

#### Features
- **Search** - Type in the search box to filter sessions by customer ID
- **Real-time Updates** - New customer messages appear automatically
- **Message Timestamps** - See when each message was sent
- **Mobile Responsive** - Full functionality on mobile devices
- **No Duplicate Messages** - Messages appear only once

---

### Moderating Reviews (Reviews Tab)

#### Viewing Reviews
1. Click **"Reviews"** in the sidebar
2. Left panel shows a list of all reviews (pending and approved)
3. Right panel shows full review details when selected

#### Review Information
Each review displays:
- **Rating** - 1-5 stars
- **Review Text** - Customer's written feedback (if provided)
- **Submission Date** - When the review was submitted
- **Status** - "Approved" (green) or "Pending" (yellow)

#### Approving a Review
1. Click on a review in the left panel (or use the right panel)
2. Click the **"Approve"** button (green checkmark icon)
3. Review status changes to "Approved"
4. Review now appears on the public website

#### Rejecting a Review
1. Select the review you want to reject
2. Click the **"Reject"** button (red X icon)
3. Review is permanently deleted

#### Tips for Moderation
- Approve positive, constructive reviews
- Reject spam, inappropriate, or fake reviews
- Check for clear ratings and helpful feedback
- Approved reviews build trust with potential customers

---

### Settings Configuration

#### Accessing Settings
1. Click **"Settings"** in the sidebar
2. Settings panel opens on the right side

---

#### Notification Preferences

Control when you receive email notifications:

**1. Email Notifications** (Master Toggle)
- **ON**: You'll receive email notifications (if specific alerts are enabled)
- **OFF**: No emails will be sent, regardless of other settings

**2. New Chat Alerts**
- **ON**: Receive emails when:
  - New chat session is created
  - Customer sends a new message
- **OFF**: No emails for chat-related events

**3. Review Alerts**
- **ON**: Receive emails when new reviews are submitted
- **OFF**: No emails for new reviews

#### How to Change Notification Settings
1. Go to **Settings** tab
2. Toggle any notification preference ON/OFF
3. Click **"Save Settings"** button at the bottom
4. Settings are saved immediately and take effect right away

#### Testing Your Settings
- **Disable New Chat Alerts** → Create a test chat session → No email should be sent
- **Enable New Chat Alerts** → Create a test chat session → Email should arrive
- Same logic applies to Review Alerts

---

#### Profile Settings

**Display Name**
- Change how your name appears in the sidebar
- Type your preferred name in the input field
- Example: "John Admin" or "Admin User"
- Click **"Save Settings"** to apply

**Email Address**
- Shows your login email address
- Cannot be changed from the dashboard
- Contact system administrator to update email
- This is the email where notifications are sent

---

#### System Configuration

**Auto Refresh**
- **ON**: Dashboard automatically refreshes data at set intervals
- **OFF**: Data only refreshes when you manually reload

**Refresh Interval**
- Only visible when Auto Refresh is enabled
- Set how often data refreshes (10-300 seconds)
- Default: 30 seconds
- Minimum: 10 seconds
- Maximum: 300 seconds (5 minutes)
- Shows countdown timer when active

**Theme Preference (Global Setting)**
- **Light Mode**: All users (admin, customers, visitors) see light theme
- **Dark Mode**: All users see dark theme
- **Auto**: All users see theme that matches their system preference
- Changes apply immediately to all users
- Theme is stored in database, not locally
- Frontend polls for theme changes every 5 seconds

#### How to Change System Settings
1. Go to **Settings** tab
2. Toggle Auto Refresh or change Theme
3. Adjust Refresh Interval if needed
4. Click **"Save Settings"** button
5. Changes apply immediately

---

### Search Functionality

#### Searching Chat Sessions
1. Go to **Inbox** tab
2. Type in the search box at the top
3. Results filter by customer ID (partial matches work)
4. Click a session to view conversation

#### Searching Reviews
1. Go to **Reviews** tab
2. Type in the search box at the top
3. Results filter by:
   - Review text content
   - Rating number
4. Click a review to view full details

---

### Logging Out

1. Click **"Logout"** button in the top right corner
2. You'll be signed out immediately
3. Redirected to the login page
4. You'll need to log in again to access the dashboard

---

## Getting Started

### For Customers

**First Time Using the Service:**
1. Visit the website homepage
2. Browse services and read reviews
3. Click **"Schedule Consultation"**
4. Choose your preferred communication method
5. Start chatting with our support team

**Returning Customer:**
- Your chat history is saved (if using in-app chat)
- You can start a new chat anytime
- Or continue on WhatsApp if you prefer

### For Admins

**First Time Setup:**
1. Log in with your Firebase admin credentials
2. Configure notification preferences in Settings
3. Set your display name
4. Choose your theme preference
5. Start managing chats and reviews

**Daily Workflow:**
1. Log in to the admin dashboard
2. Check **Inbox** for new chat sessions
3. Respond to customer messages
4. Update session status as needed
5. Check **Reviews** tab for new submissions
6. Approve or reject reviews
7. Monitor settings for any needed adjustments

---

## Frequently Asked Questions (FAQ)

### Customer FAQ

**Q: Do I need to create an account?**
A: No account required! Just start a chat or contact us on WhatsApp.

**Q: How long does it take to get a response?**
A: Our team typically responds within a few minutes during business hours. You'll receive email notifications when we respond.

**Q: Can I use the chat on my phone?**
A: Yes! The website works on all devices - desktop, tablet, and mobile phones.

**Q: What if I prefer WhatsApp?**
A: No problem! Click "Book on WhatsApp" instead of "Book on App" and continue the conversation there.

**Q: Will my chat history be saved?**
A: Yes, if you use the in-app chat, your conversation history is saved automatically.

**Q: How do I submit a review?**
A: Click "Submit Your Review" from the homepage, rate your experience (1-5 stars), and optionally add text. Click submit!

**Q: When will my review appear on the website?**
A: Reviews require admin approval. Once approved, your review will appear in the "Patient Reviews" section.

---

### Admin FAQ

**Q: How do I reset my password?**
A: Password reset must be done through Firebase Console, not from the dashboard.

**Q: Why am I not receiving email notifications?**
A: Check your Settings → Notification Preferences:
- Ensure "Email Notifications" is ON
- Ensure specific alert types (New Chat Alerts, Review Alerts) are ON
- Verify ADMIN_EMAIL is configured in backend environment variables

**Q: Can multiple admins use the dashboard?**
A: Yes! Any user with Firebase admin credentials can log in. Each admin's notification preferences are stored separately based on their email.

**Q: How do I see which customer sent which message?**
A: Each chat session has a unique Customer ID. The customer ID is shown at the top of each conversation panel.

**Q: What happens if I reject a review?**
A: Rejected reviews are permanently deleted and cannot be recovered.

**Q: How do I change the email where notifications are sent?**
A: Update the `ADMIN_EMAIL` environment variable in the backend `.env` file. This requires backend access.

**Q: Can I disable auto-refresh?**
A: Yes! Go to Settings → System Configuration → Toggle "Auto Refresh" OFF.

**Q: How do I switch to dark mode?**
A: Go to Settings → System Configuration → Theme Preference → Select "Dark Mode" or "Auto". Note: This changes the theme for ALL users (customers, admins, visitors), not just you.

**Q: Can I delete a chat session?**
A: Yes! Select the chat session, click the "Delete" button, and confirm. The session will be soft-deleted (removed from view but recoverable from database).

**Q: What happens when I delete a chat session?**
A: The chat session and all its messages are marked as deleted. They no longer appear in the inbox but can be recovered from the database if needed. An audit log is created recording who deleted it and when.

**Q: Why do messages sometimes appear twice?**
A: This has been fixed! Messages now appear only once. The system uses API calls with Socket.IO broadcasting and duplicate prevention.

**Q: Can I use the admin dashboard on my phone?**
A: Yes! The admin dashboard is fully mobile responsive. Use the hamburger menu (☰) to open the sidebar on mobile devices.

**Q: What if I lose my chat history?**
A: Chat history is stored in the database and persists. If you don't see a session, check the search box or verify database connection.

---

## Support

### For Technical Issues

**Customers:**
- Use the in-app chat or WhatsApp to contact support
- Mention "Technical Issue" in your message

**Admins:**
- Check the browser console for error messages
- Verify environment variables are set correctly
- Review backend logs for API errors
- Ensure Firebase credentials are configured

### Contact Information

- **Phone**: +1 (215) 617-8614
- **Email**: purityfamilyservicextonpa@yahoo.com
- **WhatsApp**: Available 24/7
- **Website**: Visit the homepage and use the chat feature

---

## Security & Privacy

### Customer Privacy
- Chat sessions are encrypted end-to-end
- Your personal information is kept confidential
- Chat history is securely stored
- Reviews are moderated before public display

### Admin Security
- Admin dashboard requires Firebase authentication
- All admin endpoints are protected with JWT tokens
- Session data is stored securely in MongoDB
- Email notifications sent via encrypted SMTP

---

*Last Updated: January 2026*
*Version: 3.0*
