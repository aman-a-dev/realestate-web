import Hero from "@/components/blocks/hero";
import PropertyShowcase from "@/components/blocks/property-showcase";
import PropertyList from "@/components/blocks/property-list";
import { properties } from "@/lib/properties";
import Statistics from "@/components/blocks/statistics";
import Landing from "@/components/blocks/landing";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <PropertyShowcase />
      <Statistics />
      <PropertyList properties={properties} />
      <Landing />
    </main>
  );
}
