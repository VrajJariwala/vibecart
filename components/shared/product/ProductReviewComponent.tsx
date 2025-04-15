"use client";

import { ChevronDown, Star, Trash2, Edit } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "@mantine/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { handleError } from "@/lib/utils";
import { createProductReview } from "@/lib/database/actions/product.actions";
import { toast } from "sonner";
import Link from "next/link";

const ProductReviewComponent = ({ product }: { product: any }) => {
  const { user } = useClerk();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [reviews, setReviews] = useState(product.reviews || []);
  const [sortBy, setSortBy] = useState("Most Recent");
  const [editReview, setEditReview] = useState<any>(null);

  const form = useForm({
    initialValues: {
      rating: "",
      review: "",
    },
    validate: {
      rating: (value) => (value ? null : "Rating is required."),
      review: (value) =>
        value.trim().length > 0 ? null : "Review cannot be empty.",
    },
  });

  const handleSubmit = async (action: "create" | "edit" = "create") => {
    try {
      setLoading(true);
      if (!user) return;

      await createProductReview(
        Number(form.values.rating),
        form.values.review,
        user?.id,
        product._id,
        action
      )
        .then((res) => {
          setReviews(res.reviews);
          form.setValues({ rating: "", review: "" });
          setEditReview(null);
          toast.success(`Successfully ${action === "edit" ? "updated" : "added"} product review`);
        })
        .catch((err) => alert(err))
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeleteReview = async () => {
    if (!user) return;
    try {
      setLoading(true);
      await createProductReview(null, null, user?.id, product._id, "delete")
        .then((res) => {
          setReviews(res.reviews);
          toast.success("Review deleted successfully");
        })
        .catch((err) => alert(err))
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      handleError(error);
    }
  };

  // Safe way to get user initials
  const getUserInitial = (review: any) => {
    if (!review?.reviewBy?.username) return "U"; // Default to "U" for unknown
    return review.reviewBy.username.substring(0, 1).toUpperCase();
  };

  // Safe way to get username
  const getUsername = (review: any) => {
    if (!review?.reviewBy?.username) return "Anonymous";
    return review.reviewBy.username;
  };

  return (
    <div className="ownContainer p-4 mt-[20px]">
      <h2 className="heading">Customer Reviews</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="flex items-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= Math.round(product.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-xl font-semibold">{product.rating?.toFixed(1) || '0.0'}</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Based on {product.numReviews || 0} reviews
          </p>
          <Link href={`/review/${product.slug}`}>
            <button className="text-sm text-blue-600 mt-2">
              See all reviews
            </button>
          </Link>
        </div>

        <div className="md:w-2/3">
          <div className="flex justify-between mb-4">
            {user ? (
              <Dialog open={editReview !== null} onOpenChange={(open) => !open && setEditReview(null)}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditReview("new")}>Leave a Review</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editReview === "new" ? "Submit Your Review" : "Edit Your Review"}</DialogTitle>
                  </DialogHeader>

                  <form onSubmit={form.onSubmit(() => handleSubmit(editReview === "new" ? "create" : "edit"))}>
                    {/* Rating Select */}
                    <div style={{ marginBottom: "1rem" }}>
                      <Select
                        onValueChange={(value) => form.setFieldValue("rating", value)}
                        value={form.values.rating}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Rating</SelectLabel>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <SelectItem key={star} value={String(star)}>{star} Stars</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Review Textarea */}
                    <div style={{ marginBottom: "1rem" }}>
                      <Textarea placeholder="Write your review here" {...form.getInputProps("review")} />
                    </div>

                    {/* Submit Button */}
                    <DialogFooter>
                      <Button type="submit">{editReview === "new" ? "Submit Review" : "Update Review"}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            ) : (
              <Button onClick={() => router.push("/sign-in")}>Login to add review</Button>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className="flex justify-center">No Reviews yet.</div>
          ) : (
            reviews.slice(0, 3).map((i: any, index: number) => (
              <div className="border-t pt-4" key={index}>
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xl font-semibold mr-3">
                    {getUserInitial(i)}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-semibold mr-2 capitalize">{getUsername(i)}</span>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Verified
                      </span>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(i.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {user?.id === i.reviewBy?.clerkId && (
                    <div className="flex gap-2 ml-auto">
                      <Button variant="outline" onClick={() => setEditReview(i)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" onClick={handleDeleteReview}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-lg mb-2">{i.review}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviewComponent;