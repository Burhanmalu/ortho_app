// ========================================
// Cart Screen
// ========================================
import { navigate } from '../router.js';
import { getProductById, formatPrice } from '../data/products.js';
import { icons } from '../data/icons.js';
import * as store from '../store.js';
import { renderBackHeader, renderBottomNav, renderEmptyState, showToast } from '../components/index.js';

export default function CartScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen screen-with-nav';

  el.appendChild(renderBackHeader('My Cart'));

  const contentEl = document.createElement('div');
  el.appendChild(contentEl);

  function render() {
    const cart = store.getCart();
    if (cart.length === 0) {
      contentEl.innerHTML = '';
      contentEl.appendChild(renderEmptyState(
        '🛒', 'Your cart is empty',
        'Your cart is waiting for something supportive.',
        'Explore Products', () => navigate('home')
      ));
      return;
    }

    let totalMRP = 0;
    let totalPrice = 0;

    const itemsHtml = cart.map(item => {
      const product = getProductById(item.productId);
      if (!product) return '';
      const itemTotal = product.price * item.qty;
      const itemMRP = product.mrp * item.qty;
      totalPrice += itemTotal;
      totalMRP += itemMRP;

      return `
        <div class="cart-item" data-pid="${item.productId}" data-size="${item.size}">
          <div class="cart-item-img" style="cursor:pointer" data-navigate="product/${item.productId}">
            ${product.images.length > 0
              ? `<img src="${product.images[0]}" alt="${product.name}" />`
              : `<div style="font-size:36px;opacity:0.3">${product.emoji || '🩹'}</div>`
            }
          </div>
          <div class="cart-item-info">
            <div class="cart-item-name">${product.name}</div>
            <div class="cart-item-size">Size: ${item.size}</div>
            <div class="price-group">
              <span class="price-current">${formatPrice(product.price)}</span>
              ${product.mrp > product.price ? `<span class="price-original">${formatPrice(product.mrp)}</span>` : ''}
              ${product.discount > 0 ? `<span class="price-discount">${product.discount}% off</span>` : ''}
            </div>
            <div class="cart-item-bottom">
              <div class="qty-control">
                <button class="qty-btn" data-action="dec" ${item.qty <= 1 ? 'disabled' : ''}>−</button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-btn" data-action="inc">+</button>
              </div>
            </div>
            <div class="cart-item-actions">
              <button class="cart-item-action" data-action="remove">Remove</button>
              <button class="cart-item-action" data-action="save">Save for Later</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const discount = totalMRP - totalPrice;
    const delivery = totalPrice >= 999 ? 0 : 49;
    const coupon = store.getAppliedCoupon();
    let couponDiscount = 0;
    if (coupon) couponDiscount = Math.min(200, Math.floor(totalPrice * 0.2));
    const finalTotal = totalPrice + delivery - couponDiscount;

    contentEl.innerHTML = `
      ${itemsHtml}
      <div class="divider-thick"></div>

      <!-- Coupon -->
      <div style="padding:var(--sp-lg) var(--content-padding);background:var(--color-card)">
        <div style="font-weight:var(--fw-semibold);margin-bottom:var(--sp-md)">Apply Coupon</div>
        ${coupon ? `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--sp-md);background:var(--color-accent-light);border-radius:var(--radius-md)">
            <div>
              <span style="font-weight:var(--fw-bold);color:var(--color-primary)">${coupon}</span>
              <span style="font-size:var(--fs-sm);color:var(--color-accent);margin-left:var(--sp-sm)">−${formatPrice(couponDiscount)}</span>
            </div>
            <button style="font-size:var(--fs-sm);color:var(--color-error);font-weight:var(--fw-semibold)" id="remove-coupon">Remove</button>
          </div>
        ` : `
          <div class="coupon-input">
            <input type="text" id="coupon-code" placeholder="Enter coupon code" />
            <button id="apply-coupon">Apply</button>
          </div>
        `}
      </div>

      <div class="divider-thick"></div>

      <!-- Price Summary -->
      <div class="price-summary">
        <div class="price-summary-title">Price Details (${cart.reduce((s, c) => s + c.qty, 0)} items)</div>
        <div class="price-row">
          <span class="price-row-label">Total MRP</span>
          <span class="price-row-value">${formatPrice(totalMRP)}</span>
        </div>
        <div class="price-row">
          <span class="price-row-label">Discount on MRP</span>
          <span class="price-row-value price-row-discount">−${formatPrice(discount)}</span>
        </div>
        ${couponDiscount > 0 ? `
          <div class="price-row">
            <span class="price-row-label">Coupon Discount</span>
            <span class="price-row-value price-row-discount">−${formatPrice(couponDiscount)}</span>
          </div>
        ` : ''}
        <div class="price-row">
          <span class="price-row-label">Delivery Charges</span>
          <span class="price-row-value ${delivery === 0 ? 'price-row-discount' : ''}">${delivery === 0 ? 'FREE' : formatPrice(delivery)}</span>
        </div>
        <div class="price-row price-row-total">
          <span class="price-row-label">Total Amount</span>
          <span class="price-row-value">${formatPrice(finalTotal)}</span>
        </div>
        ${discount > 0 ? `<div style="font-size:var(--fs-sm);color:var(--color-accent);font-weight:var(--fw-semibold);margin-top:var(--sp-sm)">You're saving ${formatPrice(discount + couponDiscount)} on this order!</div>` : ''}
      </div>

      <div style="height:80px"></div>
    `;

    // Event listeners
    contentEl.querySelectorAll('[data-action="inc"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ci = btn.closest('.cart-item');
        store.updateCartQty(ci.dataset.pid, ci.dataset.size, parseInt(ci.querySelector('.qty-value').textContent) + 1);
        render();
      });
    });

    contentEl.querySelectorAll('[data-action="dec"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ci = btn.closest('.cart-item');
        store.updateCartQty(ci.dataset.pid, ci.dataset.size, parseInt(ci.querySelector('.qty-value').textContent) - 1);
        render();
      });
    });

    contentEl.querySelectorAll('[data-action="remove"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ci = btn.closest('.cart-item');
        store.removeFromCart(ci.dataset.pid, ci.dataset.size);
        showToast('Removed from cart', 'info');
        render();
      });
    });

    contentEl.querySelectorAll('[data-action="save"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ci = btn.closest('.cart-item');
        store.saveForLater(ci.dataset.pid, ci.dataset.size);
        render();
      });
    });

    contentEl.querySelectorAll('[data-navigate]').forEach(el => {
      el.addEventListener('click', () => navigate(el.dataset.navigate));
    });

    const applyCouponBtn = contentEl.querySelector('#apply-coupon');
    if (applyCouponBtn) {
      applyCouponBtn.addEventListener('click', () => {
        const code = contentEl.querySelector('#coupon-code').value.trim().toUpperCase();
        if (code) {
          store.applyCoupon(code);
          showToast('Coupon applied!', 'success');
          render();
        }
      });
    }

    const removeCouponBtn = contentEl.querySelector('#remove-coupon');
    if (removeCouponBtn) {
      removeCouponBtn.addEventListener('click', () => {
        store.removeCoupon();
        render();
      });
    }
  }

  render();
  appEl.appendChild(el);

  // Sticky CTA
  const stickyEl = document.createElement('div');
  stickyEl.id = 'cart-sticky';
  function renderSticky() {
    const cart = store.getCart();
    if (cart.length === 0) { stickyEl.innerHTML = ''; return; }
    stickyEl.className = 'sticky-bottom';
    stickyEl.style.bottom = 'var(--bottom-nav-height)';
    stickyEl.innerHTML = `<button class="btn btn-primary btn-block btn-lg" id="checkout-btn">Proceed to Checkout</button>`;
    stickyEl.querySelector('#checkout-btn').addEventListener('click', () => navigate('checkout'));
  }
  renderSticky();
  appEl.appendChild(stickyEl);

  const nav = renderBottomNav('cart');
  appEl.appendChild(nav);

  const unsub = store.on('cart:changed', () => { render(); renderSticky(); });

  return { unmount() { unsub(); if (nav._unsub) nav._unsub(); } };
}
