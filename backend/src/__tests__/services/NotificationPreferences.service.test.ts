/// <reference types="jest" />
import { notificationPreferencesService } from '../../services/NotificationPreferences.service';

describe('NotificationPreferencesService', () => {
  beforeEach(() => {
    // Clear the internal preferences map by creating a new instance
    // Since it's a singleton, we'll test the exported instance
    jest.clearAllMocks();
    
    // Set admin email for tests
    process.env.ADMIN_EMAIL = 'admin@example.com';
  });

  afterEach(() => {
    delete process.env.ADMIN_EMAIL;
  });

  describe('getPreferences', () => {
    it('should return default preferences when none are set', () => {
      const prefs = notificationPreferencesService.getPreferences('new-admin@example.com');
      
      expect(prefs).toEqual({
        emailNotifications: true,
        newChatAlerts: true,
        reviewAlerts: true,
      });
    });

    it('should return stored preferences when they exist', () => {
      notificationPreferencesService.updatePreferences('admin@example.com', {
        emailNotifications: false,
        newChatAlerts: true,
      });

      const prefs = notificationPreferencesService.getPreferences('admin@example.com');
      
      expect(prefs.emailNotifications).toBe(false);
      expect(prefs.newChatAlerts).toBe(true);
      expect(prefs.reviewAlerts).toBe(true); // Default value
    });
  });

  describe('updatePreferences', () => {
    it('should update preferences partially', () => {
      const updated = notificationPreferencesService.updatePreferences('admin@example.com', {
        emailNotifications: false,
      });

      expect(updated.emailNotifications).toBe(false);
      expect(updated.newChatAlerts).toBe(true); // Kept default
      expect(updated.reviewAlerts).toBe(true); // Kept default
    });

    it('should update all preferences', () => {
      const updated = notificationPreferencesService.updatePreferences('admin@example.com', {
        emailNotifications: false,
        newChatAlerts: false,
        reviewAlerts: false,
      });

      expect(updated).toEqual({
        emailNotifications: false,
        newChatAlerts: false,
        reviewAlerts: false,
      });
    });

    it('should merge with existing preferences', () => {
      notificationPreferencesService.updatePreferences('admin@example.com', {
        emailNotifications: false,
      });

      const updated = notificationPreferencesService.updatePreferences('admin@example.com', {
        newChatAlerts: false,
      });

      expect(updated.emailNotifications).toBe(false); // Previous value
      expect(updated.newChatAlerts).toBe(false); // New value
    });
  });

  describe('shouldSendEmail', () => {
    it('should return false if emailNotifications is disabled', () => {
      notificationPreferencesService.updatePreferences('admin@example.com', {
        emailNotifications: false,
        newChatAlerts: true,
      });

      const shouldSend = notificationPreferencesService.shouldSendEmail('admin@example.com', 'newChat');
      
      expect(shouldSend).toBe(false);
    });

    it('should return false if newChatAlerts is disabled for newChat', () => {
      notificationPreferencesService.updatePreferences('admin@example.com', {
        emailNotifications: true,
        newChatAlerts: false,
      });

      const shouldSend = notificationPreferencesService.shouldSendEmail('admin@example.com', 'newChat');
      
      expect(shouldSend).toBe(false);
    });

    it('should return false if newChatAlerts is disabled for newMessage', () => {
      notificationPreferencesService.updatePreferences('admin@example.com', {
        emailNotifications: true,
        newChatAlerts: false,
      });

      const shouldSend = notificationPreferencesService.shouldSendEmail('admin@example.com', 'newMessage');
      
      expect(shouldSend).toBe(false);
    });

    it('should return false if reviewAlerts is disabled for newReview', () => {
      notificationPreferencesService.updatePreferences('admin@example.com', {
        emailNotifications: true,
        reviewAlerts: false,
      });

      const shouldSend = notificationPreferencesService.shouldSendEmail('admin@example.com', 'newReview');
      
      expect(shouldSend).toBe(false);
    });

    it('should return true if all preferences are enabled for newChat', () => {
      notificationPreferencesService.updatePreferences('admin@example.com', {
        emailNotifications: true,
        newChatAlerts: true,
      });

      const shouldSend = notificationPreferencesService.shouldSendEmail('admin@example.com', 'newChat');
      
      expect(shouldSend).toBe(true);
    });

    it('should return true if all preferences are enabled for newMessage', () => {
      notificationPreferencesService.updatePreferences('admin@example.com', {
        emailNotifications: true,
        newChatAlerts: true,
      });

      const shouldSend = notificationPreferencesService.shouldSendEmail('admin@example.com', 'newMessage');
      
      expect(shouldSend).toBe(true);
    });

    it('should return true if all preferences are enabled for newReview', () => {
      notificationPreferencesService.updatePreferences('admin@example.com', {
        emailNotifications: true,
        reviewAlerts: true,
      });

      const shouldSend = notificationPreferencesService.shouldSendEmail('admin@example.com', 'newReview');
      
      expect(shouldSend).toBe(true);
    });

    it('should return default true for new admin email', () => {
      const shouldSend = notificationPreferencesService.shouldSendEmail('new-admin@example.com', 'newChat');
      
      expect(shouldSend).toBe(true);
    });
  });
});
