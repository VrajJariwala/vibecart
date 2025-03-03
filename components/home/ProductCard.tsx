import { Star } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  discount?: number;
  isBestseller?: boolean;
  isSale?: boolean;
}
const products: Product[] = [
  {
    id: "1",
    name: "High-End Fragrance Collection for Males",
    category: "MEN",
    image:
      "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727352106/1_upscaled_pku7p3.png",
    rating: 4.7,
    reviews: 1221,
    price: 565.0,
    originalPrice: 849.0,
    discount: 34,
    isBestseller: true,
  },
  {
    id: "2",
    name: "Chief Gentleman Deluxe Fragrance - 100ml.",
    category: "MEN",
    image:
      "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727352106/3_upscaled_smnoeu.png",
    rating: 4.8,
    reviews: 736,
    price: 499.0,
    originalPrice: 899.0,
    discount: 45,
    isBestseller: true,
  },
  {
    id: "3",
    name: "Smudge-Proof Fluid Lip Color",
    category: "WOMEN",
    image:
      "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727352106/2_upscaled_g6ibby.png",
    rating: 4.8,
    reviews: 187,
    price: 329.0,
    originalPrice: 449.0,
    isBestseller: true,
    isSale: true,
  },
  {
    id: "4",
    name: "Premium Scent Gift Bundle for Females",
    category: "WOMEN",
    image:
      "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727352106/4_upscaled_hqhzq6.png",
    rating: 4.9,
    reviews: 732,
    price: 565.0,
    originalPrice: 849.0,
    discount: 34,
    isBestseller: true,
  },
];
const Card = ({ product, shop }: { product: Product; shop?: boolean }) => {
  return (
    <div className="w-full flex-shrink-0 mb-2">
      <div className="relative">
        <Link href={"/product"}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto object-cover mb-4"
          />
        </Link>
        <div className="absolute top-2 left-2 flex gap-2">
          {product.isBestseller && (
            <span className="bg-[#E1B87F] text-white text-xs font-semibold px-2 py-1 rounded">
              BESTSELLER
            </span>
          )}
          {product.isSale && (
            <span className="bg-[#7EBFAE] text-white text-xs font-semibold px-2 py-1 rounded">
              SALE
            </span>
          )}
        </div>
        {product.discount && (
          <span className="absolute bottom-2 left-2 bg-[#7EBFAE] text-white text-xs font-semibold px-2 py-1 rounded">
            {product.discount}% OFF
          </span>
        )}
      </div>
      <div className="text-xs text-gray-500 mb-1 textGap text-[10px]">
        {product.category.length > 25
          ? product.category.substring(0, 25) + "..."
          : product.category}
      </div>
      <h3 className="font-semibold text-sm mb-2 textGap">
        {product.name.length > 25
          ? product.name.substring(0, 25) + "..."
          : product.name}
      </h3>
      <div className="flex items-center mb-2">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-semibold ml-1">{product.rating}</span>
        <span className="text-xs text-gray-500 ml-2">
          ({product.reviews} Reviews)
        </span>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span className="font-semibold">₹{product.price.toFixed(2)}</span>
        <span className="text-gray-500 line-through text-sm">
          ₹{product.originalPrice.toFixed(2)}
        </span>
      </div>
      {!shop && (
        <Link href={"/product"}>
          <Button className="w-full bg-black text-white hover:bg-gray-800">
            VIEW PRODUCT
          </Button>
        </Link>
      )}
    </div>
  );
};

const ProductCard = ({
  heading,
  shop,
}: {
  heading: string;
  shop?: boolean;
}) => {
  return (
    <div className="container mx-auto mb-[20px]">
      {shop ? null : (
        <div className="flex justify-center">
          <div className="heading ownContainer uppercase sm:my-[40px]">
            {heading}
          </div>
        </div>
      )}
      <div className="relative">
        <div
          className={`${
            shop
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              : "flex overflow-x-auto gap-4 sm:gap-6 scroll-smooth no-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-4"
          } mb-8`}
        >
          {products.map((product) => (
            <Card key={product.id} product={product} shop={shop} />
          ))}
        </div>
      </div>
      {!shop && (
        <div className="flex justify-center mt-8">
          <Button
            variant={"outline"}
            className="w-[90%] sm:w-[347px] border-2 border-black textGap px-[10px] py-[20px]"
          >
            VIEW ALL
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;