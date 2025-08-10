"use client"

import { render, screen, fireEvent } from "@testing-library/react"
import { RestaurantForm, type RestaurantFormValues } from "@/components/restaurant-form"
import { vi } from "vitest"

const initialValues: RestaurantFormValues = {
  restaurant_name: "",
  restaurant_rating: "",
  restaurant_image: "",
  restaurant_status: "Open Now",
  restaurant_price: "",
}

describe("RestaurantForm", () => {
  it("submits valid input", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: true })
    render(<RestaurantForm mode="add" initialValues={initialValues} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/Restaurant Name/), { target: { value: "Sushi Set" } })
    fireEvent.change(screen.getByLabelText(/Restaurant Rating/), { target: { value: "4.5" } })
    fireEvent.change(screen.getByLabelText(/Restaurant Image URL/), {
      target: { value: "https://example.com/sushi.jpg" },
    })
    // Status defaults to Open Now
    fireEvent.change(screen.getByLabelText(/Restaurant Price/), { target: { value: "9.99" } })

    fireEvent.click(screen.getByTestId("restaurant-save-btn"))

    expect(onSubmit).toHaveBeenCalledWith({
      restaurant_name: "Sushi Set",
      restaurant_rating: "4.5",
      restaurant_image: "https://example.com/sushi.jpg",
      restaurant_status: "Open Now",
      restaurant_price: "9.99",
    })
  })

  it("shows validation errors", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: false })
    render(<RestaurantForm mode="add" initialValues={initialValues} onSubmit={onSubmit} />)
    fireEvent.click(screen.getByTestId("restaurant-save-btn"))

    expect(await screen.findByText(/Restaurant Name is required/)).toBeInTheDocument()
    expect(await screen.findByText(/Food Rating must be a number/)).toBeInTheDocument()
    expect(await screen.findByText(/Food Image URL is required/)).toBeInTheDocument()
  })
})
