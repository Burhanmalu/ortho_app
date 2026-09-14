// ========================================
// Product Detail Screen
// ========================================
import { navigate } from '../router.js';
import { getProductById, formatPrice } from '../data/products.js';
import { icons, renderStars } from '../data/icons.js';
import * as store from '../store.js';
import { renderBackHeader, showToast } from '../components/index.js';

export default function ProductDetailScreen(appEl, productId) {
  const product = getProductById(productId);
  if (!product) { navigate('home'); return { unmount() {} }; }

  store.addRecentlyViewed(productId);

  const el = document.createElement('div');
  el.className = 'screen';
  el.style.paddingBottom = '80px';

  let selectedSize = product.sizes[0];
  const inWishlist = store.isInWishlist(product.id);

  // Header
  const header = renderBackHeader(product.brand, `
    <button class="back-btn" id="pd-share">${icons.share}</button>
    <button class="back-btn wishlist-btn-header ${inWishlist ? 'active' : ''}" id="pd-wishlist" style="color:${inWishlist ? 'var(--color-error)' : 'var(--color-text)'}">
      ${inWishlist ? icons.heartFilled : icons.heart}
    </button>
  `);
  el.appendChild(header);

  // Gallery
  const gallery = document.createElement('div');
  gallery.className = 'pd-gallery';
  gallery.innerHTML = `
    <div class="pd-image-main">
      ${product.images.length > 0
        ? `<img src="${product.images[0]}" alt="${product.name}" />`
        : `<div style="font-size:120px;opacity:0.3;color:var(--color-primary)">${product.emoji || '🩹'}</div>`
      }
    </div>
  `;
  el.appendChild(gallery);

  // Product Info
  const info = document.createElement('div');
  info.className = 'pd-info';
  info.innerHTML = `
    <h1 class="pd-title">${product.name}</h1>
    <div class="pd-rating-row">
      <span class="pd-rating-badge">★ ${product.rating}</span>
      <span class="pd-review-count">${product.reviews.toLocaleString()} Reviews</span>
    </div>
    <div class="pd-price-row">
      <span class="pd-price">${formatPrice(product.price)}</span>
      ${product.mrp > product.price ? `<span class="pd-mrp">${formatPrice(product.mrp)}</span>` : ''}
      ${product.discount > 0 ? `<span class="pd-discount-tag">${product.discount}% OFF</span>` : ''}
    </div>
    ${product.price >= 1000 ? `
      <div style="font-size:var(--fs-sm);color:var(--color-text-secondary);margin-top:-8px;margin-bottom:var(--sp-md)">
        EMI from ${formatPrice(Math.ceil(product.price / 3))}/month
      </div>
    ` : ''}
  `;
  el.appendChild(info);

  // Size Selection
  if (product.sizes.length > 1 || (product.sizes.length === 1 && product.sizes[0] !== 'Standard')) {
    const sizeSection = document.createElement('div');
    sizeSection.className = 'pd-section';
    sizeSection.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--sp-md)">
        <h3 class="pd-section-title" style="margin-bottom:0">Select Size</h3>
        <a href="#" style="font-size:var(--fs-sm);font-weight:600;color:var(--color-primary)">Size Guide</a>
      </div>
      <div class="size-grid" id="size-grid">
        ${product.sizes.map(s => `
          <button class="size-option ${s === selectedSize ? 'active' : ''}" data-size="${s}">${s}</button>
        `).join('')}
      </div>
    `;
    sizeSection.querySelectorAll('.size-option').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedSize = btn.dataset.size;
        sizeSection.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
    el.appendChild(sizeSection);
  }

  // Product Highlights
  const highlights = document.createElement('div');
  highlights.className = 'pd-section';
  highlights.innerHTML = `
    <h3 class="pd-section-title">Product Highlights</h3>
    ${product.highlights.map(h => `
      <div class="pd-highlight">
        <span class="pd-highlight-icon">✓</span>
        <span>${h}</span>
      </div>
    `).join('')}
  `;
  el.appendChild(highlights);

  // Description
  const desc = document.createElement('div');
  desc.className = 'pd-section';
  desc.innerHTML = `
    <h3 class="pd-section-title">Description</h3>
    <p style="font-size:var(--fs-md);color:var(--color-text-secondary);line-height:var(--lh-relaxed)">${product.description}</p>
  `;
  el.appendChild(desc);

  // Specifications
  const specsSection = document.createElement('div');
  specsSection.className = 'pd-section';
  specsSection.innerHTML = `
    <h3 class="pd-section-title">Specifications</h3>
    <div class="pd-specs-table">
      <div class="pd-spec-row"><span class="pd-spec-label">Brand</span><span class="pd-spec-value">${product.brand}</span></div>
      <div class="pd-spec-row"><span class="pd-spec-label">Material</span><span class="pd-spec-value">${product.material}</span></div>
      ${Object.entries(product.specs).map(([k, v]) => `
        <div class="pd-spec-row"><span class="pd-spec-label">${k}</span><span class="pd-spec-value">${v}</span></div>
      `).join('')}
      <div class="pd-spec-row"><span class="pd-spec-label">Available Sizes</span><span class="pd-spec-value">${product.sizes.join(', ')}</span></div>
      ${product.colors ? `<div class="pd-spec-row"><span class="pd-spec-label">Colors</span><span class="pd-spec-value">${product.colors.join(', ')}</span></div>` : ''}
    </div>
  `;
  el.appendChild(specsSection);

  // Care Instructions
  const careSection = document.createElement('div');
  careSection.className = 'pd-section';
  careSection.innerHTML = `
    <h3 class="pd-section-title">Care Instructions</h3>
    <p style="font-size:var(--fs-md);color:var(--color-text-secondary);line-height:var(--lh-relaxed)">${product.care}</p>
  `;
  el.appendChild(careSection);

  // Delivery
  const deliverySection = document.createElement('div');
  deliverySection.className = 'pd-section';
  deliverySection.innerHTML = `
    <h3 class="pd-section-title">Delivery</h3>
    <div class="pd-delivery">
      <span class="pd-delivery-icon">${icons.truck}</span>
      <div>
        <div style="font-weight:var(--fw-semibold);margin-bottom:4px">📍 Deliver to 452001</div>
        <div style="font-size:var(--fs-sm);color:var(--color-accent);font-weight:var(--fw-medium)">✓ Available — Estimated delivery: ${product.deliveryDays} days</div>
      </div>
    </div>
  `;
  el.appendChild(deliverySection);

  // Return Policy
  const returnSection = document.createElement('div');
  returnSection.className = 'pd-section';
  returnSection.innerHTML = `
    <h3 class="pd-section-title">Return & Replacement</h3>
    <div style="display:flex;align-items:center;gap:var(--sp-md);font-size:var(--fs-md);color:var(--color-text-secondary)">
      ${icons.repeat} <span>${product.returnPolicy}</span>
    </div>
  `;
  el.appendChild(returnSection);

  // Customer Reviews
  const reviewSection = document.createElement('div');
  reviewSection.className = 'pd-section';
  const reviewers = ['Amit K.', 'Priya S.', 'Rajesh M.'];
  const reviewTexts = [
    'Very comfortable and good quality. Fits well and provides excellent support during daily activities.',
    'Good product for the price. Material is breathable and the fit is adjustable. Would recommend.',
    'Exactly as described. Delivery was fast and packaging was good. Happy with the purchase.',
  ];
  reviewSection.innerHTML = `
    <h3 class="pd-section-title">Customer Reviews (${product.reviews.toLocaleString()})</h3>
    <div style="display:flex;align-items:center;gap:var(--sp-lg);margin-bottom:var(--sp-xl)">
      <div style="font-size:var(--fs-4xl);font-weight:var(--fw-bold);font-family:var(--font-heading)">${product.rating}</div>
      <div>
        <div class="rating" style="margin-bottom:4px">${renderStars(product.rating)}</div>
        <div style="font-size:var(--fs-sm);color:var(--color-text-secondary)">${product.reviews.toLocaleString()} reviews</div>
      </div>
    </div>
    ${reviewers.map((name, i) => `
      <div class="review-card">
        <div class="review-header">
          <div class="review-avatar">${name[0]}</div>
          <div>
            <div class="review-name">${name}</div>
            <div class="review-date">${['2 weeks ago', '1 month ago', '3 months ago'][i]}</div>
          </div>
        </div>
        <div class="rating" style="margin-bottom:var(--sp-sm)">${renderStars([4.5, 4, 5][i])}</div>
        <div class="review-text">${reviewTexts[i]}</div>
      </div>
    `).join('')}
  `;
  el.appendChild(reviewSection);

  // Spacer
  const spacer = document.createElement('div');
  spacer.style.height = '20px';
  el.appendChild(spacer);

  appEl.appendChild(el);

  // Sticky Bottom CTA
  const stickyBar = document.createElement('div');
  stickyBar.className = 'sticky-bottom';
  stickyBar.innerHTML = `
    <button class="btn btn-outline btn-block" id="pd-add-cart">Add to Cart</button>
    <button class="btn btn-primary btn-block" id="pd-buy-now">Buy Now</button>
  `;
  appEl.appendChild(stickyBar);

  stickyBar.querySelector('#pd-add-cart').addEventListener('click', () => {
    store.addToCart(product.id, selectedSize);
  });

  stickyBar.querySelector('#pd-buy-now').addEventListener('click', () => {
    store.addToCart(product.id, selectedSize);
    navigate('cart');
  });

  // Wishlist in header
  header.querySelector('#pd-wishlist').addEventListener('click', () => {
    store.toggleWishlist(product.id);
    const btn = header.querySelector('#pd-wishlist');
    const isNow = store.isInWishlist(product.id);
    btn.innerHTML = isNow ? icons.heartFilled : icons.heart;
    btn.style.color = isNow ? 'var(--color-error)' : 'var(--color-text)';
  });

  return { unmount() {} };
}
