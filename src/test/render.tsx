import type { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render } from "@testing-library/react";

/**
 * Renders a component as the sole route of a fresh in-memory router, so
 * components using <Link>/useParams work the same as they do in the app.
 */
export function renderWithProviders(ui: ReactElement, { path = "/" }: { path?: string } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  const rootRoute = createRootRoute();
  const testRoute = createRoute({
    getParentRoute: () => rootRoute,
    path,
    component: () => ui,
  });
  const postDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/posts/$postId",
    component: () => null,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([testRoute, postDetailRoute]),
    history: createMemoryHistory({ initialEntries: [path] }),
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}
