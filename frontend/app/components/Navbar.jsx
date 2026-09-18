"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="text-xl font-semibold text-gray-900"
          >
            Handmade Art
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 text-sm md:flex">
            <Link
              href="/"
              className="hover:text-gray-600"
            >
              Home
            </Link>

            <Link
              href="/products"
              className="hover:text-gray-600"
            >
              Products
            </Link>

            <Link
              href="/about"
              className="hover:text-gray-600"
            >
              Our Story
            </Link>

            <a
              href="https://wa.me/YOUR_PHONE_NUMBER"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-black px-4 py-2 text-white transition hover:bg-gray-800"
            >
              WhatsApp
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-md p-2 text-gray-900 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <span className="text-2xl">×</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-t border-gray-100 py-4 md:hidden">
            <div className="flex flex-col gap-4 text-sm">
              <Link
                href="/"
                onClick={closeMenu}
                className="py-1"
              >
                Home
              </Link>

              <Link
                href="/products"
                onClick={closeMenu}
                className="py-1"
              >
                Products
              </Link>

              <Link
                href="/about"
                onClick={closeMenu}
                className="py-1"
              >
                Our Story
              </Link>

              <a
                href="https://wa.me/YOUR_PHONE_NUMBER"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="w-fit rounded-full bg-black px-5 py-2 text-white"
              >
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}