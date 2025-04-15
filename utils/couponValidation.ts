// utils/couponValidation.ts
import Coupon from "@/lib/database/models/coupon.model";
import { connectToDatabase } from "@/lib/database/connect";
import { Types } from "mongoose";

interface CouponValidationResult {
  isValid: boolean;
  message?: string;
  discount?: number;
}

export const validateCouponForCart = async (
  couponCode: string,
  productIds: string[]
): Promise<CouponValidationResult> => {
  try {
    await connectToDatabase();

    const coupon = await Coupon.findOne({
      coupon: couponCode.toUpperCase(),
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    if (!coupon) {
      return {
        isValid: false,
        message: "Coupon not found or expired",
      };
    }

    // Check if coupon is global or applies to all products in cart
    if (!coupon.isGlobal) {
      const validProductIds = productIds.map(id => new Types.ObjectId(id));
      const couponProductIds = coupon.applicableProducts.map((p: any) => p.toString());

      const allProductsValid = productIds.every(id => 
        couponProductIds.includes(id)
      );

      if (!allProductsValid) {
        return {
          isValid: false,
          message: "Coupon is not valid for all items in cart",
        };
      }
    }

    return {
      isValid: true,
      discount: coupon.discount,
    };
  } catch (error) {
    console.error("Coupon validation error:", error);
    return {
      isValid: false,
      message: "Error validating coupon",
    };
  }
};