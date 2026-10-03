"use client";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { Select } from "@/components/ui/select";

export function CitySelector({
  cities,
  selectedCityId,
  onChange,
}: {
  cities: { id: string; name: string }[];
  selectedCityId: string;
  onChange?: (cityId: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <MapPin className="h-4 w-4 text-rose" />
      <span className="text-sm text-muted">Delivering to</span>
      <Select
        value={selectedCityId}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-9 w-auto border-none bg-transparent px-1 font-medium text-ink"
      >
        {cities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
