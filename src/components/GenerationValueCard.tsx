import { Link } from "@tanstack/react-router";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Card, Space, Tag } from "antd";
import type { ProductionTypeSeries } from "@/schemas/generation";
import { getCategory, getProductionTypeMeta } from "@/shared/generationMeta";
import { formatDateTime, formatMegawatts } from "@/shared/format";
import { parseRteDate } from "@/shared/dates";

interface GenerationValueCardProps {
  series: ProductionTypeSeries;
}

function getLatestValue(series: ProductionTypeSeries) {
  return series.values.at(-1);
}

export function GenerationValueCard({ series }: GenerationValueCardProps) {
  const meta = getProductionTypeMeta(series.production_type);
  const category = getCategory(series.production_type);
  const latest = getLatestValue(series);

  return (
    <Link
      to="/generation/$productionType"
      params={{ productionType: series.production_type }}
      className="generation-value-card-link"
    >
      <Card
        className="generation-value-card"
        hoverable
        styles={{ body: { padding: 0 } }}
        style={{
          borderTop: `3px solid ${meta.color}`,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        <Space className="generation-value-card content" direction="vertical" size={0}>
          <Space className="generation-value-card header" size={0}>
            <Tag color={category.color} className="generation-value-card category-tag">
              {category.label}
            </Tag>
            <span className="generation-value-card title">{meta.label}</span>
          </Space>

          {latest ? (
            <>
              <Space className="generation-value-card value" size={0} style={{ color: meta.color }}>
                {formatMegawatts(latest.value)}
              </Space>
              <Space className="generation-value-card meta" size={0}>
                Mis à jour le {formatDateTime(parseRteDate(latest.updated_date))}
              </Space>
            </>
          ) : (
            <Space className="generation-value-card meta" size={0}>
              Aucune valeur pour la période
            </Space>
          )}

          <Space className="generation-value-card footer" size={0}>
            Voir l'historique
            <ArrowRightOutlined />
          </Space>
        </Space>
      </Card>
    </Link>
  );
}
