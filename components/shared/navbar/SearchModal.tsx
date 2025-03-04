/* eslint no-use-before-define: 0 */

import React from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
const SearchModal = ({ setOpen }: { setOpen: any }) => {
  const trendingSearches = [
    "Perfume",
    "Bath & Body",
    "Gifting",
    "Crazy Deals",
    "Combos",
  ];
  const recommendedProducts = [
    {
      name: "Intense Men Perfume",
      price: 849,
      originalPrice: 1099,
      discount: 23,
      image: "https://placehold.co/100x200",
    },
    {
      name: "Intense Men Perfume",
      price: 849,
      originalPrice: 1099,
      discount: 23,
      image: "https://placehold.co/100x200",
    },
    {
      name: "Intense Men Perfume",
      price: 849,
      originalPrice: 1099,
      discount: 23,
      image: "https://placehold.co/100x200",
    },
    {
      name: "Intense Men Perfume",
      price: 849,
      originalPrice: 1099,
      discount: 23,
      image: "https://placehold.co/100x200",
    },
  ];
  return (
    <Dialog>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-2xl mx-4 md:mx-6 lg:mx-auto p-4 sm:p-6 bg-background rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Search</h2>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Input
            type="search"
            placeholder="Search..."
            className="w-full mb-4"
          />
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Trending Searches</h3>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((search) => (
                <Button key={search} variant={"outline"} size={"sm"}>
                  {search}
                </Button>
              ))}
            </div>
          </div>
          <div className="">
            <h3 className="text-sm font-semibold mb-2">Recommended for you</h3>
            <div className="flex space-x-2 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:space-x-0 sm:gap-2">
              {recommendedProducts.map((product, index: number) => (
                <div
                  key={index}
                  className="space-y-2 min-w-[110px] flex-shrink-0 sm:min-w-0"
                >
                  <div className="aspect-square relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-[200px] h-full object-cover rounded-none"
                    />
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      {product.discount}% OFF
                    </span>
                  </div>
                  <div className="">
                    <h4 className="font-semibold text-sm">{product.name}</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold">₹{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default SearchModal;