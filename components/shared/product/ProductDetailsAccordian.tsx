import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const ProductDetailsAccordian = () => {
  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="uppercase subHeading tracking-[1px]">
            DESCRIPTION
          </AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
            voluptates, necessitatibus itaque iste perspiciatis odit repudiandae
            dicta aspernatur beatae, quas modi ut illum nulla ea eligendi
            mollitia, impedit fugiat. Consequuntur.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="uppercase subHeading tracking-[1px]">
            KEY BENEFITS
          </AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
            voluptates, necessitatibus itaque iste perspiciatis odit repudiandae
            dicta aspernatur beatae, quas modi ut illum nulla ea eligendi
            mollitia, impedit fugiat. Consequuntur.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="uppercase subHeading tracking-[1px]">
            Ingredients
          </AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
            voluptates, necessitatibus itaque iste perspiciatis odit repudiandae
            dicta aspernatur beatae, quas modi ut illum nulla ea eligendi
            mollitia, impedit fugiat. Consequuntur.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="uppercase subHeading tracking-[1px]">
            FAQ&apos;S
          </AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
            voluptates, necessitatibus itaque iste perspiciatis odit repudiandae
            dicta aspernatur beatae, quas modi ut illum nulla ea eligendi
            mollitia, impedit fugiat. Consequuntur.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductDetailsAccordian;