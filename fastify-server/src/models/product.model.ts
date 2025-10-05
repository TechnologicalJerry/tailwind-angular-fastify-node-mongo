export interface IProduct {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  isActive: boolean;
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductCreate {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images?: string[];
  createdBy: string;
}

export interface IProductUpdate {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  images?: string[];
  isActive?: boolean;
}

export interface IProductQuery {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
