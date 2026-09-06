import { Product } from "@/backend/db/schema";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}
