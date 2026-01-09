import { sanitizeString } from "../utils/security";

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export class Product {
  constructor({
    id,
    title,
    description,
    brand,
    category,
    categoryId,
    price,
    discountPercentage = 0,
    rating = 0,
    stock = 0,
    thumbnail = "",
    images = [],
    ...rest
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.brand = brand;
    this.category = category;
    this.categoryId = categoryId;
    this.price = toNumber(price);
    this.discountPercentage = toNumber(discountPercentage);
    this.rating = toNumber(rating);
    this.stock = toNumber(stock);
    this.thumbnail = thumbnail;
    this.images = Array.isArray(images) ? images : [];
    Object.assign(this, rest);
  }

  static fromRaw(raw) {
    if (raw instanceof Product) {
      return raw;
    }

    if (!raw || typeof raw !== "object") {
      return new Product({
        id: `product-${Date.now()}`,
        title: "",
        description: "",
        brand: "",
        category: "Uncategorized",
        categoryId: Product.createSlug("Uncategorized"),
        price: 0,
        discountPercentage: 0,
        rating: 0,
        stock: 0,
        thumbnail: "",
        images: [],
      });
    }

    const safeTitle = sanitizeString(raw.title, { maxLength: 200 }) || "";
    const safeDescription = sanitizeString(raw.description, { maxLength: 1000 }) || "";
    const safeBrand = sanitizeString(raw.brand, { maxLength: 120 }) || "";
    const categoryLabel = sanitizeString(raw.category, { maxLength: 120 }) || "Uncategorized";
    const categoryId = Product.createSlug(raw.category || categoryLabel);
    const thumbnail = typeof raw.thumbnail === "string" ? raw.thumbnail : "";
    const images = Array.isArray(raw.images)
      ? raw.images.filter((url) => typeof url === "string")
      : [];

    return new Product({
      ...raw,
      title: safeTitle,
      description: safeDescription,
      brand: safeBrand,
      category: categoryLabel,
      categoryId,
      thumbnail,
      images,
    });
  }

  static createSlug(value) {
    const base = sanitizeString(value, { maxLength: 120 })
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return base || "uncategorized";
  }

  getEffectivePrice() {
    if (!this.discountPercentage) {
      return Number(this.price.toFixed(2));
    }
    const multiplier = 1 - this.discountPercentage / 100;
    const discounted = this.price * multiplier;
    return Number(discounted.toFixed(2));
  }

  matchesSearch(term) {
    if (!term) return true;
    const normalized = term.toLowerCase();
    return (
      this.title.toLowerCase().includes(normalized) ||
      this.brand.toLowerCase().includes(normalized) ||
      this.category.toLowerCase().includes(normalized)
    );
  }

  belongsToCategory(categoryId) {
    if (!categoryId || categoryId === "all") return true;
    return this.categoryId === categoryId;
  }

  toJSON() {
    const { id, title, description, brand, category, categoryId, price, discountPercentage, rating, stock, thumbnail, images } = this;
    return {
      id,
      title,
      description,
      brand,
      category,
      categoryId,
      price,
      discountPercentage,
      rating,
      stock,
      thumbnail,
      images,
    };
  }
}
