import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useFormStatus } from "react-dom";

const DeliveryAddressForm = ({ form }: { form: any }) => {
  const { pending } = useFormStatus();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label htmlFor="firstName">First Name</label>
          <Input
            id="firstName"
            placeholder="First Name"
            {...form.getInputProps("firstName")}
            onBlur={() => form.validateField("firstName")} // Validate on blur
            required
          />
          {form.errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{form.errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName">Last Name</label>
          <Input
            id="lastName"
            placeholder="Last Name"
            {...form.getInputProps("lastName")}
            onBlur={() => form.validateField("lastName")} // Validate on blur
            required
          />
          {form.errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{form.errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phone">Phone Number</label>
        <Input
          id="phone"
          placeholder="Phone Number"
          {...form.getInputProps("phoneNumber")}
          onBlur={() => form.validateField("phoneNumber")} // Validate on blur
          required
        />
        {form.errors.phoneNumber && (
          <p className="text-red-500 text-sm mt-1">{form.errors.phoneNumber}</p>
        )}
      </div>

      {/* State */}
      <div>
        <label htmlFor="state">State</label>
        <Input
          id="state"
          placeholder="State"
          {...form.getInputProps("state")}
          onBlur={() => form.validateField("state")} // Validate on blur
          required
        />
        {form.errors.state && (
          <p className="text-red-500 text-sm mt-1">{form.errors.state}</p>
        )}
      </div>

      {/* City */}
      <div>
        <label htmlFor="city">City</label>
        <Input
          id="city"
          placeholder="City"
          {...form.getInputProps("city")}
          onBlur={() => form.validateField("city")} // Validate on blur
          required
        />
        {form.errors.city && (
          <p className="text-red-500 text-sm mt-1">{form.errors.city}</p>
        )}
      </div>

      {/* Zip Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="zipCode">Zip Code / Postal Code</label>
          <Input
            id="zipCode"
            placeholder="Zip Code / Postal Code"
            {...form.getInputProps("zipCode")}
            onBlur={() => form.validateField("zipCode")} // Validate on blur
            required
          />
          {form.errors.zipCode && (
            <p className="text-red-500 text-sm mt-1">{form.errors.zipCode}</p>
          )}
        </div>
      </div>

      {/* Address 1 */}
      <div>
        <label htmlFor="address1">Address 1</label>
        <Input
          id="address1"
          placeholder="Address 1"
          {...form.getInputProps("address1")}
          onBlur={() => form.validateField("address1")} // Validate on blur
          required
        />
        {form.errors.address1 && (
          <p className="text-red-500 text-sm mt-1">{form.errors.address1}</p>
        )}
      </div>

      {/* Address 2 */}
      <div>
        <label htmlFor="address2">Address 2</label>
        <Input
          id="address2"
          placeholder="Address 2"
          {...form.getInputProps("address2")}
          onBlur={() => form.validateField("address2")} // Validate on blur
          required
        />
        {form.errors.address2 && (
          <p className="text-red-500 text-sm mt-1">{form.errors.address2}</p>
        )}
      </div>

      {/* Country */}
      <div>
        <label htmlFor="country">Country</label>
        <Input
          id="country"
          placeholder="Country"
          {...form.getInputProps("country")}
          onBlur={() => form.validateField("country")} // Validate on blur
          required
        />
        {form.errors.country && (
          <p className="text-red-500 text-sm mt-1">{form.errors.country}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
};

export default DeliveryAddressForm;