import ProductCard from "/ProductCard";

export default function ProductList({ products = [] }) {
  if (products.length === 0) {
    return (
      <div className="product-list-empty">
        <p>No products found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
          />
        ))}
      </div>
    </div>
  );
}
