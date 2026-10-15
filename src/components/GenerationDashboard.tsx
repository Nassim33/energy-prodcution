import { useState } from "react";
import { ThunderboltFilled } from "@ant-design/icons";
import { Card, Space, Tag, Typography } from "antd";
import { CategoryFilter } from "@/components/CategoryFilter";
import { LatestGenerationSummary } from "@/components/LatestGenerationSummary";
import type { ProductionTypeSeries } from "@/schemas/generation";
import { CATEGORY_OF_PRODUCTION_TYPE, type ProductionCategory } from "@/shared/generationMeta";
import { formatDate, formatDateTime } from "@/shared/format";
import { parseRteDate } from "@/shared/dates";

export function GenerationDashboard({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const [selectedCategories, setSelectedCategories] = useState<ProductionCategory[]>([]);

  const filter =
    selectedCategories.length === 0
      ? undefined
      : (series: ProductionTypeSeries) =>
          selectedCategories.includes(CATEGORY_OF_PRODUCTION_TYPE[series.production_type]);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Space className="home hero" size={0} wrap>
        <Space direction="vertical" size={0}>
          <Typography.Title level={1} style={{ marginBottom: 8 }}>
            Production d'énergie en France
          </Typography.Title>
          <Typography.Paragraph type="secondary" style={{ fontSize: 16, marginBottom: 0 }}>
            La puissance injectée sur le réseau électrique, par filière, sur les 7 derniers jours.
          </Typography.Paragraph>
        </Space>
        <Tag icon={<ThunderboltFilled />} className="home hero-chip" color="blue">
          {formatDate(parseRteDate(startDate))} → {formatDateTime(parseRteDate(endDate))}
        </Tag>
      </Space>

      <Card className="home filter-card">
        <Space className="home filter-row" size={0} wrap>
          <Space direction="vertical" size={0}>
            <Typography.Text strong>Filtrer par catégorie d'énergie</Typography.Text>
            <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
              {selectedCategories.length === 0
                ? "Aucune sélection : toutes les filières sont affichées."
                : `${selectedCategories.length} catégorie${selectedCategories.length > 1 ? "s" : ""} sélectionnée${selectedCategories.length > 1 ? "s" : ""}.`}
            </Typography.Paragraph>
          </Space>
          <CategoryFilter value={selectedCategories} onChange={setSelectedCategories} />
        </Space>
      </Card>

      <LatestGenerationSummary startDate={startDate} endDate={endDate} filter={filter} />
    </Space>
  );
}
