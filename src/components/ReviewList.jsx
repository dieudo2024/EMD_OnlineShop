import RatingStars from "./RatingStars";

function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0)
    return <p>No reviews yet. Be the first to review!</p>;

  return (
    <div className="review-list">
      {reviews.map((review, idx) => (
        <div key={idx} className="review-item">
          <div className="review-header">
            <strong>{review.reviewerName || review.name || "Anonymous"}</strong>

            {/* ⭐ Replace text rating with RatingStars */}
            <RatingStars rating={review.rating} />
          </div>

          <p className="review-text">{review.comment || review.text}</p>

          {review.date && (
            <small className="review-date">
              {new Date(review.date).toLocaleDateString()}
            </small>
          )}
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
