import { useAppStore } from "@/store/useAppStore";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Layout, Menu } from "antd";


export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
    const { themeMode } = useAppStore();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <span style={{ color: "#f8fafc", fontWeight: 600 }}>Starter 2026</span>
        <Menu
          theme={themeMode}
          mode="horizontal"
          style={{ flex: 1, minWidth: 0 }}
          items={[
            { key: "home", label: <Link to="/">Home</Link> },
            { key: "posts", label: <Link to="/posts">Posts</Link> },
          ]}
        />
      </Layout.Header>
      <Layout.Content style={{ padding: 24 }}>
        <Outlet />
      </Layout.Content>
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </Layout>
  );
}
