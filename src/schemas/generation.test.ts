import { describe, expect, it } from "vitest";
import { PRODUCTION_TYPES, actualGenerationSchema, type ActualGenerationInput } from "./generation";

interface SeriesInput {
  start_date: string;
  end_date: string;
  production_type: string;
  values: Array<{
    start_date: string;
    end_date: string;
    updated_date?: string;
    value: number;
  }>;
}

const HOUR: SeriesInput = {
  start_date: "2026-09-09T00:00:00+02:00",
  end_date: "2026-09-09T01:00:00+02:00",
  production_type: "BIOMASS",
  values: [
    {
      start_date: "2026-09-09T00:00:00+02:00",
      end_date: "2026-09-09T01:00:00+02:00",
      updated_date: "2026-09-09T01:56:58+02:00",
      value: 321,
    },
  ],
};

function buildPayload(): ActualGenerationInput {
  return {
    actual_generations_per_production_type: PRODUCTION_TYPES.map((productionType) => ({
      ...HOUR,
      production_type: productionType,
    })),
  };
}

describe("actualGenerationSchema", () => {
  it("accepts the 12 real production types", () => {
    const parsed = actualGenerationSchema.parse(buildPayload());

    expect(
      parsed.actual_generations_per_production_type.map((series) => series.production_type),
    ).toEqual(PRODUCTION_TYPES);
  });

  it("drops the RTE 'TOTAL' aggregate series that the real API returns", () => {
    const payload = buildPayload();
    payload.actual_generations_per_production_type.push({
      ...HOUR,
      production_type: "TOTAL",
    });

    const parsed = actualGenerationSchema.parse(payload);
    const parsedTypes = parsed.actual_generations_per_production_type.map(
      (series) => series.production_type,
    );

    expect(parsedTypes).toHaveLength(PRODUCTION_TYPES.length);
    expect(parsedTypes.every((type) => PRODUCTION_TYPES.includes(type))).toBe(true);
  });
});
