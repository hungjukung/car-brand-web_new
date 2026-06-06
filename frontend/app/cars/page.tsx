import type { Metadata } from "next";
import { Suspense } from "react";
import { api } from "@/lib/api";
import { CarCard } from "@/components/cars/CarCard";
import { SearchBar } from "@/components/cars/SearchBar";
import { CarListItem } from "@/lib/types";

export const metadata: Metadata = { title: "車款資料庫" };

interface Props {
  searchParams: Promise<{
    q?: string;
    body_type?: string;
    page?: string;
    min_price?: string;
    max_price?: string;
    min_hp?: string;
    brand?: string;
  }>;
}

async function CarGrid({ searchParams }: { searchParams: Awaited<Props["searchParams"]> }) {
  const page = Number(searchParams.page) || 1;

  let result;
  try {
    if (searchParams.q) {
      result = await api.search({
        q: searchParams.q,
        body_type: searchParams.body_type,
        min_hp: searchParams.min_hp ? Number(searchParams.min_hp) : undefined,
        max_price: searchParams.max_price ? Number(searchParams.max_price) : undefined,
        page,
      });
    } else {
      result = await api.cars({
        page,
        body_type: searchParams.body_type,
        brand: searchParams.brand,
        min_price: searchParams.min_price ? Number(searchParams.min_price) : undefined,
        max_price: searchParams.max_price ? Number(searchParams.max_price) : undefined,
        min_hp: searchParams.min_hp ? Number(searchParams.min_hp) : undefined,
      });
    }
  } catch {
    return <p className="text-zinc-500 text-center py-20">無法載入車款資料，請確認後端服務已啟動。</p>;
  }

  if (result.items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-zinc-400 text-lg">沒有找到符合條件的車款</p>
        <p className="text-zinc-600 text-sm mt-2">試試看其他關鍵字或移除篩選條件</p>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-zinc-500 mb-6">共 {result.total} 款車型</p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {result.items.map((car: CarListItem) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </>
  );
}

export default async function CarsPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-zinc-100 mb-2">車款資料庫</h1>
        <p className="text-zinc-500">搜尋並比較台灣所有車款規格</p>
      </div>

      <div className="mb-8">
        <Suspense>
          <SearchBar />
        </Suspense>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-xl bg-zinc-800 animate-pulse" />
          ))}
        </div>
      }>
        <CarGrid searchParams={params} />
      </Suspense>
    </div>
  );
}
