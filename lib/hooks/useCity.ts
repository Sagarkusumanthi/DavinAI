"use client";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "giftly_city_id"; // non-sensitive preference only, per spec

export function useCity(cities: { id: string; name: string }[]) {
  const [cityId, setCityIdState] = useState<string>("");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (cities.length === 0) {
      if (stored) setCityIdState(stored);
      return;
    }
    if (stored && cities.some((c) => c.id === stored)) {
      setCityIdState(stored);
    } else {
      setCityIdState(cities[0].id);
    }
  }, [cities]);

  const setCityId = useCallback((id: string) => {
    setCityIdState(id);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, id);
  }, []);

  return { cityId, setCityId };
}
