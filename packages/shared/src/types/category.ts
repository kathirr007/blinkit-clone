export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  children?: ICategory[];
  sortOrder: number;
  isActive: boolean;
}
