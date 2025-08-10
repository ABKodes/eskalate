"use client";

import { Instagram, Facebook, Twitter } from "lucide-react";

export function RestaurantFooter() {
  return (
    <footer className="restaurant-footer mt-8 bg-[#18181b] text-white">
      <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row justify-between gap-8 md:gap-x-20 items-start">
        {/* Left flex: Company, Contact, Legal */}
  <div className="flex flex-col sm:flex-row justify-between gap-8 w-full md:w-auto">
          <div>
            <h3 className="font-bold mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="hover:underline">
                  About us
                </a>
              </li>
              <li>
                <a href="#team" className="hover:underline">
                  Team
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:underline">
                  Careers
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:underline">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="#help" className="hover:underline">
                  Help and Support
                </a>
              </li>
              <li>
                <a href="#partner" className="hover:underline">
                  Partner with us
                </a>
              </li>
              <li>
                <a href="#ride" className="hover:underline">
                  Ride with us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#terms" className="hover:underline">
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a href="#refund" className="hover:underline">
                  Refund and Cancellation
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#cookie" className="hover:underline">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Right grid: Social, Email, Subscribe */}
        <div className="flex flex-col gap-6 justify-between">
          <div>
            <h3 className="font-bold mb-3">Follow us</h3>
            <div className="flex gap-4 mb-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
                className="hover:text-[#FF9A0E]"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
                className="hover:text-[#FF9A0E]"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener"
                aria-label="Twitter"
                className="hover:text-[#FF9A0E]"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
            <form className="flex gap-2 mt-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-l bg-[#232326] text-white border-none outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-r bg-[#FF9A0E] text-white font-semibold hover:bg-[#e88a0c]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      <hr className="border-t border-gray-700 my-6" />
      <div className="text-center text-xs text-gray-400 pb-6">
        All rights reserved &copy; Your Company 2021
      </div>
    </footer>
  );
}
