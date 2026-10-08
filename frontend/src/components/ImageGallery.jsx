import React, { useState } from "react";

import "./ImageGallery.css";

const ImageGallery = ({
  images = [],
  productName = "Product",
}) => {
  const [activeImage, setActiveImage] = useState(0);

  if (!images.length) {
    return (
      <div className="image-gallery-empty">
        <img
          src="/images/product-placeholder.jpg"
          alt={productName}
        />
      </div>
    );
  }

  const currentImage = images[activeImage];

  return (
    <div className="image-gallery">

      {/* Main Image */}
      <div className="image-gallery-main">
        <img
          src={currentImage}
          alt={`${productName} ${activeImage + 1}`}
          onError={(e) => {
            e.currentTarget.src =
              "/images/product-placeholder.jpg";
          }}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="image-gallery-thumbnails">
          {images.map((image, index) => (
            <button
              type="button"
              key={`${image}-${index}`}
              className={`image-thumbnail ${
                activeImage === index ? "active" : ""
              }`}
              onClick={() => setActiveImage(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                onError={(e) => {
                  e.currentTarget.src =
                    "/images/product-placeholder.jpg";
                }}
              />
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

export default ImageGallery;