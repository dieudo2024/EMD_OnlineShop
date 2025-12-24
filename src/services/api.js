const BASE_URL = 'https://dummyjson.com';

export async function fetchAllProducts() {
  const res = await fetch(`${BASE_URL}/products?limit=0`); 
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  return data.products;
}

export async function fetchProductById(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/products/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function searchProducts(query) {
  const res = await fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search products');
  const data = await res.json();
  return data.products;
}