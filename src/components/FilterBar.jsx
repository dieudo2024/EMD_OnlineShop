import { useState } from 'react';

export default function FiltersBar({ onFilterChange }) {
  // Filter state
  const [filters, setFilters] = useState({
    category: [],
    priceRange: [0, 1000],
    rating: 0,
    inStock: true,
  });

  // Handle category filter change
  const handleCategoryChange = (category) => {
    const newCategories = filters.category.includes(category)
      ? filters.category.filter((c) => c !== category)
      : [...filters.category, category];

    const newFilters = { ...filters, category: newCategories };
    setFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  // Handle price range change
  const handlePriceChange = (e) => {
    const newPriceRange = [0, parseInt(e.target.value)];
    const newFilters = { ...filters, priceRange: newPriceRange };
    setFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  // Handle rating filter change
  const handleRatingChange = (rating) => {
    const newFilters = { ...filters, rating };
    setFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  // Handle stock filter change
  const handleStockChange = () => {
    const newFilters = { ...filters, inStock: !filters.inStock };
    setFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  // Reset all filters
  const handleResetFilters = () => {
    const resetFilters = {
      category: [],
      priceRange: [0, 1000],
      rating: 0,
      inStock: true,
    };
    setFilters(resetFilters);
    if (onFilterChange) onFilterChange(resetFilters);
  };

  return (
    <aside className="filters-bar">
      <h3>Filters</h3>

      {/* Category filter */}
      <div className="filter-section">
        <h4>Category</h4>
        <div className="filter-options">
          {['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'].map((cat) => (
            <label key={cat} className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.category.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Price range filter */}
      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="price-range">
          <span>$0</span>
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={filters.priceRange[1]}
            onChange={handlePriceChange}
            className="price-slider"
          />
          <span>${filters.priceRange[1]}</span>
        </div>
      </div>

      {/* Rating filter */}
      <div className="filter-section">
        <h4>Rating</h4>
        <div className="filter-options">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="filter-radio">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === rating}
                onChange={() => handleRatingChange(rating)}
              />
              {rating}★ & up
            </label>
          ))}
        </div>
      </div>

      {/* Stock filter */}
      <div className="filter-section">
        <h4>Availability</h4>
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={handleStockChange}
          />
          In Stock Only
        </label>
      </div>

      {/* Reset button */}
      <button
        className="btn-reset-filters"
        onClick={handleResetFilters}
      >
        Reset Filters
      </button>
    </aside>
  );
}
