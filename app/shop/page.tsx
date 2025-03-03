// "use client" directive indicates this component is client-side only
"use client";

// Import necessary components and libraries
import ProductCard from "@/components/home/ProductCard";
import FilterButton from "@/components/shop/FilterButton";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

// ShopPage component displays the product listing page with sorting and filtering functionality
const ShopPage = () => {
  // State to manage the sorting options for the products
  const [sortBy, setSortBy] = useState("Featured");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page title */}
      <h1 className="heading mb-8 text-center">Shop All Products</h1>

      {/* Container for the filter button and sorting dropdown */}
      <div className="flex justify-center items-center mb-6">
        <div className="flex">
          {/* Filter button component to open product filtering options */}
          <FilterButton />

          {/* Sorting dropdown to allow users to sort products by criteria like price or rating */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)} // Update sort option on change
              className="appearance-none bg-black text-white px-4 py-2 pr-8 border-l border-white"
            >
              <option>Featured</option> {/* Default sorting option */}
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Customer Rating</option>
            </select>

            {/* Chevron icon added to the dropdown to indicate it is clickable */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Display product cards - passing 'shop' prop to adjust the layout for the shop page */}
      <ProductCard heading="" shop={true} />
      <ProductCard heading="" shop={true} />
    </div>
  );
};

export default ShopPage;