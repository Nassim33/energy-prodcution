import { http, HttpResponse } from "msw";
import type { Post } from "@/schemas/post";

const posts: Post[] = [
  {
    id: "1",
    title: "Kubb + TanStack Query is a great pairing",
    body: "Generate typed hooks straight from your OpenAPI spec.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "oxlint is fast",
    body: "A Rust-based linter that runs 50-100x faster than ESLint.",
    createdAt: new Date().toISOString(),
  },
];

export const handlers = [
  http.get("/api/posts", () => HttpResponse.json(posts)),

  http.get("/api/posts/:id", ({ params }) => {
    const post = posts.find((p) => p.id === params.id);
    if (!post) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(post);
  }),

  http.post("/api/posts", async ({ request }) => {
    const body = (await request.json()) as { title: string; body: string };
    const newPost: Post = {
      id: String(posts.length + 1),
      title: body.title,
      body: body.body,
      createdAt: new Date().toISOString(),
    };
    posts.push(newPost);
    return HttpResponse.json(newPost, { status: 201 });
  }),
];
