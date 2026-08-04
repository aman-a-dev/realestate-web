import { notFound } from "next/navigation";
import { properties } from "@/lib/properties";
import {
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Fixes IDs like:
 * "1 " -> "1"
 * " 2" -> "2"
 */
const cleanId = (value: unknown) => String(value ?? "").trim();

/**
 * Fixes normal text like:
 * "Modern Villa in Bole " -> "Modern Villa in Bole"
 */
const cleanText = (value: unknown) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Fixes image URLs like:
 * "https://... ?auto=format &fit=crop" -> "https://...?auto=format&fit=crop"
 */
const cleanUrl = (value: unknown) => String(value ?? "").replace(/\s+/g, "");

export async function generateStaticParams() {
  return properties.map((property) => ({
    id: cleanId(property.id),
  }));
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;

  const matchedProperty = properties.find(
    (property) => cleanId(property.id) === cleanId(id),
  );

  if (!matchedProperty) {
    notFound();
  }

  const property = matchedProperty!;

  const title = cleanText(property.title);
  const city = cleanText(property.city);
  const location = cleanText(property.location);
  const description = cleanText(property.description);
  const status = cleanText(property.status);
  const image = cleanUrl(property.image);
  const features = property.features.map(cleanText);

  const isSale = status === "For Sale";

  return (
    <main className="min-h-screen bg-background pb-20 mt-10">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/*
          If you have a /properties page, you can change href="/" to href="/properties"
        */}
        <Link href="/">
          <Button
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={18} /> Back to home
          </Button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left: Image & Details */}
        <div className="lg:col-span-3 space-y-8">
          {/* Hero Image */}
          <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            <div
              className={`absolute top-6 left-6 px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                isSale ? "bg-green-500 text-white" : "bg-yellow-500 text-black"
              }`}
            >
              {status}
            </div>
          </div>

          {/* Description */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              About this property
            </h2>

            <p className="text-muted-foreground leading-relaxed text-lg">
              {description}
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">
              Features & Amenities
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div
                  key={`${feature}-${index}`}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <CheckCircle2 size={18} className="text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Sticky Info Card */}
        <div className="lg:col-span-2">
          <div className="sticky top-8 bg-card border border-border rounded-2xl p-8 shadow-xl">
            <h1 className="text-3xl font-black text-foreground leading-tight">
              {title}
            </h1>

            <div className="flex items-center gap-2 mt-3 text-muted-foreground">
              <MapPin size={16} className="text-primary" />
              <span className="font-medium">
                {city}, {location}
              </span>
            </div>

            <div className="mt-6 pb-6 border-b border-border">
              <p className="text-4xl font-black text-primary">
                ETB {property.price.toLocaleString()}
                {status === "For Rent" && (
                  <span className="text-lg font-normal text-muted-foreground">
                    /mo
                  </span>
                )}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 my-6">
              <div className="text-center p-4 bg-muted rounded-xl">
                <BedDouble className="mx-auto text-primary mb-2" size={24} />
                <p className="text-xl font-bold text-foreground">
                  {property.beds}
                </p>
                <p className="text-xs text-muted-foreground">Beds</p>
              </div>

              <div className="text-center p-4 bg-muted rounded-xl">
                <Bath className="mx-auto text-primary mb-2" size={24} />
                <p className="text-xl font-bold text-foreground">
                  {property.baths}
                </p>
                <p className="text-xs text-muted-foreground">Baths</p>
              </div>

              <div className="text-center p-4 bg-muted rounded-xl">
                <Maximize className="mx-auto text-primary mb-2" size={24} />
                <p className="text-xl font-bold text-foreground">
                  {property.area}
                </p>
                <p className="text-xs text-muted-foreground">Sq Meters</p>
              </div>
            </div>

            {/* Contact Button */}
            <Button className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
              Contact Agent
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Usually responds within 2 hours
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
