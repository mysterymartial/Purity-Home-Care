/// <reference types="jest" />
import { globalSettingsService } from '../../services/GlobalSettings.service';
import { GlobalSettingsModel } from '../../persistent/models/GlobalSettings.model';

jest.mock('../../persistent/models/GlobalSettings.model');

describe('GlobalSettingsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTheme', () => {
    it('should return default theme when no settings exist', async () => {
      (GlobalSettingsModel.findOne as jest.Mock).mockResolvedValue(null);
      (GlobalSettingsModel.create as jest.Mock).mockResolvedValue({
        theme: 'light',
        save: jest.fn(),
      });

      const result = await globalSettingsService.getTheme();

      expect(result).toBe('light');
      expect(GlobalSettingsModel.create).toHaveBeenCalledWith({ theme: 'light' });
    });

    it('should return existing theme when settings exist', async () => {
      (GlobalSettingsModel.findOne as jest.Mock).mockResolvedValue({
        theme: 'dark',
      });

      const result = await globalSettingsService.getTheme();

      expect(result).toBe('dark');
      expect(GlobalSettingsModel.create).not.toHaveBeenCalled();
    });

    it('should return light theme on error', async () => {
      (GlobalSettingsModel.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      const result = await globalSettingsService.getTheme();

      expect(result).toBe('light');
    });

    it('should handle auto theme', async () => {
      (GlobalSettingsModel.findOne as jest.Mock).mockResolvedValue({
        theme: 'auto',
      });

      const result = await globalSettingsService.getTheme();

      expect(result).toBe('auto');
    });
  });

  describe('updateTheme', () => {
    it('should update existing theme', async () => {
      const mockSettings = {
        theme: 'light',
        save: jest.fn().mockResolvedValue(true),
      };

      (GlobalSettingsModel.findOne as jest.Mock).mockResolvedValue(mockSettings);

      const result = await globalSettingsService.updateTheme('dark');

      expect(result).toBe('dark');
      expect(mockSettings.theme).toBe('dark');
      expect(mockSettings.save).toHaveBeenCalled();
    });

    it('should create new settings if none exist', async () => {
      (GlobalSettingsModel.findOne as jest.Mock).mockResolvedValue(null);
      (GlobalSettingsModel.create as jest.Mock).mockResolvedValue({
        theme: 'dark',
      });

      const result = await globalSettingsService.updateTheme('dark');

      expect(result).toBe('dark');
      expect(GlobalSettingsModel.create).toHaveBeenCalledWith({ theme: 'dark' });
    });

    it('should handle theme update to auto', async () => {
      const mockSettings = {
        theme: 'light',
        save: jest.fn().mockResolvedValue(true),
      };

      (GlobalSettingsModel.findOne as jest.Mock).mockResolvedValue(mockSettings);

      const result = await globalSettingsService.updateTheme('auto');

      expect(result).toBe('auto');
      expect(mockSettings.theme).toBe('auto');
    });

    it('should throw error on update failure', async () => {
      const mockSettings = {
        theme: 'light',
        save: jest.fn().mockRejectedValue(new Error('Save failed')),
      };

      (GlobalSettingsModel.findOne as jest.Mock).mockResolvedValue(mockSettings);

      await expect(globalSettingsService.updateTheme('dark')).rejects.toThrow('Save failed');
    });
  });

  describe('getSettings', () => {
    it('should return settings object with theme', async () => {
      (GlobalSettingsModel.findOne as jest.Mock).mockResolvedValue({
        theme: 'dark',
      });

      const result = await globalSettingsService.getSettings();

      expect(result).toEqual({ theme: 'dark' });
    });

    it('should create default settings if none exist', async () => {
      (GlobalSettingsModel.findOne as jest.Mock).mockResolvedValue(null);
      (GlobalSettingsModel.create as jest.Mock).mockResolvedValue({
        theme: 'light',
      });

      const result = await globalSettingsService.getSettings();

      expect(result).toEqual({ theme: 'light' });
      expect(GlobalSettingsModel.create).toHaveBeenCalledWith({ theme: 'light' });
    });

    it('should return default theme on error', async () => {
      (GlobalSettingsModel.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      const result = await globalSettingsService.getSettings();

      expect(result).toEqual({ theme: 'light' });
    });
  });
});
