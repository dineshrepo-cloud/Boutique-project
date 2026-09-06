import { CartItem } from "@/ui/features/cart/types";

export type PaymentMethodType = "card" | "wire" | "wallet" | "crypto";

export interface CardDetails {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  saveToVault: boolean;
}

export interface CustomerBillingDetails {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
  specialInstructions?: string;
}

export interface PaymentProcessingPayload {
  paymentMethod: PaymentMethodType;
  billingDetails: CustomerBillingDetails;
  cardDetails?: CardDetails;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  promoDiscount?: number;
}

export interface PaymentReceipt {
  orderNumber: string;
  transactionId: string;
  timestamp: string;
  paymentMethod: PaymentMethodType;
  totalAmount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  status: "settled" | "wire_pending";
}
