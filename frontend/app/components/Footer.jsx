import Link from "next/link";
import { getWhatsAppUrl } from "../lib/whatsapp";

export default function Footer() {
  const whatsappUrl = getWhatsAppUrl();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-xl font-semibold text-gray-900"
            >
              Handmade Art
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-600">
              Handmade pieces inspired by traditional Indian art,
              created with care and a personal touch.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Explore
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600">
              <Link
                href="/"
                className="hover:text-gray-900"
              >
                Home
              </Link>

              <Link
                href="/products"
                className="hover:text-gray-900"
              >
                Products
              </Link>

              <Link
                href="/about"
                className="hover:text-gray-900"
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Get in touch
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900"
              >
                WhatsApp
              </a>

              <a
                href="mailto:YOUR_EMAIL@example.com"
                className="hover:text-gray-900"
              >
                Email us
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Handmade Art. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
