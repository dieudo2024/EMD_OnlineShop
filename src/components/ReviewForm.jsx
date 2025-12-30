import { useState } from "react";
import StarRatingInput from "./StarRatingInput";
import { sanitizeReviewPayload } from "../utils/security";

function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const safePayload = sanitizeReviewPayload({
      rating,
      text,
      reviewerName: name,
      date: new Date().toISOString(),
      source: "user",
    });

    if (!safePayload.text) return;

    onSubmit(safePayload);

    setRating(5);
    setText("");
    setName("");
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Add a Review</h3>

      {/* RATING FIELD */}
      <div className="form-group">
        <label htmlFor="rating-input">Rating</label>
        <StarRatingInput id="rating-input" value={rating} onChange={setRating} />
      </div>

      {/* NAME FIELD */}
      <div className="form-group">
        <label htmlFor="reviewerName">
          Your name (optional)
          <input
            id="reviewerName"
            type="text"
            value={name}
            placeholder="Anonymous"
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>

      {/* REVIEW FIELD */}
      <div className="form-group">
        <label htmlFor="reviewText">
          Review
          <textarea
            id="reviewText"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            required
          />
        </label>
      </div>

      <button type="submit" className="btn primary">
        Submit Review
      </button>
    </form>
  );
}

export default ReviewForm;