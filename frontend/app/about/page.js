export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#faf7f2]">
      <section className="mx-auto max-w-4xl px-6 py-20 md:py-28">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
          Our story
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-gray-900 md:text-6xl">
          Handmade art, rooted in tradition.
        </h1>

        <div className="mt-10 space-y-6 text-lg leading-8 text-gray-600">
          <p>
            Every piece we create is made by hand, with patience,
            creativity, and a deep appreciation for traditional Indian
            art.
          </p>

          <p>
            Our work brings traditional artistic styles into everyday
            objects and thoughtful handmade pieces — from colourful
            stationery to small pieces of art that brighten a home.
          </p>

          <p>
            We believe handmade work has something special. No two
            pieces feel exactly the same, because every piece carries
            the time, care, and creativity of the person who made it.
          </p>

          <p>
            What started with a love for creating has grown into a
            collection of pieces made to be shared, gifted, and enjoyed.
          </p>
        </div>

        <div className="mt-14 rounded-3xl bg-[#eee6db] p-8 md:p-12">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            Made by hand
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-gray-900 md:text-3xl">
            Every piece has its own little story.
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-gray-600">
            From the first sketch to the final detail, our handmade
            pieces are created with care rather than mass produced.
          </p>
        </div>
      </section>
    </main>
  );
}