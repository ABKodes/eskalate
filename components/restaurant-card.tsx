"use client"

import Image from "next/image"
import { Edit, Trash2, Star } from "lucide-react"
import { DollarSign } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { RestaurantFood } from "@/types/restaurant"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function RestaurantCard({
  item,
  onEdit,
  onDelete,
}: {
  item: RestaurantFood
  onEdit?: () => void
  onDelete?: () => void
}) {
  const statusTone =
    item.status === "Open Now"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-rose-100 text-rose-700 border-rose-200"

  return (
    <Card
      className="restaurant-card overflow-hidden transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-md"
      data-testid="restaurant-card"
    >
      <CardHeader className="p-0">
        <div className="relative w-full aspect-[16/10] bg-muted">
          {/* Price tag in top left */}
          <div className="absolute top-2 left-2 z-10 bg-[#FF9A0E] text-white rounded-lg px-3 py-1 text-xs font-semibold flex items-center gap-1 shadow">
            <DollarSign className="w-4 h-4" />
            <span>{typeof item.price === "number" ? `$${item.price.toFixed(2)}` : "N/A"}</span>
          </div>
          <Image
            src={item.image || "/placeholder.svg?height=240&width=384&query=restaurant%20food%20image"}
            alt={item.name ? `${item.name} image` : "Restaurant food image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <div className="restaurant-name font-semibold text-base leading-tight">{item.name}</div>
        <div className="flex items-center gap-3 text-sm">
          <div className="restaurant-rating flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4" fill="#FF9A0E" stroke="#FF9A0E" />
            <span className="font-semibold text-black">{Number(item.rating).toFixed(1)}</span>
          </div>
        </div>
        <div className="restaurant-status">
          <Badge variant="outline" className={`border ${statusTone}`}>
            {item.status}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          className="restaurant-btn bg-transparent"
          onClick={onEdit}
          data-testid="restaurant-edit-btn"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="restaurant-btn"
          onClick={onDelete}
          data-testid="restaurant-delete-card-btn"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
