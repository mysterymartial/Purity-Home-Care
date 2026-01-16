import { getWhatsAppLink } from '@/lib/whatsapp';

describe('WhatsApp Utility', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should generate WhatsApp link with default message', () => {
    const link = getWhatsAppLink();
    expect(link).toContain('wa.me');
    expect(link).toContain('text=');
  });

  it('should generate WhatsApp link with custom message', () => {
    const message = 'Custom booking message';
    const link = getWhatsAppLink(message);
    expect(link).toContain('wa.me');
    expect(link).toContain(encodeURIComponent(message));
  });

  it('should use environment variable for phone number', () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = '+1 (215) 617-8614';
    const link = getWhatsAppLink('Test');
    expect(link).toContain('12156178614');
  });

  it('should clean phone number formatting', () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = '+1 (215) 617-8614';
    const link = getWhatsAppLink();
    expect(link).not.toContain('+');
    expect(link).not.toContain('(');
    expect(link).not.toContain(')');
    expect(link).not.toContain(' ');
  });

  it('should use default number when env var not set', () => {
    delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const link = getWhatsAppLink();
    expect(link).toContain('12156178614');
  });

  it('should handle phone number with only digits', () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = '12156178614';
    const link = getWhatsAppLink();
    expect(link).toContain('12156178614');
  });
});




