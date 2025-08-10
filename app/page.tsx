"use client"

import { useEffect, useMemo, useState } from "react"
import { PlusCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { RestaurantCard } from "@/components/restaurant-card"
import { RestaurantSearchBar } from "@/components/restaurant-search-bar"
import { RestaurantModal } from "@/components/restaurant-modal"
import { RestaurantForm, type RestaurantFormValues } from "@/components/restaurant-form"
import { RestaurantFooter } from "@/components/restaurant-footer"

import { getFoods, createFood, updateFood, deleteFood } from "@/lib/api"
import type { RestaurantFood } from "@/types/restaurant"

function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

export default function Page() {
  const [foods, setFoods] = useState<RestaurantFood[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 450)

  const [entryAnimated, setEntryAnimated] = useState(false)

  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [selected, setSelected] = useState<RestaurantFood | null>(null)
  const [actionPending, setActionPending] = useState(false)

  const loadFoods = async (q?: string) => {
    try {
      setLoading(true)
      setError(null)
      let data = await getFoods(q)
      // Randomly set some items to 'Closed' for demo
      data = data.map((item, idx) => ({
        ...item,
        status: idx % 3 === 0 ? "Closed" : item.status,
      }))
      setFoods(data)
    } catch (e) {
      setError("Failed to load data. Please try again.")
    } finally {
      setLoading(false)
      // trigger entry animation once data is ready
      requestAnimationFrame(() => {
        setEntryAnimated(true)
        setTimeout(() => {
          // allow re-trigger on future reloads if needed
        }, 300)
      })
    }
  }

  useEffect(() => {
    loadFoods()
  }, [])

  useEffect(() => {
    loadFoods(debouncedSearch)
  }, [debouncedSearch])

  const handleOpenAdd = () => {
    setSelected(null)
    setAddOpen(true)
  }

  const handleOpenEdit = (item: RestaurantFood) => {
    setSelected(item)
    setEditOpen(true)
  }

  const handleOpenDelete = (item: RestaurantFood) => {
    setSelected(item)
    setDeleteOpen(true)
  }

  const initialFormValues: RestaurantFormValues = useMemo(
    () => ({
      restaurant_name: selected?.name ?? "",
      restaurant_rating: selected?.rating?.toString() ?? "",
      restaurant_image: selected?.image ?? "",
      restaurant_status: selected?.status ?? "Open Now",
      restaurant_price: selected?.price?.toString() ?? "",
    }),
    [selected],
  )

  const handleAdd = async (values: RestaurantFormValues) => {
    try {
      setActionPending(true)
      const payload: Omit<RestaurantFood, "id"> = {
        name: values.restaurant_name.trim(),
        rating: Number(values.restaurant_rating),
        image: values.restaurant_image.trim(),
        status: values.restaurant_status as "Open Now" | "Closed",
        price: values.restaurant_price ? Number(values.restaurant_price) : undefined,
      }
      await createFood(payload)
      await loadFoods(debouncedSearch)
      setAddOpen(false)
      return { ok: true }
    } catch (e) {
      return { ok: false, message: "Failed to add item." }
    } finally {
      setActionPending(false)
    }
  }

  const handleEdit = async (values: RestaurantFormValues) => {
    if (!selected?.id) return { ok: false, message: "Invalid selection." }
    try {
      setActionPending(true)
      const payload: Partial<RestaurantFood> = {
        name: values.restaurant_name.trim(),
        rating: Number(values.restaurant_rating),
        image: values.restaurant_image.trim(),
        status: values.restaurant_status as "Open Now" | "Closed",
        price: values.restaurant_price ? Number(values.restaurant_price) : undefined,
      }
      await updateFood(selected.id, payload)
      await loadFoods(debouncedSearch)
      setEditOpen(false)
      setSelected(null)
      return { ok: true }
    } catch (e) {
      return { ok: false, message: "Failed to update item." }
    } finally {
      setActionPending(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selected?.id) return
    try {
      setActionPending(true)
      await deleteFood(selected.id)
      await loadFoods(debouncedSearch)
      setDeleteOpen(false)
      setSelected(null)
    } catch (e) {
      // surface an inline error inside the modal area or toast
      setError("Failed to delete item.")
    } finally {
      setActionPending(false)
    }
  }

  return (
    <div className="restaurant-app min-h-dvh flex flex-col">
      <header className="restaurant-header sticky top-0 z-10 bg-background/70 backdrop-blur border-b px-8 py-4">
        <div className="container mx-auto flex items-center gap-3">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-semibold">Food Wagen</h1>
            <p className="text-sm text-muted-foreground">Manage your restaurant foods</p>
          </div>
          <Button className="restaurant-btn bg-[#FF9A0E] text-white hover:bg-[#e88a0c] border-none shadow" onClick={handleOpenAdd} data-testid="restaurant-add-food-btn">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Food
          </Button>
        </div>
      </header>

      <main className="restaurant-main flex-1">
        <section className="container mx-auto px-4 py-6">
          <Card className="restaurant-search-card">
            <CardContent className="py-4">
              <RestaurantSearchBar value={search} onChange={setSearch} onClear={() => setSearch("")} />
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading restaurants...</span>
              </div>
            </div>
          ) : error ? (
            <div className="restaurant-error my-8 text-center text-red-600">{error}</div>
          ) : foods.length === 0 ? (
            <div className="restaurant-empty my-10 text-center">
              <h2 className="text-lg font-semibold mb-2 empty-state-message">No items available</h2>
              <p className="text-muted-foreground">Try adjusting your search or add a new restaurant food item.</p>
              <div className="mt-4">
                <Button className="restaurant-btn bg-[#FF9A0E] text-white hover:bg-[#e88a0c] border-none shadow" onClick={handleOpenAdd} data-testid="restaurant-empty-add-btn">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Food
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={[
                "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6 px-2 md:px-8 lg:px-16",
                "transition-opacity transition-transform duration-300",
                entryAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
              ].join(" ")}
            >
              {foods.map((food) => (
                <article key={food.id}>
                  <RestaurantCard
                    item={food}
                    onEdit={() => handleOpenEdit(food)}
                    onDelete={() => handleOpenDelete(food)}
                  />
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <RestaurantFooter />

      {/* Add Modal */}
      <RestaurantModal title="Add Food" open={addOpen} onOpenChange={setAddOpen} dataTestId="restaurant-add-modal">
        <RestaurantForm
          mode="add"
          initialValues={{
            restaurant_name: "",
            restaurant_rating: "",
            restaurant_image: "",
            restaurant_status: "Open Now",
            restaurant_price: "",
          }}
          pending={actionPending}
          onSubmit={handleAdd}
          onCancel={() => setAddOpen(false)}
        />
      </RestaurantModal>

      {/* Edit Modal */}
      <RestaurantModal title="Edit Food" open={editOpen} onOpenChange={setEditOpen} dataTestId="restaurant-edit-modal">
        <RestaurantForm
          mode="edit"
          initialValues={initialFormValues}
          pending={actionPending}
          onSubmit={handleEdit}
          onCancel={() => setEditOpen(false)}
        />
      </RestaurantModal>

      {/* Delete Modal */}
      <RestaurantModal
        title="Delete Food"
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        dataTestId="restaurant-delete-modal"
      >
        <div className="restaurant-delete-content space-y-4">
          <p>
            Are you sure you want to delete <strong className="restaurant-name">{selected?.name}</strong>?
          </p>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" className="restaurant-btn bg-transparent" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="restaurant-btn"
              onClick={handleConfirmDelete}
              data-testid="restaurant-delete-btn"
              disabled={actionPending}
            >
              {actionPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting Restaurant...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </RestaurantModal>
    </div>
  )
}
