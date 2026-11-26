/**
 * Centralized brand, WhatsApp, and branch configuration for Ben El-Tayyib Coffee.
 * Update placeholder values below with verified business details before publishing.
 */

export interface BranchInfo {
  branchName: string;
  address: string;
  openingHours: string;
  /**
   * Set the verified Google Maps share URL (e.g. 'https://maps.app.goo.gl/...').
   * Leave empty until the official branch coordinates/link are confirmed.
   */
  googleMapsUrl: string;
  isPlaceholder: boolean;
  storefrontIsTemporary: boolean;
}

export const siteConfig = {
  brand: {
    nameAr: 'بن الطيب',
    nameEn: 'Ben El-Tayyib',
    fullNameEn: 'Ben El-Tayyib Coffee',
    tagline: 'بن يعني الطيب',
    /**
     * Optional path to the original standalone logo file when supplied (e.g. '/assets/logo.svg').
     * When null, renders the typographic Arabic & Latin lockup matching the approved design system.
     */
    logoUrl: null as string | null,
  },
  currency: {
    code: 'EGP',
    symbolAr: 'ج.م',
  },
  whatsapp: {
    /**
     * Add the international WhatsApp number without '+' or spaces (e.g., '201012345678').
     * Leave empty until the official number is provided.
     */
    phoneNumber: '',
    displayPlaceholder: 'رقم واتساب قيد التحديث (بيانات مؤقتة)',
  },
  branch: {
    branchName: 'الفرع الرئيسي (بيانات مؤقتة)',
    address: 'عنوان الفرع يُحدَّث لاحقاً من الإعدادات',
    openingHours: 'مواعيد العمل تُحدَّث لاحقاً من الإعدادات',
    googleMapsUrl: '',
    isPlaceholder: true,
    storefrontIsTemporary: true,
  } satisfies BranchInfo,
  assets: {
    heroCoffeeCup: '/src/assets/images/hero_cup_nobg.png',
    branchStorefront: '/src/assets/images/branch_storefront_1795658039855.jpg',
  },
} as const;
