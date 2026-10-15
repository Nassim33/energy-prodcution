import {
  PRODUCTION_TYPES,
  type ActualGeneration,
  type GenerationValue,
} from "@/schemas/generation";
import { formatIsoDate, parseRteDate } from "@/shared/dates";

interface Curve {
  base: number;
  amplitude: number;
  peakHour: number;
}

const CURVES: Record<(typeof PRODUCTION_TYPES)[number], Curve> = {
  NUCLEAR: { base: 39_000, amplitude: 2_500, peakHour: 9 },
  FOSSIL_GAS: { base: 2_500, amplitude: 1_200, peakHour: 19 },
  FOSSIL_HARD_COAL: { base: 300, amplitude: 100, peakHour: 10 },
  FOSSIL_OIL: { base: 120, amplitude: 40, peakHour: 19 },
  BIOMASS: { base: 720, amplitude: 60, peakHour: 9 },
  WASTE: { base: 330, amplitude: 20, peakHour: 9 },
  SOLAR: { base: 500, amplitude: 9_500, peakHour: 13 },
  WIND_ONSHORE: { base: 9_500, amplitude: 4_500, peakHour: 6 },
  WIND_OFFSHORE: { base: 2_200, amplitude: 1_800, peakHour: 6 },
  HYDRO_PUMPED_STORAGE: { base: 700, amplitude: 600, peakHour: 21 },
  HYDRO_RUN_OF_RIVER_AND_POUNDAGE: { base: 6_000, amplitude: 2_000, peakHour: 18 },
  HYDRO_WATER_RESERVOIR: { base: 4_200, amplitude: 1_800, peakHour: 19 },
};

const MAX_POINTS = 7 * 24;

// Deterministic hourly curves (one value per hour) used by the MSW handler,
// so tests and the mocked dev mode behave like the live RTE API.
export function buildMockActualGeneration(startDate: string, endDate: string): ActualGeneration {
  const start = parseRteDate(startDate);
  const end = parseRteDate(endDate);

  const series = PRODUCTION_TYPES.map((productionType) => {
    const curve = CURVES[productionType];
    const values: GenerationValue[] = [];
    const cursor = new Date(start);

    for (let count = 0; count < MAX_POINTS && cursor <= end; count++) {
      const hour = cursor.getHours() + cursor.getMinutes() / 60;
      const value = Math.round(
        curve.base + curve.amplitude * Math.sin(((hour - curve.peakHour + 6) / 24) * Math.PI * 2),
      );

      const intervalStart = formatIsoDate(cursor);
      const intervalEnd = formatIsoDate(new Date(cursor.getTime() + 60 * 60_000));
      values.push({
        start_date: intervalStart,
        end_date: intervalEnd,
        updated_date: intervalStart,
        value,
      });

      cursor.setHours(cursor.getHours() + 1);
    }

    return {
      start_date: startDate,
      end_date: endDate,
      production_type: productionType,
      values,
    };
  });

  return { actual_generations_per_production_type: series };
}
