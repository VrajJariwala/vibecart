"use client";

import { Button } from "@/components/ui/button";
import { CheckCircleIcon, ClockIcon, TruckIcon, XCircleIcon } from "lucide-react";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";
import { CancelProductModal } from "./CancelProductModal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

interface OrderProduct {
  _id: string;
  name: string;
  image: string;
  size: string;
  qty: number;
  price: number;
  status: "Not Processed" | "Processing" | "Dispatched" | "Cancelled" | "Completed";
  cancellationReason?: string;
  cancelledAt?: string;
}

interface OrderedProductDetailedViewProps {
  item: OrderProduct;
  orderId: string;
  onProductCancel?: (productId: string, reason: string) => void;
}

const OrderedProductDetailedView = ({
  item,
  orderId,
  onProductCancel,
}: OrderedProductDetailedViewProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const steps = [
    {
      name: "Not Processed",
      icon: <XCircleIcon className="h-6 w-6 text-red-500" />,
      description: "Order received but not yet processed",
    },
    {
      name: "Processing",
      icon: <ClockIcon className="h-6 w-6 text-blue-400" />,
      description: "Preparing your order for shipment",
    },
    {
      name: "Dispatched",
      icon: <TruckIcon className="h-6 w-6 text-indigo-500" />,
      description: "Order has been shipped",
    },
    {
      name: "Cancelled",
      icon: <XCircleIcon className="h-6 w-6 text-gray-400" />,
      description: "Order has been cancelled",
    },
    {
      name: "Completed",
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
      description: "Order delivered successfully",
    },
  ];

  const currentStepIndex = steps.findIndex((step) => step.name === item.status);

  const handleCancelSuccess = (reason: string) => {
    toast.success("Product cancellation requested");
    if (onProductCancel) {
      onProductCancel(item._id, reason);
    }
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center">
          <div className="relative">
            <span className="flex h-[11px] w-[11px] mr-2">
              <span
                className={`absolute inline-flex h-full w-[10px] animate-ping rounded-full ${
                  item.status === "Not Processed"
                    ? "bg-[#e3503e]"
                    : item.status === "Processing"
                    ? "bg-[#54b7d3]"
                    : item.status === "Dispatched"
                    ? "bg-[#1e91cf]"
                    : item.status === "Cancelled"
                    ? "bg-[#e3d4d4]"
                    : "bg-green-500"
                }  opacity-75`}
              ></span>
              <span
                className={`relative inline-flex h-[11px] w-[10px] rounded-full ${
                  item.status === "Not Processed"
                    ? "bg-[#e3503e]"
                    : item.status === "Processing"
                    ? "bg-[#54b7d3]"
                    : item.status === "Dispatched"
                    ? "bg-[#1e91cf]"
                    : item.status === "Cancelled"
                    ? "bg-[#e3d4d4]"
                    : "bg-green-500"
                }`}
              ></span>
            </span>
          </div>
          <div className="text-[10px] sm:text-[15px]">
            {item.status}
            {item.status === "Cancelled" && (
              <span className="text-xs text-gray-500 ml-1">
                (Refund initiated)
              </span>
            )}
          </div>
        </div>

        {item.status === "Not Processed" && (
          <div className="flex justify-end self-end">
            <Button
              className="text-[10px] sm:text-[15px]"
              variant={"ghost"}
              onClick={() => setCancelModalOpen(true)}
              disabled={item.status === ("Cancelled" as OrderProduct['status'])}
            >
              Cancel this product
            </Button>
          </div>
        )}

        <Button
          onClick={() => setOpen(!open)}
          variant={"ghost"}
          className="ml-2"
          aria-label={open ? "Hide details" : "Show details"}
        >
          {open ? <FaChevronCircleUp /> : <FaChevronCircleDown />}
        </Button>
      </div>

      {open && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="relative flex items-center">
              <div className="flex space-x-4">
                {steps.map((step, index) => (
                  <div key={step.name} className="flex items-center">
                    <div
                      className={`flex flex-col items-center ${
                        index <= currentStepIndex ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      <div className="relative flex items-center justify-center">
                        {step.icon}
                        {index <= currentStepIndex && (
                          <span className="absolute inline-flex h-2 w-2 rounded-full bg-green-400 animate-ping" />
                        )}
                      </div>
                      <div className="text-center mt-1">
                        <span className="text-sm text-gray-600 hidden sm:block">
                          {step.name}
                        </span>
                        {index === currentStepIndex && (
                          <p className="text-xs text-gray-500 mt-1 max-w-[100px]">
                            {step.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-1 sm:w-8 w-5 ${
                          index < currentStepIndex
                            ? "bg-green-400"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <CancelProductModal
        orderId={orderId}
        productId={item._id}
        open={cancelModalOpen}
        setOpen={setCancelModalOpen}
        onSuccess={handleCancelSuccess}
      />
    </>
  );
};

export default OrderedProductDetailedView;