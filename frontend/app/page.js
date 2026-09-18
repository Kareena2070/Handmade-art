import Hero from "./components/Hero";
import FeaturedProducts from "./components/FeaturedProducts";
import ContactCTA from "./components/ContactCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <ContactCTA />
    </main>
  );
}