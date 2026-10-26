
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

function ProductGrid({ products = [], onAddToCart }) {
  if (!products.length) {
    return (
      <section
        className="flex min-h-[240px] flex-col items-center justify-center border border-dashed border-[#e5ddd4] bg-white px-5 py-12 text-center"
        aria-live="polite"
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0e9] text-2xl">
          🌶️
        </div>

        <h3 className="text-lg font-semibold text-[#302820]">
          No products found
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-[#77716b]">
          No spices match your current filters. Try changing your
          category, price range, or search term.
        </p>
      </section>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
    >
      {products.map((product, index) => (
        <motion.div
          key={
            product.id ??
            product.product_id ??
            `${product.name ?? "product"}-${index}`
          }
          className="flex min-w-0"
          variants={{
            hidden: {
              opacity: 0,
              y: 10,
            },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.25,
                ease: "easeOut",
              },
            },
          }}
        >
          <div className="w-full">
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default ProductGrid;
