/// <reference types="jest" />
import { Request, Response } from 'express';
import { SettingsController } from '../../presentation/controllers/Settings.controller';
import { AuthRequest } from '../../presentation/middleware/auth.middleware';
import { notificationPreferencesService } from '../../services/NotificationPreferences.service';

jest.mock('../../services/NotificationPreferences.service', () => ({
  notificationPreferencesService: {
    getPreferences: jest.fn(),
    updatePreferences: jest.fn(),
  },
}));

describe('SettingsController', () => {
  let settingsController: SettingsController;
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    settingsController = new SettingsController();

    mockRequest = {
      user: {
        email: 'admin@example.com',
        uid: 'test-uid',
      } as any,
    };

    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  describe('getNotificationPreferences', () => {
    it('should return notification preferences for admin', async () => {
      const mockPreferences = {
        emailNotifications: true,
        newChatAlerts: true,
        reviewAlerts: true,
      };

      (notificationPreferencesService.getPreferences as jest.Mock).mockReturnValue(mockPreferences);

      await settingsController.getNotificationPreferences(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(notificationPreferencesService.getPreferences).toHaveBeenCalledWith('admin@example.com');
      expect(mockResponse.json).toHaveBeenCalledWith(mockPreferences);
    });

    it('should return 401 if admin email is not found', async () => {
      mockRequest.user = {} as any;

      await settingsController.getNotificationPreferences(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Admin email not found' });
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Database error');
      (notificationPreferencesService.getPreferences as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await settingsController.getNotificationPreferences(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('updateNotificationPreferences', () => {
    it('should update notification preferences successfully', async () => {
      const updateData = {
        emailNotifications: false,
        newChatAlerts: true,
        reviewAlerts: false,
      };

      const updatedPreferences = {
        emailNotifications: false,
        newChatAlerts: true,
        reviewAlerts: false,
      };

      mockRequest.body = updateData;
      (notificationPreferencesService.updatePreferences as jest.Mock).mockReturnValue(updatedPreferences);

      await settingsController.updateNotificationPreferences(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(notificationPreferencesService.updatePreferences).toHaveBeenCalledWith(
        'admin@example.com',
        updateData
      );
      expect(mockResponse.json).toHaveBeenCalledWith(updatedPreferences);
    });

    it('should handle partial updates', async () => {
      const updateData = {
        emailNotifications: false,
      };

      const updatedPreferences = {
        emailNotifications: false,
        newChatAlerts: true,
        reviewAlerts: true,
      };

      mockRequest.body = updateData;
      (notificationPreferencesService.updatePreferences as jest.Mock).mockReturnValue(updatedPreferences);

      await settingsController.updateNotificationPreferences(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(notificationPreferencesService.updatePreferences).toHaveBeenCalledWith(
        'admin@example.com',
        updateData
      );
      expect(mockResponse.json).toHaveBeenCalledWith(updatedPreferences);
    });

    it('should return 401 if admin email is not found', async () => {
      mockRequest.user = {} as any;
      mockRequest.body = { emailNotifications: false };

      await settingsController.updateNotificationPreferences(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Admin email not found' });
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Update failed');
      mockRequest.body = { emailNotifications: false };
      (notificationPreferencesService.updatePreferences as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await settingsController.updateNotificationPreferences(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Update failed' });
    });
  });
});
