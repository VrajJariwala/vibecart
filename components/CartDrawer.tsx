"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { X, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useAtom, useStore } from "jotai";
import { cartMenuState } from "./store";
const CartDrawer = () => {
  const [cartMenuOpen, setCartMenuOpen] = useAtom(cartMenuState, {
    store: useStore(),
  });
  const handleOnClickCartMenu = () => {
    setCartMenuOpen(true);
    console.log("cart", cartMenuOpen);
  };
  interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "High-End Fragrance Collection for Males",
      price: 1615,
      quantity: 4,
      image:
        "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727352106/2_upscaled_g6ibby.png",
    },
    {
      id: "2",
      name: "High-End Fragrance Collection for Males",
      price: 2300,
      quantity: 4,
      image:
        "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727352106/1_upscaled_pku7p3.png",
    },
  ]);
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };
  const updateQuantity = (id: string, newQuantity: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return (
    <div className="relative">
      <Sheet open={cartMenuOpen}>
        <SheetTrigger asChild>
          <Button
            onClick={() => handleOnClickCartMenu()}
            variant={"ghost"}
            size={"icon"}
            className="relative"
          >
            <ShoppingBag size={24} />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-black rounded-full">
              {cartItems.length}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[90%] max-w-[450px] sm:max-w-[540px]">
          <SheetHeader>
            <SheetTitle className="subHeading">CART</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            {cartItems.map((item) => (
              <div
                className="flex items-center space-x-4 border-b-2 pb-3"
                key={item.id}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-xs sm:text-sm tracking-wide">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Buy More Save More
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <button
                        className="p-1"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="p-1"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-semibold text-xs sm:text-base">
                      ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-2 w-[90%] mt-6  bg-white">
            <p className="text-sm text-gray-500">
              Tax included. Shipping calculated at checkout.
            </p>
            <Link href={"/checkout"}>
              <Button className="w-full mt-4 bg-black text-white hover:bg-gray-800">
                CHECKOUT - ₹{total.toFixed(2)}
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CartDrawer;