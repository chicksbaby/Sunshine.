/**
 * WhatsApp integration utility for Sunshine Squares.
 * Handles generation of prefilled WhatsApp order messages.
 */

export const DEFAULT_BUSINESS_WHATSAPP = '919876543210'; // Project default: +91 98765 43210

export function getCleanWhatsAppNumber(rawNumber?: string): string {
  if (!rawNumber) return DEFAULT_BUSINESS_WHATSAPP;
  const digits = rawNumber.replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  return digits.length > 0 ? digits : DEFAULT_BUSINESS_WHATSAPP;
}

export interface WhatsAppProductOrderParams {
  productName: string;
  price: number;
  quantity?: number;
  selectedColor?: string;
  customNote?: string;
  whatsappNumber?: string;
}

export function createWhatsAppProductOrderUrl({
  productName,
  price,
  quantity = 1,
  selectedColor,
  customNote,
  whatsappNumber,
}: WhatsAppProductOrderParams): string {
  const phone = getCleanWhatsAppNumber(whatsappNumber);
  const total = price * quantity;

  const lines = [
    `Hello Sunshine Squares! 🌼`,
    ``,
    `I would like to order this handmade piece:`,
    `🧵 *Product:* ${productName}`,
    `💰 *Price:* ₹${price} each`,
    `🔢 *Quantity:* ${quantity}`,
    `🏷️ *Total:* ₹${total}`,
  ];

  if (selectedColor && selectedColor !== 'Standard') {
    lines.push(`🎨 *Color/Shade:* ${selectedColor}`);
  }
  if (customNote && customNote.trim()) {
    lines.push(`📝 *Gift Note:* ${customNote.trim()}`);
  }

  lines.push(
    ``,
    `📌 *Note:* I understand this is an order enquiry and will be confirmed once you review availability and delivery details.`,
    ``,
    `Please let me know how to proceed with payment & delivery. Thank you! ♡`
  );

  const text = lines.join('\n');
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export interface WhatsAppCartOrderParams {
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    selectedColor?: string;
  }>;
  subtotal: number;
  whatsappNumber?: string;
  customerDetails?: {
    fullName?: string;
    mobile?: string;
    address?: string;
    city?: string;
    state?: string;
    pinCode?: string;
  };
}

export function createWhatsAppCartOrderUrl({
  items,
  subtotal,
  whatsappNumber,
  customerDetails,
}: WhatsAppCartOrderParams): string {
  const phone = getCleanWhatsAppNumber(whatsappNumber);

  const lines = [
    `Hello Sunshine Squares! 🌼`,
    ``,
    `I would like to place an order enquiry for the following handmade crochet items:`,
    ``,
  ];

  items.forEach((item, index) => {
    const colorStr = item.selectedColor && item.selectedColor !== 'Standard' ? ` | Shade: ${item.selectedColor}` : '';
    lines.push(
      `${index + 1}. *${item.name}* (Qty: ${item.quantity}${colorStr}) — ₹${item.price * item.quantity}`
    );
  });

  lines.push(``, `💰 *Estimated Items Total:* ₹${subtotal}`);

  if (customerDetails?.fullName) {
    lines.push(
      ``,
      `📦 *My Delivery Details:*`,
      `• Name: ${customerDetails.fullName}`,
      `• Mobile: ${customerDetails.mobile || 'Not specified'}`,
      `• Address: ${customerDetails.address || ''}, ${customerDetails.city || ''}, ${customerDetails.state || ''} - ${customerDetails.pinCode || ''}`
    );
  }

  lines.push(
    ``,
    `📌 *Note:* I understand this is an order enquiry until you confirm availability, shipping details, and estimated dispatch.`,
    ``,
    `Looking forward to hearing from you! ♡`
  );

  const text = lines.join('\n');
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
