"use server";

import { connectToDatabase } from "../connect";
import Order from "../models/order.model";
import User from "../models/user.model";
import Product from "../models/product.model";
import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import EmailTemplate from "@/lib/emails/index";
import { handleError } from "@/lib/utils";
import mongoose from "mongoose";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { unstable_cache } from "next/cache";
import { revalidatePath } from "next/cache";

const { ObjectId } = mongoose.Types;

// create an order
export async function createOrder(
  products: {
    product: string;
    name: string;
    image: string;
    size: string;
    qty: number;
    color: { color: string; image: string };
    price: number;
    status: string;
    productCompletedAt: Date | null;
    _id: string;
    vendor: { _id: string; name: string; email: string }; // Added vendor field
  }[],
  shippingAddress: any,
  paymentMethod: string,
  total: number,
  totalBeforeDiscount: number,
  couponApplied: string,
  userId: string,
  totalSaved: number
) {
  try {
    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      return {
        message: "User not found with provided ID!",
        success: false,
        orderId: null,
      };
    }

    const newOrder = await new Order({
      user: user._id,
      products,
      shippingAddress,
      paymentMethod,
      total,
      totalBeforeDiscount,
      couponApplied,
      totalSaved,
    }).save();

    // Send email confirmation
    let config = {
      service: "gmail",
      auth: {
        user: "jariwalabusiness20@gmail.com",
        pass: process.env.GOOGLE_APP_PASSWORD as string,
      },
    };
    let transporter = nodemailer.createTransport(config);
    let dataConfig = {
      from: config.auth.user,
      to: user.email,
      subject: "Order Confirmation - VibeCart",
      html: await render(EmailTemplate(newOrder)),
    };
    
    await transporter.sendMail(dataConfig);

    return {
      message: "Successfully placed Order. You should receive an email confirmation.",
      orderId: JSON.parse(JSON.stringify(newOrder._id)),
      success: true,
    };
  } catch (error) {
    handleError(error);
    return {
      message: "Failed to create order",
      success: false,
      orderId: null,
    };
  }
}

// get order details by its ID
export const getOrderDetailsById = unstable_cache(
  async (orderId: string) => {
    try {
      if (!ObjectId.isValid(orderId)) {
        redirect("/");
      }
      await connectToDatabase();
      const orderData = await Order.findById(orderId)
        .populate({ path: "user", model: User })
        .lean();
      if (!orderData) {
        return {
          message: "Order not found with this ID!",
          success: false,
          orderData: [],
        };
      }
      return {
        message: "Successfully grabbed data.",
        success: true,
        orderData: JSON.parse(JSON.stringify(orderData)),
      };
    } catch (error) {
      handleError(error);
      return {
        message: "Error fetching order details",
        success: false,
        orderData: [],
      };
    }
  },
  ["order_details"],
  {
    revalidate: 3,
  }
);

// create a stripe order instance
export async function createStripeOrder(
  products: {
    product: string;
    name: string;
    image: string;
    size: string;
    qty: number;
    color: { color: string; image: string };
    price: number;
    status: string;
    productCompletedAt: Date | null;
    _id: string;
    vendor: { _id: string; name: string; email: string }; // Added vendor field
  }[],
  shippingAddress: any,
  paymentMethod: string,
  total: number,
  totalBeforeDiscount: number,
  couponApplied: string,
  userId: string,
  totalSaved: number
) {
  try {
    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      return redirect("/sign-in");
    }

    const newOrder = await new Order({
      user: user._id,
      products,
      shippingAddress,
      paymentMethod,
      total,
      totalBeforeDiscount,
      couponApplied,
      totalSaved,
    }).save();

    const lineItems = products.map((item) => ({
      price_data: {
        currency: "inr",
        unit_amount: item.price * 100,
        product_data: {
          name: item.name,
          images: [item.image],
        },
      },
      quantity: item.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url:
        process.env.NODE_ENV === "development"
          ? `http://localhost:3000/order/${newOrder._id}`
          : `https://vibecart-jet.vercel.app/order/${newOrder._id}`,
      cancel_url:
        process.env.NODE_ENV === "development"
          ? `http://localhost:3000/payment/cancel`
          : `https://vibecart-jet.vercel.app/payment/cancel`,
      metadata: { orderId: newOrder._id.toString() },
    });

    return { sessionUrl: session.url };
  } catch (error) {
    handleError(error);
    return { sessionUrl: null };
  }
}

// Cancel a product in an order
export async function cancelOrderProduct(
  orderId: string,
  productId: string,
  reason: string,
  userId?: string // Optional user ID for verification
) {
  try {
    await connectToDatabase();

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Verify user owns the order if userId is provided
    if (userId && order.user.toString() !== userId) {
      throw new Error("Unauthorized to cancel this order");
    }

    // Find the product in the order
    const productIndex = order.products.findIndex(
      (p: any) => p._id.toString() === productId
    );
    
    if (productIndex === -1) {
      throw new Error("Product not found in order");
    }

    const product = order.products[productIndex];

    // Check if product can be cancelled (only if status is "Not Processed")
    if (product.status !== "Not Processed") {
      throw new Error("Product cannot be cancelled at this stage");
    }

    // Update product status and add cancellation details
    product.status = "Cancelled";
    product.cancellationReason = reason;
    product.cancelledAt = new Date();

    // Restore product quantity if needed
    const mainProduct = await Product.findById(product.product);
    if (mainProduct) {
      const subProduct = mainProduct.subProducts[0];
      const size = subProduct.sizes.find(
        (s: any) => s.size === product.size
      );
      if (size) {
        size.qty += product.qty;
        await mainProduct.save();
      }
    }

    // Check if all products are cancelled
    const allCancelled = order.products.every(
      (p: any) => p.status === "Cancelled"
    );
    if (allCancelled) {
      order.status = "Cancelled";
    }

    await order.save();

    // Send cancellation email if user ID is provided
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        let config = {
          service: "gmail",
          auth: {
            user: "jariwalabusiness20@gmail.com",
            pass: process.env.GOOGLE_APP_PASSWORD as string,
          },
        };
        let transporter = nodemailer.createTransport(config);
        let dataConfig = {
          from: config.auth.user,
          to: user.email,
          subject: "Product Cancellation Confirmation - VibeCart",
          html: `<p>Your product "${product.name}" from order #${order.orderNumber} has been cancelled.</p>
                 <p>Reason: ${reason}</p>
                 <p>If you didn't request this cancellation, please contact support.</p>`,
        };
        await transporter.sendMail(dataConfig);
      }
    }

    // Revalidate relevant paths
    revalidatePath(`/order/${orderId}`);
    revalidatePath("/orders");
    revalidatePath("/vendor/orders");

    return { success: true, message: "Product cancelled successfully" };
  } catch (error) {
    handleError(error);
    return { success: false, message: "Failed to cancel product" };
  }
}

// Get orders for a specific vendor
export const getVendorOrders = unstable_cache(
  async (vendorId: string) => {
    try {
      await connectToDatabase();
      const orders = await Order.find({ "products.vendor._id": vendorId })
        .populate({ path: "user", model: User, select: "name email" })
        .sort({ createdAt: -1 })
        .lean();

      // Filter to only include vendor's products
      const filteredOrders = orders.map(order => ({
        ...order,
        products: order.products.filter((product: any) => 
          product.vendor?._id.toString() === vendorId
        )
      }));

      return JSON.parse(JSON.stringify(filteredOrders));
    } catch (error) {
      handleError(error);
      return [];
    }
  },
  ["vendor_orders"],
  {
    revalidate: 60, // Revalidate every minute
    tags: ["vendor_orders"]
  }
);

// Update order status (for admin/vendor)
export async function updateOrderStatus(
  orderId: string,
  productId: string,
  status: string,
  userId: string,
  userRole: "admin" | "vendor"
) {
  try {
    await connectToDatabase();

    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Find the product in the order
    const productIndex = order.products.findIndex(
      (p: any) => p._id.toString() === productId
    );
    
    if (productIndex === -1) {
      throw new Error("Product not found in order");
    }

    const product = order.products[productIndex];

    // Vendor can only update their own products
    if (userRole === "vendor" && product.vendor?._id.toString() !== userId) {
      throw new Error("Unauthorized to update this product");
    }

    // Update product status
    product.status = status;
    
    // Set completion date if status is "Completed"
    if (status === "Completed") {
      product.productCompletedAt = new Date();
    }

    // Check if all products are completed
    if (order.products.every((p: any) => p.status === "Completed")) {
      order.status = "Completed";
    }

    await order.save();

    // Revalidate relevant paths
    revalidatePath(`/order/${orderId}`);
    revalidatePath("/admin/orders");
    revalidatePath("/vendor/orders");

    return { success: true, message: "Order status updated successfully" };
  } catch (error) {
    handleError(error);
    return { success: false, message: "Failed to update order status" };
  }
}