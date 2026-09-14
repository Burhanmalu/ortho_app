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

// ========================================
// Wholesale B2B Bottom Navigation
// ========================================
export function renderWholesaleBottomNav(activeTab = 'dashboard') {
  const wholesaleCart = store.getWholesaleCart();
  const totalUnits = wholesaleCart.reduce((s, c) => s + c.qty, 0);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: icons.home, route: 'wholesale/dashboard' },
    { id: 'products', label: 'B2B Catalog', icon: icons.grid, route: 'wholesale/products' },
    { id: 'bulk-order', label: 'Bulk Pad', icon: icons.clipboard || '📝', route: 'wholesale/bulk-order' },
    { id: 'cart', label: 'Cart', icon: icons.cart, route: 'wholesale/cart', badge: totalUnits > 0 ? `${totalUnits}` : null },
    { id: 'orders', label: 'B2B Orders', icon: icons.truck || '📦', route: 'wholesale/orders' },
    { id: 'profile', label: 'Business', icon: icons.user, route: 'wholesale/profile' }
  ];

  const nav = document.createElement('nav');
  nav.className = 'bottom-nav b2b-nav';
  nav.style.borderTop = '2px solid #0f3647';
  nav.innerHTML = tabs.map(tab => `
    <div class="bottom-nav-item ${tab.id === activeTab ? 'active' : ''}" data-route="${tab.route}">
      <span class="bottom-nav-icon" style="position:relative">
        ${tab.icon}
        ${tab.badge ? `<span class="badge-dot" style="background:#0d9488">${tab.badge}</span>` : ''}
      </span>
      <span class="bottom-nav-label" style="font-size:10px">${tab.label}</span>
    </div>
  `).join('');

  nav.querySelectorAll('.bottom-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      navigate(item.dataset.route);
    });
  });

  return nav;
}

// ========================================
// Universal Floating Demo Role Switcher
// ========================================
export function initUniversalDemoRoleSwitcher() {
  if (document.getElementById('universal-demo-switcher')) return;

  const container = document.createElement('div');
  container.id = 'universal-demo-switcher';
  container.className = 'demo-role-switcher-fab';

  function renderSwitcher() {
    const currentRole = store.getRole();
    const wholesaleUser = store.getWholesaleUser();
    const isPending = wholesaleUser && wholesaleUser.status === 'pending';

    let label = '🛒 Retail Customer';
    let bg = '#0f3647';
    if (currentRole === 'admin') {
      label = '🛡️ Admin Portal';
      bg = '#0f172a';
    } else if (currentRole === 'wholesale') {
      label = isPending ? '⏳ Wholesale (Pending)' : '🏢 Wholesale (Verified)';
      bg = isPending ? '#b45309' : '#047857';
    }

    container.innerHTML = `
      <div class="demo-switcher-dropdown" id="demo-dropdown">
        <div style="padding:4px 8px 6px; border-bottom:1px solid #f1f5f9; font-size:11px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:0.5px">
          Switch Demo Perspective
        </div>
        <button class="demo-role-option ${currentRole === 'customer' ? 'active' : ''}" data-role="customer">
          <span>🛒</span>
          <div>
            <div style="font-size:12px;font-weight:700">Retail Customer</div>
            <div style="font-size:10px;color:#64748b">Individual & Family Care</div>
          </div>
        </button>
        <button class="demo-role-option ${currentRole === 'wholesale' && !isPending ? 'active' : ''}" data-role="wholesale-verified">
          <span>🏢</span>
          <div>
            <div style="font-size:12px;font-weight:700">Wholesale (Verified)</div>
            <div style="font-size:10px;color:#64748b">Apollo Pharmacy (Gold Tier)</div>
          </div>
        </button>
        <button class="demo-role-option ${currentRole === 'wholesale' && isPending ? 'active' : ''}" data-role="wholesale-pending">
          <span>⏳</span>
          <div>
            <div style="font-size:12px;font-weight:700">Wholesale (Pending)</div>
            <div style="font-size:10px;color:#64748b">CareMed Surgical (Under Review)</div>
          </div>
        </button>
        <button class="demo-role-option ${currentRole === 'admin' ? 'active' : ''}" data-role="admin">
          <span>🛡️</span>
          <div>
            <div style="font-size:12px;font-weight:700">Admin Dashboard</div>
            <div style="font-size:10px;color:#64748b">Catalog, Orders, Verification</div>
          </div>
        </button>
      </div>
      <div class="demo-switcher-pill" id="demo-toggle-btn" style="background:${bg}">
        <span>${label}</span>
        <span style="font-size:10px;opacity:0.8">⇄ Switch</span>
      </div>
    `;

    const toggleBtn = container.querySelector('#demo-toggle-btn');
    const dropdown = container.querySelector('#demo-dropdown');

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });

    container.querySelectorAll('.demo-role-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.role;
        dropdown.classList.remove('show');

        if (target === 'customer') {
          store.setRole('customer');
          navigate('home');
        } else if (target === 'wholesale-verified') {
          store.setRole('wholesale');
          // Switch user to Apollo
          const verifiedUser = store.getWholesaleBuyers().find(b => b.status === 'verified');
          if (verifiedUser) store.setWholesaleUser(verifiedUser);
          navigate('wholesale/dashboard');
        } else if (target === 'wholesale-pending') {
          store.setRole('wholesale');
          // Switch user to Pending
          const pendingUser = store.getWholesaleBuyers().find(b => b.status === 'pending');
          if (pendingUser) store.setWholesaleUser(pendingUser);
          navigate('wholesale/verification-pending');
        } else if (target === 'admin') {
          store.setRole('admin');
          navigate('admin/dashboard');
        }
        renderSwitcher();
      });
    });
  }

  renderSwitcher();
  document.body.appendChild(container);

  store.on('role:changed', () => renderSwitcher());
  store.on('wholesaleUser:changed', () => renderSwitcher());
}

// ========================================
// GST Tax Invoice Modal (Printable & Downloadable)
// ========================================
export function showGSTTaxInvoiceModal(order) {
  if (!order) return;

  const contentHtml = `
    <div class="invoice-container" id="printable-invoice">
      <div class="invoice-header">
        <div>
          <div class="invoice-title">OrthoCare Healthcare India Pvt Ltd</div>
          <div style="font-size:12px;color:#475569">Certified Orthopedic & Rehabilitation Supplies</div>
          <div style="font-size:11px;color:#64748b;margin-top:4px">
            GSTIN: <strong>07AAFCO9918K1ZZ</strong> | CIN: U85110DL2024PTC391024<br>
            Plot 104, Okhla Industrial Area Phase III, New Delhi 110020
          </div>
        </div>
        <div class="invoice-meta">
          <div style="font-size:15px;font-weight:800;color:#0f3647">TAX INVOICE</div>
          <div>Invoice No: <strong>INV-${order.id}</strong></div>
          <div>Date: <strong>${order.date || '14 Sep 2026'}</strong></div>
          <div>Order Ref: <strong>${order.id}</strong></div>
          <div>Place of Supply: <strong>${order.shippingAddress ? (order.shippingAddress.state || 'Delhi') : 'Delhi'}</strong></div>
        </div>
      </div>

      <div class="invoice-grid">
        <div>
          <div style="font-weight:700;margin-bottom:4px;color:#0f3647">BILLED TO (BUYER):</div>
          <div style="font-weight:600">${order.billingAddress ? (order.billingAddress.legalName || order.businessName) : (order.businessName || 'Retail Customer')}</div>
          <div>${order.billingAddress ? order.billingAddress.address : 'Registered Address'}</div>
          <div>${order.billingAddress ? `${order.billingAddress.city}, ${order.billingAddress.state} - ${order.billingAddress.pincode}` : ''}</div>
          <div style="margin-top:4px">GSTIN: <strong>${order.gstin || (order.billingAddress && order.billingAddress.gstin) || 'UNREGISTERED (B2C)'}</strong></div>
        </div>
        <div>
          <div style="font-weight:700;margin-bottom:4px;color:#0f3647">DISPATCHED / SHIPPED TO:</div>
          <div style="font-weight:600">${order.shippingAddress ? (order.shippingAddress.facility || order.shippingAddress.contact || 'Main Location') : 'Main Facility'}</div>
          <div>${order.shippingAddress ? order.shippingAddress.address : ''}</div>
          <div>${order.shippingAddress ? `${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}` : ''}</div>
          <div style="margin-top:4px">Contact: <strong>${order.shippingAddress ? (order.shippingAddress.contact || '+91 98201 44821') : '-'}</strong></div>
        </div>
      </div>

      <table class="invoice-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Item Description</th>
            <th>SKU / HSN</th>
            <th>Qty</th>
            <th>Unit Rate</th>
            <th>Discount</th>
            <th>Taxable Amt</th>
          </tr>
        </thead>
        <tbody>
          ${(order.items || []).map((it, idx) => {
            const hsn = it.hsn || '90211000';
            const sku = it.sku || `OC-PROD-${idx + 1}`;
            const unit = it.unitPrice || it.price || 0;
            const amt = it.total || (unit * it.qty);
            return `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${it.name || it.productName || 'Orthopedic Support Item'}</strong></td>
                <td>${sku}<br><small style="color:#64748b">HSN: ${hsn}</small></td>
                <td><strong>${it.qty}</strong></td>
                <td>${formatPrice(unit)}</td>
                <td>${formatPrice(it.discount || 0)}</td>
                <td style="font-weight:700">${formatPrice(amt)}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div style="font-size:11px;color:#64748b;max-width:320px">
          <div><strong>Payment Terms:</strong> ${order.paymentMethod || '30-Day Approved B2B Credit'}</div>
          <div><strong>Status:</strong> ${order.paymentStatus || 'Verified & Invoiced'}</div>
          <div style="margin-top:12px">
            <em>This is a computer-generated tax invoice compliant with Indian GST Rules. No physical signature required.</em>
          </div>
        </div>

        <div class="invoice-totals">
          <div class="invoice-total-row">
            <span>Subtotal:</span>
            <span>${formatPrice(order.subtotal || order.total || 0)}</span>
          </div>
          ${order.bulkDiscount ? `
            <div class="invoice-total-row" style="color:#16a34a">
              <span>B2B Tier Discount:</span>
              <span>- ${formatPrice(order.bulkDiscount)}</span>
            </div>
          ` : ''}
          <div class="invoice-total-row">
            <span>Taxable Value:</span>
            <span>${formatPrice(order.taxableAmount || (order.total * 0.84))}</span>
          </div>
          ${order.gstType === 'IGST' ? `
            <div class="invoice-total-row">
              <span>IGST (18%):</span>
              <span>${formatPrice(order.igst || Math.round((order.taxableAmount || order.total) * 0.18))}</span>
            </div>
          ` : `
            <div class="invoice-total-row">
              <span>CGST (9%):</span>
              <span>${formatPrice(order.cgst || Math.round((order.taxableAmount || order.total) * 0.09))}</span>
            </div>
            <div class="invoice-total-row">
              <span>SGST (9%):</span>
              <span>${formatPrice(order.sgst || Math.round((order.taxableAmount || order.total) * 0.09))}</span>
            </div>
          `}
          <div class="invoice-total-row">
            <span>Freight & Handling:</span>
            <span>${order.shipping === 0 ? 'FREE (B2B)' : formatPrice(order.shipping || 0)}</span>
          </div>
          <div class="invoice-total-row grand">
            <span>Invoice Total:</span>
            <span>${formatPrice(order.total || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary btn-sm" id="btn-print-inv">🖨️ Print Invoice</button>
    <button class="btn btn-primary btn-sm" id="btn-dl-inv">⬇️ Download PDF</button>
    <button class="btn btn-secondary btn-sm" id="btn-close-inv">Close</button>
  `;

  const modal = showModal(`GST Invoice — ${order.id}`, contentHtml, footerHtml);

  document.getElementById('btn-print-inv')?.addEventListener('click', () => {
    window.print();
  });

  document.getElementById('btn-dl-inv')?.addEventListener('click', () => {
    showToast('GST Invoice PDF downloaded successfully!', 'success');
  });

  document.getElementById('btn-close-inv')?.addEventListener('click', () => {
    modal.close();
  });
}
