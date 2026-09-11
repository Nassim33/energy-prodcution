import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, Space, Typography } from "antd";
import { useAppStore } from "@/store/useAppStore";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { themeMode, toggleTheme } = useAppStore();

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Typography.Title level={2}>React Starter 2026</Typography.Title>
      <Typography.Paragraph>
        Vite + React 19 + antd + TanStack Query/Router + Zustand + Zod + Kubb + oxlint + Vitest +
        MSW, wired together and ready to build on.
      </Typography.Paragraph>
      <Card>
        <Space>
          <span>Zustand-persisted theme preference: {themeMode}</span>
          <Button onClick={toggleTheme}>Toggle</Button>
        </Space>
      </Card>
    </Space>
  );
}
