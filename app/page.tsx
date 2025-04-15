import ScrollToSection from "@/components/shared/ScrollToSection";
import BannerCarousel from "@/components/shared/home/BannerCarousel";
import BlogImages from "@/components/shared/home/BlogImages";
import CrazyDeals from "@/components/shared/home/CrazyDeals";
import FeaturedProducts from "@/components/shared/home/FeaturedProducts";
import NeedOfWebsite from "@/components/shared/home/NeedOfWebsite";
import ProductCard from "@/components/shared/home/ProductCard";
// import ReviewSection
import SpecialCombos from "@/components/shared/home/SpecialCombos";
import { fetchAllWebsiteBanners } from "@/lib/database/actions/banners.actions";
import {
  getAllCrazyDealOffers,
  getAllSpecialComboOffers,
} from "@/lib/database/actions/homescreenoffers.actions";
import {
  getAllFeaturedProducts,
  getNewArrivalProducts,
  getTopSellingProducts,
} from "@/lib/database/actions/product.actions";
import { getAllSubCategoriesByName } from "@/lib/database/actions/subCategory.actions";
import CategorySection from "@/components/shared/home/categorySection";
import WhatsAppButton from "@/components/WhatsAppButton";
// import { ReviewSection } from '@/components/shared/home/ReviewSection';

import ReviewSection from "@/components/shared/home/ReviewSection";

const HomePage = async () => {
  const desktopImages: any = await fetchAllWebsiteBanners().catch((err) =>
    console.log(err)
  );
  const subcategoriesData: any = await getAllSubCategoriesByName("unisex").catch(
    (err) => console.log(err)
  );
  const specialCombosHomeData: any = await getAllSpecialComboOffers().catch(
    (err) => console.log(err)
  );
  const crazyDealsData: any = await getAllCrazyDealOffers().catch((err) =>
    console.log(err)
  );
  const topSellingProducts = await getTopSellingProducts().catch((err) =>
    console.log(err)
  );
  const newArrivalProducts = await getNewArrivalProducts().catch((err) =>
    console.log(err)
  );
  const featuredProducts: any = await getAllFeaturedProducts().catch((err) =>
    console.log(err)
  );

  const transformedBestSellerProducts = topSellingProducts?.products.map(
    (product: any) => ({
      id: product._id,
      name: product.name,
      category: product.category?.name || "Uncategorized",
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
        .sort((a: number, b: number) => a - b),
    })
  );

  const transformedNewArrivalProducts = newArrivalProducts?.products.map(
    (product: any) => ({
      id: product._id,
      name: product.name,
      category: product.category?.name || "Uncategorized",
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
        .sort((a: number, b: number) => a - b),
    })
  );

  return (
    <div>
      <ScrollToSection />

      <BannerCarousel desktopImages={desktopImages} />
      <SpecialCombos comboData={specialCombosHomeData} />

      <div id="bestsellers"></div>
      <ProductCard
        heading="BEST SELLERS"
        products={transformedBestSellerProducts}
      />

      <CategorySection subCategories={subcategoriesData.subCategories} />

      <div id="featured"></div>
      <FeaturedProducts products={featuredProducts.featuredProducts} />

      <div id="crazy-deals"></div>
      <CrazyDeals dealsData={crazyDealsData} />

      <NeedOfWebsite />

      <div id="new-arrivals"></div>
      <ProductCard
        heading="NEW ARRIVALS"
        products={transformedNewArrivalProducts}
      />

      <ReviewSection />
      <BlogImages />
      <WhatsAppButton />
    </div>
  );
};

export default HomePage;
