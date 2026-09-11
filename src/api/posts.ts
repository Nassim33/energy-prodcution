/**
 * Hand-written today; once you run `pnpm generate` against openapi.yaml,
 * equivalent (and more exhaustive) code lands in src/api/gen and you can
 * delete this file. Kept here so the starter runs before you've wired up
 * a real backend/spec.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api-client";
import { postSchema, postInputSchema, type Post, type PostInput } from "@/schemas/post";
import { z } from "zod";

const postListSchema = z.array(postSchema);

async function listPosts(signal?: AbortSignal): Promise<Post[]> {
  const { data } = await client<unknown>({ url: "/posts", method: "GET", signal });
  return postListSchema.parse(data);
}

async function getPostById(postId: string, signal?: AbortSignal): Promise<Post> {
  const { data } = await client<unknown>({ url: `/posts/${postId}`, method: "GET", signal });
  return postSchema.parse(data);
}

async function createPost(input: PostInput): Promise<Post> {
  const payload = postInputSchema.parse(input);
  const { data } = await client<unknown, unknown, PostInput>({
    url: "/posts",
    method: "POST",
    data: payload,
  });
  return postSchema.parse(data);
}

export const postKeys = {
  all: ["posts"] as const,
  detail: (id: string) => ["posts", id] as const,
};

export function usePostsQuery() {
  return useQuery({
    queryKey: postKeys.all,
    queryFn: ({ signal }) => listPosts(signal),
  });
}

export function usePostQuery(postId: string) {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: ({ signal }) => getPostById(postId, signal),
    enabled: Boolean(postId),
  });
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}
