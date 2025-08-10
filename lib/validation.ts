export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export type RestaurantFormErrors = Partial<{
  restaurant_name: string
  restaurant_rating: string
  restaurant_image: string
  restaurant_status: string
  restaurant_price: string
}>

import type { RestaurantFormValues } from "@/components/restaurant-form"

export function validateRestaurantForm(values: RestaurantFormValues): RestaurantFormErrors {
  const errors: RestaurantFormErrors = {}

  if (!values.restaurant_name.trim()) {
    errors.restaurant_name = "Restaurant Name is required"
  }

  const ratingNum = Number(values.restaurant_rating)
  if (values.restaurant_rating === "" || Number.isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    errors.restaurant_rating = "Food Rating must be a number"
  }

  if (!values.restaurant_image.trim() || !isValidUrl(values.restaurant_image.trim())) {
    errors.restaurant_image = "Food Image URL is required"
  }

  if (values.restaurant_status !== "Open Now" && values.restaurant_status !== "Closed") {
    errors.restaurant_status = "Restaurant Status must be ‘Open Now’ or ‘Closed’"
  }

  if (values.restaurant_price && Number.isNaN(Number(values.restaurant_price))) {
    errors.restaurant_price = "Price must be a number"
  }

  return errors
}
