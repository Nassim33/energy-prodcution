import { z } from "zod";

export const productionTypeSchema = z.enum([
  "BIOMASS",
  "FOSSIL_GAS",
  "FOSSIL_HARD_COAL",
  "FOSSIL_OIL",
  "HYDRO_PUMPED_STORAGE",
  "HYDRO_RUN_OF_RIVER_AND_POUNDAGE",
  "HYDRO_WATER_RESERVOIR",
  "NUCLEAR",
  "SOLAR",
  "WASTE",
  "WIND_OFFSHORE",
  "WIND_ONSHORE",
]);

export type ProductionType = z.infer<typeof productionTypeSchema>;

export const PRODUCTION_TYPES = productionTypeSchema.options;

export const generationValueSchema = z.object({
  start_date: z.string(),
  end_date: z.string(),
  updated_date: z.string(),
  value: z.number().int(),
});

export type GenerationValue = z.infer<typeof generationValueSchema>;

export const productionTypeSeriesSchema = z.object({
  start_date: z.string(),
  end_date: z.string(),
  production_type: productionTypeSchema,
  values: z.array(generationValueSchema),
});

export type ProductionTypeSeries = z.infer<typeof productionTypeSeriesSchema>;

export type ActualGeneration = {
  actual_generations_per_production_type: ProductionTypeSeries[];
};

export type ActualGenerationInput = {
  actual_generations_per_production_type: unknown[];
};

// RTE returns a 13th aggregate series with production_type "TOTAL" (whose values also omit
// `updated_date`). Validate each series with the strict 12-sector schema and drop any that
// don't match, keeping the output strictly typed.
export const actualGenerationSchema: z.ZodType<
  ActualGeneration,
  z.ZodTypeDef,
  ActualGenerationInput
> = z
  .object({
    actual_generations_per_production_type: z.array(z.unknown()),
  })
  .transform((data): ActualGeneration => ({
    actual_generations_per_production_type: data.actual_generations_per_production_type.flatMap(
      (series) => {
        const parsed = productionTypeSeriesSchema.safeParse(series);
        return parsed.success ? [parsed.data] : [];
      },
    ),
  }));
