import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
      default: "/default-avatar.png"
    },
    userId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const Review = models?.Review || model("Review", ReviewSchema);
export default Review;