"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cancelOrderProduct } from "@/lib/database/actions/order.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type CancelProductModalProps = {
  orderId: string;
  productId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: (reason: string) => void;
};

export const CancelProductModal = ({
  orderId,
  productId,
  open,
  setOpen,
  onSuccess,
}: CancelProductModalProps) => {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a cancellation reason");
      return;
    }

    setIsLoading(true);
    try {
      await cancelOrderProduct(orderId, productId, reason);
      toast.success("Product cancellation requested successfully");
      router.refresh();
      setOpen(false);
      if (onSuccess) onSuccess(reason);
    } catch (error) {
      console.error("Failed to cancel product:", error);
      toast.error("Failed to cancel product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this product? Please provide a reason.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Reason for cancellation..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Back
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Confirm Cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};