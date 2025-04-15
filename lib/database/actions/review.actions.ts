"use server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../connect";
import Review from "../models/review.model";
import { handleError } from "@/lib/utils";

export async function createReview(review: {
  name: string;
  rating: number;
  text: string;
  userId: string;
  userImage?: string;
}) {
  try {
    await connectToDatabase();
    
    const newReview = await Review.create(review);
    
    revalidatePath("/");
    return {
      success: true,
      message: "Thank you for your review!",
      review: JSON.parse(JSON.stringify(newReview)),
    };
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: "Failed to submit review. Please try again.",
    };
  }
}
export async function getReviews() {
  try {
    await connectToDatabase();
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(reviews));
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function updateReview(reviewId: string, updates: {
  text?: string;
  rating?: number;
}) {
  try {
    await connectToDatabase();
    
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      updates,
      { new: true }
    ).lean();
    
    revalidatePath("/");
    return {
      success: true,
      message: "Review updated successfully",
      review: JSON.parse(JSON.stringify(updatedReview)),
    };
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: "Failed to update review",
    };
  }
}

export async function deleteReview(reviewId: string) {
  try {
    await connectToDatabase();
    
    await Review.findByIdAndDelete(reviewId);
    
    revalidatePath("/");
    return {
      success: true,
      message: "Review deleted successfully",
    };
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: "Failed to delete review",
    };
  }
}