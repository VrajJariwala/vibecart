"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BannerImage {
  url: string;
  targetUrl: string | null;
}

const mobileImages: BannerImage[] = [
  { url: "https://placehold.co/400x200?text=Mobile+Slide+1", targetUrl: "https://example.com/1" },
  { url: "https://placehold.co/400x200?text=Mobile+Slide+2", targetUrl: "https://example.com/2" },
  { url: "https://placehold.co/400x200?text=Mobile+Slide+3", targetUrl: null },
  { url: "https://placehold.co/400x200?text=Mobile+Slide+4", targetUrl: "https://example.com/4" },
];

const BannerCarousel = ({ desktopImages }: { desktopImages: BannerImage[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleBannerClick = (targetUrl: string | null) => {
    if (!targetUrl) return;

    try {
      let url = targetUrl.trim();
      if (!url.startsWith("http") && !url.startsWith("/")) {
        url = `https://${url}`;
      }
      url = url.replace(/([^:]\/)\/+/g, "$1");

      console.log("Navigating to URL:", url);
      window.location.href = url; // Changed from window.open to window.location.href
    } catch (error) {
      console.error("Invalid URL:", targetUrl, error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 485);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    const interval = setInterval(nextSlide, 5000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const images = isMobile ? mobileImages : desktopImages;

  return (
    <div className="relative w-full h-[400px] overflow-hidden mb-[20px]">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={image.url}
            alt={`Banner ${index + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => {
              console.log("Banner clicked! Image:", image.url);
              handleBannerClick(image.targetUrl);
            }}
          />
        </div>
      ))}

      {/* Navigation arrows */}
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        aria-label="Previous slide"
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-black rounded-none z-20"
      >
        <ChevronLeft size={24} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        aria-label="Next slide"
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-black rounded-none z-20"
      >
        <ChevronRight size={24} />
      </Button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;