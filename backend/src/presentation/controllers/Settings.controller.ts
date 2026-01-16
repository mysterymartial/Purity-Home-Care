import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { notificationPreferencesService } from '../../services/NotificationPreferences.service';

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
}
