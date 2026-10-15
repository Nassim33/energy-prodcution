import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { GenerationDashboard } from "./GenerationDashboard";
import { renderWithProviders } from "@/test/render";

const START = "2026-09-08T00:00:00+01:00";
const END = "2026-09-15T12:00:00+01:00";
const RENEWABLE_COUNT = 7;
const NON_RENEWABLE_COUNT = 4;
const NUCLEAR_COUNT = 1;
const TOTAL_COUNT = RENEWABLE_COUNT + NON_RENEWABLE_COUNT + NUCLEAR_COUNT;

describe("GenerationDashboard", () => {
  it("shows one latest-value card per production type", async () => {
    renderWithProviders(<GenerationDashboard startDate={START} endDate={END} />);

    const links = await screen.findAllByRole("link");
    expect(links).toHaveLength(TOTAL_COUNT);
    expect(await screen.findByText("Solaire")).toBeInTheDocument();
  });

  it("filters the cards by selected category", async () => {
    const user = userEvent.setup();
    renderWithProviders(<GenerationDashboard startDate={START} endDate={END} />);

    await screen.findAllByRole("link");

    // "Nucléaire" appears three times while the nuclear card is visible:
    // once as the category filter option, plus card title and category tag.
    expect(screen.getAllByText("Nucléaire")).toHaveLength(3);

    await user.click(screen.getByRole("checkbox", { name: "Renouvelable" }));

    expect(screen.getAllByRole("link")).toHaveLength(RENEWABLE_COUNT);
    expect(screen.getAllByText("Nucléaire")).toHaveLength(1);
    expect(screen.getByText("Éolien terrestre")).toBeInTheDocument();
    expect(screen.queryByText("Gaz fossile")).not.toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: "Non-renouvelable" }));

    expect(screen.getAllByRole("link")).toHaveLength(RENEWABLE_COUNT + NON_RENEWABLE_COUNT);
    expect(screen.getByText("Gaz fossile")).toBeInTheDocument();
  });
});
