import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, BarChart3 } from "lucide-react";
import { api } from "@/lib/api";
import { CarSpecs } from "@/components/cars/CarSpecs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BODY_TYPE_LABELS, FUEL_TYPE_LABELS, formatPrice } from "@/lib/types";

interface Props {
  params: Promise<{ brand: string; model: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand, model } = await params;
  try {
    const car = await api.carDetail(brand, model);
    return { title: `${car.brand.name_zh} ${car.model_zh}` };
  } catch {
    return { title: "車款詳情" };
  }
}

export default async function CarDetailPage({ params }: Props) {
  const { brand, model } = await params;

  let car;
  try {
    car = await api.carDetail(brand, model);
  } catch {
    notFound();
  }

  const prices = car.specs.map((s) => s.msrp).filter(Boolean) as number[];
  const minPrice = prices.length ? Math.min(...prices) : undefined;
  const maxPrice = prices.length ? Math.max(...prices) : undefined;
  const maxHp = Math.max(...car.specs.map((s) => s.horsepower ?? 0));
  const minAccel = Math.min(...car.specs.map((s) => Number(s.acceleration) || 99));

  const fuelTypes = [...new Set(car.specs.map((s) => s.fuel_type))];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-zinc-500 mb-8">
        <Link href="/cars" className="hover:text-zinc-300">車款</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/cars/${brand}`} className="hover:text-zinc-300">{car.brand.name_zh}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-zinc-300">{car.model_zh}</span>
      </nav>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-800">
          {car.hero_image_url ? (
            <Image
              src={car.hero_image_url}
              alt={`${car.brand.name_zh} ${car.model_zh}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-8xl">🚗</div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{BODY_TYPE_LABELS[car.body_type]}</Badge>
            {fuelTypes.map((ft) => (
              <Badge key={ft} variant="green">{FUEL_TYPE_LABELS[ft]}</Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-100 mb-1">
            {car.brand.name_zh} {car.model_zh}
          </h1>
          <p className="text-xl text-zinc-500 mb-4">{car.model_en} · 第 {car.generation} 代</p>
          <p className="text-sm text-zinc-400 mb-6">
            {car.year_start} – {car.year_end ?? "現在"}
          </p>

          {car.description && (
            <p className="text-zinc-400 leading-relaxed mb-8">{car.description}</p>
          )}

          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "最大馬力", value: maxHp > 0 ? `${maxHp} hp` : "—" },
              { label: "最快破百", value: minAccel < 99 ? `${minAccel} 秒` : "—" },
              { label: "起售價", value: formatPrice(minPrice) },
            ].map(({ label, value }) => (
              <div key={label} className="text-center rounded-xl bg-zinc-800/50 p-4 border border-zinc-800">
                <div className="text-xl font-bold text-zinc-100">{value}</div>
                <div className="text-xs text-zinc-500 mt-1">{label}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href={`/compare?ids=${car.id}`}>
                <BarChart3 className="h-4 w-4" />
                加入比較
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Specs */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-6">詳細規格</h2>
        <CarSpecs specs={car.specs} />
      </div>
    </div>
  );
}
