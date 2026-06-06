import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-7xl mb-6">🔍</div>
      <h1 className="text-4xl font-extrabold text-zinc-100 mb-3">404</h1>
      <p className="text-zinc-400 mb-8">找不到您要的頁面</p>
      <Button asChild>
        <Link href="/">回到首頁</Link>
      </Button>
    </div>
  );
}
