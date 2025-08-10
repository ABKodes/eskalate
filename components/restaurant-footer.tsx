"use client"

export function RestaurantFooter() {
  return (
    <footer className="restaurant-footer border-t mt-8">
      <div className="container mx-auto px-4 py-6 grid gap-2 sm:flex sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Food Wagen, Inc. All rights reserved.
        </div>
        <nav className="text-sm flex gap-4">
          <a className="hover:underline restaurant-link" href="#about">
            About
          </a>
          <a className="hover:underline restaurant-link" href="#contact">
            Contact
          </a>
          <a className="hover:underline restaurant-link" href="#privacy">
            Privacy
          </a>
        </nav>
      </div>
    </footer>
  )
}
