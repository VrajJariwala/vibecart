import React from "react";

const categories = [
  {
    name: "COSMETICS",
    image:
      "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727315701/800w-5eU04gvABJs_zqip4d.webp",
  },
  {
    name: "SKINCARE",
    image:
      "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727315700/800w-qWKqCY5hzd8_hr8sey.webp",
  },
  {
    name: "LUXURY PERFUMES",
    image:
      "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727315700/800w-Yn6osI7XMnI_azndat.webp",
  },
  {
    name: "BATH & BODY",
    image:
      "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727315701/800w-DI-sLlEIVnM_tiuzw4.webp",
  },
  {
    name: "Skin Deodorants",
    image:
      "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727315700/Skin_Care_Products_nvwzf0.png",
  },
  {
    name: "GIFT SETS",
    image:
      "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727315701/800w-XaTLqFr-mtI_yinzh6.jpg",
  },
];
const CategorySection = () => {
  return (
    <div className="container mx-auto px-4 mb-[20px]">
      <div className="heading my-[10px] ownContainer text-center uppercase heading ownContainer  sm:my-[40px]">
        LUXURY CATEGORIES
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="bg-gray-100">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-auto object-cover"
              />
            </div>
            <span className="text-sm font-medium text-center">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;