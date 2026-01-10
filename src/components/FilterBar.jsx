export default function FilterBar({
  categories = [],
  selectedCategory = "all",
  onCategoryChange,
  minPrice = "",
  onMinPriceChange,
  maxPrice = "",
  onMaxPriceChange,
}) {
  return (
    <div className="filter-controls">
      <select
        value={selectedCategory}
        onChange={(event) => onCategoryChange?.(event.target.value)}
      >
        <option value="all">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.label}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Min price"
        value={minPrice}
        min="0"
        onChange={(event) => onMinPriceChange?.(event.target.value)}
      />

      <input
        type="number"
        placeholder="Max price"
        value={maxPrice}
        min="0"
        onChange={(event) => onMaxPriceChange?.(event.target.value)}
      />
    </div>
  );
}
