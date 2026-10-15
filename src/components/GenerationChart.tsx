import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Space, Typography } from "antd";
import type { ProductionType, ProductionTypeSeries } from "@/schemas/generation";
import { getProductionTypeMeta } from "@/shared/generationMeta";
import {
  formatCompactDateTime,
  formatDateTime,
  formatMegawatts,
  formatNumber,
} from "@/shared/format";
import { parseRteDate } from "@/shared/dates";

interface GenerationChartProps {
  productionType: ProductionType;
  series: ProductionTypeSeries;
}

interface ChartPoint {
  time: number;
  value: number;
}

function toChartPoints(series: ProductionTypeSeries): ChartPoint[] {
  return series.values.map((value) => ({
    time: parseRteDate(value.start_date).getTime(),
    value: value.value,
  }));
}

export function GenerationChart({ productionType, series }: GenerationChartProps) {
  const meta = getProductionTypeMeta(productionType);
  const points = toChartPoints(series);
  const latest = series.values.at(-1)?.value;

  const total = points.reduce((sum, point) => sum + point.value, 0);
  const average = points.length > 0 ? total / points.length : 0;
  const min = points.reduce((minimum, point) => Math.min(minimum, point.value), Infinity);
  const max = points.reduce((maximum, point) => Math.max(maximum, point.value), -Infinity);

  return (
    <Space className="generation-chart" direction="vertical" size={0} style={{ width: "100%" }}>
      <Space className="generation-chart stats" size={0}>
        <Space className="generation-chart stat" direction="vertical" size={0}>
          <span className="generation-chart stat-label">Dernière mesure</span>
          <span className="generation-chart stat-value" style={{ color: meta.color }}>
            {latest != null ? formatMegawatts(latest) : "—"}
          </span>
        </Space>
        <Space className="generation-chart stat" direction="vertical" size={0}>
          <span className="generation-chart stat-label">Moyenne</span>
          <span className="generation-chart stat-value">
            {formatMegawatts(Math.round(average))}
          </span>
        </Space>
        <Space className="generation-chart stat" direction="vertical" size={0}>
          <span className="generation-chart stat-label">Minimum</span>
          <span className="generation-chart stat-value">{formatMegawatts(Math.round(min))}</span>
        </Space>
        <Space className="generation-chart stat" direction="vertical" size={0}>
          <span className="generation-chart stat-label">Maximum</span>
          <span className="generation-chart stat-value">{formatMegawatts(Math.round(max))}</span>
        </Space>
      </Space>

      <Typography.Paragraph type="secondary" className="generation-chart caption">
        {meta.description} · {formatNumber(points.length)} relevés sur 7 jours
      </Typography.Paragraph>

      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id={`gradient-${productionType}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={meta.color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={meta.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="time"
            type="number"
            scale="time"
            domain={["auto", "auto"]}
            tickFormatter={(tick: number) => formatCompactDateTime(new Date(tick))}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
            minTickGap={32}
          />
          <YAxis
            tickFormatter={(tick: number) => formatNumber(tick)}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            width={64}
          />
          <Tooltip
            labelFormatter={(label) => formatDateTime(new Date(label as number))}
            formatter={(value) => [formatMegawatts(value as number), meta.label]}
            contentStyle={{
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 24px rgba(15,23,42,.08)",
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="none"
            fill={`url(#gradient-${productionType})`}
            isAnimationActive
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={meta.color}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Space>
  );
}
