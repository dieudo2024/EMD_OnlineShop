import { CartItem } from "./CartItem";

function cloneItems(items) {
  return items.map((item) =>
    item instanceof CartItem ? item : CartItem.fromStored(item)
  );
}

export class Cart {
  constructor(items = []) {
    this._items = new Map();
    cloneItems(items).forEach((item) => {
      this._items.set(String(item.id), item);
    });
  }

  static fromStorage(rawItems = []) {
    return new Cart(rawItems);
  }

  toJSON() {
    return this.getItems().map((item) => item.toJSON());
  }

  getItems() {
    return Array.from(this._items.values());
  }

  getItem(id) {
    return this._items.get(String(id)) || null;
  }

  addProduct(product) {
    const next = this.getItems();
    const index = next.findIndex((item) => item.id === product.id);
    if (index >= 0) {
      next[index] = next[index].withQuantity(next[index].quantity + 1);
    } else {
      next.push(CartItem.fromProduct(product));
    }
    return new Cart(next);
  }

  removeItem(id) {
    const target = String(id);
    const next = this.getItems().filter((item) => String(item.id) !== target);
    return new Cart(next);
  }

  updateQuantity(id, quantity) {
    if (quantity <= 0) {
      return this.removeItem(id);
    }
    const target = String(id);
    const next = this.getItems().map((item) =>
      String(item.id) === target ? item.withQuantity(quantity) : item
    );
    return new Cart(next);
  }

  clear() {
    return new Cart();
  }

  getItemCount() {
    return this.getItems().reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal() {
    const subtotal = this.getItems().reduce(
      (total, item) => total + item.getLineTotal(),
      0
    );
    return Number(subtotal.toFixed(2));
  }
}
