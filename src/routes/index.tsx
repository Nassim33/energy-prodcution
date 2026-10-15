import { createFileRoute } from "@tanstack/react-router";
import { GenerationDashboard } from "@/components/GenerationDashboard";
import { DEFAULT_WINDOW } from "@/shared/weekWindow";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <GenerationDashboard startDate={DEFAULT_WINDOW.startDate} endDate={DEFAULT_WINDOW.endDate} />
  );
}
