import mongoose, { Schema, Document } from "mongoose";

export interface ICoupon extends Document {
  coupon: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  isGlobal: boolean;
  applicableProducts: mongoose.Types.ObjectId[];
  vendor?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    coupon: {
      type: String,
      trim: true,
      unique: true,
      uppercase: true,
      required: true,
      minLength: 4,
      maxLength: 10,
    },
    vendor: {
      type: Object,
    },
    discount: {
      type: Number,
      required: true,
      min: 1,
      max: 99
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isGlobal: {
      type: Boolean,
      default: true
    },
    applicableProducts: [{
      type: Schema.Types.ObjectId,
      ref: "Product"
    }]
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.models.Coupon as mongoose.Model<ICoupon> || 
  mongoose.model<ICoupon>("Coupon", couponSchema);

export default Coupon;