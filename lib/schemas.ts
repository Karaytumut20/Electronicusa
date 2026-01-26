import { z } from 'zod';

export const adSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number({ invalid_type_error: "Please enter a valid price" }).min(0, "Price cannot be negative"),
  currency: z.enum(['USD', 'EUR', 'GBP']), // Removed TL
  city: z.string().min(1, "City selection is required"),
  district: z.string().min(1, "District selection is required"),
  category: z.string().min(1, "Category is required"),
  image: z.string().nullable().optional(),
  images: z.array(z.string()).optional(),

  // Electronic Specifics
  brand: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  processor: z.string().optional().nullable(),
  ram: z.string().optional().nullable(),
  screen_size: z.string().optional().nullable(),
  gpu_capacity: z.string().optional().nullable(),
  resolution: z.string().optional().nullable(),
  ssd_capacity: z.string().optional().nullable(),

  // Legacy fields (kept optional to avoid breaks)
  year: z.any().optional().nullable(),
  km: z.any().optional().nullable(),
  m2: z.any().optional().nullable(),
  room: z.any().optional().nullable(),
  technical_specs: z.any().optional().nullable()
});

export type AdFormValues = z.infer<typeof adSchema>;