"use client";
import { useState } from "react";
import { CreditCard, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import Link from "next/link";

export default function LoanCalculatorPage() {
  const [form, setForm] = useState({
    car_price: 1500000,
    down_payment: 300000,
    loan_years: 5,
    annual_rate: 2.5,
  });
  const [result, setResult] = useState<{
    loan_amount: number;
    monthly_payment: number;
    total_payment: number;
    total_interest: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: Number(value) }));
  }

  async function calculate() {
    setLoading(true);
    try {
      const r = await api.loanCalc(form);
      setResult(r);
    } catch {
      alert("計算失敗，請確認後端服務已啟動");
    } finally {
      setLoading(false);
    }
  }

  const loanPercent = form.car_price > 0
    ? Math.round(((form.car_price - form.down_payment) / form.car_price) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <div className="mb-2">
          <Link href="/tools/fuel-calculator" className="text-sm text-zinc-500 hover:text-zinc-300">
            油耗計算
          </Link>
        </div>
        <h1 className="text-4xl font-extrabold text-zinc-100 mb-2 flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-orange-500" />
          購車貸款計算
        </h1>
        <p className="text-zinc-500">試算每月還款金額與總利息支出</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>輸入條件</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">車輛售價（元）</label>
            <Input
              type="number"
              value={form.car_price}
              onChange={(e) => update("car_price", e.target.value)}
              step={10000}
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">
              頭期款（元）
              <span className="ml-2 text-orange-400">貸款比例 {loanPercent}%</span>
            </label>
            <Input
              type="number"
              value={form.down_payment}
              onChange={(e) => update("down_payment", e.target.value)}
              step={10000}
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">貸款年限</label>
            <div className="flex gap-2">
              {[3, 5, 7].map((y) => (
                <button
                  key={y}
                  onClick={() => setForm((f) => ({ ...f, loan_years: y }))}
                  className={`flex-1 py-2 rounded-md text-sm border transition-colors ${
                    form.loan_years === y
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  {y} 年
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">年利率（%）</label>
            <Input
              type="number"
              step="0.1"
              value={form.annual_rate}
              onChange={(e) => update("annual_rate", e.target.value)}
              min={0.1}
              max={20}
            />
            <p className="text-xs text-zinc-600 mt-1">台灣車貸年利率通常約 1.5% ~ 4%</p>
          </div>

          <Button className="w-full" onClick={calculate} disabled={loading}>
            <Calculator className="h-4 w-4" />
            {loading ? "計算中…" : "試算貸款"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-orange-500/30 bg-orange-950/10">
          <CardHeader>
            <CardTitle className="text-orange-400">試算結果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center mb-4">
              {[
                { label: "每月還款", value: `NT$ ${result.monthly_payment.toLocaleString()}` },
                { label: "貸款金額", value: `NT$ ${result.loan_amount.toLocaleString()}` },
                { label: "總還款金額", value: `NT$ ${result.total_payment.toLocaleString()}` },
                { label: "總利息支出", value: `NT$ ${result.total_interest.toLocaleString()}` },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl bg-zinc-800/50 p-4">
                  <div className="text-lg font-bold text-zinc-100">{value}</div>
                  <div className="text-xs text-zinc-500 mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* Interest ratio bar */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                <span>本金 NT$ {result.loan_amount.toLocaleString()}</span>
                <span>利息 NT$ {result.total_interest.toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-700 overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${(result.loan_amount / result.total_payment) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
