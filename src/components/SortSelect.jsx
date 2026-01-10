const DEFAULT_OPTIONS = [
  { value: "none", label: "No sort" },
  { value: "price-asc", label: "Price: Low - High" },
  { value: "price-desc", label: "Price: High - Low" },
  { value: "rating-desc", label: "Rating: High - Low" },
];

export default function SortSelect({ value = "none", onSortChange, options = DEFAULT_OPTIONS }) {
  const handleSortChange = (event) => {
    onSortChange?.(event.target.value);
  };

  return (
    <div className="sort-select">
      <label htmlFor="sort-dropdown">Sort by:</label>
      <select
        id="sort-dropdown"
        value={value}
        onChange={handleSortChange}
        className="sort-dropdown"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
