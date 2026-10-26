
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, Package } from "lucide-react";

const CartItem = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  if (!item) return null;

  const {
    id,
    name,
    image,
    image_url,
    price = 0,
    quantity = 1,
    weight,
    weight_label,
    quantity_label,
  } = item;

  const productImage =
    image || image_url || "/images/product-placeholder.jpg";

  const productWeight =
    weight || weight_label || quantity_label;

  const formatPrice = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  const subtotal =
    Number(price || 0) * Number(quantity || 1);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 30, height: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group grid grid-cols-[76px_minmax(0,1fr)] gap-3 overflow-hidden rounded-2xl border border-[#eadfd5] bg-white p-3 shadow-sm transition-shadow duration-300 hover:shadow-md sm:grid-cols-[100px_minmax(0,1fr)_auto] sm:gap-4 sm:p-4"
    >
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f5eee5]">
        <motion.img
          src={productImage}
          alt={name || "Spice product"}
          loading="lazy"
          whileHover={{ scale: 1.07 }}
          transition={{ duration: 0.35 }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/product-placeholder.jpg";
          }}
          className="h-full w-full object-cover"
        />

        <div className="pointer-events-none absolute inset-0 border border-black/5 rounded-xl" />
      </div>

      {/* Product information */}
      <div className="flex min-w-0 flex-col">
        <h3 className="line-clamp-2 text-sm font-bold leading-5 text-[#382316] transition-colors group-hover:text-[#8a552f] sm:text-base">
          {name || "SpiceCraft Product"}
        </h3>

        {productWeight && (
          <span className="mt-1 text-xs text-[#89796b]">
            {productWeight}
          </span>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-base font-bold text-[#6b3d24]">
            ₹{formatPrice(price)}
          </span>

          <span className="text-[10px] font-medium uppercase tracking-wider text-[#a18b76]">
            Per pack
          </span>
        </div>

        {/* Quantity controls */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center rounded-xl border border-[#e8d8c8] bg-[#fffaf5] p-1">
            <motion.button
              type="button"
              onClick={() => onDecrease?.(id)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.88 }}
              aria-label={`Decrease quantity of ${name || "product"}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b3d24] transition-colors hover:bg-[#f0e3d5]"
            >
              <Minus size={15} strokeWidth={2.2} />
            </motion.button>

            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={quantity}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.14 }}
                aria-live="polite"
                className="min-w-8 text-center text-sm font-bold tabular-nums text-[#382316]"
              >
                {quantity}
              </motion.span>
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={() => onIncrease?.(id)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.88 }}
              aria-label={`Increase quantity of ${name || "product"}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b3d24] transition-colors hover:bg-[#f0e3d5]"
            >
              <Plus size={15} strokeWidth={2.2} />
            </motion.button>
          </div>

          {/* Remove button */}
          <motion.button
            type="button"
            onClick={() => onRemove?.(id)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            aria-label={`Remove ${name || "product"} from cart`}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-[#a04438] transition-colors hover:bg-red-50 hover:text-red-800 sm:text-sm"
          >
            <Trash2 size={14} />
            Remove
          </motion.button>
        </div>
      </div>

      {/* Item subtotal */}
      <div className="col-span-2 flex items-center justify-between border-t border-[#f0e7df] pt-3 sm:col-span-1 sm:min-w-[100px] sm:flex-col sm:items-end sm:justify-start sm:border-0 sm:pt-1">
        <span className="text-xs font-medium text-[#89796b] sm:mb-2">
          Item total
        </span>

        <AnimatePresence mode="wait" initial={false}>
          <motion.strong
            key={subtotal}
            initial={{ opacity: 0.45, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="text-sm font-bold tabular-nums text-[#382316] sm:text-base"
          >
            ₹{formatPrice(subtotal)}
          </motion.strong>
        </AnimatePresence>
      </div>
    </motion.article>
  );
};

export default CartItem;
