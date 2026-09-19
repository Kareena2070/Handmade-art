import Link from "next/link";
import homeImage from "../../public/main-image.jpeg";

export default function Hero() {
  return (
    <section className="bg-[#faf7f2]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-gray-600">
            Handmade with love
          </p>

          <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-gray-900 md:text-6xl">
            Art that carries a story.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
            Discover thoughtfully handmade pieces inspired by Indian folk art,
            created with care and a personal touch.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Explore Collection
            </Link>

            <Link
              href="/about"
              className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
            >
              Our Story
            </Link>
          </div>
        </div>

        <div className="flex h-[400px] w-full items-center justify-center overflow-hidden rounded-3xl md:h-[500px]">
          <img
            src={homeImage.src}
            alt="Handmade Art"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
