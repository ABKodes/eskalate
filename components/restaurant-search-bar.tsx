
"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { getFoods } from "@/lib/api"

export function RestaurantSearchBar({
  value,
  onChange,
  onClear,
}: {
  value: string
  onChange: (v: string) => void
  onClear?: () => void
}) {
  const [foodImage, setFoodImage] = useState<string>("")
  const [tab, setTab] = useState<'delivery' | 'pickup'>('delivery')

  useEffect(() => {
    async function fetchFoodImage() {
      try {
        const foods = await getFoods()
        if (foods.length > 0 && foods[0].image) {
          setFoodImage(foods[0].image)
        }
      } catch (e) {
        setFoodImage("")
      }
    }
    fetchFoodImage()
  }, [])

  return (
    <section
      className="hero-section flex flex-col md:flex-row items-center justify-between p-8 rounded-xl"
      style={{ background: "#FF9A0E", minHeight: "320px" }}
    >
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        {/* Hero Text */}
        <div className="mb-2">
          <h1 className="text-4xl font-bold text-white mb-2">Are You Starving</h1>
          <p className="text-lg text-white/90">Within a few clicks, find meals that are accessible near you</p>
        </div>
        {/* Tabs and Search Bar */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4">
          <div className="flex gap-2 mb-2">
            <button
              className={`px-4 py-2 rounded-t-lg font-semibold shadow ${tab === 'delivery' ? 'bg-orange-100 text-orange-500' : 'bg-white text-orange-500'}`}
              onClick={() => setTab('delivery')}
            >
              Delivery
            </button>
            <button
              className={`px-4 py-2 rounded-t-lg font-semibold ${tab === 'pickup' ? 'bg-orange-100 text-orange-500 shadow' : 'bg-white text-orange-500'}`}
              onClick={() => setTab('pickup')}
            >
              Pickup
            </button>
          </div>
          <div className="relative flex items-center gap-2">
            <Input
              id="restaurant-search"
              className="restaurant-input pr-10 text-base bg-white text-black"
              placeholder="Enter restaurant name"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              data-testid="restaurant-search-input"
            />
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="restaurant-btn absolute right-1"
                aria-label="Clear search"
                onClick={onClear}
                data-testid="restaurant-search-clear"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              type="button"
              variant="default"
              className="find-meal-btn ml-2 bg-[#FF9A0E] text-white hover:bg-[#e88a0c] border-none shadow"
              aria-label="Find meal"
              data-testid="restaurant-search-find-meal"
            >
              Find Meal
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex justify-center items-center mt-8 md:mt-0">
        {foodImage ? (
          <img
            src={foodImage}
            alt="Food"
            className="rounded-xl shadow-lg object-cover"
            style={{ maxWidth: "320px", maxHeight: "240px" }}
          />
        ) : (
          <div className="bg-white/30 rounded-xl w-[320px] h-[240px] flex items-center justify-center text-white text-lg">
            No image
          </div>
        )}
      </div>
    </section>
  )
}
