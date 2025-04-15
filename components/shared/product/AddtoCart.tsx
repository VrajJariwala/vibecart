"use client";
import { Button } from "@/components/ui/button";
import { getProductDetailsById } from "@/lib/database/actions/product.actions";
import { useCartStore } from "@/store/cart";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaCheckCircle } from "react-icons/fa";
import { useAtom, useStore } from "jotai";
import { quantityState } from "../jotai/store";
import { handleError } from "@/lib/utils";

const AddtoCartButton = ({ product, size }: { product: any; size: number }) => {
  const [loading, setLoading] = useState(false);
  const frontendSize = useSearchParams().get("size");
  const [qty] = useAtom(quantityState, { store: useStore() });
  const { addToCart, updateCart } = useCartStore();
  const cart = useCartStore((state: any) => state.cart.cartItems);

  // Rehydrate cart store on mount
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  const addtoCartHandler = async () => {
    if (!frontendSize) {
      toast.error("Please select a size first!", {
        style: { backgroundColor: "#FBE0E2" },
      });
      return;
    }

    setLoading(true);
    try {
      const data = await getProductDetailsById(
        product._id,
        product.style,
        frontendSize
      );

      // Validate stock availability
      if (data.quantity < 1) {
        toast.error("This product is currently out of stock!");
        return;
      }

      if (qty > data.quantity) {
        toast.error(`Only ${data.quantity} items available in stock!`);
        return;
      }

      const _uid = `${data._id}_${product.style}_${frontendSize}`;
      const existingItem = cart.find((p: any) => p._uid === _uid);

      // Prepare success toast
      const successToast = () => (
        <div className="flex items-center gap-4">
          <Image 
            src={data.images[0].url} 
            alt={product.name} 
            height={40} 
            width={40} 
            className="rounded"
          />
          <div className="flex items-center gap-2 text-white">
            <span>
              {existingItem ? "Cart updated successfully" : "Added to cart"}
            </span>
            <FaCheckCircle size={18} />
          </div>
        </div>
      );

      if (existingItem) {
        // Update existing item in cart
        const newCart = cart.map((p: any) => 
          p._uid === _uid ? { ...p, qty } : p
        );
        updateCart(newCart);
        toast.success(successToast, {
          style: { backgroundColor: "black" }
        });
      } else {
        // Add new item to cart
        addToCart({
          ...data,
          qty,
          size: data.size,
          _uid,
          name: product.name, // Ensure product name is included
          price: data.price,   // Ensure price is included
        });
        toast.success(successToast, {
          style: { backgroundColor: "black" }
        });
      }
    } catch (error) {
      handleError(error);
      toast.error("Failed to update cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Determine if button should be disabled
  const isDisabled = 
    product.quantity < 1 || 
    qty === 0 || 
    !frontendSize ||
    loading;

  return (
    <Button
      onClick={addtoCartHandler}
      disabled={isDisabled}
      className={`w-full bg-black text-white hover:bg-gray-800 py-[30px] transition-colors ${
        isDisabled ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        product.quantity < 1 ? "OUT OF STOCK" : "ADD TO CART"
      )}
    </Button>
  );
};

export default AddtoCartButton;