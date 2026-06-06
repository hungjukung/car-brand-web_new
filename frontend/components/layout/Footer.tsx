import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-12 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-zinc-100 mb-3">AutoDB</h3>
            <p className="text-sm text-zinc-500">台灣最完整的汽車規格資料庫</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-400 mb-3">車款</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/cars?body_type=sedan" className="hover:text-zinc-300">房車</Link></li>
              <li><Link href="/cars?body_type=suv" className="hover:text-zinc-300">SUV</Link></li>
              <li><Link href="/cars?body_type=sports" className="hover:text-zinc-300">跑車</Link></li>
              <li><Link href="/cars?fuel_type=electric" className="hover:text-zinc-300">電動車</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-400 mb-3">工具</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/compare" className="hover:text-zinc-300">車款比較</Link></li>
              <li><Link href="/tools/fuel-calculator" className="hover:text-zinc-300">油耗計算</Link></li>
              <li><Link href="/tools/loan-calculator" className="hover:text-zinc-300">貸款計算</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-400 mb-3">熱門品牌</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/cars/toyota" className="hover:text-zinc-300">Toyota</Link></li>
              <li><Link href="/cars/honda" className="hover:text-zinc-300">Honda</Link></li>
              <li><Link href="/cars/bmw" className="hover:text-zinc-300">BMW</Link></li>
              <li><Link href="/cars/mazda" className="hover:text-zinc-300">Mazda</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-800 pt-8 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} AutoDB. 台灣汽車資料庫平台
        </div>
      </div>
    </footer>
  );
}
