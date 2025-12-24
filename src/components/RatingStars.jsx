function RatingStars({ rating = 0, onChange }) {
  const rounded = Math.round(rating);

  const handleClick = (value) => {
    if (onChange) onChange(value);
  };

  return (
    <span className={`rating-stars ${onChange ? "interactive" : ""}`}>
      {[1, 2, 3, 4, 5].map((value) => {
        const filled = value <= rounded;

        return (
          <svg
            key={value}
            className={`star ${filled ? "filled" : ""}`}
            onClick={() => handleClick(value)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="22"
            height="22"
          >
            <path
              d="M12 .587l3.668 7.568L24 9.748l-6 5.848 1.416 8.268L12 19.771l-7.416 4.093L6 15.596 0 9.748l8.332-1.593z"
              fill="currentColor"
            />
          </svg>
        );
      })}

      {!onChange && (
        <span className="rating-value">({rating.toFixed(1)})</span>
      )}
    </span>
  );
}

export default RatingStars;
