import React from "react";
import { Star, Minus, Plus, Clock, Award, Droplet, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Marquee from "react-fast-marquee";
import ProductCard from "@/components/shared/home/ProductCard";
import ProductReviewComponent from "@/components/shared/product/ProductReviewComponent";
import ProductDetailsAccordian from "@/components/shared/product/ProductDetailsAccordian";

// ProductPage component: Individual product detail page layout with product carousel,
// price details, ratings, reviews, and recommendations
const ProductPage = () => {
  // Array of image URLs for the product's image carousel
  const images = [
    "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727321123/Untitled_design_v3eavb.png",
    "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727321123/800w-_ShdzRGGvdI_jqaoyg.webp",
    "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727321123/800w-W_55-2Yrou0_jl6lot.jpg",
  ];

  return (
    <div>
      {/* Announcement Marquee: Displays promotional offers and shipping information */}
      <Marquee className="bg-[#FFF579] flex justify-between gap-[50px] p-4 sm:hidden">
        <p className="para mx-4">✨ Free delivery on all PrePaid Orders</p>
        <p className="para mx-4">
          🎁 Buy Any 3 products and get 1 gift for free
        </p>
        <p className="para mx-4">
          1 Body wash cleanser + 5 SKINCARE PRODUCTS @ ₹1500
        </p>
      </Marquee>

      {/* Main container: Product details section */}
      <div className="max-w-7xl ownContainer pb-6 px-6 pt-2">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mb-[20px] ">
          {/* Product Image Carousel: Displays multiple images of the product */}
          <div className="w-full lg:w-1/2">
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((imgSrc, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <img
                        src={imgSrc}
                        alt={`Product Image ${index + 1}`}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Product Information: Title, price, rating, and cart interaction */}
          <div className="w-full lg:w-1/2 space-y-4">
            {/* Product Title */}
            <h1 className="text-2xl lg:subHeading">
              High-End Fragrance Collection for Males
            </h1>

            {/* Product Category */}
            <p className="text-xs lg:text-sm text-gray-500">MEN</p>

            {/* Product Rating: Displays star ratings and total number of reviews */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < 4
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">4.4</span>
              <span className="text-sm text-gray-500">(1221 Reviews)</span>
            </div>

            {/* Pricing Information: Product price, discount, and tax info */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-4">
              <div className="mb-4 lg:mb-0">
                <div className="flex items-baseline gap-2 ">
                  <span className="text-2xl lg:text-3xl font-bold">
                    ₹525.00
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹860.00
                  </span>
                  <span className="text-red-500 font-semibold">-39%</span>
                </div>
                <p className="text-sm text-gray-500">Inclusive of all taxes</p>
              </div>

              {/* Quantity Selector: Allows users to increase/decrease quantity */}
              <div className="flex items-center gap-0">
                <Button
                  variant={"outline"}
                  className="bg-[#F2F2F2]"
                  size={"icon"}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center border-y-2 py-[6px]">1</span>
                <Button
                  variant={"outline"}
                  className="bg-[#F2F2F2]"
                  size={"icon"}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button className="w-full bg-black text-white gap-4 py-7">
              ADD TO CART
            </Button>

            {/* Product Features: Icons with descriptive text */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {[
                { icon: Clock, text: "LONG-LASTING" },
                { icon: Award, text: "CERTIFIED" },
                { icon: Droplet, text: "QUALITY CHECKED OILS" },
                { icon: MapPin, text: "MADE IN INDIA" },
              ].map(({ icon: Icon, text }, index) => (
                <div
                  className="flex flex-col items-center text-center bg-gray-100 px-1 py-8 justify-center"
                  key={index}
                >
                  <div className="rounded-full">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs mt-2">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Accordion: Expands to show more detailed information */}
        <ProductDetailsAccordian />

        {/* Product Review Component: Displays product reviews */}
        <ProductReviewComponent />

        {/* Related Products Section: Suggests additional products */}
        {/* <ProductCard heading="YOU MAY ALSO LIKE" /> */}
      </div>
    </div>
  );
};

export default ProductPage;