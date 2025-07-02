
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  ugx_price: number;
  usd_price: number;
  stock_quantity: number;
  inStock: boolean;
  bestseller: boolean;
  rating: number;
  review_count: number;
  vendor: string;
  featured: boolean;
  featured_image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  brand: string;
  material: string;
  care_instructions: string[];
}
