import BannerCarousel from '@/components/shared/home/BannerCarousel'
import BlogImages from '@/components/shared/home/BlogImages'
import CategorySection from '@/components/shared/home/categorySection'
import CrazyDeals from '@/components/shared/home/CrazyDeals'
import NeedOfWebsite from '@/components/shared/home/NeedOfWebsite'

import ProductCard from '@/components/shared/home/ProductCard' 
import ReviewSection from '@/components/shared/home/ReviewSection' 

import SpecialCombos from '@/components/shared/home/SpecialCombos'
import { fetchAllWebsiteBanners } from '@/lib/database/actions/banners.actions'
import { getAllCrazyDealOffers, getAllSpecialComboOffers } from '@/lib/database/actions/homescreenoffers.actions'
import { getNewArrivalProducts, getTopSellingProducts } from '@/lib/database/actions/product.actions'
import { getAllSubCategoriesByName } from '@/lib/database/actions/subCategory.actions'

import React from 'react'


const Homepage = async  ()  => {
  const desktopImages:any = await fetchAllWebsiteBanners().catch((err)=>console.log(err));
 
  const subcategoriesData: any = await getAllSubCategoriesByName(
    "unisex"
  ).catch((err) => console.log(err));

  const specialCombosHomeData:any = await getAllSpecialComboOffers().catch((err)=>console.log(err));

   const crazyDealsData:any = await getAllCrazyDealOffers().catch((err)=>console.log(err));

   const topSellingProducts = await getTopSellingProducts().catch((err) =>
    console.log(err)
  );
  

  const newArrivalProducts = await getNewArrivalProducts().catch((err) =>
    console.log(err)
  );

  const transformedBestSellerProducts = topSellingProducts?.products.map(
    (product: any) => ({
      id: product._id,
      name: product.name,
      category: product.category, // You might need to format this
      image: product.subProducts[0]?.images[0].url || "", // Adjust to match your image structure
      rating: product.rating,
      reviews: product.numReviews,
      price: product.subProducts[0]?.price || 0, // Adjust to match your pricing structure
      originalPrice: product.subProducts[0]?.originalPrice || 0, // Add logic for original price
      discount: product.subProducts[0]?.discount || 0,
      isBestseller: product.featured,
      isSale: product.subProducts[0]?.isSale || false, // Adjust if you have sale logic
      slug: product.slug,
      prices: product.subProducts[0]?.sizes
        .map((s: any) => {
          return s.price;
        })
        .sort((a: any, b: any) => {
          return a - b;
        }),
    })
  );
  
  const transformedNewArrivalProducts = newArrivalProducts?.products.map(
    (product: any) => ({
      id: product._id,
      name: product.name,
      category: product.category, // You might need to format this
      image: product.subProducts[0]?.images[0].url || "", // Adjust to match your image structure
      rating: product.rating,
      reviews: product.numReviews,
      price: product.subProducts[0]?.price || 0, // Adjust to match your pricing structure
      originalPrice: product.subProducts[0]?.originalPrice || 0, // Add logic for original price
      discount: product.subProducts[0]?.discount || 0,
      isBestseller: product.featured,
      isSale: product.subProducts[0]?.isSale || false, // Adjust if you have sale logic
      slug: product.slug,
      prices: product.subProducts[0]?.sizes
        .map((s: any) => {
          return s.price;
        })
        .sort((a: any, b: any) => {
          return a - b;
        }),
    })
  );
  return (
    <div>
      <BannerCarousel desktopImages={desktopImages}/>
      <SpecialCombos comboData={specialCombosHomeData}/>
      <ProductCard heading="BEST SELLERS" products={transformedBestSellerProducts} />
      <CategorySection subCategories={subcategoriesData.subCategories}/>
      <CrazyDeals dealsData={crazyDealsData}/>
      <NeedOfWebsite/>
      <ProductCard heading="NEW ARRIVALS" products={transformedNewArrivalProducts} />
      <ReviewSection/>
      <BlogImages/>
      </div>
  )
}

export default Homepage