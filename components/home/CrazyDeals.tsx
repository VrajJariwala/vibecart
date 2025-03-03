import React from "react";

const dealsData = [
  {
    id: 1,
    title: "Personal Care Bundle",
    imgSrc:
      "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727314689/800w-SR7K5nxBVr8_na9qik.webp",
    altText: "Slide 1",
  },
  {
    id: 2,
    title: "Essential Cosmetics",
    imgSrc:
      "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727314688/800w-moQWTTJcEbk_nyvzfq.webp",
    altText: "Slide 2",
  },
  {
    id: 3,
    title: "Magical Set",
    imgSrc:
      "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727314688/800w-h3QQLkdtmWY_thb4og.webp",
    altText: "Slide 3",
  },
];
const CrazyDeals = () => {
  return (
    <div className="container mx-auto px-4 mb-[20px]">
      <div className="heading my-[10px] ownContainer text-center uppercase sm:my-[40px]">
        Crazy Deals
      </div>
      <div className="relative">
        <div className="flex overflow-x-auto gap-[20px] sm:justify-center scroll-smooth no-scrollbar">
          {dealsData.map((deal) => (
            <div key={deal.id} className="flex-shrink-0 w-[80vw] sm:w-[347px]">
              <img
                src={deal.imgSrc}
                alt={deal.altText}
                className="w-full h-auto object-cover"
              />
              <p className="text-center uppercase textGap font-[500]">
                {deal.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CrazyDeals;