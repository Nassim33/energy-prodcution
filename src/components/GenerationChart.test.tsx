import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Space } from "antd";
import { GenerationChart } from "./GenerationChart";
import { buildMockActualGeneration } from "@/mocks/generationData";

vi.mock("recharts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("recharts")>();
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => (
      <Space size={0} style={{ width: 640, height: 360 }}>
        {children}
      </Space>
    ),
  };
});

const START = "2026-09-08T00:00:00+01:00";
const END = "2026-09-15T12:00:00+01:00";

const nuclearSeries = buildMockActualGeneration(
  START,
  END,
).actual_generations_per_production_type.find((series) => series.production_type === "NUCLEAR");

describe("GenerationChart", () => {
  it("renders the chart, stats and the series legend values", () => {
    render(<GenerationChart productionType="NUCLEAR" series={nuclearSeries!} />);

    expect(screen.getByText("Dernière mesure")).toBeInTheDocument();
    expect(screen.getByText("Moyenne")).toBeInTheDocument();
    expect(screen.getByText(/relevés sur 7 jours/)).toBeInTheDocument();
  });
});
