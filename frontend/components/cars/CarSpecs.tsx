"use client";
import { useState } from "react";
import { CarSpec, FUEL_TYPE_LABELS, formatPrice } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SpecRow = { label: string; key: keyof CarSpec; unit?: string; group: string };

const SPEC_ROWS: SpecRow[] = [
  // Engine
  { label: "排氣量", key: "displacement", unit: "L", group: "引擎" },
  { label: "最大馬力", key: "horsepower", unit: "hp", group: "引擎" },
  { label: "最大扭力", key: "torque", unit: "Nm", group: "引擎" },
  { label: "汽缸數", key: "cylinder_count", unit: "缸", group: "引擎" },
  { label: "燃料類型", key: "fuel_type", group: "引擎" },
  // Performance
  { label: "0-100 km/h", key: "acceleration", unit: "秒", group: "性能" },
  { label: "極速", key: "top_speed", unit: "km/h", group: "性能" },
  { label: "油耗", key: "fuel_consumption", unit: "L/100km", group: "性能" },
  { label: "純電里程", key: "electric_range", unit: "km", group: "性能" },
  // Drivetrain
  { label: "驅動方式", key: "drivetrain", group: "傳動" },
  { label: "變速箱", key: "transmission", group: "傳動" },
  { label: "檔位數", key: "gear_count", unit: "速", group: "傳動" },
  // Dimensions
  { label: "車長", key: "length", unit: "mm", group: "尺寸" },
  { label: "車寬", key: "width", unit: "mm", group: "尺寸" },
  { label: "車高", key: "height", unit: "mm", group: "尺寸" },
  { label: "軸距", key: "wheelbase", unit: "mm", group: "尺寸" },
  { label: "整備重量", key: "curb_weight", unit: "kg", group: "尺寸" },
  { label: "座位數", key: "seat_count", unit: "人", group: "尺寸" },
  { label: "行李廂容積", key: "trunk_capacity", unit: "L", group: "尺寸" },
  // EV
  { label: "電池容量", key: "battery_capacity", unit: "kWh", group: "電動" },
  { label: "電動馬力", key: "motor_power", unit: "hp", group: "電動" },
];

function formatValue(spec: CarSpec, row: SpecRow): string {
  const v = spec[row.key];
  if (v == null || v === 0) return "—";
  if (row.key === "fuel_type") return FUEL_TYPE_LABELS[v as keyof typeof FUEL_TYPE_LABELS] ?? String(v);
  return `${v}${row.unit ? " " + row.unit : ""}`;
}

export function CarSpecs({ specs }: { specs: CarSpec[] }) {
  const [active, setActive] = useState(0);
  const spec = specs[active];
  if (!spec) return null;

  const groups = [...new Set(SPEC_ROWS.map((r) => r.group))];

  return (
    <div>
      {specs.length > 1 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {specs.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                active === i
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
              )}
            >
              {s.trim_name}
            </button>
          ))}
        </div>
      )}

      <div className="mb-4 flex items-center gap-3">
        <h3 className="text-lg font-bold">{spec.trim_name}</h3>
        {spec.msrp && (
          <Badge variant="default">{formatPrice(spec.msrp)}</Badge>
        )}
      </div>

      <div className="space-y-6">
        {groups.map((group) => {
          const rows = SPEC_ROWS.filter((r) => r.group === group);
          const hasData = rows.some((r) => spec[r.key] != null && spec[r.key] !== 0);
          if (!hasData) return null;

          return (
            <div key={group}>
              <h4 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-3">
                {group}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-zinc-800 rounded-lg overflow-hidden">
                {rows.map((row) => {
                  const val = formatValue(spec, row);
                  if (val === "—" && spec[row.key] == null) return null;
                  return (
                    <div
                      key={row.key}
                      className="flex justify-between items-center px-4 py-3 border-b border-r border-zinc-800 last:border-b-0 odd:border-r even:border-r-0"
                    >
                      <span className="text-sm text-zinc-500">{row.label}</span>
                      <span className="text-sm font-medium text-zinc-100">{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
