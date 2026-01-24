/**
 * Shared phone number used for WhatsApp chat and calls (same as NEXT_PUBLIC_WHATSAPP_NUMBER).
 */
const getWhatsAppPhone = (): string => {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '12156178614';
  return phoneNumber.replace(/\D/g, '');
};

/**
 * Utility function to generate WhatsApp deep link
 * Formats phone number and creates WhatsApp link with pre-filled message
 */
export const getWhatsAppLink = (message: string = 'Hello, I want to book a service.'): string => {
  const cleanNumber = getWhatsAppPhone();
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
};

/**
 * Returns a tel: link for the WhatsApp/chat number so the call button can dial it.
 */
export const getCallLink = (): string => {
  const cleanNumber = getWhatsAppPhone();
  return `tel:+${cleanNumber}`;
};




