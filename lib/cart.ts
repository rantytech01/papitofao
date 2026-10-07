export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image_url: string | null;
  size: string | null;
  quantity: number;
}

const CART_KEY = "papitofao_cart";
const CART_EVENT = "papitofao_cart_change";

function cartKey(productId: string, size: string | null) {
  return `${productId}::${size ?? ""}`;
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function addToCart(item: Omit<CartItem, "quantity">, quantity = 1) {
  const items = getCart();
  const key = cartKey(item.productId, item.size);
  const existing = items.find((i) => cartKey(i.productId, i.size) === key);

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ ...item, quantity });
  }

  saveCart(items);
}

export function updateCartQuantity(productId: string, size: string | null, quantity: number) {
  const items = getCart();
  const key = cartKey(productId, size);

  if (quantity <= 0) {
    saveCart(items.filter((i) => cartKey(i.productId, i.size) !== key));
    return;
  }

  const existing = items.find((i) => cartKey(i.productId, i.size) === key);
  if (existing) existing.quantity = quantity;
  saveCart(items);
}

export function removeFromCart(productId: string, size: string | null) {
  updateCartQuantity(productId, size, 0);
}

export function clearCart() {
  saveCart([]);
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

/** Subscribe to cart changes (storage events from other tabs + same-tab updates). */
export function onCartChange(callback: () => void): () => void {
  window.addEventListener(CART_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CART_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
