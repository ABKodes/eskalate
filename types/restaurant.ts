export type RestaurantFood = {
  id?: string
  name: string
  rating: number
  image: string
  status: "Open Now" | "Closed"
  price?: number
  createdAt?: string
}
