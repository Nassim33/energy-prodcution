import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PostList } from "./PostList";
import { renderWithProviders } from "@/test/render";

describe("PostList", () => {
  it("renders posts returned by the (mocked) API", async () => {
    renderWithProviders(<PostList />);

    await waitFor(() => {
      expect(screen.getByText(/kubb \+ tanstack query/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/oxlint is fast/i)).toBeInTheDocument();
  });

  it("shows the new-post form", async () => {
    renderWithProviders(<PostList />);
    expect(await screen.findByRole("button", { name: /publish/i })).toBeInTheDocument();
  });
});
