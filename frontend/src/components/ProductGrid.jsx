import React from "react";
import ProductCard from "./ProductCard";
import "./ProductGrid.css";

const ProductGrid = ({ products = [], onAddToCart }) => {
  if (!products.length) {
    return (
      <div className="product-grid-empty">
        <h3>No products found</h3>
        <p>
          Try changing your filters or explore our full collection.
        </p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;