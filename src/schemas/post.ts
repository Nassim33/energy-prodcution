import { z } from "zod";

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  createdAt: z.string().datetime(),
});

export const postInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
});

export type Post = z.infer<typeof postSchema>;
export type PostInput = z.infer<typeof postInputSchema>;
