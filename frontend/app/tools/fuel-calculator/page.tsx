"use client";
import { useState } from "react";
import { Calculator, Fuel, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import Link from "next/link";

export default function FuelCalculatorPage() {
  const [form, setForm] = useState({
    distance_km: 10000,
    fuel_consumption: 12,
    fuel_price: 30,
  });
  const [result, setResult] = useState<{
    total_liters: number;
    total_cost: number;
    cost_per_km: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: Number(value) }));
  }

  async function calculate() {
    setLoading(true);
    try {
      const r = await api.fuelCalc(form);
      setResult(r);
    } catch {
      alert("計算失敗，請確認後端服務已啟動");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/tools/loan-calculator" className="text-sm text-zinc-500 hover:text-zinc-300">
            貸款計算
          </Link>
        </div>
        <h1 className="text-4xl font-extrabold text-zinc-100 mb-2 flex items-center gap-3">
          <Fuel className="h-8 w-8 text-orange-500" />
          油耗費用計算
        </h1>
        <p className="text-zinc-500">計算一段路程的油費支出</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>輸入條件</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">行駛距離（公里）</label>
            <Input
              type="number"
              value={form.distance_km}
              onChange={(e) => update("distance_km", e.target.value)}
              min={1}
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">平均油耗（L/100km）</label>
            <Input
              type="number"
              step="0.1"
              value={form.fuel_consumption}
              onChange={(e) => update("fuel_consumption", e.target.value)}
              min={0.1}
            />
            <p className="text-xs text-zinc-600 mt-1">汽油車平均約 10–14 L/100km，油電約 5–8 L/100km</p>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">油價（元/公升）</label>
            <Input
              type="number"
              step="0.1"
              value={form.fuel_price}
              onChange={(e) => update("fuel_price", e.target.value)}
              min={1}
            />
          </div>

          <Button className="w-full" onClick={calculate} disabled={loading}>
            <Calculator className="h-4 w-4" />
            {loading ? "計算中…" : "開始計算"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-orange-500/30 bg-orange-950/10">
          <CardHeader>
            <CardTitle className="text-orange-400">計算結果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: "總耗油量", value: `${result.total_liters.toFixed(1)} 公升` },
                { label: "總油費", value: `NT$ ${result.total_cost.toLocaleString()}` },
                { label: "每公里費用", value: `NT$ ${result.cost_per_km.toFixed(2)}` },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl bg-zinc-800/50 p-4">
                  <div className="text-xl font-bold text-zinc-100">{value}</div>
                  <div className="text-xs text-zinc-500 mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-zinc-800/30 text-sm text-zinc-400">
              每月行駛 {(form.distance_km / 12).toFixed(0)} km 的情境下，月均油費約
              <span className="text-orange-400 font-semibold mx-1">
                NT$ {(result.total_cost / 12).toFixed(0)}
              </span>
              元
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
