// ISR(CACHE) - 30 MINUTES

import React from "react";
import { Star, Clock, Award, Droplet, MapPin } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Marquee from "react-fast-marquee";
import ProductReviewComponent from "@/components/shared/product/ProductReviewComponent";
import ProductDetailsAccordian from "@/components/shared/product/ProductDetailsAccordian";
import {
  getRelatedProductsBySubCategoryIds,
  getSingleProduct,
} from "@/lib/database/actions/product.actions";
import { Metadata } from "next";
import QtyButtons from "@/components/shared/product/QtyButtons";
import Link from "next/link";
import AddtoCartButton from "@/components/shared/product/AddtoCart";
import ProductCard from "@/components/shared/home/ProductCard";
import { redirect } from "next/navigation";
import IdInvalidError from "@/components/shared/IdInvalidError";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const style = Number((await searchParams).style);
  const size = Number((await searchParams).size) || 0;
  const product = await getSingleProduct(slug, style, size);

  return {
    title: `Buy ${product.name} product | VibeCart`,
    description: product.description,
  };
}

const ProductPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const slug = (await params).slug;
  const style = Number((await searchParams).style) || 0;
  const size = Number((await searchParams).size) || 0;
  const sizeForButton = Number((await searchParams).size);
  const product = await getSingleProduct(slug, style, size);
  
  if (!product.success) {
    return <IdInvalidError />;
  }

  // Get all product images
  const images = product.subProducts[0].images.map((image: any) => image.url);
  const subCategoryProducts = product.subCategories.map((i: any) => i._id);
  const relatedProducts = await getRelatedProductsBySubCategoryIds(
    subCategoryProducts
  ).catch((err) => console.log(err));
  
  const transformedProducts = relatedProducts?.products.map((product: any) => ({
    id: product._id,
    name: product.name,
    category: product.category,
    image: product.subProducts[0]?.images[0].url || "",
    rating: product.rating,
    reviews: product.numReviews,
    price: product.subProducts[0]?.price || 0,
    originalPrice: product.subProducts[0]?.originalPrice || 0,
    discount: product.subProducts[0]?.discount || 0,
    isBestseller: product.featured,
    isSale: product.subProducts[0]?.isSale || false,
    slug: product.slug,
    prices: product.subProducts[0]?.sizes
      .map((s: any) => s.price)
      .sort((a: any, b: any) => a - b),
  }));

  const hasDiscount = product.discount > 0;
  const availableQty = product.subProducts[0].sizes[size].qty;

  return (
    <div>
      <Marquee className="bg-[#FFF579] flex justify-between gap-[50px] p-4 sm:hidden">
        <p className="para mx-4">✨ Free delivery on all PrePaid Orders</p>
        <p className="para mx-4">
          🎁 Buy Any 3 products and get 1 gift for free
        </p>
        <p className="para mx-4">
          1 Body wash cleanser + 5 SKINCARE PRODUCTS @ ₹1500
        </p>
      </Marquee>
      
      <div className="max-w-7xl ownContainer pb-6 px-6 pt-2">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mb-[20px]">
          {/* Product Images */}
          <div className="w-full lg:w-1/2 lg:sticky top-[1rem] self-start">
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((imgSrc: string, index: number) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <img
                        src={imgSrc}
                        alt={`Product Image ${index + 1}`}
                        className="w-full h-auto object-contain aspect-square"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </>
              )}
            </Carousel>
            
            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex mt-4 gap-2 overflow-x-auto pb-2">
                {images.map((imgSrc: string, index: number) => (
                  <div 
                    key={index} 
                    className="w-16 h-16 border-2 border-gray-200 hover:border-black cursor-pointer overflow-hidden flex-shrink-0"
                  >
                    <img
                      src={imgSrc}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="w-full lg:w-1/2 space-y-4">
            <h1 className="text-2xl lg:subHeading">{product.name}</h1>
            <p className="text-xs lg:text-sm text-gray-500">
              {product.category.name}
            </p>
            <p className="text-xs lg:text-sm text-gray-500">
              {product?.description}
            </p>

            {/* Ratings */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < product.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-gray-500">
                ({product.numReviews} Reviews)
              </span>
            </div>

            {/* Price Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-4">
              <div className="mb-4 lg:mb-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  {hasDiscount ? (
                    <>
                      <span className="text-2xl lg:text-3xl font-bold text-green-500">
                      ₹{product.price}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        ₹{product.priceBefore.toFixed(2)}
                      </span>
                      <span className="text-red-500 font-semibold">
                        -{product.discount}%
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl lg:text-3xl font-bold text-gray-900">
                      ₹{product.price}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">Inclusive of all taxes</p>
              </div>
              
              {/* Quantity Selector */}
              <QtyButtons product={product} size={size} style={style} />
            </div>

            {/* Stock Warning */}
            {availableQty <= 10 && (
              <div className="text-sm">
                {availableQty > 0 ? (
                  <>
                    <b className="text-red-500">Hurry Up!</b> Only{" "}
                    <b className="text-red-500">{availableQty}</b> Left!
                  </>
                ) : (
                  <b className="text-red-500">Out of Stock</b>
                )}
              </div>
            )}

            {/* Size Selector */}
            <div className="flex gap-[10px] flex-wrap">
              {product.sizes.map((sizes: { size: string }, index: number) => (
                <Link
                  key={sizes.size}
                  href={`/product/${product.slug}?style=${style}&size=${index}`}
                >
                  <div
                    className={`${
                      index === sizeForButton ? "bg-black text-white" : "bg-white"
                    } h-[50px] w-[50px] rounded-full grid items-center border border-black cursor-pointer justify-center hover:text-white hover:bg-black transition-colors`}
                  >
                    {sizes.size}
                  </div>
                </Link>
              ))}
            </div>

            {/* Add to Cart Button */}
            <AddtoCartButton product={product} size={size} />

            {/* Long Description */}
            {product.longDescription.length > 0 && (
              <div className="border-t-gray-300 border-t-2 my-[20px] pt-4">
                <p className="font-bold mb-2">Description</p>
                <div
                  dangerouslySetInnerHTML={{ __html: product.longDescription }}
                  className="prose max-w-none"
                />
              </div>
            )}

            {/* Features */}
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

        {/* Product Details Accordion */}
        <ProductDetailsAccordian
          description={product.longDescription}
          keyBenefits={product.benefits}
          ingredients={product.ingredients}
          details={product.details}
        />

        {/* Reviews */}
        <ProductReviewComponent
          product={product}
          rating={product.rating}
          numofReviews={product.numReviews}
          ratings={product.ratings}
        />

        {/* Related Products */}
        <ProductCard
          heading="YOU MAY ALSO LIKE"
          products={transformedProducts}
          shop
        />
      </div>
    </div>
  );
};

export default ProductPage;