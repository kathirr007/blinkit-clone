import type { IProduct, IProductVariant } from './product';

export interface ICartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product?: IProduct;
  variant?: IProductVariant;
}

export interface ICart {
  id: string;
  userId: string;
  items: ICartItem[];
  createdAt: string;
  updatedAt: string;
}
