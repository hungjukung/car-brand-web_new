export type BodyType =
  | "sedan" | "suv" | "hatchback" | "coupe" | "convertible"
  | "wagon" | "pickup" | "van" | "sports" | "mpv";

export type FuelType =
  | "gasoline" | "diesel" | "hybrid" | "phev" | "electric" | "hydrogen";

export type DrivetrainType = "FWD" | "RWD" | "AWD" | "4WD";

export type TransmissionType = "manual" | "automatic" | "CVT" | "DCT" | "AMT";

export interface Brand {
  id: number;
  name_en: string;
  name_zh: string;
  country?: string;
  logo_url?: string;
}

export interface CarSpec {
  id: number;
  trim_name: string;
  engine_code?: string;
  displacement?: number;
  horsepower?: number;
  torque?: number;
  fuel_type: FuelType;
  cylinder_count?: number;
  acceleration?: number;
  top_speed?: number;
  fuel_consumption?: number;
  length?: number;
  width?: number;
  height?: number;
  wheelbase?: number;
  curb_weight?: number;
  drivetrain?: DrivetrainType;
  transmission?: TransmissionType;
  gear_count?: number;
  seat_count?: number;
  trunk_capacity?: number;
  battery_capacity?: number;
  electric_range?: number;
  motor_power?: number;
  msrp?: number;
}

export interface CarGeneration {
  id: number;
  brand: Brand;
  model_en: string;
  model_zh: string;
  generation: number;
  year_start: number;
  year_end?: number;
  body_type: BodyType;
  description?: string;
  hero_image_url?: string;
  specs: CarSpec[];
}

export interface CarListItem {
  id: number;
  brand_name_en: string;
  brand_name_zh: string;
  model_en: string;
  model_zh: string;
  year_start: number;
  year_end?: number;
  body_type: BodyType;
  hero_image_url?: string;
  min_price?: number;
  max_price?: number;
  min_horsepower?: number;
}

export interface CarSearchResult {
  total: number;
  page: number;
  page_size: number;
  items: CarListItem[];
}

export const BODY_TYPE_LABELS: Record<BodyType, string> = {
  sedan: "房車",
  suv: "SUV",
  hatchback: "掀背",
  coupe: "跑車",
  convertible: "敞篷",
  wagon: "旅行車",
  pickup: "皮卡",
  van: "廂型車",
  sports: "跑車",
  mpv: "MPV",
};

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  gasoline: "汽油",
  diesel: "柴油",
  hybrid: "油電混合",
  phev: "插電混合",
  electric: "純電",
  hydrogen: "氫燃料",
};

export function formatPrice(price?: number): string {
  if (!price) return "洽詢";
  return `NT$ ${(price / 10000).toFixed(0)} 萬`;
}
