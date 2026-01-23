import { GlobalSettingsModel, IGlobalSettings } from '../persistent/models/GlobalSettings.model';

class GlobalSettingsService {
  async getTheme(): Promise<'light' | 'dark' | 'auto'> {
    try {
      let settings = await GlobalSettingsModel.findOne();
      
      // If no settings exist, create default
      if (!settings) {
        settings = await GlobalSettingsModel.create({ theme: 'light' });
      }
      
      return settings.theme;
    } catch (error) {
      console.error('Error getting global theme:', error);
      return 'light'; // Default fallback
    }
  }

  async updateTheme(theme: 'light' | 'dark' | 'auto'): Promise<'light' | 'dark' | 'auto'> {
    try {
      let settings = await GlobalSettingsModel.findOne();
      
      if (!settings) {
        settings = await GlobalSettingsModel.create({ theme });
      } else {
        settings.theme = theme;
        await settings.save();
      }
      
      return settings.theme;
    } catch (error) {
      console.error('Error updating global theme:', error);
      throw error;
    }
  }

  async getSettings(): Promise<{ theme: 'light' | 'dark' | 'auto' }> {
    try {
      let settings = await GlobalSettingsModel.findOne();
      
      if (!settings) {
        settings = await GlobalSettingsModel.create({ theme: 'light' });
      }
      
      return { theme: settings.theme };
    } catch (error) {
      console.error('Error getting global settings:', error);
      return { theme: 'light' }; // Default fallback
    }
  }
}

// Export singleton instance
export const globalSettingsService = new GlobalSettingsService();
