import BannerCarousel from '@/components/shared/home/BannerCarousel'
import BlogImages from '@/components/shared/home/BlogImages'
import CategorySection from '@/components/shared/home/categorySection'
import CrazyDeals from '@/components/shared/home/CrazyDeals'
import NeedOfWebsite from '@/components/shared/home/NeedOfWebsite'

import ProductCard from '@/components/shared/home/ProductCard' 
import ReviewSection from '@/components/shared/home/ReviewSection' 

import SpecialCombos from '@/components/shared/home/SpecialCombos'
import React from 'react'


const Homepage = () => {
  return (
    <div>
      <BannerCarousel/>
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