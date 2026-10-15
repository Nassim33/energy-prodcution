import { http, HttpResponse } from "msw";
import { rteConfig } from "@/config/app.config";
import type { Post } from "@/schemas/post";
import { getWeeklyWindow } from "@/shared/dates";
import { buildMockActualGeneration } from "@/mocks/generationData";

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

  http.post(`${rteConfig.baseURL}/token/oauth/`, () => {
    return HttpResponse.json({
      access_token: "mock-rte-access-token",
      token_type: "Bearer",
      expires_in: 3600,
    });
  }),

  http.get(
    `${rteConfig.baseURL}/open_api/actual_generation/v1/actual_generations_per_production_type`,
    ({ request }) => {
      const searchParams = new URL(request.url).searchParams;
      const { startDate, endDate } = getWeeklyWindow();
      const start = searchParams.get("start_date") ?? startDate;
      const end = searchParams.get("end_date") ?? endDate;
      return HttpResponse.json(buildMockActualGeneration(start, end));
    },
  ),
];
