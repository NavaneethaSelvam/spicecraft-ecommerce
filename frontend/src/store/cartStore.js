
import { create } from "zustand";
import {
  persist,
  createJSONStorage,
} from "zustand/middleware";

// Backend product IDs must be UUIDs.
const isValidUUID = (value) =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value.trim()
  );

const getProductId = (product) => {
  if (!product) return null;

  const candidates = [
    product.product_id,
    product.productId,
    product.id,
    product.product?.id,
  ];

  const validId = candidates.find((id) =>
    typeof id === "string" && isValidUUID(id)
  );

  return validId ? validId.trim() : null;
};

const getQuantity = (quantity) => {
  const value = Number(quantity);
  return Number.isInteger(value) && value > 0 ? value : 1;
};

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],

      addToCart: (product) => {
        const productId = getProductId(product);
        const price = Number(
          product?.price ?? product?.unit_price
        );

        if (
          !productId ||
          !Number.isFinite(price) ||
          price <= 0
        ) {
          console.error(
            "Cannot add product: valid backend UUID and price are required.",
            product
          );
          return;
        }

        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => getProductId(item) === productId
          );

          if (existingItem) {
            return {
              cartItems: state.cartItems.map((item) =>
                getProductId(item) === productId
                  ? {
                      ...item,
                      quantity:
                        getQuantity(item.quantity) + 1,
                    }
                  : item
              ),
            };
          }

          const newItem = {
            ...product,
            id: productId,
            product_id: productId,
            name: product.name ?? product.title ?? "Indian Spice",
            price,
            quantity: 1,
          };

          return {
            cartItems: [...state.cartItems, newItem],
          };
        });
      },

      increaseQuantity: (id) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            getProductId(item) === id
              ? {
                  ...item,
                  quantity:
                    getQuantity(item.quantity) + 1,
                }
              : item
          ),
        }));
      },

      decreaseQuantity: (id) => {
        set((state) => ({
          cartItems: state.cartItems
            .map((item) => {
              if (getProductId(item) !== id) {
                return item;
              }

              return {
                ...item,
                quantity: Number(item.quantity) - 1,
              };
            })
            .filter((item) => Number(item.quantity) > 0),
        }));
      },

      removeFromCart: (id) => {
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) => getProductId(item) !== id
          ),
        }));
      },

      clearCart: () => {
        set({ cartItems: [] });
      },

      getTotalItems: () =>
        get().cartItems.reduce(
          (total, item) =>
            total + (Number(item.quantity) || 0),
          0
        ),

      getTotal: () =>
        get().cartItems.reduce(
          (total, item) =>
            total +
            Number(item.price ?? item.unit_price ?? 0) *
              (Number(item.quantity) || 0),
          0
        ),
    }),
    {
      name: "spicecraft-cart",
      storage: createJSONStorage(() => localStorage),

      // Remove old persisted cart entries with invalid IDs.
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        cartItems: Array.isArray(persistedState?.cartItems)
          ? persistedState.cartItems.filter(
              (item) =>
                isValidUUID(
                  String(
                    item?.product_id ??
                    item?.productId ??
                    item?.id ??
                    ""
                  )
                ) &&
                Number.isFinite(
                  Number(item?.price ?? item?.unit_price)
                ) &&
                Number(item?.price ?? item?.unit_price) > 0 &&
                Number.isInteger(Number(item?.quantity)) &&
                Number(item?.quantity) > 0
            )
          : [],
      }),

      partialize: (state) => ({
        cartItems: state.cartItems,
      }),
    }
  )
);

export default useCartStore;
