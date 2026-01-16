import nodemailer from 'nodemailer';
import { notificationPreferencesService } from './NotificationPreferences.service';

export class EmailService {
  private transporter: nodemailer.Transporter;
  private adminEmail: string;

  constructor() {
    this.adminEmail = process.env.ADMIN_EMAIL || '';
    
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  async sendNewChatNotification(sessionId: string, customerId: string): Promise<void> {
    if (!this.adminEmail) {
      console.warn('Admin email not configured. Skipping email notification.');
      return;
    }

    // Check notification preferences
    if (!notificationPreferencesService.shouldSendEmail(this.adminEmail, 'newChat')) {
      return; // Don't send if disabled by admin preferences
    }

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER || '',
        to: this.adminEmail,
        subject: 'New Chat Session Created - Purity Home Care',
        html: `
          <h2>New Chat Session Alert</h2>
          <p>A new chat session has been created on the Purity Home Care platform.</p>
          <p><strong>Session ID:</strong> ${sessionId}</p>
          <p><strong>Customer ID:</strong> ${customerId}</p>
          <p><strong>Status:</strong> Pending</p>
          <p>Please log into the admin dashboard to respond to this customer.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This is an automated notification from Purity Home Care.</p>
        `,
      });
      console.log('✅ New chat notification email sent successfully');
    } catch (error) {
      console.error('❌ Failed to send new chat notification email:', error);
      // Don't throw - email failure shouldn't break the application
    }
  }

  async sendNewMessageNotification(sessionId: string, customerId: string, messageContent: string): Promise<void> {
    if (!this.adminEmail) {
      console.warn('Admin email not configured. Skipping email notification.');
      return;
    }

    // Check notification preferences
    if (!notificationPreferencesService.shouldSendEmail(this.adminEmail, 'newMessage')) {
      return; // Don't send if disabled by admin preferences
    }

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER || '',
        to: this.adminEmail,
        subject: 'New Customer Message - Purity Home Care',
        html: `
          <h2>New Message from Customer</h2>
          <p>You have received a new message from a customer.</p>
          <p><strong>Session ID:</strong> ${sessionId}</p>
          <p><strong>Customer ID:</strong> ${customerId}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #0d9488; margin: 10px 0;">
            ${messageContent}
          </div>
          <p>Please log into the admin dashboard to respond.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This is an automated notification from Purity Home Care.</p>
        `,
      });
      console.log('✅ New message notification email sent successfully');
    } catch (error) {
      console.error('❌ Failed to send new message notification email:', error);
      // Don't throw - email failure shouldn't break the application
    }
  }

  async sendNewReviewNotification(reviewId: string, rating: number, text?: string): Promise<void> {
    if (!this.adminEmail) {
      console.warn('Admin email not configured. Skipping email notification.');
      return;
    }

    // Check notification preferences
    if (!notificationPreferencesService.shouldSendEmail(this.adminEmail, 'newReview')) {
      return; // Don't send if disabled by admin preferences
    }

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER || '',
        to: this.adminEmail,
        subject: 'New Review Submitted - Purity Home Care',
        html: `
          <h2>New Review Alert</h2>
          <p>A new review has been submitted on the Purity Home Care platform.</p>
          <p><strong>Review ID:</strong> ${reviewId}</p>
          <p><strong>Rating:</strong> ${rating}/5 ${'⭐'.repeat(rating)}</p>
          ${text ? `<p><strong>Review Text:</strong></p><div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #0d9488; margin: 10px 0;">${text}</div>` : '<p><em>No review text provided.</em></p>'}
          <p><strong>Status:</strong> Pending Approval</p>
          <p>Please log into the admin dashboard to review and approve this review.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This is an automated notification from Purity Home Care.</p>
        `,
      });
      console.log('✅ New review notification email sent successfully');
    } catch (error) {
      console.error('❌ Failed to send new review notification email:', error);
      // Don't throw - email failure shouldn't break the application
    }
  }
}
