import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThunderboltFilled } from "@ant-design/icons";
import { Layout, Menu, Space } from "antd";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f4f7fb" }}>
      <Layout.Header style={{ display: "flex", alignItems: "center", gap: 24, paddingInline: 24 }}>
        <Link to="/" className="app-brand" aria-label="Accueil">
          <ThunderboltFilled style={{ color: "#facc15", fontSize: 20 }} />
          <span>Énergie France</span>
        </Link>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ flex: 1, minWidth: 0, fontWeight: 500, background: "transparent" }}
          items={[
            { key: "home", label: <Link to="/">Production</Link> },
            { key: "posts", label: <Link to="/posts">Posts</Link> },
          ]}
        />
      </Layout.Header>
      <Layout.Content style={{ padding: 24 }}>
        <Space className="app-container" direction="vertical" size={0}>
          <Outlet />
        </Space>
      </Layout.Content>
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </Layout>
  );
}
