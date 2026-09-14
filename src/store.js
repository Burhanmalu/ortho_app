// ========================================
// OrthoCare — Central Multi-Role State Store
// ========================================

import { products, getProductById, getWholesaleTierPrice } from './data/products.js';
import { wholesaleBuyers } from './data/wholesaleBuyers.js';
import { wholesaleOrders as initialWholesaleOrders } from './data/wholesaleOrders.js';
import { retailCustomers } from './data/customers.js';
import { initialCoupons, initialBroadcastNotifications, wholesaleTiers } from './data/adminData.js';

const STORAGE_KEY = 'orthocare_multirole_state_v2';

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

export const emitter = new EventEmitter();

function loadSavedState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch(e) {}
  return null;
}

function getDefaultState() {
  return {
    // Current Active Role: 'customer' | 'wholesale' | 'admin'
    currentRole: 'customer',

    // Retail Customer
    user: {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@gmail.com',
      phone: '+91 98765 43210',
      isLoggedIn: true
    },
    cart: [
      { productId: 'OC0001', size: 'M', qty: 1 },
      { productId: 'OC0013', size: 'L', qty: 1 }
    ],
    wishlist: ['OC0002', 'OC0025', 'OC0037'],
    orders: [
      {
        id: 'ORD-88291',
        date: '12 Sep 2026',
        status: 'shipped',
        items: [{ productId: 'OC0001', qty: 1, size: 'L', price: 799 }],
        total: 799,
        address: 'Home',
        trackingNumber: 'DELH-RET-88291'
      },
      {
        id: 'ORD-87823',
        date: '08 Sep 2026',
        status: 'delivered',
        items: [{ productId: 'OC0013', qty: 1, size: 'XL', price: 1299 }],
        total: 1299,
        address: 'Office',
        trackingNumber: 'DELH-RET-87823'
      },
      {
        id: 'ORD-86012',
        date: '01 Sep 2026',
        status: 'cancelled',
        items: [{ productId: 'OC0025', qty: 1, size: 'Standard', price: 649 }],
        total: 649,
        address: 'Home',
        trackingNumber: '-'
      }
    ],
    recentlyViewed: ['OC0001', 'OC0003', 'OC0014', 'OC0025'],
    savedForLater: [],
    selectedAddress: 1,
    selectedPayment: 'upi',
    appliedCoupon: null,
    searchHistory: ['Knee brace', 'Back support', 'Cervical collar', 'Walking stick'],
    hasSeenOnboarding: true,
    hasSeenSplash: true,

    // Wholesale System
    wholesaleUser: wholesaleBuyers[0], // Defaults to Apollo Pharmacy (Verified)
    wholesaleCart: [
      { productId: 'OC0001', qty: 25, size: 'M' },
      { productId: 'OC0013', qty: 20, size: 'L' }
    ],
    wholesaleOrders: initialWholesaleOrders,
    wholesaleBuyersList: wholesaleBuyers,

    // Admin System
    adminProducts: products,
    adminCustomers: retailCustomers,
    adminCoupons: initialCoupons,
    adminNotifications: initialBroadcastNotifications
  };
}

const savedState = loadSavedState();
const state = savedState ? { ...getDefaultState(), ...savedState } : getDefaultState();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch(e) {}
}

// ========================================
// Role Management & Demo Role Switcher
// ========================================
export function getRole() {
  return state.currentRole || 'customer';
}

export function setRole(role) {
  if (['customer', 'wholesale', 'admin'].includes(role)) {
    state.currentRole = role;
    persist();
    emitter.emit('role:changed', role);
    emitter.emit('toast', {
      message: `Switched view to ${role.toUpperCase()} mode`,
      type: 'info'
    });
  }
}

// ========================================
// Retail Customer Cart & Features
// ========================================
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

// Wishlist
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

// Recently Viewed
export function addRecentlyViewed(productId) {
  state.recentlyViewed = state.recentlyViewed.filter(id => id !== productId);
  state.recentlyViewed.unshift(productId);
  if (state.recentlyViewed.length > 10) state.recentlyViewed = state.recentlyViewed.slice(0, 10);
  persist();
}
export function getRecentlyViewed() { return state.recentlyViewed; }

// Retail Orders
export function placeOrder() {
  const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
  const items = state.cart.map(c => {
    const prod = getProductById(c.productId);
    return {
      productId: c.productId,
      qty: c.qty,
      size: c.size,
      price: prod ? prod.price : 799
    };
  });
  const total = items.reduce((sum, it) => sum + (it.price * it.qty), 0);
  const order = {
    id: orderId,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'processing',
    items,
    total,
    address: state.selectedAddress === 1 ? 'Home' : 'Office',
    trackingNumber: 'DELH-RET-' + Math.floor(10000 + Math.random() * 90000)
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

// Search History
export function addSearchHistory(term) {
  if (!term || !term.trim()) return;
  state.searchHistory = state.searchHistory.filter(t => t.toLowerCase() !== term.toLowerCase());
  state.searchHistory.unshift(term.trim());
  if (state.searchHistory.length > 8) state.searchHistory = state.searchHistory.slice(0, 8);
  persist();
}
export function getSearchHistory() { return state.searchHistory; }
export function clearSearchHistory() { state.searchHistory = []; persist(); }

// Retail User, Addresses & Coupon
export function setSelectedAddress(id) { state.selectedAddress = id; persist(); }
export function getSelectedAddress() { return state.selectedAddress; }
export function setSelectedPayment(id) { state.selectedPayment = id; persist(); }
export function getSelectedPayment() { return state.selectedPayment; }

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

export function getUser() { return state.user; }
export function setLoggedIn(val) { state.user.isLoggedIn = val; persist(); }
export function hasSeenOnboarding() { return state.hasSeenOnboarding; }
export function setSeenOnboarding() { state.hasSeenOnboarding = true; persist(); }
export function hasSeenSplash() { return state.hasSeenSplash; }
export function setSeenSplash() { state.hasSeenSplash = true; persist(); }

// ========================================
// Wholesale Buyer System & B2B State
// ========================================
export function getWholesaleUser() {
  return state.wholesaleUser || wholesaleBuyers[0];
}

export function setWholesaleUser(userOrId) {
  if (typeof userOrId === 'string') {
    const found = state.wholesaleBuyersList.find(b => b.id === userOrId);
    if (found) state.wholesaleUser = found;
  } else if (userOrId) {
    state.wholesaleUser = userOrId;
  }
  persist();
  emitter.emit('wholesaleUser:changed', state.wholesaleUser);
}

export function isWholesaleVerified() {
  return state.wholesaleUser && state.wholesaleUser.status === 'verified';
}

export function getWholesaleCart() {
  return state.wholesaleCart || [];
}

export function addToWholesaleCart(productId, qty = 10, size = 'M') {
  const prod = getProductById(productId);
  const minMoq = prod ? prod.moq : 10;
  const quantity = Math.max(qty, minMoq);

  const existing = state.wholesaleCart.find(c => c.productId === productId && c.size === size);
  if (existing) {
    existing.qty += quantity;
  } else {
    state.wholesaleCart.push({ productId, qty: quantity, size });
  }
  persist();
  emitter.emit('wholesaleCart:changed', state.wholesaleCart);
  emitter.emit('toast', {
    message: `Added ${quantity} units to Wholesale Cart`,
    type: 'success'
  });
}

export function updateWholesaleCartQty(productId, size, qty) {
  const item = state.wholesaleCart.find(c => c.productId === productId && c.size === size);
  if (item) {
    if (qty <= 0) {
      removeFromWholesaleCart(productId, size);
    } else {
      item.qty = qty;
      persist();
      emitter.emit('wholesaleCart:changed', state.wholesaleCart);
    }
  }
}

export function removeFromWholesaleCart(productId, size) {
  state.wholesaleCart = state.wholesaleCart.filter(c => !(c.productId === productId && c.size === size));
  persist();
  emitter.emit('wholesaleCart:changed', state.wholesaleCart);
}

export function clearWholesaleCart() {
  state.wholesaleCart = [];
  persist();
  emitter.emit('wholesaleCart:changed', state.wholesaleCart);
}

// Calculate Wholesale Cart Financials (Tier Pricing, MOQ validation, 18% GST, Shipping)
export function getWholesaleCartSummary() {
  const cart = state.wholesaleCart || [];
  let subtotal = 0;
  let retailTotal = 0;
  let totalUnits = 0;
  let hasMoqViolation = false;
  const itemDetails = [];

  cart.forEach(item => {
    const prod = getProductById(item.productId);
    if (!prod) return;

    const unitPrice = getWholesaleTierPrice(prod, item.qty);
    const itemTotal = unitPrice * item.qty;
    const itemRetailTotal = prod.price * item.qty;
    const isBelowMoq = item.qty < prod.moq;

    if (isBelowMoq) hasMoqViolation = true;

    subtotal += itemTotal;
    retailTotal += itemRetailTotal;
    totalUnits += item.qty;

    itemDetails.push({
      ...item,
      product: prod,
      unitPrice,
      itemTotal,
      itemRetailTotal,
      savings: itemRetailTotal - itemTotal,
      isBelowMoq
    });
  });

  // Wholesale Buyer Tier additional discount
  const user = getWholesaleUser();
  const tierObj = wholesaleTiers.find(t => t.tier === (user ? user.tier : 'Bronze'));
  const tierDiscountPercent = tierObj ? tierObj.discountPercent : 0;
  const tierRebate = Math.round(subtotal * (tierDiscountPercent / 100));

  const taxableAmount = Math.max(0, subtotal - tierRebate);
  const gstRate = 18;
  const gstAmount = Math.round(taxableAmount * 0.18);
  const cgst = Math.round(gstAmount / 2);
  const sgst = cgst;
  const shipping = taxableAmount > 15000 || totalUnits >= 25 ? 0 : 750;
  const finalTotal = taxableAmount + gstAmount + shipping;

  return {
    itemDetails,
    totalUnits,
    subtotal,
    retailTotal,
    overallSavings: (retailTotal - subtotal) + tierRebate,
    tierRebate,
    tierDiscountPercent,
    taxableAmount,
    gstRate,
    gstAmount,
    cgst,
    sgst,
    shipping,
    finalTotal,
    hasMoqViolation
  };
}

// Wholesale Orders
export function getWholesaleOrders() {
  return state.wholesaleOrders || [];
}

export function placeWholesaleOrder(orderDetails = {}) {
  const summary = getWholesaleCartSummary();
  const user = getWholesaleUser();
  const orderId = 'WHO-' + Math.floor(10000 + Math.random() * 90000);

  const newOrder = {
    id: orderId,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    buyerId: user ? user.id : 'WB-001',
    businessName: user ? user.businessName : 'Registered Wholesale Buyer',
    gstin: user ? user.gstin : '07AAAAA0000A1Z5',
    status: 'pending',
    items: summary.itemDetails.map(it => ({
      productId: it.productId,
      name: it.product.name,
      sku: it.product.sku,
      hsn: '90211000',
      qty: it.qty,
      unitPrice: it.unitPrice,
      total: it.itemTotal
    })),
    subtotal: summary.subtotal,
    bulkDiscount: summary.tierRebate,
    taxableAmount: summary.taxableAmount,
    gstRate: 18,
    gstType: 'CGST_SGST',
    cgst: summary.cgst,
    sgst: summary.sgst,
    igst: 0,
    shipping: summary.shipping,
    total: summary.finalTotal,
    paymentMethod: orderDetails.paymentMethod || '30-Day Credit Terms',
    paymentStatus: orderDetails.paymentStatus || 'Pending Invoice',
    shippingAddress: orderDetails.shippingAddress || {
      facility: 'Primary Facility Receiving Dock',
      address: user ? user.address : 'Plot 42, Industrial Area',
      city: user ? user.city : 'New Delhi',
      state: user ? user.state : 'Delhi',
      pincode: user ? user.pincode : '110092',
      contact: user ? user.ownerName : 'Procurement Manager'
    },
    billingAddress: orderDetails.billingAddress || {
      legalName: user ? user.businessName : 'Registered B2B Buyer',
      address: user ? user.address : 'Plot 42, Industrial Area',
      city: user ? user.city : 'New Delhi',
      state: user ? user.state : 'Delhi',
      pincode: user ? user.pincode : '110092',
      gstin: user ? user.gstin : '07AAAAA0000A1Z5',
      pan: user ? user.pan : 'AAAAA0000A'
    },
    tracking: {
      courier: 'SafeXpress B2B Logistics',
      awb: 'AWB-' + Math.floor(100000 + Math.random() * 900000),
      status: 'Order Placed — Awaiting Warehouse Allocation',
      estimatedDelivery: '3–4 Business Days'
    }
  };

  state.wholesaleOrders.unshift(newOrder);
  clearWholesaleCart();
  persist();
  emitter.emit('wholesaleOrders:changed', state.wholesaleOrders);
  return newOrder;
}

// Wholesale Registration
export function registerWholesaleBuyer(formData) {
  const newBuyer = {
    id: 'WB-' + String(state.wholesaleBuyersList.length + 1).padStart(3, '0'),
    businessName: formData.businessName,
    businessType: formData.businessType || 'Hospital',
    ownerName: formData.ownerName,
    phone: formData.phone,
    email: formData.email,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    pincode: formData.pincode,
    gstin: formData.gstin || '07AABCB1234F1Z0',
    pan: formData.pan || 'AABCB1234F',
    medLicense: formData.medLicense || 'MED-REG-99120',
    yearsInBusiness: Number(formData.yearsInBusiness) || 3,
    status: 'pending', // Pending verification
    tier: 'Bronze',
    creditLimit: 100000,
    creditUsed: 0,
    ordersCount: 0,
    totalPurchases: 0,
    registrationDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    documents: [
      { name: 'GST_Certificate_Submitted.pdf', size: '1.2 MB', date: 'Today' },
      { name: 'Medical_License_Doc.pdf', size: '1.8 MB', date: 'Today' }
    ]
  };

  state.wholesaleBuyersList.unshift(newBuyer);
  state.wholesaleUser = newBuyer;
  persist();
  emitter.emit('wholesaleBuyers:changed', state.wholesaleBuyersList);
  emitter.emit('wholesaleUser:changed', state.wholesaleUser);
  return newBuyer;
}

// ========================================
// Admin Management Actions
// ========================================
export function getAdminProducts() {
  return state.adminProducts || products;
}

export function updateAdminProduct(productId, updatedFields) {
  const prod = state.adminProducts.find(p => p.id === productId);
  if (prod) {
    Object.assign(prod, updatedFields);
    persist();
    emitter.emit('products:changed', state.adminProducts);
    emitter.emit('toast', { message: 'Product updated successfully', type: 'success' });
  }
}

export function addAdminProduct(newProdData) {
  const id = 'OC' + String(state.adminProducts.length + 1).padStart(4, '0');
  const catCode = (newProdData.category || 'gen').slice(0, 2).toUpperCase();
  const prod = {
    id,
    sku: `OC-${catCode}-${String(state.adminProducts.length + 1).padStart(3, '0')}`,
    name: newProdData.name,
    category: newProdData.category || 'knee',
    brand: newProdData.brand || 'OrthoCare Pro',
    mrp: Number(newProdData.mrp) || 999,
    price: Number(newProdData.price) || 699,
    discount: Math.round(((Number(newProdData.mrp) - Number(newProdData.price)) / Number(newProdData.mrp)) * 100),
    wholesalePrice: Number(newProdData.wholesalePrice) || Math.round(Number(newProdData.price) * 0.75),
    moq: Number(newProdData.moq) || 10,
    stock: Number(newProdData.stock) || 100,
    reservedStock: 10,
    wholesaleStock: Math.max(0, (Number(newProdData.stock) || 100) - 10),
    lowStockThreshold: 20,
    cartonQty: 25,
    sizes: newProdData.sizes || ['S', 'M', 'L', 'XL'],
    colors: newProdData.colors || ['Black'],
    material: newProdData.material || 'Medical Grade Neoprene',
    rating: 4.8,
    reviews: 1,
    inStock: true,
    iconKey: 'knee',
    images: [],
    bulkTiers: [
      { minQty: Number(newProdData.moq) || 10, maxQty: (Number(newProdData.moq) || 10) + 14, price: Number(newProdData.wholesalePrice) || 500, label: '10–24 Units' },
      { minQty: (Number(newProdData.moq) || 10) + 15, maxQty: (Number(newProdData.moq) || 10) + 39, price: Math.round((Number(newProdData.wholesalePrice) || 500) * 0.95), label: '25–49 Units' },
      { minQty: (Number(newProdData.moq) || 10) + 40, maxQty: null, price: Math.round((Number(newProdData.wholesalePrice) || 500) * 0.9), label: '50+ Units' }
    ],
    highlights: ['Hospital grade material', 'Clinically tested', 'Bulk supply certified'],
    description: newProdData.description || 'Professional grade orthopedic support manufactured to strict clinical standards.',
    packagingInfo: 'Master Corrugated Export Carton with Individual Blister Seal',
    deliveryTimeline: '2–4 Business Days across India'
  };

  state.adminProducts.unshift(prod);
  persist();
  emitter.emit('products:changed', state.adminProducts);
  emitter.emit('toast', { message: 'New product added to catalog', type: 'success' });
  return prod;
}

export function deleteAdminProduct(productId) {
  state.adminProducts = state.adminProducts.filter(p => p.id !== productId);
  persist();
  emitter.emit('products:changed', state.adminProducts);
  emitter.emit('toast', { message: 'Product removed from catalog', type: 'info' });
}

export function duplicateAdminProduct(productId) {
  const orig = state.adminProducts.find(p => p.id === productId);
  if (!orig) return;
  const copy = JSON.parse(JSON.stringify(orig));
  copy.id = 'OC' + String(state.adminProducts.length + 1).padStart(4, '0');
  copy.name = orig.name + ' (Copy)';
  copy.sku = orig.sku + '-CP';
  state.adminProducts.unshift(copy);
  persist();
  emitter.emit('products:changed', state.adminProducts);
  emitter.emit('toast', { message: 'Product duplicated', type: 'success' });
}

export function updateProductStock(productId, deltaOrSet, isAbsolute = false) {
  const prod = state.adminProducts.find(p => p.id === productId);
  if (prod) {
    if (isAbsolute) {
      prod.stock = Math.max(0, Number(deltaOrSet) || 0);
    } else {
      prod.stock = Math.max(0, (prod.stock || 0) + Number(deltaOrSet));
    }
    prod.wholesaleStock = Math.max(0, prod.stock - (prod.reservedStock || 0));
    persist();
    emitter.emit('products:changed', state.adminProducts);
  }
}

// Wholesale Buyers Verification Actions
export function getWholesaleBuyers() {
  return state.wholesaleBuyersList || wholesaleBuyers;
}

export function approveWholesaleBuyer(buyerId) {
  const buyer = state.wholesaleBuyersList.find(b => b.id === buyerId);
  if (buyer) {
    buyer.status = 'verified';
    if (state.wholesaleUser && state.wholesaleUser.id === buyerId) {
      state.wholesaleUser.status = 'verified';
    }
    persist();
    emitter.emit('wholesaleBuyers:changed', state.wholesaleBuyersList);
    emitter.emit('wholesaleUser:changed', state.wholesaleUser);
    emitter.emit('toast', { message: `${buyer.businessName} has been VERIFIED!`, type: 'success' });
  }
}

export function rejectWholesaleBuyer(buyerId, reason = 'Document clarification required') {
  const buyer = state.wholesaleBuyersList.find(b => b.id === buyerId);
  if (buyer) {
    buyer.status = 'rejected';
    buyer.rejectionReason = reason;
    if (state.wholesaleUser && state.wholesaleUser.id === buyerId) {
      state.wholesaleUser.status = 'rejected';
    }
    persist();
    emitter.emit('wholesaleBuyers:changed', state.wholesaleBuyersList);
    emitter.emit('wholesaleUser:changed', state.wholesaleUser);
    emitter.emit('toast', { message: `${buyer.businessName} verification rejected`, type: 'error' });
  }
}

export function suspendWholesaleBuyer(buyerId) {
  const buyer = state.wholesaleBuyersList.find(b => b.id === buyerId);
  if (buyer) {
    buyer.status = buyer.status === 'suspended' ? 'verified' : 'suspended';
    persist();
    emitter.emit('wholesaleBuyers:changed', state.wholesaleBuyersList);
    emitter.emit('toast', { message: `${buyer.businessName} status updated to ${buyer.status}`, type: 'info' });
  }
}

// Order Management Actions
export function updateWholesaleOrderStatus(orderId, newStatus, trackingInfo = null) {
  const order = state.wholesaleOrders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    if (trackingInfo && order.tracking) {
      Object.assign(order.tracking, trackingInfo);
    }
    persist();
    emitter.emit('wholesaleOrders:changed', state.wholesaleOrders);
    emitter.emit('toast', { message: `Order ${orderId} marked as ${newStatus}`, type: 'info' });
  }
}

export function updateRetailOrderStatus(orderId, newStatus) {
  const order = state.orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    persist();
    emitter.emit('orders:changed', state.orders);
    emitter.emit('toast', { message: `Retail Order ${orderId} marked as ${newStatus}`, type: 'info' });
  }
}

// Coupons Actions
export function getAdminCoupons() {
  return state.adminCoupons || initialCoupons;
}

export function addAdminCoupon(couponData) {
  const coupon = {
    code: couponData.code.toUpperCase(),
    title: couponData.title,
    discountType: couponData.discountType || 'percentage',
    discountValue: Number(couponData.discountValue) || 10,
    minOrder: Number(couponData.minOrder) || 1000,
    maxDiscount: Number(couponData.maxDiscount) || 500,
    userType: couponData.userType || 'both',
    startDate: couponData.startDate || '14 Sep 2026',
    endDate: couponData.endDate || '31 Dec 2026',
    usageLimit: Number(couponData.usageLimit) || 1000,
    usedCount: 0,
    active: true
  };
  state.adminCoupons.unshift(coupon);
  persist();
  emitter.emit('coupons:changed', state.adminCoupons);
  emitter.emit('toast', { message: `Coupon ${coupon.code} created`, type: 'success' });
}

export function toggleAdminCoupon(code) {
  const coupon = state.adminCoupons.find(c => c.code === code);
  if (coupon) {
    coupon.active = !coupon.active;
    persist();
    emitter.emit('coupons:changed', state.adminCoupons);
  }
}

// Notifications Actions
export function getAdminNotifications() {
  return state.adminNotifications || initialBroadcastNotifications;
}

export function sendBroadcastNotification(data) {
  const notif = {
    id: 'NOTIF-' + String(state.adminNotifications.length + 1).padStart(2, '0'),
    target: data.target || 'all',
    title: data.title,
    message: data.message,
    sentAt: 'Just now',
    delivered: data.target === 'wholesale' ? 326 : (data.target === 'retail' ? 8420 : 8746),
    clicked: 0
  };
  state.adminNotifications.unshift(notif);
  persist();
  emitter.emit('notifications:changed', state.adminNotifications);
  emitter.emit('toast', {
    message: `📢 Broadcast dispatched to ${data.target.toUpperCase()} users!`,
    type: 'success'
  });
}

// Customers Actions
export function getAdminCustomers() {
  return state.adminCustomers || retailCustomers;
}

// Reset Entire Store to Initial Demo Defaults
export function resetStore() {
  localStorage.removeItem(STORAGE_KEY);
  Object.assign(state, getDefaultState());
  emitter.emit('store:reset');
  emitter.emit('toast', { message: 'Demo store reset to initial state', type: 'info' });
}

export function on(event, fn) { return emitter.on(event, fn); }
export function emit(event, data) { emitter.emit(event, data); }
