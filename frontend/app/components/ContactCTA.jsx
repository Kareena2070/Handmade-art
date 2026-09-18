import { getWhatsAppUrl } from "../lib/whatsapp";

export default function ContactCTA() {
  const whatsappUrl = getWhatsAppUrl();

  return (
    <section className="bg-[#eee6db]">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-24">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
          Have something in mind?
        </p>

        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
          Let&apos;s talk about your next handmade piece.
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-gray-600">
          Interested in a product or looking for something special?
          Get in touch with us directly.
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}
