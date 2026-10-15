import { Alert, Button, Col, Empty, Row, Skeleton } from "antd";
import { useActualGenerationQuery } from "@/api/generation";
import type { ProductionTypeSeries } from "@/schemas/generation";
import { GenerationValueCard } from "@/components/GenerationValueCard";

interface LatestGenerationSummaryProps {
  startDate: string;
  endDate: string;
  filter?: (series: ProductionTypeSeries) => boolean;
}

export function LatestGenerationSummary({
  startDate,
  endDate,
  filter,
}: LatestGenerationSummaryProps) {
  const { data, isPending, isError, refetch } = useActualGenerationQuery(startDate, endDate);

  if (isPending) {
    return (
      <Row gutter={[16, 16]}>
        {Array.from({ length: 12 }, (_, index) => (
          <Col key={index} xs={24} sm={12} lg={8} xl={6}>
            <Skeleton active paragraph={{ rows: 3 }} />
          </Col>
        ))}
      </Row>
    );
  }

  if (isError) {
    return (
      <Alert
        type="error"
        showIcon
        message="Impossible de charger la production d'énergie"
        description="La source de données RTE est indisponible pour le moment. Vérifiez la clé d'API (VITE_RTE_IDENTIFIER) et votre connexion, ou activez les mocks locaux (VITE_ENABLE_MOCKS=true)."
        action={
          <Button size="small" danger onClick={() => refetch()}>
            Réessayer
          </Button>
        }
      />
    );
  }

  const seriesList = data?.actual_generations_per_production_type ?? [];
  const visible = filter ? seriesList.filter(filter) : seriesList;

  if (visible.length === 0) {
    return (
      <Empty
        description="Aucune filière ne correspond à la sélection."
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {visible.map((series) => (
        <Col key={series.production_type} xs={24} sm={12} lg={8} xl={6}>
          <GenerationValueCard series={series} />
        </Col>
      ))}
    </Row>
  );
}
