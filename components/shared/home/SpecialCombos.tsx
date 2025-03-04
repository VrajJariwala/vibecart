import React from "react";

const comboData = [
  {
    id: 1,
    title: "Daily Essential Kit",
    imgSrc:
      "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727314688/800w-fDTMbXs8Oe0_lo6rzv.webp",
    altText: "Slide 1",
  },
  {
    id: 2,
    title: "Impeccable Matte Set of Three",
    imgSrc:
      "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727314688/800w-5eU04gvABJs_tatwlc.webp",
    altText: "Slide 2",
  },
  {
    id: 3,
    title: "Fragrance Team Set",
    imgSrc:
      "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727314688/800w-7c4w5uNaEyc_plialn.webp",
    altText: "Slide 3",
  },
];
const SpecialCombos = () => {
  return (
    <div className="container mx-auto px-4 mb-[20px]">
      <div className="heading my-[10px] ownContainer text-center uppercase sm:my-[40px]">
        SPECIAL COMBOS
      </div>
      <div className="relative">
        <div className="flex overflow-x-auto gap-[20px] sm:justify-center scroll-smooth no-scrollbar">
          {comboData.map((combo) => (
            <div key={combo.id} className="flex-shrink-0 w-[80vw] sm:w-[347px]">
              <img
                src={combo.imgSrc}
                alt={combo.altText}
                className="w-full h-auto object-cover"
              />
              <p className="text-center uppercase textGap font-[500]">
                {combo.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialCombos;