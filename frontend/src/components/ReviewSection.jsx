import React, { useState } from "react";
import RatingStars from "./RatingStars";

import "./ReviewSection.css";

const ReviewSection = ({
  reviews = [],
  onSubmitReview,
}) => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !comment.trim()) {
      return;
    }

    const newReview = {
      id: Date.now(),
      name: name.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toLocaleDateString(),
    };

    onSubmitReview?.(newReview);

    setName("");
    setRating(5);
    setComment("");
  };

  return (
    <section className="review-section">

      {/* Header */}
      <div className="review-header">
        <div>
          <span className="review-label">CUSTOMER FEEDBACK</span>
          <h2>What Our Customers Say</h2>
        </div>

        <span className="review-count">
          {reviews.length} Reviews
        </span>
      </div>

      {/* Reviews */}
      <div className="reviews-list">

        {reviews.length === 0 ? (
          <div className="no-reviews">
            <div className="no-reviews-icon">💬</div>
            <h3>No reviews yet</h3>
            <p>Be the first to share your experience.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <article
              className="review-card"
              key={review.id}
            >
              <div className="review-card-top">

                <div className="review-user">
                  <div className="review-avatar">
                    {review.name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3>{review.name}</h3>

                    {review.date && (
                      <span>{review.date}</span>
                    )}
                  </div>
                </div>

                <RatingStars rating={review.rating} />

              </div>

              <p className="review-comment">
                {review.comment}
              </p>
            </article>
          ))
        )}

      </div>

      {/* Review Form */}
      <div className="review-form-wrapper">

        <h3>Write a Review</h3>

        <form
          className="review-form"
          onSubmit={handleSubmit}
        >

          <div className="review-form-group">
            <label htmlFor="review-name">
              Your Name
            </label>

            <input
              id="review-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="review-form-group">
            <label>Rating</label>

            <select
              value={rating}
              onChange={(e) =>
                setRating(Number(e.target.value))
              }
            >
              <option value="5">★★★★★ - Excellent</option>
              <option value="4">★★★★☆ - Very Good</option>
              <option value="3">★★★☆☆ - Good</option>
              <option value="2">★★☆☆☆ - Average</option>
              <option value="1">★☆☆☆☆ - Poor</option>
            </select>
          </div>

          <div className="review-form-group">
            <label htmlFor="review-comment">
              Your Review
            </label>

            <textarea
              id="review-comment"
              rows="5"
              placeholder="Tell us about this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="submit-review-btn"
          >
            Submit Review
          </button>

        </form>

      </div>

    </section>
  );
};

export default ReviewSection;