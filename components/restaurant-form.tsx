"use client"

import type React from "react"

import { useEffect, useId, useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { validateRestaurantForm, type RestaurantFormErrors } from "@/lib/validation"

export type RestaurantFormValues = {
  restaurant_name: string
  restaurant_rating: string
  restaurant_image: string
  restaurant_status: "Open Now" | "Closed" | string
  restaurant_price: string
}

export function RestaurantForm({
  mode,
  initialValues,
  pending,
  onSubmit,
  onCancel,
}: {
  mode: "add" | "edit"
  initialValues: RestaurantFormValues
  pending?: boolean
  onSubmit: (values: RestaurantFormValues) => Promise<{ ok: boolean; message?: string }>
  onCancel?: () => void
}) {
  const [values, setValues] = useState<RestaurantFormValues>(initialValues)
  const [errors, setErrors] = useState<RestaurantFormErrors>({})
  const [justSubmitted, setJustSubmitted] = useState(false)

  useEffect(() => {
    setValues(initialValues)
    setErrors({})
  }, [initialValues])

  const formId = useId()

  const submitLabel = (() => {
    if (pending) {
      // Required Loading States
      return mode === "add" ? "Adding Food..." : "Updating Food..."
    }
    // Alternative Phase text from brief also mentions "Saving Restaurant..."
    return mode === "add" ? "Save" : "Save"
  })()

  const handleChange = (name: keyof RestaurantFormValues, val: string) => {
    setValues((v) => ({ ...v, [name]: val }))
    if (errors[name]) {
      // live clear on edit
      setErrors((e) => ({ ...e, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validateRestaurantForm(values)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setJustSubmitted(true)
    const res = await onSubmit(values)
    if (res.ok) {
      // reset after success
      setValues({
        restaurant_name: "",
        restaurant_rating: "",
        restaurant_image: "",
        restaurant_status: "Open Now",
        restaurant_price: "",
      })
      setErrors({})
    } else if (res.message) {
      // Could surface a general error if needed
      // eslint-disable-next-line no-console
      console.error(res.message)
    }
    setJustSubmitted(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="restaurant-form grid gap-4"
      data-testid="restaurant-form"
      aria-describedby={[
        errors.restaurant_name ? "restaurant_name-error" : "",
        errors.restaurant_rating ? "restaurant_rating-error" : "",
        errors.restaurant_image ? "restaurant_image-error" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="grid gap-2">
        <Label htmlFor={formId + "-restaurant-name"}>Restaurant Name</Label>
        <Input
          id={formId + "-restaurant-name"}
          name="restaurant_name"
          className="restaurant-input"
          placeholder="Enter restaurant name"
          value={values.restaurant_name}
          onChange={(e) => handleChange("restaurant_name", e.target.value)}
          aria-invalid={!!errors.restaurant_name}
          aria-describedby={errors.restaurant_name ? "restaurant_name-error" : undefined}
        />
        {errors.restaurant_name && (
          <p id="restaurant_name-error" className="text-sm text-red-600">
            Restaurant Name is required
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor={formId + "-restaurant-rating"}>Restaurant Rating</Label>
        <Input
          id={formId + "-restaurant-rating"}
          name="restaurant_rating"
          type="number"
          step="0.1"
          min={1}
          max={5}
          className="restaurant-input"
          placeholder="Rating (1-5)"
          value={values.restaurant_rating}
          onChange={(e) => handleChange("restaurant_rating", e.target.value)}
          aria-invalid={!!errors.restaurant_rating}
          aria-describedby={errors.restaurant_rating ? "restaurant_rating-error" : undefined}
        />
        {errors.restaurant_rating && (
          <p id="restaurant_rating-error" className="text-sm text-red-600">
            Food Rating must be a number
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor={formId + "-restaurant-image"}>Restaurant Image URL</Label>
        <Input
          id={formId + "-restaurant-image"}
          name="restaurant_image"
          type="url"
          className="restaurant-input"
          placeholder="Enter restaurant image URL"
          value={values.restaurant_image}
          onChange={(e) => handleChange("restaurant_image", e.target.value)}
          aria-invalid={!!errors.restaurant_image}
          aria-describedby={errors.restaurant_image ? "restaurant_image-error" : undefined}
        />
        {errors.restaurant_image && (
          <p id="restaurant_image-error" className="text-sm text-red-600">
            Food Image URL is required
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor={formId + "-restaurant-status"}>Restaurant Status</Label>
        <Select value={values.restaurant_status} onValueChange={(v) => handleChange("restaurant_status", v)}>
          <SelectTrigger
            id={formId + "-restaurant-status"}
            className="restaurant-input"
            aria-invalid={!!errors.restaurant_status}
            aria-describedby={errors.restaurant_status ? "restaurant-status-error" : undefined}
          >
            <SelectValue placeholder="Select restaurant status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Open Now">Open Now</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        {errors.restaurant_status && (
          <p id="restaurant-status-error" className="text-sm text-red-600">
            Restaurant Status must be ‘Open Now’ or ‘Closed’
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor={formId + "-restaurant-price"}>Restaurant Price (optional)</Label>
        <Input
          id={formId + "-restaurant-price"}
          name="restaurant_price"
          type="number"
          step="0.01"
          className="restaurant-input"
          placeholder="Enter restaurant price (optional)"
          value={values.restaurant_price}
          onChange={(e) => handleChange("restaurant_price", e.target.value)}
          aria-invalid={!!errors.restaurant_price}
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="outline" className="restaurant-btn bg-transparent" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="restaurant-btn"
          disabled={pending || justSubmitted}
          data-testid="restaurant-save-btn"
        >
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "add" ? "Saving Restaurant..." : "Saving Restaurant..."}
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  )
}
