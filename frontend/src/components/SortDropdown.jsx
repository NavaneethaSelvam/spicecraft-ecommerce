
import { ArrowUpDown, ChevronDown } from "lucide-react";

const sortOptions = [
  { value: "default", label: "Recommended" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "popular", label: "Most Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

function SortDropdown({ value = "default", onChange }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <label
        htmlFor="sort-products"
        className="hidden shrink-0 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8b7563] sm:block"
      >
        Sort by
      </label>

      <div className="group relative min-w-0 flex-1 sm:flex-none">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#8b6749] transition-colors group-hover:text-[#754426]">
          <ArrowUpDown size={15} strokeWidth={1.8} />
        </div>

        <select
          id="sort-products"
          name="sort-products"
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          className="h-11 w-full min-w-0 cursor-pointer appearance-none rounded-full border border-[#e8d9c8] bg-gradient-to-b from-white to-[#fffaf4] py-2 pl-9 pr-10 text-xs font-semibold text-[#493629] shadow-sm outline-none transition duration-200 hover:border-[#b78b62] hover:shadow-md focus:border-[#9b6747] focus:ring-4 focus:ring-[#ead8c6]/50 sm:min-w-[190px] sm:text-sm"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#8b6749] transition-transform group-hover:text-[#754426]">
          <ChevronDown size={15} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}

export default SortDropdown;
