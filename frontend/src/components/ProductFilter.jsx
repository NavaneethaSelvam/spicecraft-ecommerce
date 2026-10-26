
import { RotateCcw, Check, SlidersHorizontal } from "lucide-react";

const priceRanges = [
  { label: "Under ₹250", value: "under-250" },
  { label: "₹250 – ₹500", value: "250-500" },
  { label: "₹500 – ₹1,000", value: "500-1000" },
  { label: "Above ₹1,000", value: "above-1000" },
];

function FilterHeading({ title }) {
  return (
    <h3 className="mb-4 text-sm font-semibold tracking-wide text-[#29251f]">
      {title}
    </h3>
  );
}

export default function ProductFilter({
  categories = [],
  selectedCategory = "all",
  selectedPrice = "all",
  onCategoryChange,
  onPriceChange,
  onClear,
}) {
  const activeCount = [
    selectedCategory !== "all",
    selectedPrice !== "all",
  ].filter(Boolean).length;

 

const allowedCategories = [
  { id: "all", name: "All Products" },
  { id: "masala-powders", name: "Masala Powders" },
  { id: "spice-blends", name: "Spice Blends" },
  { id: "curry-pastes", name: "Curry Pastes" },
  { id: "podis", name: "Podis" },
  { id: "pickles", name: "Pickles" },
  { id: "pure-spices", name: "Pure Spices" },
];

const categoryOptions = allowedCategories;

  return (
    <aside className="h-fit overflow-hidden rounded-xl border border-[#e7e1d8] bg-white shadow-sm">
      {/* Filter Header */}
      <div className="flex items-center justify-between border-b border-[#e7e1d8] bg-[#fcfaf7] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal
            size={18}
            className="text-[#e7441d]"
            aria-hidden="true"
          />

          <h2 className="text-base font-semibold text-[#29251f]">
            Filter products
          </h2>
        </div>

        {activeCount > 0 && (
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#f04418] px-2 text-xs font-semibold text-white">
            {activeCount}
          </span>
        )}
      </div>

      <div className="p-5">
        {/* Category Filter */}
        <section className="pb-6">
          <FilterHeading title="Category" />

          <div className="space-y-1">
            {categoryOptions.map((category) => {
              const active = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onCategoryChange?.(category.id)}
                  aria-pressed={active}
                  className={`flex min-h-10 w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors duration-200 ${
                    active
                      ? "bg-[#fff0e9] font-semibold text-[#e7441d]"
                      : "text-[#514a42] hover:bg-[#faf8f5]"
                  }`}
                >
                  <span>{category.name}</span>

                  {active && (
                    <Check
                      size={16}
                      aria-hidden="true"
                      className="shrink-0 text-[#f04418]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <div className="border-t border-[#e7e1d8]" />

        {/* Price Range Filter */}
        <section className="py-6">
          <FilterHeading title="Price range" />

          <div className="space-y-1">
            {priceRanges.map((range) => {
              const active = selectedPrice === range.value;

              return (
                <button
                  key={range.value}
                  type="button"
                  onClick={() =>
                    onPriceChange?.(
                      active ? "all" : range.value
                    )
                  }
                  aria-pressed={active}
                  className={`flex min-h-10 w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors duration-200 ${
                    active
                      ? "bg-[#fff0e9] font-semibold text-[#e7441d]"
                      : "text-[#514a42] hover:bg-[#faf8f5]"
                  }`}
                >
                  <span>{range.label}</span>

                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      active
                        ? "border-[#f04418]"
                        : "border-[#cfc5b9]"
                    }`}
                    aria-hidden="true"
                  >
                    {active && (
                      <span className="h-2 w-2 rounded-full bg-[#f04418]" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Clear Filters */}
        <button
          type="button"
          onClick={onClear}
          disabled={activeCount === 0}
          className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#dcd2c6] px-4 py-2.5 text-sm font-medium text-[#6d4a33] transition-all duration-200 hover:border-[#f04418] hover:bg-[#fff8f4] hover:text-[#e7441d] disabled:cursor-not-allowed disabled:opacity-45"
        >
          <RotateCcw size={15} aria-hidden="true" />
          Clear all filters
        </button>
      </div>
    </aside>
  );
}
