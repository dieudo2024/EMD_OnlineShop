import { useState } from "react";

function StarRatingInput({ value, onChange }) {
  const [hover, setHover] = useState(null);

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="star-rating-input">
      {stars.map((star) => {
        const isFilled = (hover || value) >= star;

        return (
          <svg
            key={star}
            className={`star-icon ${isFilled ? "filled" : ""}`}
            viewBox="0 0 24 24"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
          >
            <path d="M12 2l3.09 6.26 6.91.99-5 4.87L18.18 22 12 18.54 5.82 22 7 14.12l-5-4.87 6.91-.99z" />
          </svg>
        );
      })}
    </div>
  );
}

export default StarRatingInput;
