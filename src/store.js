// ========================================
// OrthoCare — State Management Store
// ========================================

const STORAGE_KEY = 'orthocare_state';

// Event Emitter
class EventEmitter {
  constructor() { this._events = {}; }
  on(event, fn) {
    (this._events[event] = this._events[event] || []).push(fn);
    return () => this.off(event, fn);
  }
  off(event, fn) {
    this._events[event] = (this._events[event] || []).filter(f => f !== fn);
  }
  emit(event, data) {
    (this._events[event] || []).forEach(fn => fn(data));
  }
}

// Create store
const emitter = new EventEmitter();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch(e) {}
  return null;
}

function getDefaultState() {
  return {
    user: { name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210', isLoggedIn: false },
    cart: [],           // { productId, qty, size }
    wishlist: [],       // productId[]
    orders: [
      {
        id: 'OR48291', date: '12 Sep 2026', status: 'shipped',
        items: [{ productId: 'OC0001', qty: 1, size: 'L', price: 799 }],
        total: 799, address: 'Home',
      },
      {
        id: 'OR47823', date: '8 Sep 2026', status: 'delivered',
        items: [{ productId: 'OC0013', qty: 1, size: 'XL', price: 1299 }],
        total: 1299, address: 'Work',
      },
      {
        id: 'OR46012', date: '1 Sep 2026', status: 'cancelled',
        items: [{ productId: 'OC0023', qty: 1, size: 'Standard', price: 1799 }],
        total: 1799, address: 'Home',
      },
    ],
    recentlyViewed: [], // productId[]
    savedForLater: [],  // { productId, size }
    selectedAddress: 1,
    selectedPayment: 'upi',
    appliedCoupon: null,
    searchHistory: ['Knee brace', 'Back support', 'Cervical collar'],
    hasSeenOnboarding: false,
    hasSeenSplash: false,
  };
}

// Merge saved state with defaults
const defaults = getDefaultState();
const saved = loadState();
const state = saved ? { ...defaults, ...saved } : defaults;

// Save to localStorage
function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch(e) {}
}

// ---- Cart ----
export function addToCart(productId, size = 'M', qty = 1) {
  const existing = state.cart.find(c => c.productId === productId && c.size === size);
  if (existing) {
    existing.qty += qty;
  } else {
    state.cart.push({ productId, size, qty });
  }
  persist();
  emitter.emit('cart:changed', state.cart);
  emitter.emit('toast', { message: 'Added to cart', type: 'success' });
}

export function removeFromCart(productId, size) {
  state.cart = state.cart.filter(c => !(c.productId === productId && c.size === size));
  persist();
  emitter.emit('cart:changed', state.cart);
}

export function updateCartQty(productId, size, qty) {
  const item = state.cart.find(c => c.productId === productId && c.size === size);
  if (item) {
    if (qty <= 0) {
      removeFromCart(productId, size);
    } else {
      item.qty = qty;
      persist();
      emitter.emit('cart:changed', state.cart);
    }
  }
}

export function getCart() { return state.cart; }
export function getCartCount() { return state.cart.reduce((sum, c) => sum + c.qty, 0); }

export function clearCart() {
  state.cart = [];
  persist();
  emitter.emit('cart:changed', state.cart);
}

// ---- Save For Later ----
export function saveForLater(productId, size) {
  removeFromCart(productId, size);
  if (!state.savedForLater.find(s => s.productId === productId)) {
    state.savedForLater.push({ productId, size });
  }
  persist();
  emitter.emit('savedForLater:changed', state.savedForLater);
  emitter.emit('toast', { message: 'Saved for later', type: 'info' });
}

export function moveToCartFromSaved(productId, size) {
  state.savedForLater = state.savedForLater.filter(s => s.productId !== productId);
  addToCart(productId, size);
  persist();
  emitter.emit('savedForLater:changed', state.savedForLater);
}

export function getSavedForLater() { return state.savedForLater; }

// ---- Wishlist ----
export function toggleWishlist(productId) {
  const idx = state.wishlist.indexOf(productId);
  if (idx > -1) {
    state.wishlist.splice(idx, 1);
    emitter.emit('toast', { message: 'Removed from wishlist', type: 'info' });
  } else {
    state.wishlist.push(productId);
    emitter.emit('toast', { message: 'Added to wishlist', type: 'success' });
  }
  persist();
  emitter.emit('wishlist:changed', state.wishlist);
}

export function isInWishlist(productId) { return state.wishlist.includes(productId); }
export function getWishlist() { return state.wishlist; }

// ---- Recently Viewed ----
export function addRecentlyViewed(productId) {
  state.recentlyViewed = state.recentlyViewed.filter(id => id !== productId);
  state.recentlyViewed.unshift(productId);
  if (state.recentlyViewed.length > 10) state.recentlyViewed = state.recentlyViewed.slice(0, 10);
  persist();
}

export function getRecentlyViewed() { return state.recentlyViewed; }

// ---- Orders ----
export function placeOrder() {
  const { getProductById } = require('./data/products.js');
  const orderId = 'OR' + Math.floor(10000 + Math.random() * 90000);
  const items = state.cart.map(c => ({
    productId: c.productId,
    qty: c.qty,
    size: c.size,
    price: 0 // will be calculated
  }));
  const order = {
    id: orderId,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'confirmed',
    items,
    total: 0,
    address: state.selectedAddress === 1 ? 'Home' : 'Work',
  };
  state.orders.unshift(order);
  state.cart = [];
  state.appliedCoupon = null;
  persist();
  emitter.emit('cart:changed', state.cart);
  emitter.emit('orders:changed', state.orders);
  return order;
}

export function getOrders() { return state.orders; }

// ---- Search History ----
export function addSearchHistory(term) {
  state.searchHistory = state.searchHistory.filter(t => t !== term);
  state.searchHistory.unshift(term);
  if (state.searchHistory.length > 8) state.searchHistory = state.searchHistory.slice(0, 8);
  persist();
}

export function getSearchHistory() { return state.searchHistory; }
export function clearSearchHistory() { state.searchHistory = []; persist(); }

// ---- Address & Payment ----
export function setSelectedAddress(id) { state.selectedAddress = id; persist(); }
export function getSelectedAddress() { return state.selectedAddress; }
export function setSelectedPayment(id) { state.selectedPayment = id; persist(); }
export function getSelectedPayment() { return state.selectedPayment; }

// ---- Coupon ----
export function applyCoupon(code) {
  state.appliedCoupon = code;
  persist();
  emitter.emit('coupon:applied', code);
}

export function removeCoupon() {
  state.appliedCoupon = null;
  persist();
  emitter.emit('coupon:removed');
}

export function getAppliedCoupon() { return state.appliedCoupon; }

// ---- User ----
export function getUser() { return state.user; }
export function setLoggedIn(val) { state.user.isLoggedIn = val; persist(); }

// ---- Onboarding ----
export function hasSeenOnboarding() { return state.hasSeenOnboarding; }
export function setSeenOnboarding() { state.hasSeenOnboarding = true; persist(); }
export function hasSeenSplash() { return state.hasSeenSplash; }
export function setSeenSplash() { state.hasSeenSplash = true; persist(); }

// ---- Event Emitter ----
export function on(event, fn) { return emitter.on(event, fn); }
export function emit(event, data) { emitter.emit(event, data); }

// ---- Reset ----
export function resetStore() {
  localStorage.removeItem(STORAGE_KEY);
  Object.assign(state, getDefaultState());
  emitter.emit('store:reset');
}
