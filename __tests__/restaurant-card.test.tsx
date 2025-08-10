import { render, screen } from "@testing-library/react"
import { RestaurantCard } from "@/components/restaurant-card"
import type { RestaurantFood } from "@/types/restaurant"

const mockItem: RestaurantFood = {
  id: "1",
  name: "Margherita Pizza",
  rating: 4.6,
  image: "https://example.com/pizza.jpg",
  status: "Open Now",
  price: 12.5,
}

describe("RestaurantCard", () => {
  it("renders with expected props", () => {
    render(<RestaurantCard item={mockItem} />)
    expect(screen.getByTestId("restaurant-card")).toBeInTheDocument()
    expect(screen.getByText(/Margherita Pizza/)).toBeInTheDocument()
    expect(screen.getByText(/Rating: 4.6/)).toBeInTheDocument()
    expect(screen.getByText(/Price: \$12.50/)).toBeInTheDocument()
    expect(screen.getByText(/Open Now/)).toBeInTheDocument()
  })
})
