export interface Banner {
  id: string;
  label: string;
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  banner: Banner
}

export interface Product {
  id: string;
  category: Category;
  price: number;
  discountPrice: number;
  description: string;
  name: string;
  isFeatured: boolean;
  isAvailable: boolean;
  images: Image[]
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  discountPrice: number;
  quantity: number;
  image?: string;
  subtotal: number;
}

export interface Cart {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product: CartItem;
}

export interface Image {
  id: string;
  url: string;
}

export interface Payment {
  id: string;
  userId: string;
  paymentCode: string;
  totalPrice: number;
  status: number;
  paymentTime: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_address: string;
  snap_token?: string;
  redirect_url?: string;
}