import { z } from 'zod';

export const adSchema = z.object({
  title: z.string().min(5, "Başlık en az 5 karakter olmalıdır").max(100, "Başlık çok uzun"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  price: z.number({ invalid_type_error: "Geçerli bir fiyat giriniz" }).min(0, "Fiyat 0'dan küçük olamaz"),
  currency: z.enum(['TL', 'USD', 'EUR', 'GBP']),
  city: z.string().min(1, "İl seçimi zorunludur"),
  district: z.string().min(1, "İlçe seçimi zorunludur"),
  category: z.string().min(1, "Kategori seçimi zorunludur"),
  image: z.string().nullable().optional(),
  images: z.array(z.string()).optional(),

  // Elektronik Alanları (Opsiyonel bırakıldı, formda required kontrol edilebilir)
  brand: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  processor: z.string().optional().nullable(),
  ram: z.string().optional().nullable(),
  screen_size: z.string().optional().nullable(),
  gpu_capacity: z.string().optional().nullable(),
  resolution: z.string().optional().nullable(),
  ssd_capacity: z.string().optional().nullable(),

  // Eski alanlar (Pasife çekildi)
  year: z.any().optional().nullable(),
  km: z.any().optional().nullable(),
  m2: z.any().optional().nullable(),
  room: z.any().optional().nullable(),
  technical_specs: z.any().optional().nullable()
});

export type AdFormValues = z.infer<typeof adSchema>;