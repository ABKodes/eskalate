import { getFoods } from "@/lib/api"
import { vi } from "vitest"

describe("API Mocking", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("fetches and maps foods successfully", async () => {
    const mockData = [
      { id: "1", name: "Burger", rating: 4.2, image: "http://img", status: "Open Now", price: 8.2 },
      { id: "2", name: "Pasta", rating: 4.8, image: "http://img2", status: "Closed", price: 11.0 },
    ]
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    } as any)

    const foods = await getFoods()
    expect(foods).toHaveLength(2)
    expect(foods[0].name).toBe("Burger")
    expect(foods[1].status).toBe("Closed")
  })

  it("throws on failed fetch", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as any)

    await expect(getFoods()).rejects.toThrow()
  })
})
