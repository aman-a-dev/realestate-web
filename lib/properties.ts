// lib/properties.ts
export type PropertyStatus = "For Sale" | "For Rent";

export interface Property {
  id: string;
  title: string;
  city: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  area: number;
  status: PropertyStatus;
  type: string; // Added: Villa, Apartment, Penthouse, etc.
  tags: string[]; // Added: For search filtering
  image: string;
  description: string;
  features: string[];
}

export const properties: Property[] = [
  {
    id: "1",
    title: "Modern Villa in Bole",
    city: "Addis Ababa",
    location: "Bole, Near Edna Mall",
    price: 25500000,
    beds: 4,
    baths: 3,
    area: 350,
    status: "For Sale",
    type: "Villa",
    tags: ["luxury", "pool", "garden", "smart home"],
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    description:
      "A stunning modern villa located in the heart of Bole. Features a spacious garden, smart home integration, and premium finishes throughout.",
    features: [
      "Swimming Pool",
      "Smart Home",
      "2 Car Garage",
      "Garden",
      "Security System",
    ],
  },
  {
    id: "2",
    title: "Luxury Apartment in CMC",
    city: "Addis Ababa",
    location: "CMC, Atlas Area",
    price: 45000,
    beds: 2,
    baths: 2,
    area: 120,
    status: "For Rent",
    type: "Apartment",
    tags: ["furnished", "gym", "security", "balcony"],
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    description:
      "Bright and airy 2-bedroom apartment in a secure compound. Close to international schools and shopping centers.",
    features: ["Gym Access", "Backup Generator", "Balcony", "Concierge"],
  },
  {
    id: "3",
    title: "Lake View Mansion",
    city: "Bahir Dar",
    location: "Tana Beach Road",
    price: 42000000,
    beds: 5,
    baths: 4,
    area: 500,
    status: "For Sale",
    type: "Villa",
    tags: ["lake view", "luxury", "private dock", "solar"],
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    description:
      "Breathtaking lakefront property with private dock. Perfect for a luxury retreat or boutique hotel conversion.",
    features: [
      "Lake View",
      "Private Dock",
      "Guest House",
      "Solar Power",
      "Wine Cellar",
    ],
  },
  {
    id: "4",
    title: "Cozy Studio in Hawassa",
    city: "Hawassa",
    location: "Tabor Area",
    price: 15000,
    beds: 1,
    baths: 1,
    area: 60,
    status: "For Rent",
    type: "Studio",
    tags: ["furnished", "wifi", "rooftop", "affordable"],
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    description:
      "Fully furnished studio apartment overlooking the city. Ideal for expats or young professionals.",
    features: [
      "Furnished",
      "High-Speed Internet",
      "Rooftop Access",
      "24/7 Water",
    ],
  },
  {
    id: "5",
    title: "Commercial Space in Sarbet",
    city: "Addis Ababa",
    location: "Sarbet, Main Road",
    price: 85000,
    beds: 0,
    baths: 2,
    area: 250,
    status: "For Rent",
    type: "Commercial",
    tags: ["commercial", "high traffic", "parking", "storage"],
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    description:
      "Prime commercial space on the main road. High foot traffic, perfect for a restaurant, showroom, or office.",
    features: ["Main Road Access", "High Ceiling", "Parking", "Storage Room"],
  },
  {
    id: "6",
    title: "Traditional G+2 in Kazanchis",
    city: "Addis Ababa",
    location: "Kazanchis",
    price: 38000000,
    beds: 6,
    baths: 4,
    area: 420,
    status: "For Sale",
    type: "Building",
    tags: ["investment", "multiple units", "central", "guard"],
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80",
    description:
      "Well-maintained G+2 building with multiple rental units or perfect for a large family. Excellent investment opportunity.",
    features: [
      "Multiple Units",
      "Central Location",
      "Guard House",
      "Paved Compound",
    ],
  },
];
