import { getWeeklyWindow } from "@/shared/dates";

// Single shared 7-day window for the whole session, used by both the home
// page and the chart page so TanStack Query keys match and the RTE payload
// is fetched once instead of twice with slightly different bounds.
export const DEFAULT_WINDOW = getWeeklyWindow();
