export type CategoryId =
  | 'hot-coffee'
  | 'iced-coffee'
  | 'fresh-juices'
  | 'desserts'
  | 'special-drinks';

export type ProductSizeKey = 'small' | 'medium' | 'large';

export interface ProductSizeOption {
  key: ProductSizeKey;
  label: 'صغير' | 'متوسط' | 'كبير';
  price: number;
}

export interface MenuCategory {
  id: CategoryId;
  name: string;
  image: string;
  accentTone?: string;
}

export interface MenuProduct {
  id: string;
  categoryId: CategoryId;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  featured?: boolean;
  supportsSizes: boolean;
  sizes?: ProductSizeOption[];
  supportsQuantity?: boolean;
}

export type AppScreen =
  | 'home'
  | 'categories'
  | 'products'
  | 'product-detail'
  | 'location';

export interface CartItem {
  key: string;
  product: MenuProduct;
  selectedSize?: ProductSizeOption;
  quantity: number;
  unitPrice: number;
}
