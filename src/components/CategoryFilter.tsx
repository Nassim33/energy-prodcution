import { Checkbox, Tag } from "antd";
import {
  CATEGORY_META,
  PRODUCTION_CATEGORIES,
  type ProductionCategory,
} from "@/shared/generationMeta";

interface CategoryFilterProps {
  value: ProductionCategory[];
  onChange: (value: ProductionCategory[]) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <Checkbox.Group
      value={value}
      onChange={(checked) => onChange(checked as ProductionCategory[])}
      className="category-filter"
    >
      {PRODUCTION_CATEGORIES.map((categoryId) => {
        const meta = CATEGORY_META[categoryId];
        return (
          <Checkbox key={categoryId} value={categoryId} className="category-filter option">
            <Tag color={meta.color} className="category-filter tag">
              {meta.label}
            </Tag>
          </Checkbox>
        );
      })}
    </Checkbox.Group>
  );
}
