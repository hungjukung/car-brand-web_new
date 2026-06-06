import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ brand: string; model: string; year: string }>;
}

// Redirect /cars/toyota/camry/2024 → /cars/toyota/camry
export default async function YearPage({ params }: Props) {
  const { brand, model } = await params;
  redirect(`/cars/${brand}/${model}`);
}
