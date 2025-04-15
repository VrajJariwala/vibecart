"use client";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { getReviews, updateReview, deleteReview } from "@/lib/database/actions/review.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Review {
  _id: string;
  userId: string;
  userImage?: string;
  name: string;
  text: string;
  rating: number;
}

const ReviewSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");
  const [editedRating, setEditedRating] = useState(5);
  const { user, isLoaded } = useUser();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // Debug logs
  useEffect(() => {
    console.log("Current user ID:", user?.id);
    console.log("Reviews data:", reviews.map(r => ({
      id: r._id, 
      userId: r.userId, 
      name: r.name
    })));
  }, [reviews, user]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await getReviews();
        setReviews(reviewsData);
      } catch (error) {
        toast.error("Failed to load reviews");
      }
    };
    fetchReviews();
  }, []);

  const handleEditClick = (review: Review) => {
    setEditingReviewId(review._id);
    setEditedText(review.text);
    setEditedRating(review.rating);
  };

  const handleCancelEdit = () => setEditingReviewId(null);

  const handleSaveEdit = async (reviewId: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, [reviewId]: true }));
      
      const result = await updateReview(reviewId, {
        text: editedText,
        rating: editedRating
      });
      
      if (result?.success) {
        setReviews(reviews.map(review => 
          review._id === reviewId ? { ...review, text: editedText, rating: editedRating } : review
        ));
        setEditingReviewId(null);
        toast.success("Review updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update review");
    } finally {
      setLoadingStates(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      setLoadingStates(prev => ({ ...prev, [reviewId]: true }));
      
      const result = await deleteReview(reviewId);
      
      if (result?.success) {
        setReviews(reviews.filter(review => review._id !== reviewId));
        toast.success("Review deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete review");
    } finally {
      setLoadingStates(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-center text-2xl font-bold mb-12">WHAT OUR CUSTOMERS HAVE TO SAY</h2>

      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {reviews.map((review) => (
              <div key={review._id} className="flex-[0_0_100%] min-w-0 px-4">
                <div className="bg-white rounded-lg p-6 flex flex-col items-center relative shadow-md">
                  {user?.id === review.userId && (
                    <div className="absolute top-4 right-4 flex gap-2 z-10 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg border border-gray-200">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditClick(review)}
                        disabled={loadingStates[review._id]}
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(review._id)}
                        disabled={loadingStates[review._id]}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  )}

                  <Avatar className="w-16 h-16 mb-4">
                    <AvatarImage 
                      src={review.userImage || "/default-avatar.png"} 
                      alt={review.name}
                    />
                    <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  {editingReviewId === review._id ? (
                    <div className="w-full">
                      <div className="flex justify-center mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditedRating(star)}
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= editedRating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <Textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="mb-4"
                      />
                      <div className="flex justify-center gap-3">
                        <Button variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                        <Button onClick={() => handleSaveEdit(review._id)}>
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-6 h-6 ${
                              i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-center mb-6">{review.text}</p>
                      <p className="font-semibold">{review.name}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={scrollPrev} className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10 border border-gray-200">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <button onClick={scrollNext} className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10 border border-gray-200">
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default ReviewSection;