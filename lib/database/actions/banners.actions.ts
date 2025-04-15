"use server";
import { unstable_cache } from "next/cache";
import { handleError } from "@/lib/utils";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUNDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_SECRET as string,
});

export interface BannerData {
  url: string;
  targetUrl: string | null;
  public_id: string;
}

export const fetchAllWebsiteBanners = unstable_cache(
  async (): Promise<BannerData[]> => {
    try {
      const result = await cloudinary.api.resources_by_tag("website_banners", {
        type: "upload",
        max_results: 100,
        context: true
      });

      return result.resources.map((item: any) => {
        // Clean the target URL if it exists
        let targetUrl = item.context?.custom?.target_url || null;
        if (targetUrl) {
          // Remove double slashes except after http:
          targetUrl = targetUrl.replace(/([^:]\/)\/+/g, '$1');
          // Ensure internal links start with slash
          if (!targetUrl.startsWith('http') && !targetUrl.startsWith('/')) {
            targetUrl = `/${targetUrl}`;
          }
        }

        return {
          url: item.secure_url,
          targetUrl,
          public_id: item.public_id
        };
      });
    } catch (error) {
      console.error("Error fetching banners:", error);
      handleError(error);
      return [];
    }
  },
  ["website_banners"],
  { revalidate: 6 }
);