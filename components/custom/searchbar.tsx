"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  cityFilter: string;
  setCityFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  showFilters?: boolean;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  cityFilter,
  setCityFilter,
  statusFilter,
  setStatusFilter,
  showFilters = true,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const clearSearch = () => setSearchQuery("");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full bg-card border border-border rounded-2xl p-4 md:p-6 shadow-lg backdrop-blur-sm"
    >
      {/* Header */}
      <motion.div
        className="flex items-center gap-2 mb-4 text-muted-foreground"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <motion.div
          animate={{ rotate: showFilters ? 0 : -90 }}
          transition={{ duration: 0.3 }}
        >
          <SlidersHorizontal size={18} />
        </motion.div>
        <h3 className="font-semibold text-foreground">
          Find Your Dream Property
        </h3>
      </motion.div>

      {/* Search & Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <motion.div
          className="md:col-span-2 relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <motion.div
            animate={{
              scale: isFocused ? 1.1 : 1,
              color: isFocused
                ? "hsl(var(--primary))"
                : "hsl(var(--muted-foreground))",
            }}
            transition={{ duration: 0.2 }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
          >
            <Search size={18} />
          </motion.div>

          <Input
            placeholder="Search by title, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="pl-10 pr-10 bg-background border-border transition-all duration-300"
          />

          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                type="button"
              >
                <X size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Filters */}
        <div className="grid grid-cols-2 justify-center">
          <AnimatePresence>
            {showFilters && (
              <>
                {/* City Filter */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <Select
                    value={cityFilter}
                    onValueChange={(value) => setCityFilter(value ?? "all")}
                  >
                    <SelectTrigger className="bg-background border-border hover:border-primary/50 transition-colors duration-200">
                      <SelectValue placeholder="All Cities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      <SelectItem value="Addis Ababa">Addis Ababa</SelectItem>
                      <SelectItem value="Bahir Dar">Bahir Dar</SelectItem>
                      <SelectItem value="Hawassa">Hawassa</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Status Filter */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                >
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value ?? "all")}
                  >
                    <SelectTrigger className="bg-background border-border hover:border-primary/50 transition-colors duration-200">
                      <SelectValue placeholder="Buy or Rent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Buy & Rent</SelectItem>
                      <SelectItem value="For Sale">For Sale</SelectItem>
                      <SelectItem value="For Rent">For Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Active Filters Indicator */}
        <AnimatePresence>
          {showFilters && (cityFilter !== "all" || statusFilter !== "all") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-border overflow-hidden"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Active filters:</span>
                <div className="flex gap-2">
                  <AnimatePresence mode="popLayout">
                    {cityFilter !== "all" && (
                      <motion.span
                        key="city"
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                      >
                        {cityFilter}
                        <button
                          onClick={() => setCityFilter("all")}
                          className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </motion.span>
                    )}
                    {statusFilter !== "all" && (
                      <motion.span
                        key="status"
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                      >
                        {statusFilter}
                        <button
                          onClick={() => setStatusFilter("all")}
                          className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
