import React from "react";

const RatingStars = ({ rating = 0 }) => {
  const roundedRating = Math.round(rating);

  return (
    <div className="rating-stars" aria-label={`Rating ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= roundedRating ? "star active" : "star"}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default RatingStars;