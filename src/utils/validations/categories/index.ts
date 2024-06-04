import { z } from "zod";

export const categorySchema = z.object({
  id: z.coerce.number(),
  name: z.string().min(1),
  image: z.string().url(),
});

export type Category = z.infer<typeof categorySchema>;
