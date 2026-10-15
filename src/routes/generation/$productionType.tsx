import { lazy, Suspense } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Result, Skeleton, Space, Tag, Typography } from "antd";
import { useActualGenerationQuery } from "@/api/generation";
import { productionTypeSchema } from "@/schemas/generation";
import { getCategory, getProductionTypeMeta } from "@/shared/generationMeta";
import { formatDate } from "@/shared/format";
import { parseRteDate } from "@/shared/dates";
import { DEFAULT_WINDOW } from "@/shared/weekWindow";

const GenerationChart = lazy(() =>
  import("@/components/GenerationChart").then((module) => ({ default: module.GenerationChart })),
);

export const Route = createFileRoute("/generation/$productionType")({
  component: GenerationPage,
});

function GenerationPage() {
  const { productionType } = Route.useParams();
  const parsed = productionTypeSchema.safeParse(productionType);
  const { data, isPending, isError, refetch } = useActualGenerationQuery(
    DEFAULT_WINDOW.startDate,
    DEFAULT_WINDOW.endDate,
  );

  if (!parsed.success) {
    return (
      <Result
        status="404"
        title="Filière inconnue"
        subTitle={`« ${productionType} » n'est pas une filière de production reconnue.`}
        extra={
          <Link to="/">
            <Button type="primary">Retour à la vue d'ensemble</Button>
          </Link>
        }
      />
    );
  }

  const type = parsed.data;
  const meta = getProductionTypeMeta(type);
  const category = getCategory(type);
  const series = data?.actual_generations_per_production_type.find(
    (entry) => entry.production_type === type,
  );

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Link to="/" className="chart-page back-link">
        <ArrowLeftOutlined /> Retour à la vue d'ensemble
      </Link>

      <Space className="chart-page header" direction="vertical" size={0}>
        <Space direction="vertical" size={0}>
          <Tag color={category.color}>{category.label}</Tag>
          <Typography.Title level={1} style={{ marginTop: 8, marginBottom: 4 }}>
            {meta.label}
          </Typography.Title>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0, fontSize: 15 }}>
            {meta.description} · du {formatDate(parseRteDate(DEFAULT_WINDOW.startDate))} au{" "}
            {formatDate(parseRteDate(DEFAULT_WINDOW.endDate))}
          </Typography.Paragraph>
        </Space>
      </Space>

      <Card>
        {isPending && <Skeleton active paragraph={{ rows: 12 }} />}
        {isError && (
          <Alert
            type="error"
            showIcon
            message="Impossible de charger les données"
            description="La source de données RTE est indisponible pour le moment."
            action={
              <Button size="small" danger onClick={() => refetch()}>
                Réessayer
              </Button>
            }
          />
        )}
        {!isPending && !isError && !series && (
          <Alert
            type="warning"
            showIcon
            message="Aucune donnée disponible pour cette filière sur la période."
          />
        )}
        {!isPending && !isError && series && (
          <Suspense fallback={<Skeleton active paragraph={{ rows: 12 }} />}>
            <GenerationChart productionType={type} series={series} />
          </Suspense>
        )}
      </Card>
    </Space>
  );
}
