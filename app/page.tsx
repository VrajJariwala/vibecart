import BannerCarousel from '@/components/home/BannerCarousel'
import BlogImages from '@/components/home/BlogImages'
import CategorySection from '@/components/home/categorySection'
import CrazyDeals from '@/components/home/CrazyDeals'
import NeedOfWebsite from '@/components/home/NeedOfWebsite'

import ProductCard from '@/components/home/ProductCard'
import ReviewSection from '@/components/home/ReviewSection'

import SpecialCombos from '@/components/home/SpecialCombos'
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