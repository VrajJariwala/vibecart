"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const ScrollToSection = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("scrollTo");
    if (id) {
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
  }, [searchParams]);

  return null;
};

export default ScrollToSection;
