/**
 * Utility function to generate WhatsApp deep link
 * Formats phone number and creates WhatsApp link with pre-filled message
 */
export const getWhatsAppLink = (message: string = 'Hello, I want to book a service.'): string => {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '12156178614';
  // Remove all non-digit characters from phone number
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
};




