// ========================================
// OrthoCare — Reusable UI Components
// Professional Healthcare Design System
// ========================================

import { icons, renderStars, renderIcon } from '../data/icons.js';
import { formatPrice } from '../data/products.js';
import * as store from '../store.js';
import { navigate } from '../router.js';

// ---- Toast System ----
export function showToast(message, type = 'info', duration = 2500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let iconSvg = icons.info;
  if (type === 'success') iconSvg = icons.checkCircle;
  else if (type === 'error') iconSvg = icons.alertCircle;

  toast.innerHTML = `
    <span style="display:flex;align-items:center">${iconSvg}</span>
    <span class="toast-msg">${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 220);
  }, duration);
}

// Auto-listen for store toast events
store.on('toast', ({ message, type }) => showToast(message, type));

// ---- Customer Bottom Navigation (5 Tabs) ----
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

// ---- Wholesale B2B Bottom Navigation (Exactly 5 Tabs) ----
export function renderWholesaleBottomNav(activeTab = 'home') {
  const wholesaleCart = store.getWholesaleCart();
  const totalUnits = wholesaleCart.reduce((s, c) => s + c.qty, 0);

  const tabs = [
    { id: 'home', label: 'Home', icon: icons.home, route: 'wholesale/dashboard' },
    { id: 'catalog', label: 'Catalog', icon: icons.grid, route: 'wholesale/products' },
    { id: 'bulk', label: 'Bulk', icon: icons.bulk, route: 'wholesale/bulk-order' },
    { id: 'cart', label: 'Cart', icon: icons.cart, route: 'wholesale/cart', badge: totalUnits > 0 ? `${totalUnits}` : null },
    { id: 'business', label: 'Business', icon: icons.business, route: 'wholesale/profile' },
  ];

  const nav = document.createElement('nav');
  nav.className = 'bottom-nav b2b-nav';
  nav.innerHTML = tabs.map(tab => `
    <div class="bottom-nav-item ${tab.id === activeTab ? 'active' : ''}" data-route="${tab.route}">
      <span class="bottom-nav-icon">
        ${tab.icon}
        ${tab.badge ? `<span class="badge-dot">${tab.badge}</span>` : ''}
      </span>
      <span class="bottom-nav-label">${tab.label}</span>
    </div>
  `).join('');

  nav.querySelectorAll('.bottom-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      navigate(item.dataset.route);
    });
  });

  return nav;
}

// ---- Compact Back Header ----
export function renderBackHeader(title, actions = '') {
  const header = document.createElement('header');
  header.className = 'back-header';
  header.innerHTML = `
    <button class="back-btn" id="back-btn" aria-label="Go Back">${icons.back}</button>
    <h1 class="back-header-title">${title}</h1>
    <div style="display:flex;align-items:center;gap:6px">${actions}</div>
  `;
  header.querySelector('#back-btn').addEventListener('click', () => window.history.back());
  return header;
}

// ---- Product Card Component ----
export function renderProductCard(product, options = {}) {
  const inWishlist = store.isInWishlist(product.id);
  const card = document.createElement('div');
  card.className = 'product-card';
  
  const discountHtml = product.discount > 0 ? `<span class="product-card-discount">${product.discount}% OFF</span>` : '';
  const firstImage = (product.images && product.images.length > 0) ? product.images[0] : '';

  card.innerHTML = `
    <div class="product-card-thumb">
      ${discountHtml}
      <div class="product-card-wishlist">
        <button class="wishlist-btn ${inWishlist ? 'active' : ''}" data-pid="${product.id}" aria-label="Wishlist">
          ${inWishlist ? icons.heartFilled : icons.heart}
        </button>
      </div>
      ${firstImage 
        ? `<img src="${firstImage}" alt="${product.name}" loading="lazy" />`
        : `<div style="width:60px;height:60px;border-radius:12px;background:var(--primary-bg);display:flex;align-items:center;justify-content:center;color:var(--primary)">${icons.package}</div>`
      }
    </div>
    <div class="product-card-body">
      <div class="product-card-brand">OrthoCare ${product.category ? `• ${product.category}` : ''}</div>
      <div class="product-card-title">${product.name}</div>
      <div class="product-card-rating">
        ${renderStars(product.rating || 4.5)}
        <span>${product.rating || 4.5} (${product.reviews || 120})</span>
      </div>
      <div class="product-card-pricing">
        <span class="product-card-price">${formatPrice(product.price)}</span>
        ${product.mrp > product.price ? `<span class="product-card-mrp">${formatPrice(product.mrp)}</span>` : ''}
      </div>
    </div>
  `;

  // Wishlist toggle
  card.querySelector('.wishlist-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    store.toggleWishlist(product.id);
    const btn = card.querySelector('.wishlist-btn');
    const isNow = store.isInWishlist(product.id);
    btn.classList.toggle('active', isNow);
    btn.innerHTML = isNow ? icons.heartFilled : icons.heart;
  });

  // Navigate to product detail
  card.addEventListener('click', () => {
    navigate(`product/${product.id}`);
  });

  return card;
}

// ---- Product Carousel Section ----
export function renderProductCarousel(products, title, link = '') {
  const section = document.createElement('section');
  section.style.marginBottom = '24px';
  section.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:0 16px 12px">
      <h2 style="font-size:17px;font-weight:700;color:var(--text);margin:0">${title}</h2>
      ${link ? `<a href="${link}" style="font-size:12px;font-weight:600;color:var(--primary);display:flex;align-items:center;gap:4px">View All ${icons.chevronRight}</a>` : ''}
    </div>
    <div style="display:flex;gap:12px;overflow-x:auto;padding:0 16px 4px;-webkit-overflow-scrolling:touch" class="carousel-track"></div>
  `;
  const track = section.querySelector('.carousel-track');
  products.forEach(p => {
    const card = renderProductCard(p);
    card.style.minWidth = '165px';
    card.style.maxWidth = '165px';
    track.appendChild(card);
  });
  return section;
}

// ---- Reusable Empty State ----
export function renderEmptyState(arg1 = {}, arg2, arg3, arg4, arg5) {
  let icon = icons.package;
  let title = 'Nothing here yet';
  let desc = 'Discover certified orthopedic supports crafted for everyday mobility.';
  let ctaLabel = 'Browse Products';
  let ctaAction = () => navigate('categories');

  if (typeof arg1 === 'object' && arg1 !== null) {
    if (arg1.icon) icon = icons[arg1.icon] || arg1.icon;
    if (arg1.title) title = arg1.title;
    if (arg1.desc !== undefined) desc = arg1.desc;
    if (arg1.ctaLabel !== undefined) ctaLabel = arg1.ctaLabel;
    if (arg1.ctaAction) ctaAction = arg1.ctaAction;
  } else {
    if (typeof arg1 === 'string') {
      icon = icons[arg1] || (arg1.startsWith('<svg') ? arg1 : icons.package);
    }
    if (arg2) title = arg2;
    if (arg3 !== undefined) desc = arg3;
    if (arg4 !== undefined) ctaLabel = arg4;
    if (arg5) ctaAction = arg5;
  }

  const el = document.createElement('div');
  el.className = 'empty-state';
  el.innerHTML = `
    <div class="empty-state-icon">${icon}</div>
    <div class="empty-state-title">${title}</div>
    <p class="empty-state-desc">${desc}</p>
    ${ctaLabel ? `<button class="btn btn-primary" id="empty-btn">${ctaLabel}</button>` : ''}
  `;

  if (ctaLabel && ctaAction) {
    el.querySelector('#empty-btn')?.addEventListener('click', ctaAction);
  }
  return el;
}

// ---- Reusable Skeleton Grid ----
export function renderSkeletonGrid(count = 4) {
  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = '1fr 1fr';
  grid.style.gap = '12px';
  grid.style.padding = '16px';

  for (let i = 0; i < count; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.padding = '0';
    card.style.overflow = 'hidden';
    card.innerHTML = `
      <div class="skeleton" style="height:150px;width:100%"></div>
      <div style="padding:12px;display:flex;flex-direction:column;gap:8px">
        <div class="skeleton" style="height:12px;width:50%"></div>
        <div class="skeleton" style="height:14px;width:90%"></div>
        <div class="skeleton" style="height:16px;width:40%"></div>
      </div>
    `;
    grid.appendChild(card);
  }
  return grid;
}

// ---- Modal Component ----
export function showModal(title, contentHtml, footerHtml = '') {
  let container = document.getElementById('modal-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'modal-container';
    document.body.appendChild(container);
  }

  container.innerHTML = `
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal-content">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid var(--border)">
          <h3 style="font-size:16px;font-weight:700;color:var(--text);margin:0">${title}</h3>
          <button id="modal-close" style="width:32px;height:32px;min-height:32px;border-radius:var(--radius-sm);color:var(--text-secondary);display:flex;align-items:center;justify-content:center">
            ${icons.close}
          </button>
        </div>
        <div style="padding:20px;overflow-y:auto;flex:1">${contentHtml}</div>
        ${footerHtml ? `<div style="display:flex;justify-content:flex-end;gap:10px;padding:12px 20px;border-top:1px solid var(--border);background:var(--background)">${footerHtml}</div>` : ''}
      </div>
    </div>
  `;

  const close = () => { container.innerHTML = ''; };
  container.querySelector('#modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') close();
  });
  container.querySelector('#modal-close')?.addEventListener('click', close);
  return { close, container };
}

// ========================================
// Universal Demo Role Switcher (Compact Floating Docked Pill)
// Positions safely without covering content or buttons
// ========================================
export function initUniversalDemoRoleSwitcher() {
  if (document.getElementById('universal-demo-switcher')) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'universal-demo-switcher';
  wrapper.className = 'demo-role-pill';

  function renderPill() {
    const currentRole = store.getRole();
    const wholesaleUser = store.getWholesaleUser();
    const isPending = wholesaleUser && wholesaleUser.status === 'pending';

    let roleIcon = icons.user;
    let label = 'Customer';
    if (currentRole === 'admin') {
      roleIcon = icons.shield;
      label = 'Admin';
    } else if (currentRole === 'wholesale') {
      roleIcon = icons.building;
      label = isPending ? 'B2B (Pending)' : 'Wholesale';
    }

    wrapper.innerHTML = `
      <div class="demo-role-pill-trigger" id="demo-pill-trigger" title="Switch Demo Perspective">
        <span style="display:flex;align-items:center">${roleIcon}</span>
        <span>${label}</span>
        <span style="display:flex;align-items:center;opacity:0.7">${icons.chevronUp}</span>
      </div>

      <div class="demo-role-menu" id="demo-role-menu">
        <div class="demo-role-menu-title">Switch Perspective</div>

        <div class="demo-role-menu-item ${currentRole === 'customer' ? 'active' : ''}" data-target="customer">
          <div style="display:flex;align-items:center;gap:8px">
            <span>${icons.user}</span>
            <span>Retail Customer</span>
          </div>
          ${currentRole === 'customer' ? icons.check : ''}
        </div>

        <div class="demo-role-menu-item ${currentRole === 'wholesale' && !isPending ? 'active' : ''}" data-target="wholesale-verified">
          <div style="display:flex;align-items:center;gap:8px">
            <span>${icons.building}</span>
            <span>Wholesale (Verified)</span>
          </div>
          ${currentRole === 'wholesale' && !isPending ? icons.check : ''}
        </div>

        <div class="demo-role-menu-item ${currentRole === 'wholesale' && isPending ? 'active' : ''}" data-target="wholesale-pending">
          <div style="display:flex;align-items:center;gap:8px">
            <span>${icons.clock}</span>
            <span>Wholesale (Pending)</span>
          </div>
          ${currentRole === 'wholesale' && isPending ? icons.check : ''}
        </div>

        <div class="demo-role-menu-item ${currentRole === 'admin' ? 'active' : ''}" data-target="admin">
          <div style="display:flex;align-items:center;gap:8px">
            <span>${icons.shield}</span>
            <span>Admin Portal</span>
          </div>
          ${currentRole === 'admin' ? icons.check : ''}
        </div>
      </div>
    `;

    const trigger = wrapper.querySelector('#demo-pill-trigger');
    const menu = wrapper.querySelector('#demo-role-menu');

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        menu.classList.remove('open');
      }
    });

    wrapper.querySelectorAll('.demo-role-menu-item').forEach(item => {
      item.addEventListener('click', () => {
        const target = item.dataset.target;
        menu.classList.remove('open');
        if (target === 'customer') {
          store.setRole('customer');
          navigate('home');
        } else if (target === 'wholesale-verified') {
          store.setRole('wholesale');
          const verifiedUser = store.getWholesaleBuyers().find(b => b.status === 'verified');
          if (verifiedUser) store.setWholesaleUser(verifiedUser);
          navigate('wholesale/dashboard');
        } else if (target === 'wholesale-pending') {
          store.setRole('wholesale');
          const pendingUser = store.getWholesaleBuyers().find(b => b.status === 'pending');
          if (pendingUser) store.setWholesaleUser(pendingUser);
          navigate('wholesale/verification-pending');
        } else if (target === 'admin') {
          store.setRole('admin');
          navigate('admin/dashboard');
        }
        renderPill();
      });
    });
  }

  renderPill();
  document.body.appendChild(wrapper);

  store.on('role:changed', renderPill);
  store.on('wholesaleUser:changed', renderPill);
}

// ========================================
// GST Tax Invoice Modal (Clean & Print-Ready)
// ========================================
export function showGSTTaxInvoiceModal(order) {
  if (!order) return;

  const contentHtml = `
    <div class="invoice-container" id="printable-invoice">
      <div class="invoice-header">
        <div>
          <div class="invoice-title">OrthoCare Healthcare India Pvt Ltd</div>
          <div style="font-size:12px;color:var(--text-secondary)">Certified Orthopedic & Rehabilitation Supplies</div>
          <div style="font-size:11px;color:var(--text-secondary);margin-top:4px">
            GSTIN: <strong>07AAFCO9918K1ZZ</strong> | CIN: U85110DL2024PTC391024<br>
            Plot 104, Okhla Industrial Area Phase III, New Delhi 110020
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-size:16px;font-weight:800;color:var(--primary)">TAX INVOICE</div>
          <div>Invoice No: <strong>INV-${order.id}</strong></div>
          <div>Date: <strong>${order.date || '14 Sep 2026'}</strong></div>
          <div>Place of Supply: <strong>${order.shippingAddress ? (order.shippingAddress.state || 'Delhi') : 'Delhi'}</strong></div>
        </div>
      </div>

      <div class="invoice-grid">
        <div>
          <div style="font-weight:700;margin-bottom:4px;color:var(--deep-navy)">BILLED TO (BUYER):</div>
          <div style="font-weight:600">${order.billingAddress ? (order.billingAddress.legalName || order.businessName) : (order.businessName || 'Retail Customer')}</div>
          <div>${order.billingAddress ? order.billingAddress.address : 'Registered Address'}</div>
          <div>${order.billingAddress ? `${order.billingAddress.city}, ${order.billingAddress.state} - ${order.billingAddress.pincode}` : ''}</div>
          <div style="margin-top:4px">GSTIN: <strong>${order.gstin || (order.billingAddress && order.billingAddress.gstin) || 'UNREGISTERED (B2C)'}</strong></div>
        </div>
        <div>
          <div style="font-weight:700;margin-bottom:4px;color:var(--deep-navy)">DISPATCHED TO:</div>
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
                <td>${sku}<br><small style="color:var(--text-secondary)">HSN: ${hsn}</small></td>
                <td><strong>${it.qty}</strong></td>
                <td>${formatPrice(unit)}</td>
                <td>${formatPrice(it.discount || 0)}</td>
                <td style="font-weight:700">${formatPrice(amt)}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px">
        <div style="font-size:11px;color:var(--text-secondary);max-width:320px">
          <div><strong>Payment Terms:</strong> ${order.paymentMethod || '30-Day Approved B2B Credit'}</div>
          <div><strong>Status:</strong> ${order.paymentStatus || 'Verified & Invoiced'}</div>
          <div style="margin-top:8px">
            <em>This is a computer-generated tax invoice compliant with Indian GST Rules. No physical signature required.</em>
          </div>
        </div>

        <div class="invoice-totals">
          <div class="invoice-total-row">
            <span>Subtotal:</span>
            <span>${formatPrice(order.subtotal || order.total || 0)}</span>
          </div>
          ${order.bulkDiscount ? `
            <div class="invoice-total-row" style="color:var(--success)">
              <span>Tier Savings:</span>
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
            <span>${order.shipping === 0 ? 'FREE' : formatPrice(order.shipping || 0)}</span>
          </div>
          <div class="invoice-total-row grand">
            <span>Total Payable:</span>
            <span>${formatPrice(order.total || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary btn-sm" id="btn-print-inv">
      ${icons.printer} Print Invoice
    </button>
    <button class="btn btn-primary btn-sm" id="btn-dl-inv">
      ${icons.download} Download PDF
    </button>
    <button class="btn btn-ghost btn-sm" id="btn-close-inv">Close</button>
  `;

  const modal = showModal(`GST Tax Invoice — ${order.id}`, contentHtml, footerHtml);

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
