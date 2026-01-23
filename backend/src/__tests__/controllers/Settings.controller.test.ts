/// <reference types="jest" />
import { Request, Response } from 'express';
import { SettingsController } from '../../presentation/controllers/Settings.controller';
import { AuthRequest } from '../../presentation/middleware/auth.middleware';
import { notificationPreferencesService } from '../../services/NotificationPreferences.service';
import { globalSettingsService } from '../../services/GlobalSettings.service';

jest.mock('../../services/NotificationPreferences.service', () => ({
  notificationPreferencesService: {
    getPreferences: jest.fn(),
    updatePreferences: jest.fn(),
  },
}));

jest.mock('../../services/GlobalSettings.service', () => ({
  globalSettingsService: {
    getTheme: jest.fn(),
    updateTheme: jest.fn(),
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

  describe('getGlobalTheme', () => {
    it('should return global theme successfully', async () => {
      (globalSettingsService.getTheme as jest.Mock).mockResolvedValue('dark');

      await settingsController.getGlobalTheme(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(globalSettingsService.getTheme).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({ theme: 'dark' });
    });

    it('should return light theme by default', async () => {
      (globalSettingsService.getTheme as jest.Mock).mockResolvedValue('light');

      await settingsController.getGlobalTheme(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({ theme: 'light' });
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Database error');
      (globalSettingsService.getTheme as jest.Mock).mockRejectedValue(error);

      await settingsController.getGlobalTheme(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('updateGlobalTheme', () => {
    it('should update theme to dark successfully', async () => {
      mockRequest.body = { theme: 'dark' };
      (globalSettingsService.updateTheme as jest.Mock).mockResolvedValue('dark');

      await settingsController.updateGlobalTheme(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(globalSettingsService.updateTheme).toHaveBeenCalledWith('dark');
      expect(mockResponse.json).toHaveBeenCalledWith({ theme: 'dark' });
    });

    it('should update theme to light successfully', async () => {
      mockRequest.body = { theme: 'light' };
      (globalSettingsService.updateTheme as jest.Mock).mockResolvedValue('light');

      await settingsController.updateGlobalTheme(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(globalSettingsService.updateTheme).toHaveBeenCalledWith('light');
      expect(mockResponse.json).toHaveBeenCalledWith({ theme: 'light' });
    });

    it('should update theme to auto successfully', async () => {
      mockRequest.body = { theme: 'auto' };
      (globalSettingsService.updateTheme as jest.Mock).mockResolvedValue('auto');

      await settingsController.updateGlobalTheme(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(globalSettingsService.updateTheme).toHaveBeenCalledWith('auto');
      expect(mockResponse.json).toHaveBeenCalledWith({ theme: 'auto' });
    });

    it('should reject invalid theme value', async () => {
      mockRequest.body = { theme: 'invalid' };

      await settingsController.updateGlobalTheme(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid theme. Must be light, dark, or auto',
      });
      expect(globalSettingsService.updateTheme).not.toHaveBeenCalled();
    });

    it('should reject missing theme value', async () => {
      mockRequest.body = {};

      await settingsController.updateGlobalTheme(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid theme. Must be light, dark, or auto',
      });
    });

    it('should handle errors gracefully', async () => {
      mockRequest.body = { theme: 'dark' };
      const error = new Error('Update failed');
      (globalSettingsService.updateTheme as jest.Mock).mockRejectedValue(error);

      await settingsController.updateGlobalTheme(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Update failed' });
    });
  });
});
