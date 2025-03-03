"use client";

import React, { useState } from "react";

// Importing UI components from custom UI library and icons from Lucide
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  CheckIcon,
  MapPinIcon,
  TicketIcon,
  CreditCardIcon,
} from "lucide-react";
import Link from "next/link";

/**
 * Type for the steps in the checkout process, including title and icon.
 * This type defines each step and its respective icon for better readability and maintenance.
 */
type Steps = {
  title: string;
  icon: React.ReactNode;
};

/**
 * Array of steps to guide the user through the checkout process:
 * - Delivery Address
 * - Apply Coupon
 * - Choose Payment
 */
const steps: Steps[] = [
  { title: "Delivery Address", icon: <MapPinIcon className="h-5 w-5" /> },
  { title: "Apply Coupon", icon: <TicketIcon className="h-5 w-5" /> },
  { title: "Choose Payment", icon: <CreditCardIcon className="h-5 w-5" /> },
];

/**
 * Type for order items in the cart.
 * It defines the structure of each product in the cart, including:
 * - Name of the product
 * - Size
 * - Quantity
 * - Price
 * - Image URL
 */
type OrderItems = {
  name: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
};

/**
 * Example order items array, representing a sample list of products in the user's cart.
 * This data will typically come from an API or state in real-world applications.
 */
const orderItems: OrderItems[] = [
  {
    name: "High-End Fragrance Collection for Males",
    size: "300ml",
    quantity: 1,
    price: 999.0,
    image:
      "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727352106/2_upscaled_g6ibby.png",
  },
  {
    name: "High-End Fragrance Collection for Males",
    size: "200ml",
    quantity: 1,
    price: 799.0,
    image:
      "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727352106/1_upscaled_pku7p3.png",
  },
];

/**
 * Main CheckoutPage component for handling the checkout flow.
 * It includes multi-step navigation (delivery address, coupon, payment) and an order summary.
 */
const CheckoutPage = () => {
  // State to track the current step of the checkout process
  const [currentStep, setCurrentStep] = useState(0);

  // State for managing coupon input
  const [couponCode, setCouponCode] = useState("");

  // State for managing selected payment method
  const [paymentMethod, setPaymentMethod] = useState("");

  // Calculate subtotal by summing up the prices of all items in the cart
  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);

  // Static discount value (this can be dynamically calculated based on coupon logic)
  const discount = 600;

  // Calculate total by subtracting the discount from the subtotal
  const total = subtotal - discount;

  /**
   * Handle the "Next" button click to proceed to the next step in the checkout process.
   * Ensures that the current step is not beyond the last step.
   */
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  /**
   * Handle the "Back" button click to return to the previous step in the checkout process.
   */
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="heading mb-6 text-center">CHECKOUT</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left section for checkout steps */}
        <div className="lg:w-2/3 w-full px-4">
          {/* Render step indicators */}
          <div className="flex flex-col lg:flex-row mb-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-center mb-4 lg:mb-0 lg:flex-row flex-col lg:space-x-4"
              >
                {/* Step indicator circle with icon */}
                <div
                  className={`rounded-full p-2 ${
                    index <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                {/* Step title */}
                <div className="ml-0 lg:ml-4 lg:mr-8 text-center lg:text-left">
                  <p
                    className={`text-sm font-medium ${
                      index <= currentStep
                        ? "text-primary"
                        : "text-secondary-foreground"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {/* Connector line between steps */}
                {index < steps.length - 1 && (
                  <div className="h-0.5 w-8 bg-border mt-1 lg:mt-0 mr-0 lg:mr-4 hidden lg:block"></div>
                )}
              </div>
            ))}
          </div>

          {/* Render the current step's content */}
          <Card>
            <CardHeader>
              <CardTitle className="subHeading">
                {steps[currentStep].title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Step 1: Delivery Address Form */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  {/* Form for inputting the delivery address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="First Name" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Last Name" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" placeholder="Phone Number" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">Zip Code / Postal Code</Label>
                      <Input
                        id="zipCode"
                        placeholder="Zip Code / Postal Code"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="City" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="State" />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="Country"
                        defaultValue="India"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address1">Address 1</Label>
                    <Input id="address1" placeholder="Address 1" />
                  </div>
                  <div>
                    <Label htmlFor="address2">Address 2</Label>
                    <Input id="address2" placeholder="Address 2" />
                  </div>
                  <Button className="w-full" onClick={handleNext}>
                    Save Address
                  </Button>
                </div>
              )}

              {/* Step 2: Apply Coupon Code */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="couponCode">Enter Coupon Code</Label>
                    <Input
                      id="couponCode"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" onClick={handleNext}>
                    Apply Coupon
                  </Button>
                </div>
              )}

              {/* Step 3: Choose Payment Method */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  {/* Radio group for selecting payment method */}
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
               
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod">Cash On Delievery (COD)</Label>

                  </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="credit_card" id="credit_card" />
                        <Label htmlFor="credit_card">Credit Card</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="debit_card" id="debit_card" />
                        <Label htmlFor="debit_card">Debit Card</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="net_banking" id="net_banking" />
                        <Label htmlFor="net_banking">Net Banking</Label>
                      </div>
                    </div>
                  </RadioGroup>
                  <Button className="w-full" onClick={handleNext}>
                    Confirm Payment Method
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/order">Place Order</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation buttons for moving between steps */}
          <div className="mt-4 flex space-x-4 justify-center lg:justify-start">
            {currentStep > 0 && (
              <Button variant={"outline"} onClick={handlePrevious}>
                Back
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button variant={"outline"} onClick={handleNext}>
                Continue
              </Button>
            )}
          </div>
        </div>

        {/* Right section for order summary */}
        <div className="lg:w-1/3 w-full px-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Display each item in the cart */}
                {orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div className="flex space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 object-cover"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.size} - {item.quantity}x
                        </p>
                      </div>
                    </div>
                    <div className="font-medium">${item.price.toFixed(2)}</div>
                  </div>
                ))}
                {/* Display subtotal, discount, and total */}
                <div className="flex justify-between pt-4 border-t border-border">
                  <p>Subtotal</p>
                  <p>${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Discount</p>
                  <p>-${discount.toFixed(2)}</p>
                </div>
                <div className="flex justify-between font-bold">
                  <p>Total</p>
                  <p>${total.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;