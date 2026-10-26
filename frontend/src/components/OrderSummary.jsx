
import React from "react";

const OrderSummary = ({
  items = [],
  subtotal = 0,
  deliveryFee = 0,
  discount = 0,
}) => {
  const safeSubtotal = Number(subtotal) || 0;
  const safeDeliveryFee = Number(deliveryFee) || 0;
  const safeDiscount = Number(discount) || 0;

  const total = Math.max(
    0,
    safeSubtotal + safeDeliveryFee - safeDiscount
  );

  const formatPrice = (amount) =>
    `₹${(Number(amount) || 0).toFixed(2)}`;

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-[#eee0d2] bg-[#fffdf9] p-5 text-[#39251d] shadow-sm sm:p-7">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-3 border-b border-[#eee0d2] pb-5">
        <div>
          <span className="text-xs font-extrabold tracking-[0.2em] text-[#a45b32]">
            SPICECRAFT
          </span>

          <h2 className="mt-2 font-serif text-2xl font-bold text-stone-900">
            Order Summary
          </h2>
        </div>

        <span className="shrink-0 rounded-full bg-[#f5e8dc] px-3 py-2 text-xs font-bold text-[#874526]">
          {items.length} {items.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      {/* Products */}
      {items.length > 0 ? (
        <div className="flex flex-col gap-5">
          {items.map((item, index) => {
            const quantity = Math.max(
              1,
              Number(item.quantity) || 1
            );

            const price = Number(item.price) || 0;
            const itemTotal = price * quantity;

            return (
              <div
                key={item.id ?? `${item.name}-${index}`}
                className="flex min-w-0 items-center gap-3 border-b border-[#f0e5da] pb-5 last:border-b-0 last:pb-0 sm:gap-4"
              >
                {/* Product image */}
                <div className="h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl border border-[#eee0d2] bg-[#f5ede4] sm:h-[88px] sm:w-[88px]">
                  <img
                    src={
                      item.image ||
                      item.image_url ||
                      "/images/product-placeholder.jpg"
                    }
                    alt={item.name || "SpiceCraft product"}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src =
                        "/images/product-placeholder.jpg";
                    }}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>

                {/* Product details */}
                <div className="min-w-0 flex-1">
                  <h3 className="break-words text-sm font-bold leading-5 text-stone-900 sm:text-base">
                    {item.name || "SpiceCraft Product"}
                  </h3>

                  {item.weight && (
                    <p className="mt-1 text-xs text-[#968476]">
                      {item.weight}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-stone-600">
                    {formatPrice(price)} × {quantity}
                  </p>
                </div>

                {/* Item total */}
                <strong className="shrink-0 self-start text-sm font-bold text-stone-900 sm:text-base">
                  {formatPrice(itemTotal)}
                </strong>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl bg-[#f9eee3] px-4 py-8 text-center">
          <p className="text-sm font-semibold text-stone-900">
            No items in this order
          </p>
          <p className="mt-2 text-xs text-stone-600">
            Add some spices to see your order summary.
          </p>
        </div>
      )}

      {/* Price calculation */}
      <div className="mt-6 space-y-4 border-t border-dashed border-[#dcc8b7] pt-5">
        <div className="flex items-center justify-between gap-3 text-sm text-[#806e61]">
          <span>Subtotal</span>
          <strong className="text-stone-900">
            {formatPrice(safeSubtotal)}
          </strong>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm text-[#806e61]">
          <span>Delivery</span>
          <strong
            className={
              safeDeliveryFee === 0
                ? "text-[#527b45]"
                : "text-stone-900"
            }
          >
            {safeDeliveryFee === 0
              ? "FREE"
              : formatPrice(safeDeliveryFee)}
          </strong>
        </div>

        {safeDiscount > 0 && (
          <div className="flex items-center justify-between gap-3 text-sm text-[#527b45]">
            <span>Discount</span>
            <strong>-{formatPrice(safeDiscount)}</strong>
          </div>
        )}
      </div>

      {/* Free delivery message */}
      {safeSubtotal > 0 &&
        safeSubtotal < 500 &&
        safeDeliveryFee > 0 && (
          <p className="mt-5 rounded-xl bg-[#f9eee3] p-3 text-xs leading-5 text-[#8a4d2c]">
            Add {formatPrice(500 - safeSubtotal)} more for free delivery.
          </p>
        )}

      {/* Grand total */}
      <div className="mt-6 flex items-center justify-between gap-3 rounded-xl bg-[#f5e8dc] p-4 sm:p-5">
        <div>
          <span className="block text-base font-extrabold text-stone-900">
            Total Amount
          </span>
          <span className="mt-1 block text-xs text-stone-600">
            Inclusive of listed charges
          </span>
        </div>

        <strong className="shrink-0 text-xl font-extrabold text-[#8a4528] sm:text-2xl">
          {formatPrice(total)}
        </strong>
      </div>

      {/* Footer note */}
      <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs leading-5 text-[#968476]">
        <span aria-hidden="true">✦</span>
        <span>Freshly packed · Quality spices · Delivered across India</span>
      </div>
    </section>
  );
};

export default OrderSummary;
