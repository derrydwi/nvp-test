import { z } from "zod";

export const searchSchema = z.object({
  search: z.string(),
});

export type Search = z.infer<typeof searchSchema>;
