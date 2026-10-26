
import React from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import CartItem from "./CartItem";

const CartDrawer = ({
  isOpen,
  cartItems = [],
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
}) => {
  const total = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const formatPrice = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="flex h-full w-full max-w-md flex-col bg-[#fffaf5] shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 32,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#eadfd5] px-5 py-4">
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  className="text-xl font-bold text-[#382316]"
                >
                  Your Cart
                </motion.h2>

                <p className="mt-1 text-xs text-gray-500">
                  {cartItems.length} product(s)
                </p>
              </div>

              <motion.button
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                whileHover={{ rotate: 90, scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-[#6b3d24] transition hover:bg-[#f0e5d9]"
              >
                ×
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              <AnimatePresence mode="wait">
                {cartItems.length === 0 ? (
                  <motion.div
                    key="empty-cart"
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex h-full min-h-64 flex-col items-center justify-center text-center"
                  >
                    <motion.div
                      animate={{ y: [0, -7, 0] }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="text-4xl"
                    >
                      🛒
                    </motion.div>

                    <h3 className="mt-4 text-lg font-bold text-[#382316]">
                      Your cart is empty
                    </h3>

                    <p className="mt-2 max-w-xs text-sm text-gray-600">
                      Add some delicious spices to your cart.
                    </p>

                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Link
                        to="/shop"
                        onClick={onClose}
                        className="mt-5 inline-block rounded-lg bg-[#6b3d24] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4b2918]"
                      >
                        Explore Spices
                      </Link>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="cart-items"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 25 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 25, height: 0 }}
                        transition={{
                          duration: 0.25,
                          delay: Math.min(index * 0.06, 0.3),
                        }}
                      >
                        <CartItem
                          item={item}
                          onIncrease={onIncrease}
                          onDecrease={onDecrease}
                          onRemove={onRemove}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Total and Checkout */}
            {cartItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-[#eadfd5] bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Total
                  </span>

                  <motion.strong
                    key={total}
                    initial={{ opacity: 0.5, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xl font-bold text-[#382316]"
                  >
                    ₹{formatPrice(total)}
                  </motion.strong>
                </div>

                <motion.button
                  type="button"
                  onClick={onCheckout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 min-h-12 w-full rounded-lg bg-[#6b3d24] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#4b2918]"
                >
                  Proceed to Checkout
                </motion.button>

                <p className="mt-3 text-center text-xs text-gray-500">
                  Secure checkout • Freshly packed spices
                </p>
              </motion.div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
