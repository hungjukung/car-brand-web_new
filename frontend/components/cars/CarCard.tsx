"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Fuel, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CarListItem, BODY_TYPE_LABELS, FUEL_TYPE_LABELS, formatPrice } from "@/lib/types";

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-sm font-bold text-zinc-100">{value}</div>
      <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
    </div>
  );
}

export function CarCard({ car }: { car: CarListItem }) {
  const slug = `${car.brand_name_en.toLowerCase()}/${car.model_en.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link href={`/cars/${slug}`}>
        <Card className="overflow-hidden group cursor-pointer hover:border-zinc-600 transition-colors">
          <div className="relative aspect-video bg-zinc-800">
            {car.hero_image_url ? (
              <Image
                src={car.hero_image_url}
                alt={`${car.brand_name_zh} ${car.model_zh}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-600 text-4xl">🚗</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
            <Badge className="absolute top-3 right-3" variant="secondary">
              {BODY_TYPE_LABELS[car.body_type] ?? car.body_type}
            </Badge>
            <div className="absolute bottom-3 left-3 text-xs text-zinc-300">
              {car.year_start}{car.year_end ? `–${car.year_end}` : " 現行款"}
            </div>
          </div>

          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-orange-400 font-medium mb-0.5">{car.brand_name_zh}</p>
                <h3 className="text-lg font-bold text-zinc-100">{car.model_zh}</h3>
                <p className="text-xs text-zinc-500">{car.model_en}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-orange-400 transition-colors mt-1 shrink-0" />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3 py-3 border-y border-zinc-800">
              <StatBox
                label="最大馬力"
                value={car.min_horsepower ? `${car.min_horsepower}hp` : "—"}
              />
              <StatBox label="起售價" value={formatPrice(car.min_price)} />
              <StatBox
                label="車型"
                value={BODY_TYPE_LABELS[car.body_type] ?? car.body_type}
              />
            </div>

            {car.min_price && (
              <p className="text-sm font-semibold text-orange-400">
                {formatPrice(car.min_price)}
                {car.max_price && car.max_price !== car.min_price && (
                  <span className="text-zinc-500 font-normal"> ~ {formatPrice(car.max_price)}</span>
                )}
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
