import Link from "next/link";
import { ArrowRight, Car, BarChart3, Calculator, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { CarCard } from "@/components/cars/CarCard";

async function getFeaturedCars() {
  try {
    const result = await api.cars({ page_size: 6 });
    return result.items;
  } catch {
    return [];
  }
}

const FEATURES = [
  {
    icon: Car,
    title: "完整規格資料庫",
    desc: "涵蓋數百款車型，引擎、性能、尺寸一覽無遺",
  },
  {
    icon: BarChart3,
    title: "車款對比分析",
    desc: "最多四款車同時比較，規格差異一目瞭然",
  },
  {
    icon: Calculator,
    title: "實用計算工具",
    desc: "油耗費用、貸款試算，購車決策更輕鬆",
  },
  {
    icon: Zap,
    title: "智慧全文搜尋",
    desc: "中英文混合搜尋，依馬力、價格、車型精準篩選",
  },
];

export default async function HomePage() {
  const featured = await getFeaturedCars();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-zinc-950 py-24 md:py-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-950/30 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-400">
            🚀 Taiwan&apos;s Most Complete Car Database
          </div>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-zinc-100 md:text-7xl">
            找你的<span className="text-orange-500">完美座駕</span>
          </h1>
          <p className="mb-10 text-xl text-zinc-400">
            台灣最完整的汽車規格資料庫。搜尋、比較、計算，一站搞定購車所有需求。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/cars">
                瀏覽所有車款
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/compare">車款比較</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="mb-10 text-center text-3xl font-bold text-zinc-100">平台功能</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="p-6 hover:border-zinc-600 transition-colors">
              <Icon className="mb-4 h-8 w-8 text-orange-500" />
              <h3 className="mb-2 font-semibold text-zinc-100">{title}</h3>
              <p className="text-sm text-zinc-500">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Cars */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-zinc-100">熱門車款</h2>
            <Link href="/cars" className="flex items-center gap-1 text-sm text-orange-400 hover:text-orange-300">
              查看全部 <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="border-t border-zinc-800 bg-zinc-900/50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { num: "50+", label: "品牌" },
              { num: "500+", label: "車款" },
              { num: "2,000+", label: "車型規格" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="text-4xl font-extrabold text-orange-500">{num}</div>
                <div className="mt-1 text-sm text-zinc-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
