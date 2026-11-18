import type { z } from "zod";
import type {
  addressSchema,
  announcementSchema,
  businessProfileSchema,
  contactInformationSchema,
  dataStatusSchema,
  galleryImageSchema,
  highlightSchema,
  illustrationSchema,
  menuCategorySchema,
  menuProductSchema,
  openingHoursSchema,
  openingPeriodSchema,
  photoSchema,
  productAvailabilitySchema,
  productTagSchema,
  productVariantSchema,
  socialLinkSchema,
  storyBlockSchema,
} from "@/lib/schemas";

export type DataStatus = z.infer<typeof dataStatusSchema>;
export type Photo = z.infer<typeof photoSchema>;
export type OpeningPeriod = z.infer<typeof openingPeriodSchema>;
export type OpeningHours = z.infer<typeof openingHoursSchema>;
export type Address = z.infer<typeof addressSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type ContactInformation = z.infer<typeof contactInformationSchema>;
export type BusinessProfile = z.infer<typeof businessProfileSchema>;
export type BusinessAnnouncement = z.infer<typeof announcementSchema>;
export type MenuCategory = z.infer<typeof menuCategorySchema>;
export type ProductVariant = z.infer<typeof productVariantSchema>;
export type ProductAvailability = z.infer<typeof productAvailabilitySchema>;
export type ProductTag = z.infer<typeof productTagSchema>;
export type Illustration = z.infer<typeof illustrationSchema>;
export type MenuProduct = z.infer<typeof menuProductSchema>;
export type GalleryImage = z.infer<typeof galleryImageSchema>;
export type Highlight = z.infer<typeof highlightSchema>;
export type StoryBlock = z.infer<typeof storyBlockSchema>;

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
