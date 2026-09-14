// ========================================
// Wishlist Screen - Redesigned
// ========================================
import { navigate } from '../router.js';
import { getProductById } from '../data/products.js';
import { icons } from '../data/icons.js';
import * as store from '../store.js';
import { renderBackHeader, renderBottomNav, renderEmptyState, renderProductCard } from '../components/index.js';

export default function WishlistScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen screen-with-nav';
  el.style.paddingBottom = '100px';

  el.appendChild(renderBackHeader('Saved Products'));

  const contentEl = document.createElement('div');
  el.appendChild(contentEl);

  function render() {
    const wishlist = store.getWishlist() || [];
    if (wishlist.length === 0) {
      contentEl.innerHTML = '';
      contentEl.appendChild(renderEmptyState({
        icon: icons.heart,
        title: 'Your wishlist is empty',
        desc: 'Save braces, supports, and mobility aids you want to consult on or purchase later.',
        ctaLabel: 'Browse All Categories',
        ctaAction: () => navigate('categories')
      }));
      return;
    }

    contentEl.innerHTML = `
      <div style="padding:0 16px 12px;display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:13px;font-weight:600;color:var(--text-secondary)">${wishlist.length} saved ${wishlist.length === 1 ? 'item' : 'items'}</span>
        <button id="clear-wishlist-btn" style="font-size:12px;font-weight:600;color:var(--danger);background:none;border:none;cursor:pointer">Clear All</button>
      </div>
      <div class="product-grid" style="padding:0 16px 16px" id="wishlist-grid"></div>
    `;

    contentEl.querySelector('#clear-wishlist-btn')?.addEventListener('click', () => {
      wishlist.forEach(id => store.toggleWishlist(id));
      store.emit('toast', { message: 'Wishlist cleared', type: 'info' });
      render();
    });

    const grid = contentEl.querySelector('#wishlist-grid');
    wishlist.forEach(pid => {
      const product = getProductById(pid);
      if (!product) return;
      const card = renderProductCard(product);
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
