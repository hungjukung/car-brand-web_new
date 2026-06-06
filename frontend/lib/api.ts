import { CarGeneration, CarListItem, CarSearchResult, Brand, CarSpec } from "./types";

// Server-side (SSR/SSG): use Docker-internal hostname; client-side: use public URL
const BASE =
  typeof window === "undefined"
    ? process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  brands: () => fetchApi<Brand[]>("/api/v1/cars/brands"),

  cars: (params?: {
    page?: number;
    page_size?: number;
    brand?: string;
    body_type?: string;
    min_price?: number;
    max_price?: number;
    min_hp?: number;
  }) => {
    const q = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v != null) q.set(k, String(v));
      });
    }
    return fetchApi<CarSearchResult>(`/api/v1/cars?${q}`);
  },

  brandCars: (brand: string) =>
    fetchApi<CarGeneration[]>(`/api/v1/cars/${brand}`),

  carDetail: (brand: string, model: string) =>
    fetchApi<CarGeneration>(`/api/v1/cars/${brand}/${model}`),

  search: (params: {
    q?: string;
    body_type?: string;
    min_hp?: number;
    max_price?: number;
    page?: number;
    page_size?: number;
  }) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null) q.set(k, String(v));
    });
    return fetchApi<CarSearchResult>(`/api/v1/search?${q}`);
  },

  compare: (ids: number[]) =>
    fetchApi<CarGeneration[]>(`/api/v1/compare?${ids.map((id) => `ids=${id}`).join("&")}`),

  fuelCalc: (body: { distance_km: number; fuel_consumption: number; fuel_price: number }) =>
    fetchApi<{ total_liters: number; total_cost: number; cost_per_km: number }>(
      "/api/v1/tools/fuel-calculator",
      { method: "POST", body: JSON.stringify(body), next: { revalidate: 0 } }
    ),

  loanCalc: (body: { car_price: number; down_payment: number; loan_years: number; annual_rate: number }) =>
    fetchApi<{ loan_amount: number; monthly_payment: number; total_payment: number; total_interest: number }>(
      "/api/v1/tools/loan-calculator",
      { method: "POST", body: JSON.stringify(body), next: { revalidate: 0 } }
    ),
};
