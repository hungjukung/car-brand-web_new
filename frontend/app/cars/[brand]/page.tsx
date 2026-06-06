import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { CarCard } from "@/components/cars/CarCard";
import { BODY_TYPE_LABELS } from "@/lib/types";

interface Props {
  params: Promise<{ brand: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params;
  return { title: `${brand.charAt(0).toUpperCase() + brand.slice(1)} 車款` };
}

export default async function BrandPage({ params }: Props) {
  const { brand } = await params;

  let cars;
  try {
    cars = await api.brandCars(brand);
  } catch {
    notFound();
  }

  if (!cars || cars.length === 0) notFound();

  const brandInfo = cars[0].brand;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-10">
        <p className="text-sm text-orange-400 mb-1">品牌</p>
        <h1 className="text-4xl font-extrabold text-zinc-100 mb-1">
          {brandInfo.name_zh}
          <span className="ml-3 text-2xl text-zinc-500 font-light">{brandInfo.name_en}</span>
        </h1>
        {brandInfo.country && (
          <p className="text-zinc-500 text-sm">原產國：{brandInfo.country}</p>
        )}
        <p className="mt-2 text-zinc-400">共 {cars.length} 款車型</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => {
          const prices = car.specs.map((s) => s.msrp).filter(Boolean) as number[];
          const hps = car.specs.map((s) => s.horsepower).filter(Boolean) as number[];
          return (
            <CarCard
              key={car.id}
              car={{
                id: car.id,
                brand_name_en: car.brand.name_en,
                brand_name_zh: car.brand.name_zh,
                model_en: car.model_en,
                model_zh: car.model_zh,
                year_start: car.year_start,
                year_end: car.year_end,
                body_type: car.body_type,
                hero_image_url: car.hero_image_url,
                min_price: prices.length ? Math.min(...prices) : undefined,
                max_price: prices.length ? Math.max(...prices) : undefined,
                min_horsepower: hps.length ? Math.min(...hps) : undefined,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
