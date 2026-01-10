import { sanitizeString } from '../utils/security';

export default function SearchBar({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Search products...",
}) {
  const handleChange = (event) => {
    const sanitized = sanitizeString(event.target.value, { maxLength: 120 });
    onChange?.(sanitized);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(value);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="search-input"
      />

      <button type="submit" className="search-btn">
        🔍 Search
      </button>
    </form>
  );
}
