"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import React, { useEffect } from "react";
import { quantityState } from "../jotai/store";
import { useAtom, useStore } from "jotai";
import { toast } from "sonner";

const QtyButtons = ({
  product,
  size,
  style,
}: {
  product: any;
  size: number;
  style: number;
}) => {
  const [qty, setQty] = useAtom(quantityState, {
    store: useStore(),
  });
  const availableQty = product.subProducts[0].sizes[size].qty;

  // Reset quantity when style changes
  useEffect(() => {
    setQty(1);
  }, [style, setQty]);

  // Validate quantity when size changes
  useEffect(() => {
    if (qty > availableQty) {
      setQty(availableQty);
      if (availableQty > 0) {
        toast.error(`Only ${availableQty} items available`);
      }
    }
  }, [size, availableQty, qty, setQty]);

  const increment = () => {
    if (qty < availableQty) {
      setQty(qty + 1);
    } else {
      toast.error(`Only ${availableQty} items available`);
    }
  };

  const decrement = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-0">
        <Button
          onClick={decrement}
          variant={"outline"}
          className="bg-[#F2F2F2] hover:bg-[#F2F2F2]/80"
          size={"icon"}
          disabled={qty <= 1 || availableQty <= 0}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center border-y-2 py-[6px]">
          {availableQty > 0 ? qty : 0}
        </span>
        <Button
          onClick={increment}
          variant={"outline"}
          className="bg-[#F2F2F2] hover:bg-[#F2F2F2]/80"
          size={"icon"}
          disabled={qty >= availableQty || availableQty <= 0}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {availableQty <= 0 ? (
        <span className="text-red-500 text-sm">Out of Stock</span>
      ) : qty >= availableQty ? (
        <span className="text-red-500 text-sm">Max quantity reached</span>
      ) : null}
    </div>
  );
};

export default QtyButtons;