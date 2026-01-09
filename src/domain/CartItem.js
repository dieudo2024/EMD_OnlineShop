import { Product } from "./Product";

function ensurePositiveQuantity(quantity) {
  const safe = Number(quantity);
  if (Number.isFinite(safe) && safe > 0) {
    return Math.floor(safe);
  }
  return 1;
}

export class CartItem {
  constructor({ id, title, price, discountPercentage = 0, thumbnail = "", quantity = 1 }) {
    this.id = id;
    this.title = title;
    this.price = Number(price) || 0;
    this.discountPercentage = Number(discountPercentage) || 0;
    this.thumbnail = thumbnail;
    this.quantity = ensurePositiveQuantity(quantity);
  }

  static fromProduct(product) {
    const source = product instanceof Product ? product : Product.fromRaw(product);
    return new CartItem({
      id: source.id,
      title: source.title,
      price: source.price,
      discountPercentage: source.discountPercentage,
      thumbnail: source.thumbnail,
      quantity: 1,
    });
  }

  static fromStored(raw) {
    if (!raw || typeof raw !== "object") {
      throw new TypeError("Cannot build CartItem from invalid input");
    }
    return new CartItem(raw);
  }

  static computeEffectivePrice(price, discountPercentage = 0) {
    if (!discountPercentage) return Number((Number(price) || 0).toFixed(2));
    const base = Number(price) || 0;
    const multiplier = 1 - discountPercentage / 100;
    return Number((base * multiplier).toFixed(2));
  }

  withQuantity(quantity) {
    return new CartItem({
      id: this.id,
      title: this.title,
      price: this.price,
      discountPercentage: this.discountPercentage,
      thumbnail: this.thumbnail,
      quantity,
    });
  }

  getEffectivePrice() {
    return CartItem.computeEffectivePrice(this.price, this.discountPercentage);
  }

  getLineTotal() {
    return Number((this.getEffectivePrice() * this.quantity).toFixed(2));
  }

  toJSON() {
    const { id, title, price, discountPercentage, thumbnail, quantity } = this;
    return { id, title, price, discountPercentage, thumbnail, quantity };
  }
}
