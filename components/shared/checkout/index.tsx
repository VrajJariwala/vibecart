"use client";
import { useEffect, useState } from "react";
import { MapPin, Ticket, CreditCard, CheckCircle, Loader } from "lucide-react";
import { useForm } from "@mantine/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { applyCoupon, saveAddress } from "@/lib/database/actions/user.actions";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { FaArrowAltCircleRight } from "react-icons/fa";
import {
  createOrder,
  createStripeOrder,
} from "@/lib/database/actions/order.actions";
import { getSavedCartForUser } from "@/lib/database/actions/cart.actions";
import DeliveryAddressForm from "./delivery.address.form";
import ApplyCouponForm from "./apply.coupon.form";

export default function CheckoutComponent() {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState<any>();
  const [address, setAddress] = useState<any>();
  const [coupon, setCoupon] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [couponError, setCouponError] = useState("");
  const [totalAfterDiscount, setTotalAfterDiscount] = useState("");
  const [discount, setDiscount] = useState(0);
  const [data, setData] = useState<any>([]);
  const [currentlyAppliedCoupon, setCurrentlyAppliedCoupon] = useState<string | null>(null);
  const [placeOrderLoading, setPlaceOrderLoading] = useState<boolean>(false);
  const [couponDetails, setCouponDetails] = useState<{
    discount: number;
    applicableTo?: "global" | "specific";
    discountAmount?: string;
  } | null>(null);

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      state: "",
      city: "",
      zipCode: "",
      address1: "",
      address2: "",
      country: "",
    },
    validate: {
      firstName: (value) => {
        if (value.trim().length < 3) {
          return "First name must be at least 3 letters";
        }
        if (/\d/.test(value)) {
          return "First name cannot contain numbers";
        }
        return null;
      },
      lastName: (value) => {
        if (value.trim().length < 2) {
          return "Last name must be at least 2 letters";
        }
        if (/\d/.test(value)) {
          return "Last name cannot contain numbers";
        }
        return null;
      },
      phoneNumber: (value) =>
        value.trim().length !== 10 ? "Phone Number must be exactly 10 digits" : null,
      state: (value) =>
        value.length < 2 ? "State must be at least 2 letters" : null,
      city: (value) =>
        value.length < 2 ? "City must be at least 2 letters" : null,
      zipCode: (value) =>
        value.length < 6 ? "Zip Code must be at least 6 characters." : null,
      address1: (value) =>
        value.length > 100 ? "Address 1 must not exceed 100 characters." : null,
      address2: (value) =>
        value.length > 100 ? "Address 2 must not exceed 100 characters." : null,
    },
  });

  const { userId } = useAuth();
  useEffect(() => {
    if (userId) {
      getSavedCartForUser(userId).then((res) => {
        setData(res?.cart);
        setUser(res?.user);
        setAddress(res?.address);
      });
    }
  }, [userId]);

  useEffect(() => {
    if (address && Object.keys(address).length > 0) {
      form.setValues({
        firstName: address.firstName || "",
        lastName: address.lastName || "",
        phoneNumber: address.phoneNumber || "",
        state: address.state || "",
        city: address.city || "",
        zipCode: address.zipCode || "",
        address1: address.address1 || "",
        address2: address.address2 || "",
        country: address.country || "",
      });
    }
  }, [address]);

  const cart = useCartStore((state: any) => state.cart.cartItems);
  const { emptyCart } = useCartStore();
  const totalSaved: number = cart.reduce((acc: any, curr: any) => {
    return acc + curr.saved * curr.qty;
  }, 0);
  const [subTotal, setSubtotal] = useState<number>(0);
  const carttotal = Number(subTotal + totalSaved).toFixed(0);
  const router = useRouter();

  useEffect(() => {
    if (user?.address) {
      setAddress(user?.address);
    }
    setSubtotal(
      cart.reduce((a: any, c: any) => a + c.price * c.qty, 0).toFixed(2)
    );
  }, [user?.address]);

  const isStepCompleted = (currentStep: number) => step > currentStep;
  const isActiveStep = (currentStep: number) => step === currentStep;

  const applyCouponHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!coupon) {
      setCouponError("Please enter a coupon code");
      return;
    }

    // Check if this exact coupon is already applied
    if (currentlyAppliedCoupon === coupon.toUpperCase()) {
      setCouponError("This coupon has already been applied");
      return;
    }

    try {
      const res = await applyCoupon(coupon, user._id);
      
      if (res.success) {
        setTotalAfterDiscount(res.totalAfterDiscount);
        setDiscount(res.discount);
        setCurrentlyAppliedCoupon(coupon.toUpperCase());
        setCouponError("");
        
        // Save additional coupon details
        setCouponDetails({
          discount: res.discount,
          applicableTo: res.applicableTo || "global",
          discountAmount: res.discountAmount
        });
        
        // Message based on coupon type
        const successMessage = res.applicableTo === "specific" 
          ? `Applied ${res.discount}% discount to eligible products` 
          : `Applied ${res.discount}% discount successfully`;
          
        toast.success(successMessage);
        nextStep();
      } else {
        setCouponError(res.message || "Invalid coupon code");
        toast.error(res.message || "Could not apply coupon");
      }
    } catch (err) {
      setCouponError("Failed to apply coupon");
      toast.error("Failed to apply coupon");
    }
  };

  const nextStep = () => setStep(step + 1);
  
  const prevStep = () => {
    if (step === 3) {
      setCouponError("");
      setCoupon("");
    }
    setStep(step - 1);
  };

  const resetCouponState = () => {
    setCurrentlyAppliedCoupon(null);
    setCoupon("");
    setCouponError("");
    setTotalAfterDiscount("");
    setDiscount(0);
    setCouponDetails(null);
  };

  const isDisabled =
    paymentMethod === "" || user?.address.firstName === "" || placeOrderLoading;

  const buttonText = () => {
    if (paymentMethod === "") {
      return "Please select the payment method";
    } else if (paymentMethod === "cod") {
      return "Place Order with COD";
    } else if (user?.address.firstName === "") {
      return "Please Add Billing Address";
    } else if (paymentMethod === "stripe") {
      return `Place Order with Stripe`;
    }
  };

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  const placeOrderHandler = async () => {
    try {
      setPlaceOrderLoading(true);

      const formErrors = form.validate();
      if (formErrors.hasErrors) {
        toast.error("Please correct the errors in the form before proceeding.");
        setPlaceOrderLoading(false);
        return;
      }

      if (paymentMethod === "") {
        toast.error("Please choose a payment method.");
        setPlaceOrderLoading(false);
        return;
      } else if (!user?.address.firstName) {
        toast.error("Please fill in all details in the billing address.");
        setPlaceOrderLoading(false);
        return;
      }

      if (paymentMethod === "stripe") {
        const response = await createStripeOrder(
          data?.products,
          user?.address,
          paymentMethod,
          totalAfterDiscount !== "" ? totalAfterDiscount : data?.cartTotal,
          data?.cartTotal,
          currentlyAppliedCoupon || "",
          user._id,
          totalSaved
        );

        if (response?.sessionUrl) {
          window.location.href = response.sessionUrl;
        } else {
          toast.error("Stripe session URL not found");
          throw new Error("Stripe session URL not found");
        }
      } else {
        const orderResponse = await createOrder(
          data?.products,
          user?.address,
          paymentMethod,
          totalAfterDiscount !== "" ? totalAfterDiscount : data?.cartTotal,
          data?.cartTotal,
          currentlyAppliedCoupon || "",
          user._id,
          totalSaved
        );
        if (orderResponse?.success) {
          emptyCart();
          router.replace(`/order/${orderResponse.orderId}`);
        } else {
          console.error("Order creation failed:", orderResponse?.message);
          toast.error(orderResponse?.message);
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setPlaceOrderLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 ">
      <h1 className="text-2xl font-bold mb-6 text-center">CHECKOUT</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <div className="relative flex items-center justify-between mb-8">
            {/* Stepper UI */}
            <div className="flex items-center w-full">
              <div className={`flex flex-col items-center`}>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isStepCompleted(1) || isActiveStep(1)
                      ? "bg-green-600 border-green-600 text-white"
                      : "border-gray-300 text-gray-300"
                  }`}
                >
                  {isStepCompleted(1) ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <MapPin className="w-6 h-6" />
                  )}
                </div>
                <span
                  className={`mt-2 ${
                    isStepCompleted(1) || isActiveStep(1)
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  Address
                </span>
              </div>
              <div
                className={`flex-1 h-1 mx-2 ${
                  isStepCompleted(1) ? "bg-green-600" : "bg-gray-300"
                }`}
              ></div>
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isStepCompleted(2) || isActiveStep(2)
                      ? "bg-green-600 border-green-600 text-white"
                      : "border-gray-300 text-gray-300"
                  }`}
                >
                  {isStepCompleted(2) ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Ticket className="w-6 h-6" />
                  )}
                </div>
                <span
                  className={`mt-2 ${
                    isStepCompleted(2) || isActiveStep(2)
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  Coupon
                </span>
              </div>
              <div
                className={`flex-1 h-1 mx-2 ${
                  isStepCompleted(2) ? "bg-green-600" : "bg-gray-300"
                }`}
              ></div>
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isStepCompleted(3) || isActiveStep(3)
                      ? "bg-green-600 border-green-600 text-white"
                      : "border-gray-300 text-gray-300"
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                </div>
                <span
                  className={`mt-2 ${
                    isStepCompleted(3) || isActiveStep(3)
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  Payment
                </span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <form
              onSubmit={form.onSubmit(async (values) => {
                await saveAddress({ ...values, active: true }, user._id)
                  .then((res) => {
                    setAddress(res.addresses);
                    toast.success("Successfully added address");
                    router.refresh();
                    nextStep();
                  })
                  .catch((err) => {
                    console.log(err);
                    toast.error(err);
                  });
              })}
              className="space-y-4"
            >
              <DeliveryAddressForm form={form} />
            </form>
          )}

          {step === 2 && (
            <form onSubmit={applyCouponHandler} className="space-y-4">
              <ApplyCouponForm
                setCoupon={setCoupon}
                couponError={couponError}
                isCouponApplied={currentlyAppliedCoupon !== null}
                couponCode={coupon}
                couponDetails={couponDetails || undefined}
              />
              {currentlyAppliedCoupon && (
                <div className="text-green-500 text-sm">
                  Applied coupon: {currentlyAppliedCoupon} (-{discount}%)
                </div>
              )}
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={resetCouponState}
                  disabled={!currentlyAppliedCoupon}
                >
                  Remove Coupon
                </Button>
                <Button 
                  type="submit" 
                  disabled={!coupon || (currentlyAppliedCoupon === coupon.toUpperCase())}
                >
                  {currentlyAppliedCoupon ? "Change Coupon" : "Apply Coupon"}
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold mb-4">
                Choose Payment Method
              </h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery (COD)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stripe" id="stripe" />
                  <Label htmlFor="stripe">Stripe</Label>
                </div>
              </RadioGroup>
            </form>
          )}

          <div className="mt-6 flex justify-between">
            {step > 1 && (
              <Button onClick={prevStep} variant="outline">
                Previous
              </Button>
            )}
           {step < 3 && (
              <Button onClick={nextStep} className="ml-auto">
                Continue
              </Button>
            )}
          </div>
        </div>

        <div className="w-full bg-gray-100 lg:w-1/3 lg:sticky top-[1rem] self-start">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {data.products?.map((i: any, index: number) => {
                // Check if this product is eligible for product-specific coupon
                const isEligibleForCoupon = couponDetails?.applicableTo === "specific" && 
                  currentlyAppliedCoupon && 
                  data?.products?.some((product: any) => {
                    const productId = product.product?._id?.toString();
                    return productId === i.product?._id?.toString();
                  });
                
                return (
                  <div className="flex items-center space-x-4" key={index}>
                    <img
                      src={i.image}
                      alt={i.name}
                      className="w-20 h-20 object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-sm">{i.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Size: {i.size}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {i.qty}
                      </p>
                      <p className="font-semibold text-sm">
                        ₹ {i.price} * {i.qty} = ₹{i.price * i.qty}
                      </p>
                      {isEligibleForCoupon && (
                        <div className="mt-1">
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            Eligible for {couponDetails.discount}% off
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between">
                <span>
                  Subtotal ({data && data?.products?.length}{" "}
                  {data && data?.products?.length === 1 ? "Item" : "Items"}):
                </span>
                <span>
                  <strong>₹ {carttotal}</strong>
                </span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Cart Discount:</span>
                <span>
                  <strong>- ₹ {totalSaved}</strong>
                </span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Shipping Charges:</span>
                <span>Free</span>
              </div>
              <div
                className={`flex justify-between ${
                  totalAfterDiscount !== ""
                    ? "text-sm"
                    : "text-lg font-semibold"
                }`}
              >
                <span>
                  {totalAfterDiscount !== ""
                    ? "Total before coupon: "
                    : "Total: "}{" "}
                </span>
                <span>₹ {data?.cartTotal}</span>
              </div>
              <div className="mt-[10px] flex flex-col gap-[5px]">
                {discount > 0 && (
                  <span className="discount bg-green-700 text-white p-[5px] text-[14px] border flex justify-between border-[#cccccc17]">
                    {couponDetails?.applicableTo === "specific" 
                      ? "Coupon applied to eligible products:" 
                      : "Coupon applied:"}{" "}
                    <b className="text-[15px]">- {discount}%</b>
                  </span>
                )}
                {couponDetails?.applicableTo === "specific" && couponDetails?.discountAmount && (
                  <span className="discount bg-green-100 text-green-800 p-[5px] text-[14px] border flex justify-between border-[#cccccc17]">
                    Discount amount:{" "}
                    <b className="text-[15px]">₹ {couponDetails.discountAmount}</b>
                  </span>
                )}
                {totalAfterDiscount && totalAfterDiscount !== "" && (
                  <span className="p-[5px] text-lg flex justify-between border border-[#cccccc17]">
                    Total after Discount:{" "}
                    <b className="text-[15px]">₹ {totalAfterDiscount}</b>
                  </span>
                )}
              </div>
            </div>

            <Button
              onClick={placeOrderHandler}
              disabled={isDisabled}
              className={`mt-[1rem] flex justify-center pt-[10px] gap-[10px] disabled:bg-[#ccc] w-full h-[45px] bg-green-700 text-white ${
                isDisabled ? "bg-theme_light cursor-not-allowed" : ""
              }`}
            >
              {placeOrderLoading ? (
                <div className="flex gap-[10px]">
                  <Loader className="animate-spin" /> Loading...
                </div>
              ) : (
                buttonText()
              )}
              <FaArrowAltCircleRight size={25} color="white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}