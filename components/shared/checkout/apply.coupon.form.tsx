import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useFormStatus } from "react-dom";

interface ApplyCouponFormProps {
  setCoupon: (coupon: string) => void;
  couponError: string;
  isCouponApplied: boolean;
  couponCode: string;
  couponDetails?: {
    discount: number;
    applicableTo?: "global" | "specific";
    discountAmount?: string;
  };
}

const ApplyCouponForm: React.FC<ApplyCouponFormProps> = ({
  setCoupon,
  couponError,
  isCouponApplied,
  couponCode,
  couponDetails
}) => {
  const { pending } = useFormStatus();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Apply Coupon</h2>
      <div>
        <Label htmlFor="coupon">Coupon Code</Label>
        <Input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCoupon(e.target.value)}
          id="coupon"
          value={couponCode}
          placeholder={isCouponApplied ? "Coupon applied" : "Enter coupon code"}
          required
        />
      </div>
      <Button 
        type="submit" 
        disabled={pending || (!couponCode && isCouponApplied)}
        className="mt-2"
      >
        {pending ? "Processing..." : (isCouponApplied && couponCode === "") ? "Coupon Applied" : "Apply Coupon"}
      </Button>
      {couponError && (
        <div className="mt-2 text-red-500 text-sm">
          {couponError}
        </div>
      )}
      {isCouponApplied && !couponError && couponDetails && (
        <div className="mt-2 text-green-500 text-sm">
          <p>Coupon applied successfully! {couponDetails.discount}% discount</p>
          {couponDetails.applicableTo === "specific" && (
            <p className="text-xs text-gray-600 mt-1">
              Note: This coupon applies only to specific products in your cart
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplyCouponForm;