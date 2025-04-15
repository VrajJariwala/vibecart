"use client";

import { useState } from "react";
import { RiDiscountPercentFill } from "react-icons/ri";
import { LuStore, LuStar } from "react-icons/lu";
import { GrLike } from "react-icons/gr";
import { GiPerfumeBottle } from "react-icons/gi";
import { FaBath } from "react-icons/fa";
import { MdFace4 } from "react-icons/md";
import Link from "next/link";
import CartDrawer from "./CartDrawer";
import MobileHamBurgerMenu from "./mobile/hamburgerMenu";
import NavbarInput from "./NavbarInput";
import AccountDropDown from "@/components/shared/navbar/AccountDropDown";
import { useRouter, usePathname } from "next/navigation";
import ReviewModal from "../ReviewModal";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const navItems = [
    { name: "CRAZY DEALS", icon: <RiDiscountPercentFill size={24} />, id: "crazy-deals" },
    { name: "BESTSELLERS", icon: <GrLike size={24} />, id: "bestsellers" },
    {
      name: "PERFUMES",
      icon: <GiPerfumeBottle size={24} />,
      id: "bestsellers",
      hasSubmenu: true,
      submenu: [
        { name: "Men's Perfume", id: "mens-perfume" },
        { name: "Women's Perfume", id: "womens-perfume" },
        { name: "Unisex Perfume", id: "unisex-perfume" },
        { name: "New Arrivals", id: "new-arrivals" },
        { name: "Bestsellers", id: "perfume-bestsellers" },
      ],
    },
    {
      name: "NEW ARRIVALS",
      icon: <FaBath size={24} />,
      id: "new-arrivals",
      hasSubmenu: true,
      submenu: [
        { name: "Shower Gel" },
        { name: "Body Lotion" },
        { name: "Hand Cream" },
        { name: "Body Scrub" },
      ],
    },
    {
      name: "FEATURED PRODUCTS",
      icon: <MdFace4 size={24} />,
      id: "featured",
      hasSubmenu: true,
      submenu: [
        { name: "Cleansers" },
        { name: "Moisturizers" },
        { name: "Serums" },
        { name: "Sunscreen" },
      ],
    },
    {
      name: "REVIEWS",
      icon: <LuStar size={24} />,
      action: () => setIsReviewModalOpen(true)
    },
    {
      name: "TRACK ORDER",
      icon: <LuStore size={24} />,
      link: "/track-order",
    },
  ];

  const handleScroll = (id: string) => {
    if (pathname !== "/") {
      router.push(`/?scrollTo=${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const navbarHeight = document.querySelector("nav")?.offsetHeight || 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
          top: elementPosition - navbarHeight - 20,
          behavior: "smooth",
        });
      }
    }
  };

  const handleNavItemClick = (item: any) => {
    if (item.action) {
      item.action();
    } else if (item.link) {
      router.push(item.link);
    } else if (item.id) {
      handleScroll(item.id);
    }
  };

  return (
    <>
      <nav className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15">
            <div className="flex items-center lg:w-1/3">
              <MobileHamBurgerMenu navItems={navItems} />
              <NavbarInput responsive={false} />
            </div>

            <div className="flex-1 flex items-center justify-center lg:w-1/3">
              <Link href={"/"}>
                <h1 className="text-2xl font-bold">VIBECART</h1>
              </Link>
            </div>

            <div className="flex items-center justify-end lg:w-1/3">
              <AccountDropDown />
              <CartDrawer />
            </div>
          </div>

          <NavbarInput responsive={true} />
        </div>

        <div className="hidden lg:block border-t border-gray-200 mt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-evenly py-3">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavItemClick(item)}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 group transition duration-300"
                >
                  <div className="flex items-center gap-1">
                    {item.icon}
                    {item.name}
                  </div>
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black"></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </>
  );
};

export default Navbar;