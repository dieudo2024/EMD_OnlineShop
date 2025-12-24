import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  // State for search input
  const [searchTerm, setSearchTerm] = useState('');

  // Handle input change
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Call parent callback function
    if (onSearch) {
      onSearch(value);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Search for:', searchTerm);
   
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleChange}
        className="search-input"
      />

      <button type="submit" className="search-btn">
        🔍 Search
      </button>
    </form>
  );
}
