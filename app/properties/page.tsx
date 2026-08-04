"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/custom/searchbar";
import PropertyList from "@/components/blocks/property-list";
import { properties } from "@/lib/properties";

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCity = cityFilter === "all" || p.city === cityFilter;
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;

      return matchesSearch && matchesCity && matchesStatus;
    });
  }, [searchQuery, cityFilter, statusFilter]);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="relative pt-20 pb-10 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-foreground"
          >
            Explore <span className="text-primary">Properties</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Discover premium real estate across Ethiopia's most vibrant cities.
          </motion.p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cityFilter={cityFilter}
          setCityFilter={setCityFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </section>

      {/* Results Count */}
      <section className="max-w-7xl mx-auto px-4 mb-6">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-bold text-foreground">
            {filteredProperties.length}
          </span>{" "}
          properties
        </p>
      </section>

      {/* Property List */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <PropertyList properties={filteredProperties} />
      </section>
    </main>
  );
}
