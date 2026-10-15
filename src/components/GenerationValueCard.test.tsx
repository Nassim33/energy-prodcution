import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GenerationValueCard } from "./GenerationValueCard";
import { renderWithProviders } from "@/test/render";
import { buildMockActualGeneration } from "@/mocks/generationData";

const START = "2026-09-08T00:00:00+01:00";
const END = "2026-09-15T12:00:00+01:00";

const solarSeries = buildMockActualGeneration(
  START,
  END,
).actual_generations_per_production_type.find((series) => series.production_type === "SOLAR");

describe("GenerationValueCard", () => {
  it("renders the production type, latest value and update date", async () => {
    renderWithProviders(<GenerationValueCard series={solarSeries!} />);

    expect(await screen.findByText("Solaire")).toBeInTheDocument();
    expect(screen.getByText("Renouvelable")).toBeInTheDocument();
    expect(screen.getByText(/\d+ MW/)).toBeInTheDocument();
    expect(screen.getByText(/Mis à jour le/)).toBeInTheDocument();
  });

  it("links to the chart page for the production type", async () => {
    renderWithProviders(<GenerationValueCard series={solarSeries!} />);

    const link = await screen.findByRole("link");
    expect(link).toHaveAttribute("href", "/generation/SOLAR");
  });
});
