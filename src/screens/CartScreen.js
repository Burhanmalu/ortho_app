// ========================================
// Cart Screen - Redesigned
// ========================================
import { navigate } from '../router.js';
import { getProductById, formatPrice } from '../data/products.js';
import { icons } from '../data/icons.js';
import * as store from '../store.js';
import { renderBackHeader, renderBottomNav, renderEmptyState, showToast } from '../components/index.js';

export default function CartScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen screen-with-nav';
  el.style.paddingBottom = '160px'; // Space for sticky CTA and bottom nav

  el.appendChild(renderBackHeader('My Cart'));

  const contentEl = document.createElement('div');
  el.appendChild(contentEl);

  const stickyEl = document.createElement('div');
  stickyEl.id = 'cart-sticky';

  function render() {
    const cart = store.getCart() || [];
    if (cart.length === 0) {
      contentEl.innerHTML = '';
      contentEl.appendChild(renderEmptyState({
        icon: icons.cart,
        title: 'Your cart is empty',
        desc: 'Explore medically certified braces, orthotics, and recovery aids.',
        ctaLabel: 'Start Shopping',
        ctaAction: () => navigate('home')
      }));
      stickyEl.innerHTML = '';
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
      const firstImg = (product.images && product.images.length > 0) ? product.images[0] : '';

      return `
        <div class="cart-item card" data-pid="${item.productId}" data-size="${item.size}">
          <div class="cart-item-img" style="cursor:pointer" data-navigate="product/${item.productId}">
            ${firstImg
              ? `<img src="${firstImg}" alt="${product.name}" />`
              : `<div style="width:36px;height:36px;color:var(--primary);display:inline-flex">${icons.knee}</div>`
            }
          </div>
          <div class="cart-item-info">
            <div class="cart-item-name" style="cursor:pointer" data-navigate="product/${item.productId}">${product.name}</div>
            <div class="cart-item-size">Size: ${item.size}</div>
            <div class="price-group" style="margin:4px 0">
              <span class="price-current">${formatPrice(product.price)}</span>
              ${product.mrp > product.price ? `<span class="price-original">${formatPrice(product.mrp)}</span>` : ''}
              ${product.discount > 0 ? `<span class="product-card-discount" style="position:static;font-size:10px">${product.discount}% OFF</span>` : ''}
            </div>
            <div class="cart-item-bottom">
              <div class="qty-control">
                <button class="qty-btn" data-action="dec" ${item.qty <= 1 ? 'disabled' : ''}>−</button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-btn" data-action="inc">+</button>
              </div>
              <div class="cart-item-actions">
                <button class="cart-item-action" data-action="remove" style="color:var(--danger)">Remove</button>
                <button class="cart-item-action" data-action="save">Save Later</button>
              </div>
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
      <div style="padding:0 16px;display:flex;flex-direction:column;gap:12px">
        ${itemsHtml}

        <!-- Coupon Card -->
        <div class="card" style="padding:14px">
          <div style="font-size:13px;font-weight:700;margin-bottom:10px;color:var(--text);display:flex;align-items:center;gap:6px">
            <span style="color:var(--primary);display:inline-flex">${icons.tag || icons.badgeCheck}</span>
            Apply Promo Code
          </div>
          ${coupon ? `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:rgba(57, 169, 107, 0.08);border:1px solid rgba(57, 169, 107, 0.25);border-radius:var(--radius-md)">
              <div>
                <span style="font-weight:700;color:var(--primary);font-size:13px">${coupon}</span>
                <span style="font-size:12px;color:var(--success);margin-left:8px;font-weight:600">−${formatPrice(couponDiscount)} saved</span>
              </div>
              <button style="font-size:12px;color:var(--danger);font-weight:600;background:none;border:none;cursor:pointer" id="remove-coupon">Remove</button>
            </div>
          ` : `
            <div class="coupon-input" style="margin-bottom:0">
              <input type="text" id="coupon-code" placeholder="Enter coupon (e.g. ORTHO10)" />
              <button id="apply-coupon">Apply</button>
            </div>
          `}
        </div>

        <!-- Price Summary Card -->
        <div class="price-summary card" style="padding:16px">
          <div class="price-summary-title" style="margin-bottom:12px">Price Breakdown (${cart.reduce((s, c) => s + c.qty, 0)} items)</div>
          <div class="price-row">
            <span class="price-row-label">Total MRP</span>
            <span class="price-row-value">${formatPrice(totalMRP)}</span>
          </div>
          <div class="price-row">
            <span class="price-row-label">Catalog Discount</span>
            <span class="price-row-value price-row-discount">−${formatPrice(discount)}</span>
          </div>
          ${couponDiscount > 0 ? `
            <div class="price-row">
              <span class="price-row-label">Coupon Savings</span>
              <span class="price-row-value price-row-discount">−${formatPrice(couponDiscount)}</span>
            </div>
          ` : ''}
          <div class="price-row">
            <span class="price-row-label">Healthcare Express Delivery</span>
            <span class="price-row-value ${delivery === 0 ? 'price-row-discount' : ''}">${delivery === 0 ? 'FREE' : formatPrice(delivery)}</span>
          </div>
          <div class="price-row price-row-total" style="border-top:1px solid var(--border);padding-top:10px;margin-top:6px">
            <span class="price-row-label">Net Payable</span>
            <span class="price-row-value" style="color:var(--primary);font-size:18px">${formatPrice(finalTotal)}</span>
          </div>
          ${(discount + couponDiscount) > 0 ? `
            <div style="font-size:12px;color:var(--success);font-weight:600;margin-top:8px;background:rgba(57, 169, 107, 0.08);padding:8px 10px;border-radius:var(--radius-sm);text-align:center">
              You are saving ${formatPrice(discount + couponDiscount)} on this order
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Event listeners
    contentEl.querySelectorAll('[data-action="inc"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ci = btn.closest('.cart-item');
        store.updateCartQty(ci.dataset.pid, ci.dataset.size, parseInt(ci.querySelector('.qty-value').textContent) + 1);
        render();
        renderSticky();
      });
    });

    contentEl.querySelectorAll('[data-action="dec"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ci = btn.closest('.cart-item');
        store.updateCartQty(ci.dataset.pid, ci.dataset.size, parseInt(ci.querySelector('.qty-value').textContent) - 1);
        render();
        renderSticky();
      });
    });

    contentEl.querySelectorAll('[data-action="remove"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ci = btn.closest('.cart-item');
        store.removeFromCart(ci.dataset.pid, ci.dataset.size);
        showToast('Removed from cart', 'info');
        render();
        renderSticky();
      });
    });

    contentEl.querySelectorAll('[data-action="save"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ci = btn.closest('.cart-item');
        store.saveForLater(ci.dataset.pid, ci.dataset.size);
        showToast('Saved to wishlist', 'info');
        render();
        renderSticky();
      });
    });

    contentEl.querySelectorAll('[data-navigate]').forEach(item => {
      item.addEventListener('click', () => navigate(item.dataset.navigate));
    });

    const applyCouponBtn = contentEl.querySelector('#apply-coupon');
    if (applyCouponBtn) {
      applyCouponBtn.addEventListener('click', () => {
        const code = contentEl.querySelector('#coupon-code').value.trim().toUpperCase();
        if (code) {
          store.applyCoupon(code);
          showToast('Coupon code applied!', 'success');
          render();
          renderSticky();
        }
      });
    }

    const removeCouponBtn = contentEl.querySelector('#remove-coupon');
    if (removeCouponBtn) {
      removeCouponBtn.addEventListener('click', () => {
        store.removeCoupon();
        render();
        renderSticky();
      });
    }
  }

  function renderSticky() {
    const cart = store.getCart() || [];
    if (cart.length === 0) { 
      stickyEl.innerHTML = ''; 
      return; 
    }
    const totalPrice = cart.reduce((acc, item) => {
      const p = getProductById(item.productId);
      return acc + (p ? p.price * item.qty : 0);
    }, 0);
    const coupon = store.getAppliedCoupon();
    let couponDiscount = 0;
    if (coupon) couponDiscount = Math.min(200, Math.floor(totalPrice * 0.2));
    const delivery = totalPrice >= 999 ? 0 : 49;
    const finalTotal = totalPrice + delivery - couponDiscount;

    stickyEl.className = 'sticky-bottom';
    stickyEl.style.bottom = 'var(--bottom-nav-height)';
    stickyEl.style.zIndex = '50';
    stickyEl.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%">
        <div>
          <div style="font-size:11px;color:var(--text-secondary)">Total Amount</div>
          <div style="font-size:16px;font-weight:700;color:var(--primary)">${formatPrice(finalTotal)}</div>
        </div>
        <button class="btn btn-primary" id="checkout-btn" style="flex:1;max-width:220px;height:44px;font-size:14px">
          Proceed to Checkout
        </button>
      </div>
    `;
    stickyEl.querySelector('#checkout-btn').addEventListener('click', () => navigate('checkout'));
  }

  render();
  renderSticky();
  appEl.appendChild(el);
  appEl.appendChild(stickyEl);

  const nav = renderBottomNav('cart');
  appEl.appendChild(nav);

  const unsub = store.on('cart:changed', () => { 
    render(); 
    renderSticky(); 
  });

  return { 
    unmount() { 
      unsub(); 
      if (nav._unsub) nav._unsub(); 
    } 
  };
}
