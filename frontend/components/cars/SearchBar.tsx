"use client";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BODY_TYPES = [
  { value: "sedan", label: "房車" },
  { value: "suv", label: "SUV" },
  { value: "hatchback", label: "掀背" },
  { value: "coupe", label: "跑車" },
  { value: "wagon", label: "旅行車" },
  { value: "electric", label: "電動車" },
];

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [selectedType, setSelectedType] = useState(searchParams.get("body_type") ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSearch() {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedType) params.set("body_type", selectedType);
    startTransition(() => {
      router.push(`/cars?${params}`);
    });
  }

  function clearFilters() {
    setQuery("");
    setSelectedType("");
    router.push("/cars");
  }

  const hasFilters = query || selectedType;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="搜尋車款、品牌… 例如「GR86」「油電SUV」"
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} disabled={isPending}>
          <Search className="h-4 w-4" />
          搜尋
        </Button>
        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} size="icon">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-zinc-500 flex items-center gap-1">
          <SlidersHorizontal className="h-3 w-3" /> 車型篩選：
        </span>
        {BODY_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => {
              setSelectedType(t.value === selectedType ? "" : t.value);
            }}
            className="focus:outline-none"
          >
            <Badge
              variant={selectedType === t.value ? "default" : "outline"}
              className="cursor-pointer hover:border-orange-500 transition-colors"
            >
              {t.label}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}
