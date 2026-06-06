"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { CarGeneration, CarSpec, FUEL_TYPE_LABELS, formatPrice } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

type SpecRow = { label: string; key: keyof CarSpec; unit?: string; group: string };
const ROWS: SpecRow[] = [
  { label: "最大馬力", key: "horsepower", unit: "hp", group: "引擎" },
  { label: "最大扭力", key: "torque", unit: "Nm", group: "引擎" },
  { label: "排氣量", key: "displacement", unit: "L", group: "引擎" },
  { label: "燃料類型", key: "fuel_type", group: "引擎" },
  { label: "0-100 km/h", key: "acceleration", unit: "秒", group: "性能" },
  { label: "極速", key: "top_speed", unit: "km/h", group: "性能" },
  { label: "油耗", key: "fuel_consumption", unit: "L/100km", group: "性能" },
  { label: "純電里程", key: "electric_range", unit: "km", group: "性能" },
  { label: "驅動方式", key: "drivetrain", group: "傳動" },
  { label: "變速箱", key: "transmission", group: "傳動" },
  { label: "車長", key: "length", unit: "mm", group: "尺寸" },
  { label: "車寬", key: "width", unit: "mm", group: "尺寸" },
  { label: "車高", key: "height", unit: "mm", group: "尺寸" },
  { label: "軸距", key: "wheelbase", unit: "mm", group: "尺寸" },
  { label: "整備重量", key: "curb_weight", unit: "kg", group: "尺寸" },
  { label: "建議售價", key: "msrp", group: "價格" },
];

function getVal(spec: CarSpec, key: keyof CarSpec): string {
  const v = spec[key];
  if (v == null) return "—";
  if (key === "fuel_type") return FUEL_TYPE_LABELS[v as keyof typeof FUEL_TYPE_LABELS] ?? String(v);
  if (key === "msrp") return formatPrice(v as number);
  return String(v);
}

function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initIds = searchParams.getAll("ids").map(Number).filter(Boolean);

  const [ids, setIds] = useState<number[]>(initIds);
  const [cars, setCars] = useState<CarGeneration[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ids.length === 0) { setCars([]); return; }
    setLoading(true);
    api.compare(ids)
      .then(setCars)
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, [ids.join(",")]);

  function removeCar(id: number) {
    const next = ids.filter((i) => i !== id);
    setIds(next);
    const params = new URLSearchParams(next.map((i) => ["ids", String(i)]));
    router.replace(`/compare?${params}`);
  }

  const groups = [...new Set(ROWS.map((r) => r.group))];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-zinc-100 mb-2 flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-orange-500" />
          車款比較
        </h1>
        <p className="text-zinc-500">最多同時比較四款車型的詳細規格</p>
      </div>

      {loading && (
        <div className="text-center py-20 text-zinc-500">載入中…</div>
      )}

      {!loading && cars.length === 0 && (
        <div className="text-center py-24 border border-dashed border-zinc-700 rounded-2xl">
          <div className="text-5xl mb-4">⚖️</div>
          <p className="text-zinc-400 text-lg mb-2">尚未選擇任何車款</p>
          <p className="text-zinc-600 text-sm mb-6">前往車款頁面，點擊「加入比較」即可加入</p>
          <Button asChild>
            <Link href="/cars">瀏覽車款</Link>
          </Button>
        </div>
      )}

      {!loading && cars.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            {/* Car headers */}
            <thead>
              <tr>
                <th className="w-40 text-left py-3 pr-4 text-sm text-zinc-500">規格</th>
                {cars.map((car) => (
                  <th key={car.id} className="text-center pb-4 px-3">
                    <div className="relative rounded-xl overflow-hidden bg-zinc-800 aspect-video mb-3">
                      {car.hero_image_url ? (
                        <Image src={car.hero_image_url} alt={car.model_zh} fill className="object-cover" sizes="200px" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-3xl">🚗</div>
                      )}
                    </div>
                    <div className="text-xs text-orange-400">{car.brand.name_zh}</div>
                    <div className="font-bold text-zinc-100">{car.model_zh}</div>
                    <div className="text-xs text-zinc-500 mb-2">{car.year_start}</div>
                    <button
                      onClick={() => removeCar(car.id)}
                      className="text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      <X className="h-4 w-4 mx-auto" />
                    </button>
                  </th>
                ))}
                {cars.length < 4 && (
                  <th className="text-center px-3">
                    <Link href="/cars">
                      <div className="rounded-xl border-2 border-dashed border-zinc-700 hover:border-orange-500 transition-colors aspect-video flex flex-col items-center justify-center gap-2 text-zinc-600 hover:text-orange-400 mb-3 cursor-pointer">
                        <Plus className="h-6 w-6" />
                        <span className="text-xs">新增車款</span>
                      </div>
                    </Link>
                  </th>
                )}
              </tr>
            </thead>

            {/* Spec rows by group */}
            <tbody>
              {groups.map((group) => {
                const rows = ROWS.filter((r) => r.group === group);
                return (
                  <>
                    <tr key={`group-${group}`}>
                      <td colSpan={cars.length + 2} className="pt-6 pb-2">
                        <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">{group}</span>
                      </td>
                    </tr>
                    {rows.map((row) => (
                      <tr key={row.key} className="border-t border-zinc-800 hover:bg-zinc-900/50">
                        <td className="py-3 pr-4 text-sm text-zinc-500 align-middle">{row.label}</td>
                        {cars.map((car) => {
                          const spec = car.specs[0];
                          return (
                            <td key={car.id} className="py-3 px-3 text-center text-sm font-medium text-zinc-100 align-middle">
                              {spec ? getVal(spec, row.key) : "—"}
                            </td>
                          );
                        })}
                        {cars.length < 4 && <td />}
                      </tr>
                    ))}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ComparePageWrapper() {
  return (
    <Suspense>
      <ComparePage />
    </Suspense>
  );
}
