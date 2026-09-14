// ========================================
// OrthoCare — Reusable UI Components
// ========================================

import { icons, renderStars } from '../data/icons.js';
import { formatPrice } from '../data/products.js';
import * as store from '../store.js';
import { navigate } from '../router.js';

// ---- Toast System ----
export function showToast(message, type = 'info', duration = 2500) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span class="toast-msg">${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 200);
  }, duration);
}

// Auto-listen for toast events
store.on('toast', ({ message, type }) => showToast(message, type));

// ---- Bottom Navigation ----
export function renderBottomNav(activeTab = 'home') {
  const cartCount = store.getCartCount();
  const tabs = [
    { id: 'home', label: 'Home', icon: icons.home },
    { id: 'categories', label: 'Categories', icon: icons.grid },
    { id: 'wishlist', label: 'Wishlist', icon: icons.heart },
    { id: 'cart', label: 'Cart', icon: icons.cart },
    { id: 'profile', label: 'Profile', icon: icons.user },
  ];

  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.innerHTML = tabs.map(tab => `
    <div class="bottom-nav-item ${tab.id === activeTab ? 'active' : ''}" data-tab="${tab.id}">
      <span class="bottom-nav-icon">
        ${tab.icon}
        ${tab.id === 'cart' && cartCount > 0 ? `<span class="badge-dot">${cartCount}</span>` : ''}
      </span>
      <span class="bottom-nav-label">${tab.label}</span>
    </div>
  `).join('');

  nav.querySelectorAll('.bottom-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.dataset.tab;
      navigate(tab);
    });
  });

  // Update cart badge when cart changes
  const unsub = store.on('cart:changed', () => {
    const badge = nav.querySelector('[data-tab="cart"] .badge-dot');
    const count = store.getCartCount();
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    } else if (count > 0) {
      const iconEl = nav.querySelector('[data-tab="cart"] .bottom-nav-icon');
      if (iconEl) iconEl.insertAdjacentHTML('beforeend', `<span class="badge-dot">${count}</span>`);
    }
  });

  nav._unsub = unsub;
  return nav;
}

// ---- Back Header ----
export function renderBackHeader(title, actions = '') {
  const header = document.createElement('header');
  header.className = 'back-header';
  header.innerHTML = `
    <button class="back-btn" id="back-btn">${icons.back}</button>
    <h1 class="back-header-title">${title}</h1>
    ${actions}
  `;
  header.querySelector('#back-btn').addEventListener('click', () => window.history.back());
  return header;
}

// ---- Product Card ----
export function renderProductCard(product, options = {}) {
  const inWishlist = store.isInWishlist(product.id);
  const card = document.createElement('div');
  card.className = 'product-card animate-fade-in';
  card.innerHTML = `
    ${product.discount > 0 ? `<span class="product-card-discount">${product.discount}% OFF</span>` : ''}
    <div class="product-card-wishlist">
      <button class="wishlist-btn ${inWishlist ? 'active' : ''}" data-pid="${product.id}">
        ${inWishlist ? icons.heartFilled : icons.heart}
      </button>
    </div>
    <div class="product-card-img">
      ${product.images && product.images.length > 0
        ? `<img src="${product.images[0]}" alt="${product.name}" loading="lazy" />`
        : `<div class="product-card-placeholder">${product.emoji || '🩹'}</div>`
      }
    </div>
    <div class="product-card-info">
      <div class="product-card-name">${product.name}</div>
      <div class="product-card-rating">
        <div class="rating">
          ${renderStars(product.rating)}
          <span class="rating-value">${product.rating}</span>
          <span class="rating-count">(${product.reviews > 999 ? (product.reviews/1000).toFixed(1)+'k' : product.reviews})</span>
        </div>
      </div>
      <div class="product-card-price price-group">
        <span class="price-current">${formatPrice(product.price)}</span>
        ${product.mrp > product.price ? `<span class="price-original">${formatPrice(product.mrp)}</span>` : ''}
        ${product.discount > 0 ? `<span class="price-discount">${product.discount}% off</span>` : ''}
      </div>
      ${product.inStock ? '<div class="product-card-stock">✓ In Stock</div>' : '<div class="product-card-stock" style="color:var(--color-error)">Out of Stock</div>'}
    </div>
  `;

  // Wishlist toggle
  card.querySelector('.wishlist-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    store.toggleWishlist(product.id);
    const btn = card.querySelector('.wishlist-btn');
    const isNowInWishlist = store.isInWishlist(product.id);
    btn.classList.toggle('active', isNowInWishlist);
    btn.innerHTML = isNowInWishlist ? icons.heartFilled : icons.heart;
  });

  // Navigate to product detail
  card.addEventListener('click', () => {
    navigate(`product/${product.id}`);
  });

  return card;
}

// ---- Product Carousel ----
export function renderProductCarousel(products, title, link = '') {
  const section = document.createElement('section');
  section.className = 'section';
  section.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">${title}</h2>
      ${link ? `<a href="${link}" class="section-link">View All →</a>` : ''}
    </div>
    <div class="product-carousel"></div>
  `;
  const carousel = section.querySelector('.product-carousel');
  products.forEach(p => carousel.appendChild(renderProductCard(p)));
  return section;
}

// ---- Empty State ----
export function renderEmptyState(icon, title, text, ctaLabel, ctaAction) {
  const el = document.createElement('div');
  el.className = 'empty-state';
  el.innerHTML = `
    <div class="empty-state-icon">${icon}</div>
    <h3 class="empty-state-title">${title}</h3>
    <p class="empty-state-text">${text}</p>
    ${ctaLabel ? `<button class="btn btn-primary btn-pill" id="empty-cta">${ctaLabel}</button>` : ''}
  `;
  if (ctaLabel && ctaAction) {
    el.querySelector('#empty-cta').addEventListener('click', ctaAction);
  }
  return el;
}

// ---- Modal ----
export function showModal(title, contentHtml, footerHtml = '') {
  const container = document.getElementById('modal-container');
  container.innerHTML = `
    <div class="modal-backdrop" id="modal-backdrop"></div>
    <div class="modal-sheet">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
        <button class="back-btn" id="modal-close">${icons.close}</button>
      </div>
      <div class="modal-body">${contentHtml}</div>
      ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
    </div>
  `;
  const close = () => {
    container.querySelector('.modal-backdrop').classList.add('closing');
    container.querySelector('.modal-sheet').classList.add('closing');
    setTimeout(() => { container.innerHTML = ''; }, 300);
  };
  container.querySelector('#modal-backdrop').addEventListener('click', close);
  container.querySelector('#modal-close').addEventListener('click', close);
  return { close, container };
}

export function closeModal() {
  const container = document.getElementById('modal-container');
  const backdrop = container.querySelector('.modal-backdrop');
  const sheet = container.querySelector('.modal-sheet');
  if (backdrop) backdrop.classList.add('closing');
  if (sheet) sheet.classList.add('closing');
  setTimeout(() => { container.innerHTML = ''; }, 300);
}

// ---- Skeleton Loading Cards ----
export function renderSkeletonGrid(count = 4) {
  const grid = document.createElement('div');
  grid.className = 'product-grid';
  for (let i = 0; i < count; i++) {
    grid.innerHTML += `
      <div class="skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div style="padding:12px">
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
          <div class="skeleton skeleton-text" style="width:40%"></div>
        </div>
      </div>
    `;
  }
  return grid;
}
