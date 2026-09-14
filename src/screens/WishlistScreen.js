// ========================================
// Wishlist Screen
// ========================================
import { navigate } from '../router.js';
import { getProductById, formatPrice } from '../data/products.js';
import { icons, renderStars } from '../data/icons.js';
import * as store from '../store.js';
import { renderBackHeader, renderBottomNav, renderEmptyState, showToast } from '../components/index.js';

export default function WishlistScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen screen-with-nav';

  el.appendChild(renderBackHeader('My Wishlist'));

  const contentEl = document.createElement('div');
  el.appendChild(contentEl);

  function render() {
    const wishlist = store.getWishlist();
    if (wishlist.length === 0) {
      contentEl.innerHTML = '';
      contentEl.appendChild(renderEmptyState(
        '♡', 'Your wishlist is empty',
        'Save products you want to come back to.',
        'Start Shopping', () => navigate('home')
      ));
      return;
    }

    contentEl.innerHTML = `
      <div style="padding:var(--sp-sm) var(--content-padding);font-size:var(--fs-sm);color:var(--color-text-secondary)">${wishlist.length} items</div>
      <div class="product-grid" style="padding:var(--sp-sm) var(--content-padding)" id="wishlist-grid"></div>
    `;

    const grid = contentEl.querySelector('#wishlist-grid');
    wishlist.forEach(pid => {
      const product = getProductById(pid);
      if (!product) return;
      const card = document.createElement('div');
      card.className = 'product-card animate-fade-in';
      card.innerHTML = `
        ${product.discount > 0 ? `<span class="product-card-discount">${product.discount}% OFF</span>` : ''}
        <button class="wishlist-btn active" style="position:absolute;top:8px;right:8px;z-index:2" data-pid="${product.id}">
          ${icons.heartFilled}
        </button>
        <div class="product-card-img">
          <div class="product-card-placeholder">${product.emoji || '🩹'}</div>
        </div>
        <div class="product-card-info">
          <div class="product-card-name">${product.name}</div>
          <div class="product-card-rating">
            <div class="rating">
              ${renderStars(product.rating)}
              <span class="rating-value">${product.rating}</span>
            </div>
          </div>
          <div class="product-card-price price-group">
            <span class="price-current">${formatPrice(product.price)}</span>
            ${product.mrp > product.price ? `<span class="price-original">${formatPrice(product.mrp)}</span>` : ''}
          </div>
          ${product.inStock
            ? `<button class="btn btn-primary btn-sm btn-block" data-addcart="${product.id}" style="margin-top:var(--sp-sm)">Add to Cart</button>`
            : `<div style="color:var(--color-error);font-size:var(--fs-xs);font-weight:600;margin-top:var(--sp-sm)">Out of Stock</div>`
          }
        </div>
      `;

      card.querySelector('.wishlist-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        store.toggleWishlist(product.id);
        render();
      });

      const addBtn = card.querySelector('[data-addcart]');
      if (addBtn) {
        addBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          store.addToCart(product.id, product.sizes[0]);
        });
      }

      card.addEventListener('click', () => navigate(`product/${product.id}`));
      grid.appendChild(card);
    });
  }

  render();
  appEl.appendChild(el);

  const nav = renderBottomNav('wishlist');
  appEl.appendChild(nav);

  const unsub = store.on('wishlist:changed', render);

  return { unmount() { unsub(); if (nav._unsub) nav._unsub(); } };
}
