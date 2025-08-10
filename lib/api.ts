export const API_BASE = "https://6852821e0594059b23cdd834.mockapi.io/Food"

import type { RestaurantFood } from "@/types/restaurant"

export async function getFoods(search?: string): Promise<RestaurantFood[]> {
  const url = new URL(API_BASE)
  if (search && search.trim()) {
    url.searchParams.set("name", search.trim())
  }
  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch")
  const data = (await res.json()) as any[]
  // normalize and coerce types
  return data.map((d) => ({
    id: d.id,
    name: d.name ?? "",
    rating: typeof d.rating === "number" ? d.rating : Number(d.rating ?? 0),
    image: d.image ?? d.restaurant_image ?? "",
    status: d.status === "Closed" ? "Closed" : "Open Now",
    price: typeof d.price === "number" ? d.price : d.price ? Number(d.price) : undefined,
    createdAt: d.createdAt ?? undefined,
  })) as RestaurantFood[]
}

export async function createFood(payload: Omit<RestaurantFood, "id">): Promise<RestaurantFood> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Failed to create")
  return (await res.json()) as RestaurantFood
}

export async function updateFood(id: string, payload: Partial<RestaurantFood>): Promise<RestaurantFood> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Failed to update")
  return (await res.json()) as RestaurantFood
}

export async function deleteFood(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to delete")
}
