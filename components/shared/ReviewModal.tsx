"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { createReview } from "@/lib/database/actions/review.actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const { user } = useUser();
  const [rating, setRating] = useState(5);
  
interface FormData {
    get: (key: string) => FormDataEntryValue | null;
}

interface HandleSubmitState {
    success: boolean;
    message: string;
}

const handleSubmit = async (
    prevState: HandleSubmitState | null,
    formData: FormData
): Promise<HandleSubmitState> => {
    if (!user?.id) {
        return { success: false, message: "You must be logged in" };
    }

    const result = await createReview({
        name: formData.get("name") as string,
        rating: Number(formData.get("rating")),
        text: formData.get("text") as string,
        userId: user.id, // INCLUDING USER ID
        userImage: user.imageUrl
    });

    return result;
};

  const [state, formAction] = useActionState(handleSubmit, null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Write a Review</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        {state?.success ? (
          <div className="text-center py-4">
            <p className="text-green-600 mb-4">{state.message}</p>
            <Button onClick={onClose}>Close</Button>
          </div>
        ) : (
          <form action={formAction}>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 font-medium">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Rating</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <input type="hidden" name="rating" value={rating} />
            </div>

            <div className="mb-4">
              <label htmlFor="text" className="block mb-2 font-medium">
                Your Review
              </label>
              <textarea
                id="text"
                name="text"
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" onClick={onClose} variant="outline">
                Cancel
              </Button>
              <SubmitButton />
            </div>

            {state?.message && !state?.success && (
              <p className="mt-4 text-red-500">{state.message}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit Review"}
    </Button>
  );
}