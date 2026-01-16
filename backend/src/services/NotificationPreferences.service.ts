// In-memory store for notification preferences
// Keyed by admin email address
interface NotificationPreferences {
  emailNotifications: boolean;
  newChatAlerts: boolean;
  reviewAlerts: boolean;
}

class NotificationPreferencesService {
  private preferences: Map<string, NotificationPreferences>;

  constructor() {
    this.preferences = new Map<string, NotificationPreferences>();
    
    // Default preferences - all enabled by default
    const defaultPreferences: NotificationPreferences = {
      emailNotifications: true,
      newChatAlerts: true,
      reviewAlerts: true,
    };
    
    // Set default for admin email if configured
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      this.preferences.set(adminEmail, defaultPreferences);
    }
  }

  getPreferences(adminEmail: string): NotificationPreferences {
    // If preferences exist, return them
    if (this.preferences.has(adminEmail)) {
      return this.preferences.get(adminEmail)!;
    }
    
    // Otherwise return defaults
    return {
      emailNotifications: true,
      newChatAlerts: true,
      reviewAlerts: true,
    };
  }

  updatePreferences(adminEmail: string, preferences: Partial<NotificationPreferences>): NotificationPreferences {
    const current = this.getPreferences(adminEmail);
    const updated = { ...current, ...preferences };
    this.preferences.set(adminEmail, updated);
    return updated;
  }

  shouldSendEmail(adminEmail: string, notificationType: 'newChat' | 'newMessage' | 'newReview'): boolean {
    const prefs = this.getPreferences(adminEmail);
    
    // Must have email notifications enabled
    if (!prefs.emailNotifications) {
      return false;
    }
    
    // Check specific notification type
    if (notificationType === 'newChat' && !prefs.newChatAlerts) {
      return false;
    }
    
    if (notificationType === 'newMessage' && !prefs.newChatAlerts) {
      return false;
    }
    
    if (notificationType === 'newReview' && !prefs.reviewAlerts) {
      return false;
    }
    
    return true;
  }
}

// Export singleton instance
export const notificationPreferencesService = new NotificationPreferencesService();
export type { NotificationPreferences };
