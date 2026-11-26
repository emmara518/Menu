import { siteConfig } from '../config/siteConfig';
import { CartItem, MenuProduct, ProductSizeOption } from '../types/menu';

export interface WhatsAppOrderPayload {
  product: MenuProduct;
  selectedSize?: ProductSizeOption;
  quantity: number;
}

export function buildWhatsAppOrderMessage({
  product,
  selectedSize,
  quantity,
}: WhatsAppOrderPayload): string {
  const unitPrice = selectedSize ? selectedSize.price : product.price;
  const total = unitPrice * quantity;

  const lines: string[] = [
    `مرحباً ${siteConfig.brand.nameAr}، أود طلب:`,
    `• الصنف: ${product.name}`,
  ];

  if (product.supportsSizes && selectedSize) {
    lines.push(`• الحجم: ${selectedSize.label}`);
  }

  lines.push(`• الكمية: ${quantity}`);
  lines.push(`• سعر الوحدة: ${unitPrice} ${siteConfig.currency.symbolAr}`);

  if (quantity > 1) {
    lines.push(`• الإجمالي: ${total} ${siteConfig.currency.symbolAr}`);
  }

  return lines.join('\n');
}

export function buildWhatsAppCartMessage(items: CartItem[]): string {
  if (items.length === 0) return '';
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const lines: string[] = [`مرحباً ${siteConfig.brand.nameAr}، أود طلب الأصناف التالية:`];

  items.forEach((item, index) => {
    const sizeText =
      item.product.supportsSizes && item.selectedSize
        ? ` (${item.selectedSize.label})`
        : '';
    const lineTotal = item.unitPrice * item.quantity;
    lines.push(
      `${index + 1}. ${item.product.name}${sizeText} × ${item.quantity} — ${lineTotal} ${siteConfig.currency.symbolAr}`
    );
  });

  lines.push(`• الإجمالي الكلي: ${total} ${siteConfig.currency.symbolAr}`);
  return lines.join('\n');
}

export function getWhatsAppOrderUrl(message: string): string | null {
  const cleaned = siteConfig.whatsapp.phoneNumber.replace(/[^\d]/g, '');
  if (!cleaned) {
    return null;
  }
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppContactUrl(): string | null {
  const cleaned = siteConfig.whatsapp.phoneNumber.replace(/[^\d]/g, '');
  if (!cleaned) {
    return null;
  }
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(
    `مرحباً ${siteConfig.brand.nameAr}، لدي استفسار بخصوص المنيو.`
  )}`;
}
