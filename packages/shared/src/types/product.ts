export interface IProductImage {
  id: string;
  url: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface IProductVariant {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  isActive: boolean;
}

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  categoryId: string;
  brand?: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  unit: string;
  unitValue?: number;
  minOrderQty: number;
  maxOrderQty: number;
  isActive: boolean;
  isFeatured: boolean;
  avgRating: number;
  totalReviews: number;
  images: IProductImage[];
  variants?: IProductVariant[];
  inventory?: number;
  createdAt: string;
  updatedAt: string;
}
