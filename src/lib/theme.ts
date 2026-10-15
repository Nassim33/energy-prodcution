import type { ThemeConfig } from "antd";

export const theme: ThemeConfig = {
  token: {
    colorPrimary: "#2563eb",
    colorInfo: "#2563eb",
    colorSuccess: "#10b981",
    colorBgLayout: "#f4f7fb",
    colorText: "#1e293b",
    colorTextSecondary: "#64748b",
    borderRadius: 10,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    Layout: {
      headerBg: "#0d1b2a",
      headerHeight: 64,
      headerColor: "#f8fafc",
      siderBg: "#0d1b2a",
    },
    Card: {
      headerFontSize: 16,
    },
    Tag: {
      borderRadiusSM: 999,
    },
  },
};
