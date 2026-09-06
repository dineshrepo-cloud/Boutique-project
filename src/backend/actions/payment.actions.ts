"use server";

import { revalidatePath } from "next/cache";
import { dataLayer } from "@/backend/db";
import { PaymentProcessingPayload, PaymentReceipt } from "@/backend/types";

export async function processPaymentAction(
  payload: PaymentProcessingPayload
): Promise<{ success: boolean; receipt?: PaymentReceipt; error?: string }> {
  try {
    // Basic validation
    if (!payload.items || payload.items.length === 0) {
      return { success: false, error: "Your cart is empty." };
    }
    if (!payload.billingDetails.fullName || !payload.billingDetails.email) {
      return { success: false, error: "Please provide your full name and email." };
    }

    // Simulate luxury encryption handshake & bank settlement latency
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const orderNumber = "MA-" + Math.floor(100000 + Math.random() * 900000);
    const transactionId = "TXN-SEC-" + Math.random().toString(36).substring(2, 11).toUpperCase();

    const orderStatus = payload.paymentMethod === "wire" ? "processing" : "fulfilled";

    // 1. Persist to Neon PostgreSQL Database / Mock Repository
    await dataLayer.createOrder({
      orderNumber,
      customerName: payload.billingDetails.fullName,
      customerEmail: payload.billingDetails.email,
      totalAmount: payload.totalAmount,
      status: orderStatus,
      items: JSON.stringify(
        payload.items.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        }))
      ),
    });

    // 2. Decrement stock for purchased pieces
    for (const item of payload.items) {
      const current = await dataLayer.getProductBySlug(item.product.slug);
      if (current) {
        const nextStock = Math.max(0, current.stock - item.quantity);
        await dataLayer.updateStock(item.product.id, nextStock);
      }
    }

    // 3. Cache revalidation for fresh stock across all clients
    revalidatePath("/admin");
    revalidatePath("/products");
    revalidatePath("/checkout");

    const receipt: PaymentReceipt = {
      orderNumber,
      transactionId,
      timestamp: new Date().toISOString(),
      paymentMethod: payload.paymentMethod,
      totalAmount: payload.totalAmount,
      currency: "INR",
      customerName: payload.billingDetails.fullName,
      customerEmail: payload.billingDetails.email,
      items: payload.items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
      })),
      status: payload.paymentMethod === "wire" ? "wire_pending" : "settled",
    };

    return { success: true, receipt };
  } catch (err: any) {
    return { success: false, error: err.message || "Payment authorization failed." };
  }
}
