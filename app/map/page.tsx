"use client";
import {
  Map,
  MapFullscreenControl,
  MapLayerGroup,
  MapLayers,
  MapLayersControl,
  MapLocateControl,
  MapMarker,
  MapMarkerClusterGroup,
  MapPopup,
  MapSearchControl,
  MapTileLayer,
  MapTooltip,
  MapZoomControl,
} from "@/components/ui/map";
import {
  properties,
  type Property,
  type PropertyStatus,
} from "@/lib/properties";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BathIcon,
  BedDoubleIcon,
  Building2Icon,
  HeartIcon,
  HomeIcon,
  LandmarkIcon,
  ListIcon,
  MapPinIcon,
  SlidersHorizontalIcon,
  SquareIcon,
  StoreIcon,
  XIcon,
} from "lucide-react";
import type {
  LatLngExpression,
  LeafletEvent,
  LeafletMouseEvent,
  Map as LeafletMap,
} from "leaflet";
import { BRAND } from "@/lib/data";
import { useMap } from "react-leaflet";

/* ────────────────────────────────────────────────────────────────────────────
Types
──────────────────────────────────────────────────────────────────────────── */
type PropertyWithPosition = Property & {
  position: [number, number];
};
type StatusFilter = "All" | PropertyStatus;
type IconComponent = typeof HomeIcon;

/* ────────────────────────────────────────────────────────────────────────────
Helpers
──────────────────────────────────────────────────────────────────────────── */
function cleanText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function cleanUrl(value: unknown): string {
  return cleanText(value).replace(/\s+/g, "");
}

function formatPrice(property: Pick<Property, "price" | "status">): string {
  const suffix = property.status === "For Rent" ? "/mo" : "";
  try {
    const formatted = new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
      maximumFractionDigits: 0,
    }).format(property.price);
    return `${formatted}${suffix}`;
  } catch {
    return `${property.price.toLocaleString()} ETB${suffix}`;
  }
}

/* ────────────────────────────────────────────────────────────────────────────
Coordinates
──────────────────────────────────────────────────────────────────────────── */
const INITIAL_CENTER: LatLngExpression = [9.2, 38.75];
const CITY_CENTERS: Record<string, [number, number]> = {
  "Addis Ababa": [9.0272, 38.7469],
  "Bahir Dar": [11.5936, 37.3908],
  Hawassa: [7.0628, 38.477],
};

const PROPERTY_POSITIONS_BY_ID: Record<string, [number, number]> = {
  "1": [9.0108, 38.7895],
  "2": [9.0168, 38.8353],
  "3": [11.5889, 37.3615],
  "4": [7.0618, 38.4929],
  "5": [8.9937, 38.7483],
  "6": [9.0173, 38.7659],
};

const PROPERTY_POSITIONS_BY_TITLE: Record<string, [number, number]> = {
  "Modern Villa in Bole": [9.0108, 38.7895],
  "Luxury Apartment in CMC": [9.0168, 38.8353],
  "Lake View Mansion": [11.5889, 37.3615],
  "Cozy Studio in Hawassa": [7.0618, 38.4929],
  "Commercial Space in Sarbet": [8.9937, 38.7483],
  "Traditional G+2 in Kazanchis": [9.0173, 38.7659],
};

function getPropertyPosition({
  id,
  title,
  city,
  index,
}: {
  id: string;
  title: string;
  city: string;
  index: number;
}): [number, number] {
  if (id && PROPERTY_POSITIONS_BY_ID[id]) {
    return PROPERTY_POSITIONS_BY_ID[id];
  }
  if (title && PROPERTY_POSITIONS_BY_TITLE[title]) {
    return PROPERTY_POSITIONS_BY_TITLE[title];
  }
  const center: [number, number] = CITY_CENTERS[city] ?? [9.0272, 38.7469];
  const angle = (index * 137.5 * Math.PI) / 180;
  const distance = 0.015 + (index % 4) * 0.005;
  return [
    center[0] + Math.sin(angle) * distance,
    center[1] + Math.cos(angle) * distance,
  ];
}

/* ────────────────────────────────────────────────────────────────────────────
UI config
──────────────────────────────────────────────────────────────────────────── */
const TYPE_CONFIG: Record<string, { label: string; icon: IconComponent }> = {
  Villa: {
    label: "Villa",
    icon: HomeIcon,
  },
  Apartment: {
    label: "Apartment",
    icon: Building2Icon,
  },
  Studio: {
    label: "Studio",
    icon: BedDoubleIcon,
  },
  Commercial: {
    label: "Commercial",
    icon: StoreIcon,
  },
  Building: {
    label: "Building",
    icon: LandmarkIcon,
  },
};

function getTypeConfig(type: string) {
  return (
    TYPE_CONFIG[type] ?? {
      label: type || "Property",
      icon: HomeIcon,
    }
  );
}

const STATUS_CONFIG: Record<
  PropertyStatus,
  {
    badge: string;
    marker: string;
  }
> = {
  "For Sale": {
    badge:
      "border-emerald-500/20 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    marker: "bg-emerald-500",
  },
  "For Rent": {
    badge: "border-sky-500/20 bg-sky-500/15 text-sky-700 dark:text-sky-300",
    marker: "bg-sky-500",
  },
};

/* ────────────────────────────────────────────────────────────────────────────
Map marker
──────────────────────────────────────────────────────────────────────────── */
function PropertyMarkerIcon({
  property,
  active,
}: {
  property: PropertyWithPosition;
  active: boolean;
}) {
  const { icon: Icon } = getTypeConfig(property.type);
  return (
    <div className="relative flex flex-col items-center">
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-full border-2 border-white shadow-lg transition-transform duration-300",
          STATUS_CONFIG[property.status].marker,
          active && "scale-125 ring-4 ring-primary/25",
        )}
      >
        <Icon className="size-5 text-white" />
      </div>
      <div
        className={cn(
          "mt-0.5 size-2.5 -translate-y-1 rotate-45",
          STATUS_CONFIG[property.status].marker,
        )}
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
Property card
──────────────────────────────────────────────────────────────────────────── */
function PropertyCard({
  property,
  active,
  onSelect,
  index,
}: {
  property: PropertyWithPosition;
  active: boolean;
  onSelect: () => void;
  index: number;
}) {
  const [isFavorited, setIsFavorited] = useState(false);
  const typeConfig = getTypeConfig(property.type);
  const TypeIcon = typeConfig.icon;
  const statusConfig = STATUS_CONFIG[property.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{
        delay: Math.min(index, 8) * 0.04,
        duration: 0.25,
      }}
    >
      <Card
        className={cn(
          "group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg",
          active && "ring-2 ring-primary shadow-lg",
        )}
        onClick={onSelect}
      >
        <CardContent className="p-0">
          <div className="relative aspect-[16/9] overflow-hidden bg-muted">
            <div className="absolute inset-0 flex items-center justify-center">
              <TypeIcon className="size-10 text-muted-foreground/30" />
            </div>
            <img
              src={property.image}
              alt={property.title}
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(event) => {
                event.currentTarget.style.opacity = "0";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/10" />
            <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
              <Badge
                className={cn(
                  "border text-[10px] backdrop-blur-sm",
                  statusConfig.badge,
                )}
              >
                {property.status}
              </Badge>
              <Badge
                variant="secondary"
                className="text-[10px] backdrop-blur-sm"
              >
                {typeConfig.label}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 size-7 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
              onClick={(event) => {
                event.stopPropagation();
                setIsFavorited((current) => !current);
              }}
            >
              <HeartIcon
                className={cn(
                  "size-4",
                  isFavorited && "fill-red-500 text-red-500",
                )}
              />
            </Button>
            <div className="absolute inset-x-2 bottom-2 flex items-end justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white drop-shadow">
                  {property.title}
                </p>
                <p className="flex items-center gap-1 text-xs text-white/80">
                  <MapPinIcon className="size-3" />
                  <span className="truncate">{property.location}</span>
                </p>
              </div>
              <div className="rounded-md bg-black/45 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
                {formatPrice(property)}
              </div>
            </div>
          </div>
          <div className="space-y-2 p-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                {property.beds > 0 && (
                  <span className="flex items-center gap-1">
                    <BedDoubleIcon className="size-3.5" />
                    {property.beds}
                  </span>
                )}
                {property.baths > 0 && (
                  <span className="flex items-center gap-1">
                    <BathIcon className="size-3.5" />
                    {property.baths}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <SquareIcon className="size-3.5" />
                  {property.area.toLocaleString()} m²
                </span>
              </div>
              <span className="capitalize">{property.city}</span>
            </div>
            {property.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {property.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="px-1.5 py-0 text-[10px]"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
Filters
──────────────────────────────────────────────────────────────────────────── */
function FilterBar({
  statusFilter,
  onStatusChange,
  activeTypes,
  onToggleType,
  onClear,
  types,
}: {
  statusFilter: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  activeTypes: string[];
  onToggleType: (type: string) => void;
  onClear: () => void;
  types: string[];
}) {
  const statusOptions: StatusFilter[] = ["All", "For Sale", "For Rent"];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex shrink-0 items-center gap-1 rounded-lg border bg-muted/40 p-1">
        {statusOptions.map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "ghost"}
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => onStatusChange(status)}
          >
            {status === "All" ? "All" : status.replace("For ", "")}
          </Button>
        ))}
      </div>
      <Separator orientation="vertical" className="h-6 shrink-0" />
      <div className="flex shrink-0 items-center gap-1.5">
        <SlidersHorizontalIcon className="size-4 text-muted-foreground" />
        {types.map((type) => {
          const config = getTypeConfig(type);
          const Icon = config.icon;
          const isActive = activeTypes.includes(type);
          return (
            <Button
              key={type}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => onToggleType(type)}
            >
              <Icon className="size-3.5" />
              {config.label}
            </Button>
          );
        })}
        {(activeTypes.length > 0 || statusFilter !== "All") && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={onClear}
          >
            <XIcon className="size-3.5" />
            Clear
          </Button>
        )}
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
Stats
──────────────────────────────────────────────────────────────────────────── */
function StatsBar({
  count,
  saleCount,
  rentCount,
}: {
  count: number;
  saleCount: number;
  rentCount: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="hidden items-center gap-3 text-xs text-muted-foreground md:flex"
    >
      <span>
        <strong className="text-foreground">{count}</strong> listings
      </span>
      <Separator orientation="vertical" className="h-3" />
      <span>
        <strong className="text-foreground">{saleCount}</strong> for sale
      </span>
      <Separator orientation="vertical" className="h-3" />
      <span>
        <strong className="text-foreground">{rentCount}</strong> for rent
      </span>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
Empty state
──────────────────────────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <MapPinIcon className="mb-3 size-10 text-muted-foreground/40" />
      <p className="text-sm font-medium">No properties match your filters</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Try clearing filters or selecting a different status.
      </p>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
Mobile list sheet
──────────────────────────────────────────────────────────────────────────── */
function MobileListSheet({
  open,
  properties: visibleProperties,
  selectedId,
  onClose,
  onSelect,
}: {
  open: boolean;
  properties: PropertyWithPosition[];
  selectedId: string | null;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="mobile-list-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1300] bg-black/35 backdrop-blur-[2px] md:hidden"
            onClick={onClose}
          />
          <motion.div
            key="mobile-list-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[1310] max-h-[75vh] overflow-hidden rounded-t-2xl border bg-background shadow-2xl md:hidden"
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold">
                  Properties ({visibleProperties.length})
                </h2>
                <p className="text-xs text-muted-foreground">
                  Tap a property to locate it on the map.
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <XIcon className="size-4" />
              </Button>
            </div>
            <div className="max-h-[62vh] space-y-3 overflow-y-auto p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              {visibleProperties.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  active={property.id === selectedId}
                  onSelect={() => onSelect(property.id)}
                  index={index}
                />
              ))}
              {visibleProperties.length === 0 && <EmptyState />}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
Mobile property sheet
──────────────────────────────────────────────────────────────────────────── */
function MobilePropertySheet({
  property,
  onClose,
}: {
  property: PropertyWithPosition | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {property && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 320 }}
          className="fixed inset-x-0 bottom-0 z-[1320] md:hidden"
        >
          <Card className="max-h-[80vh] overflow-y-auto rounded-b-none border-b-0 shadow-2xl">
            <CardContent className="p-0">
              <div className="relative h-44 overflow-hidden bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPinIcon className="size-10 text-muted-foreground/30" />
                </div>
                <img
                  src={property.image}
                  alt={property.title}
                  className="absolute inset-0 size-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.opacity = "0";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/10" />
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  <Badge
                    className={cn(
                      "border text-[10px] backdrop-blur-sm",
                      STATUS_CONFIG[property.status].badge,
                    )}
                  >
                    {property.status}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-[10px] backdrop-blur-sm"
                  >
                    {getTypeConfig(property.type).label}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-3 size-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={onClose}
                >
                  <XIcon className="size-4" />
                </Button>
                <div className="absolute inset-x-3 bottom-3">
                  <p className="text-lg font-bold text-white drop-shadow">
                    {formatPrice(property)}
                  </p>
                </div>
              </div>
              <div className="space-y-4 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <div>
                  <h2 className="text-base font-semibold leading-tight">
                    {property.title}
                  </h2>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPinIcon className="size-3.5" />
                    {property.location}, {property.city}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {property.beds > 0 && (
                    <span className="flex items-center gap-1.5">
                      <BedDoubleIcon className="size-4" />
                      {property.beds} beds
                    </span>
                  )}
                  {property.baths > 0 && (
                    <span className="flex items-center gap-1.5">
                      <BathIcon className="size-4" />
                      {property.baths} baths
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <SquareIcon className="size-4" />
                    {property.area.toLocaleString()} m²
                  </span>
                </div>
                {property.description && (
                  <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {property.description}
                  </p>
                )}
                {property.features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {property.features.slice(0, 5).map((feature) => (
                      <Badge
                        key={feature}
                        variant="secondary"
                        className="text-xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <Button className="w-full">View Details</Button>
                  <Button variant="outline" className="w-full">
                    Contact Agent
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
Map Instance Setter (Fix for getting map instance in react-leaflet v4)
──────────────────────────────────────────────────────────────────────────── */
function MapInstanceSetter({
  onReady,
}: {
  onReady: (map: LeafletMap) => void;
}) {
  const map = useMap();
  useEffect(() => {
    onReady(map);
  }, [map, onReady]);
  return null;
}

/* ────────────────────────────────────────────────────────────────────────────
Page
──────────────────────────────────────────────────────────────────────────── */
export default function PropertiesMapPage() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null);
  const [hasFittedBounds, setHasFittedBounds] = useState(false);

  /* Normalize lib/properties.ts data and attach positions */
  const mapProperties = useMemo<PropertyWithPosition[]>(() => {
    return properties.map((property, index) => {
      const id = cleanText(property.id) || String(index + 1);
      const title = cleanText(property.title) || "Untitled Property";
      const city = cleanText(property.city) || "Ethiopia";
      const status: PropertyStatus =
        cleanText(property.status) === "For Rent" ? "For Rent" : "For Sale";

      const normalized: Property = {
        ...property,
        id,
        title,
        city,
        status,
        location: cleanText(property.location),
        type: cleanText(property.type) || "Property",
        image: cleanUrl(property.image),
        description: cleanText(property.description),
        tags: (property.tags ?? []).map(cleanText).filter(Boolean),
        features: (property.features ?? []).map(cleanText).filter(Boolean),
      };

      return {
        ...normalized,
        position: getPropertyPosition({
          id,
          title,
          city,
          index,
        }),
      };
    });
  }, []);

  const uniqueTypes = useMemo(() => {
    return Array.from(
      new Set(mapProperties.map((property) => property.type)),
    ).sort();
  }, [mapProperties]);

  const filteredProperties = useMemo(() => {
    return mapProperties.filter((property) => {
      const matchesStatus =
        statusFilter === "All" || property.status === statusFilter;
      const matchesType =
        activeTypes.length === 0 || activeTypes.includes(property.type);
      return matchesStatus && matchesType;
    });
  }, [mapProperties, statusFilter, activeTypes]);

  const selectedProperty = useMemo(() => {
    return (
      mapProperties.find((property) => property.id === selectedPropertyId) ??
      null
    );
  }, [mapProperties, selectedPropertyId]);

  const saleCount = useMemo(() => {
    return filteredProperties.filter(
      (property) => property.status === "For Sale",
    ).length;
  }, [filteredProperties]);

  const rentCount = useMemo(() => {
    return filteredProperties.filter(
      (property) => property.status === "For Rent",
    ).length;
  }, [filteredProperties]);

  const handleSelectProperty = useCallback((id: string) => {
    setSelectedPropertyId(id);
    setMobileListOpen(false);
    setMobileSheetOpen(true);
  }, []);

  const handleCloseMobileSheet = useCallback(() => {
    setMobileSheetOpen(false);
    setSelectedPropertyId(null);
  }, []);

  const handleToggleType = useCallback((type: string) => {
    setActiveTypes((previous) =>
      previous.includes(type)
        ? previous.filter((item) => item !== type)
        : [...previous, type],
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveTypes([]);
    setStatusFilter("All");
  }, []);

  const handleMapReady = useCallback((map: LeafletMap) => {
    setMapInstance(map);
  }, []);

  /* Fit all property markers on first load */
  useEffect(() => {
    if (!mapInstance || hasFittedBounds || mapProperties.length === 0) {
      return;
    }
    mapInstance.fitBounds(
      mapProperties.map((property) => property.position),
      {
        padding: [56, 56],
        maxZoom: 12,
      },
    );
    setHasFittedBounds(true);
  }, [mapInstance, hasFittedBounds, mapProperties]);

  /* Fly to selected property */
  useEffect(() => {
    if (!mapInstance || !selectedProperty) {
      return;
    }
    mapInstance.flyTo(
      selectedProperty.position,
      Math.max(mapInstance.getZoom(), 13),
      {
        duration: 1.1,
      },
    );
  }, [mapInstance, selectedProperty]);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="z-[1200] flex items-center justify-between border-b px-4 py-3 md:px-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
            <HomeIcon className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">{BRAND.name}</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Property locations across Ethiopia
            </p>
          </div>
        </div>
        <StatsBar
          count={filteredProperties.length}
          saleCount={saleCount}
          rentCount={rentCount}
        />
      </motion.header>

      {/* Filters */}
      <div className="z-[1190] border-b px-4 py-2.5 md:px-6">
        <FilterBar
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          activeTypes={activeTypes}
          onToggleType={handleToggleType}
          onClear={handleClearFilters}
          types={uniqueTypes}
        />
      </div>

      {/* Main */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="hidden w-80 flex-col border-r md:flex lg:w-96"
        >
          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            <AnimatePresence mode="popLayout">
              {filteredProperties.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  active={property.id === selectedPropertyId}
                  onSelect={() => handleSelectProperty(property.id)}
                  index={index}
                />
              ))}
            </AnimatePresence>
            {filteredProperties.length === 0 && <EmptyState />}
          </div>
        </motion.aside>

        {/* Map */}
        <motion.main
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative min-w-0 flex-1"
        >
          <Map
            center={INITIAL_CENTER}
            zoom={6}
            minZoom={5}
            maxZoom={18}
            className="size-full rounded-none"
          >
            <MapInstanceSetter onReady={handleMapReady} />
            <MapLayers
              defaultTileLayer="CARTO Light"
              defaultLayerGroups={["Properties"]}
            >
              <MapTileLayer
                name="CARTO Light"
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                darkUrl="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              <MapTileLayer
                name="CARTO Dark"
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              <MapTileLayer
                name="OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <MapLayerGroup name="Properties">
                <MapMarkerClusterGroup
                  key={`cluster-${statusFilter}-${activeTypes.join("-")}-${filteredProperties.length}`}
                  polygonOptions={{
                    className: "fill-primary/20 stroke-primary stroke-2",
                  }}
                  icon={(count) => (
                    <div className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-primary text-sm font-bold text-primary-foreground shadow-lg">
                      {count}
                    </div>
                  )}
                >
                  {filteredProperties.map((property) => {
                    const typeConfig = getTypeConfig(property.type);
                    const TypeIcon = typeConfig.icon;
                    const statusConfig = STATUS_CONFIG[property.status];
                    return (
                      <MapMarker
                        key={property.id}
                        position={property.position}
                        icon={
                          <PropertyMarkerIcon
                            property={property}
                            active={property.id === selectedPropertyId}
                          />
                        }
                        iconAnchor={[20, 44]}
                        popupAnchor={[0, -44]}
                        eventHandlers={{
                          click: (event: LeafletMouseEvent) => {
                            event.originalEvent.stopPropagation();
                            handleSelectProperty(property.id);
                          },
                        }}
                      >
                        <MapPopup className="w-72 overflow-hidden p-0">
                          <div className="space-y-0">
                            <div className="relative aspect-[16/9] bg-muted">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <TypeIcon className="size-10 text-muted-foreground/30" />
                              </div>
                              <img
                                src={property.image}
                                alt={property.title}
                                loading="lazy"
                                className="absolute inset-0 size-full object-cover"
                                onError={(event) => {
                                  event.currentTarget.style.opacity = "0";
                                }}
                              />
                              <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
                                <Badge
                                  className={cn(
                                    "border text-[10px] backdrop-blur-sm",
                                    statusConfig.badge,
                                  )}
                                >
                                  {property.status}
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] backdrop-blur-sm"
                                >
                                  {typeConfig.label}
                                </Badge>
                              </div>
                            </div>
                            <div className="space-y-2 p-3">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-sm font-semibold leading-tight">
                                  {property.title}
                                </h3>
                                <span className="whitespace-nowrap text-sm font-bold text-primary">
                                  {formatPrice(property)}
                                </span>
                              </div>
                              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPinIcon className="size-3" />
                                {property.location}, {property.city}
                              </p>
                              <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
                                {property.beds > 0 && (
                                  <span className="flex items-center gap-1">
                                    <BedDoubleIcon className="size-3.5" />
                                    {property.beds} beds
                                  </span>
                                )}
                                {property.baths > 0 && (
                                  <span className="flex items-center gap-1">
                                    <BathIcon className="size-3.5" />
                                    {property.baths} baths
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <SquareIcon className="size-3.5" />
                                  {property.area.toLocaleString()} m²
                                </span>
                              </div>
                              {property.description && (
                                <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                                  {property.description}
                                </p>
                              )}
                              {property.features.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {property.features
                                    .slice(0, 3)
                                    .map((feature) => (
                                      <Badge
                                        key={feature}
                                        variant="secondary"
                                        className="text-[10px]"
                                      >
                                        {feature}
                                      </Badge>
                                    ))}
                                </div>
                              )}
                              <Button size="sm" className="mt-2 w-full">
                                View Property
                              </Button>
                            </div>
                          </div>
                        </MapPopup>
                        <MapTooltip side="top" sideOffset={10}>
                          <span className="font-medium">{property.title}</span>
                          <br />
                          <span className="font-bold text-primary">
                            {formatPrice(property)}
                          </span>
                        </MapTooltip>
                      </MapMarker>
                    );
                  })}
                </MapMarkerClusterGroup>
              </MapLayerGroup>
              <MapLayersControl position="top-3 right-[6.75rem]" />
            </MapLayers>
            <MapZoomControl position="top-3 right-3" />
            <MapFullscreenControl position="top-3 right-14" />
            <MapLocateControl position="bottom-20 right-3 md:bottom-6" />
            <MapSearchControl
              position="top-3 left-3"
              className="w-52 max-w-[calc(100vw-8.5rem)] md:w-64"
            />
          </Map>

          {/* No results overlay */}
          {filteredProperties.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pointer-events-none absolute inset-x-4 top-16 z-[1050] flex justify-center"
            >
              <Card className="pointer-events-auto max-w-sm border-primary/20 shadow-lg">
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-medium">
                    No properties match your filters
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={handleClearFilters}
                  >
                    Reset filters
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Mobile list trigger */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="absolute inset-x-0 bottom-5 z-[1100] flex justify-center px-4 md:hidden"
          >
            <Button
              size="lg"
              className="gap-2 rounded-full px-6 shadow-xl"
              onClick={() => {
                setMobileListOpen(true);
                setMobileSheetOpen(false);
              }}
            >
              <ListIcon className="size-4" />
              {filteredProperties.length} Properties
            </Button>
          </motion.div>
        </motion.main>
      </div>

      {/* Mobile sheets */}
      <MobileListSheet
        open={mobileListOpen}
        properties={filteredProperties}
        selectedId={selectedPropertyId}
        onClose={() => setMobileListOpen(false)}
        onSelect={handleSelectProperty}
      />
      <MobilePropertySheet
        property={mobileSheetOpen ? selectedProperty : null}
        onClose={handleCloseMobileSheet}
      />
    </div>
  );
}
