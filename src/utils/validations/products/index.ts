import { z } from "zod";

export const productSchema = z.object({
  id: z.coerce.number(),
  title: z.string().min(1),
  price: z.coerce.number().positive(),
  description: z.string().min(1),
  images: z.array(z.string().url()).min(1),
  creationAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  category: z.object({
    id: z.coerce.number(),
    name: z.string(),
    image: z.string().url(),
    creationAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
});

export const createProductSchema = z.object({
  title: z.string().min(1),
  price: z.coerce.number().positive(),
  description: z.string().min(1),
  categoryId: z.coerce.number(),
  images: z.array(z.string().url()).min(1),
});

export type Product = z.infer<typeof productSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
