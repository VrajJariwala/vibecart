import BannerCarousel from '@/components/shared/home/BannerCarousel'
import BlogImages from '@/components/shared/home/BlogImages'
import CategorySection from '@/components/shared/home/categorySection'
import CrazyDeals from '@/components/shared/home/CrazyDeals'
import NeedOfWebsite from '@/components/shared/home/NeedOfWebsite'

import ProductCard from '@/components/shared/home/ProductCard' 
import ReviewSection from '@/components/shared/home/ReviewSection' 

import SpecialCombos from '@/components/shared/home/SpecialCombos'
import { fetchAllWebsiteBanners } from '@/lib/database/actions/banners.actions'
import { log } from 'console'
import React from 'react'


const Homepage = async  ()  => {
  const desktopImages:any = await fetchAllWebsiteBanners().catch((err)=>console.log(err));
  console.log(desktopImages)
  return (
    <div>
      <BannerCarousel desktopImages={desktopImages}/>
      <SpecialCombos/>
      <ProductCard heading="BEST SELLERS" />
      <CategorySection/>
      <CrazyDeals/>
      <NeedOfWebsite/>
      <ReviewSection/>
      <BlogImages/>
      </div>
  )
}

export default Homepage