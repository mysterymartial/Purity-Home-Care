import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { notificationPreferencesService } from '../../services/NotificationPreferences.service';
import { globalSettingsService } from '../../services/GlobalSettings.service';

export class SettingsController {
  getNotificationPreferences = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const adminEmail = req.user?.email;
      if (!adminEmail) {
        res.status(401).json({ error: 'Admin email not found' });
        return;
      }

      const preferences = notificationPreferencesService.getPreferences(adminEmail);
      res.json(preferences);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  updateNotificationPreferences = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const adminEmail = req.user?.email;
      if (!adminEmail) {
        res.status(401).json({ error: 'Admin email not found' });
        return;
      }

      const { emailNotifications, newChatAlerts, reviewAlerts } = req.body;

      const preferences = notificationPreferencesService.updatePreferences(adminEmail, {
        emailNotifications,
        newChatAlerts,
        reviewAlerts,
      });

      res.json(preferences);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getGlobalTheme = async (req: Request, res: Response): Promise<void> => {
    try {
      const theme = await globalSettingsService.getTheme();
      res.json({ theme });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  updateGlobalTheme = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { theme } = req.body;
      
      if (!theme || !['light', 'dark', 'auto'].includes(theme)) {
        res.status(400).json({ error: 'Invalid theme. Must be light, dark, or auto' });
        return;
      }

      const updatedTheme = await globalSettingsService.updateTheme(theme);
      res.json({ theme: updatedTheme });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
