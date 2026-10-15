import type { ProductionType } from "@/schemas/generation";

export const PRODUCTION_CATEGORIES = ["RENEWABLE", "NON_RENEWABLE", "NUCLEAR"] as const;

export type ProductionCategory = (typeof PRODUCTION_CATEGORIES)[number];

export interface CategoryMeta {
  id: ProductionCategory;
  label: string;
  color: string;
}

// RTE's own split: nuclear, fossil-fuelled thermal, and renewables
// (wind, solar, hydro, biomass). WASTE (incineration) is counted as
// non-renewable, pumped-storage hydro as renewable.
export const CATEGORY_META: Record<ProductionCategory, CategoryMeta> = {
  RENEWABLE: { id: "RENEWABLE", label: "Renouvelable", color: "#10b981" },
  NON_RENEWABLE: { id: "NON_RENEWABLE", label: "Non-renouvelable", color: "#f97316" },
  NUCLEAR: { id: "NUCLEAR", label: "Nucléaire", color: "#6366f1" },
};

export const CATEGORY_OF_PRODUCTION_TYPE: Record<ProductionType, ProductionCategory> = {
  BIOMASS: "RENEWABLE",
  WIND_OFFSHORE: "RENEWABLE",
  WIND_ONSHORE: "RENEWABLE",
  SOLAR: "RENEWABLE",
  HYDRO_PUMPED_STORAGE: "RENEWABLE",
  HYDRO_RUN_OF_RIVER_AND_POUNDAGE: "RENEWABLE",
  HYDRO_WATER_RESERVOIR: "RENEWABLE",
  FOSSIL_GAS: "NON_RENEWABLE",
  FOSSIL_HARD_COAL: "NON_RENEWABLE",
  FOSSIL_OIL: "NON_RENEWABLE",
  WASTE: "NON_RENEWABLE",
  NUCLEAR: "NUCLEAR",
};

export interface ProductionTypeMeta {
  type: ProductionType;
  label: string;
  description: string;
  color: string;
}

export const PRODUCTION_TYPE_META: Record<ProductionType, ProductionTypeMeta> = {
  NUCLEAR: {
    type: "NUCLEAR",
    label: "Nucléaire",
    description: "Réacteurs nucléaires",
    color: "#6366f1",
  },
  FOSSIL_GAS: {
    type: "FOSSIL_GAS",
    label: "Gaz fossile",
    description: "Centrales à turbine à combustion et cycles combinés",
    color: "#f97316",
  },
  FOSSIL_HARD_COAL: {
    type: "FOSSIL_HARD_COAL",
    label: "Charbon",
    description: "Centrales à charbon",
    color: "#64748b",
  },
  FOSSIL_OIL: {
    type: "FOSSIL_OIL",
    label: "Fioul",
    description: "Centrales au fioul",
    color: "#ef4444",
  },
  BIOMASS: {
    type: "BIOMASS",
    label: "Biomasse",
    description: "Biomasse et biogaz",
    color: "#65a30d",
  },
  WASTE: {
    type: "WASTE",
    label: "Déchets",
    description: "Valorisation énergétique des déchets",
    color: "#a16207",
  },
  SOLAR: {
    type: "SOLAR",
    label: "Solaire",
    description: "Photovoltaïque",
    color: "#f59e0b",
  },
  WIND_ONSHORE: {
    type: "WIND_ONSHORE",
    label: "Éolien terrestre",
    description: "Parcs éoliens à terre",
    color: "#22c55e",
  },
  WIND_OFFSHORE: {
    type: "WIND_OFFSHORE",
    label: "Éolien en mer",
    description: "Parcs éoliens en mer",
    color: "#14b8a6",
  },
  HYDRO_PUMPED_STORAGE: {
    type: "HYDRO_PUMPED_STORAGE",
    label: "Hydro (pompage)",
    description: "Stations de transfert d'énergie par pompage (STEP)",
    color: "#3b82f6",
  },
  HYDRO_RUN_OF_RIVER_AND_POUNDAGE: {
    type: "HYDRO_RUN_OF_RIVER_AND_POUNDAGE",
    label: "Hydro (fil de l'eau)",
    description: "Aux fil de l'eau et éclusées",
    color: "#0ea5e9",
  },
  HYDRO_WATER_RESERVOIR: {
    type: "HYDRO_WATER_RESERVOIR",
    label: "Hydro (réservoir)",
    description: "Centrales à réservoir et lacs",
    color: "#2563eb",
  },
};

export function getCategory(productionType: ProductionType): CategoryMeta {
  return CATEGORY_META[CATEGORY_OF_PRODUCTION_TYPE[productionType]];
}

export function getProductionTypeMeta(productionType: ProductionType): ProductionTypeMeta {
  return PRODUCTION_TYPE_META[productionType];
}
