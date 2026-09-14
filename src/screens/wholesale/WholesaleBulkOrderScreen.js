// ========================================
// Wholesale Bulk Order Matrix Pad Screen - Redesigned
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { products, formatPrice, getWholesaleTierPrice } from '../../data/products.js';
import { icons } from '../../data/icons.js';
import { renderBackHeader, renderWholesaleBottomNav } from '../../components/index.js';

export default function WholesaleBulkOrderScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen-content';
  el.style.background = 'var(--bg-light)';
  el.style.paddingBottom = '160px'; // Space for sticky matrix summary & bottom nav

  const orderPad = {};
  const samplePicks = ['OC0001', 'OC0013', 'OC0025', 'OC0037', 'OC0085'];
  products.slice(0, 15).forEach(p => {
    if (samplePicks.includes(p.id)) {
      orderPad[p.id] = p.moq;
    } else {
      orderPad[p.id] = 0;
    }
  });

  el.appendChild(renderBackHeader('Quick Bulk Order Matrix', () => navigate('wholesale/dashboard')));

  const container = document.createElement('div');
  container.style.maxWidth = '800px';
  container.style.margin = '0 auto';

  container.innerHTML = `
    <!-- Instruction Banner -->
    <div style="background:var(--deep-navy); color:var(--text-white); padding:16px 20px">
      <h2 style="font-size:15px; font-weight:700; margin:0 0 4px">Matrix Order Pad for Clinics & Pharmacies</h2>
      <p style="font-size:12px; color:var(--border); margin:0; line-height:1.4">
        Enter quantities for multiple orthopedic items simultaneously. Volume tier rates and 18% GST compute automatically.
      </p>
    </div>

    <!-- Quick Action Toolbar -->
    <div style="padding:12px 16px; display:flex; justify-content:space-between; align-items:center; background:var(--bg-white); border-bottom:1px solid var(--border)">
      <span style="font-size:12px; font-weight:700; color:var(--text-secondary)">15 Fast-Moving Clinical Items</span>
      <button id="btn-clear-matrix" style="background:none; border:none; color:var(--danger); font-size:11px; font-weight:600; cursor:pointer">
        Clear Quantities
      </button>
    </div>

    <!-- Bulk Table Matrix -->
    <div class="bulk-matrix-table-container" style="background:var(--bg-white); overflow-x:auto; -webkit-overflow-scrolling:touch">
      <table class="bulk-matrix-table" style="width:100%; border-collapse:collapse; font-size:12px">
        <thead>
          <tr style="background:var(--bg-light); border-bottom:1px solid var(--border); text-align:left">
            <th style="padding:10px 12px; width:36px; color:var(--text-secondary)">#</th>
            <th style="padding:10px 12px; color:var(--text)">Item Description</th>
            <th style="padding:10px 12px; color:var(--text)">SKU / MOQ</th>
            <th style="padding:10px 12px; text-align:center; color:var(--text)">Qty</th>
            <th style="padding:10px 12px; text-align:right; color:var(--text)">Tier Rate</th>
            <th style="padding:10px 12px; text-align:right; color:var(--text)">Total</th>
          </tr>
        </thead>
        <tbody id="matrix-tbody"></tbody>
      </table>
    </div>

    <!-- Sticky Matrix Bottom Summary Bar -->
    <div style="position:fixed; bottom:var(--bottom-nav-height); left:0; right:0; background:var(--bg-white); border-top:1px solid var(--border); padding:12px 16px; z-index:45; box-shadow:var(--shadow-lg); max-width:800px; margin:0 auto">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; font-size:12px">
        <div>
          <span style="color:var(--text-secondary)">Items: <strong id="sum-items-count" style="color:var(--text)">0</strong></span> • 
          <span style="color:var(--text-secondary)">Units: <strong id="sum-units-count" style="color:var(--text)">0</strong></span>
        </div>
        <div style="text-align:right">
          <span style="font-size:11px; color:var(--text-secondary)">Total (Inc. 18% GST):</span>
          <div style="font-size:16px; font-weight:800; color:var(--primary)" id="sum-grand-total">₹0</div>
        </div>
      </div>

      <button id="btn-submit-bulk-order" class="btn btn-primary btn-block" style="height:44px; font-weight:700; font-size:14px">
        Proceed to Wholesale Checkout
      </button>
    </div>
  `;

  el.appendChild(container);

  function renderTableRows() {
    const tbody = el.querySelector('#matrix-tbody');
    tbody.innerHTML = products.slice(0, 15).map((p, idx) => {
      const q = orderPad[p.id] || 0;
      const rate = getWholesaleTierPrice(p, q > 0 ? q : p.moq);
      const rowTotal = q * rate;
      const isSelected = q > 0;

      return `
        <tr style="background:${isSelected ? 'rgba(57, 169, 107, 0.06)' : 'transparent'}; border-bottom:1px solid var(--border)">
          <td style="padding:10px 12px; color:var(--text-secondary)">${idx + 1}</td>
          <td style="padding:10px 12px">
            <div style="font-weight:700; color:var(--text)">${p.name}</div>
            <div style="font-size:11px; color:var(--text-secondary); margin-top:2px">${p.categoryName || 'Support'}</div>
          </td>
          <td style="padding:10px 12px; white-space:nowrap">
            <span style="font-weight:600; color:var(--text)">${p.sku}</span><br>
            <span style="font-size:11px; color:var(--primary)">MOQ: ${p.moq}</span>
          </td>
          <td style="padding:10px 12px; text-align:center">
            <input type="number" class="matrix-qty-input" data-id="${p.id}" data-moq="${p.moq}" value="${q}" min="0" step="5" style="width:64px; padding:6px; border:1px solid var(--border); border-radius:var(--radius-sm); text-align:center; font-weight:700; font-size:13px" />
          </td>
          <td style="padding:10px 12px; text-align:right; font-weight:600; color:var(--text)">
            ${formatPrice(rate)}
          </td>
          <td style="padding:10px 12px; text-align:right; font-weight:700; color:${isSelected ? 'var(--primary)' : 'var(--text-secondary)'}">
            ${formatPrice(rowTotal)}
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.matrix-qty-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const id = input.dataset.id;
        const moq = Number(input.dataset.moq) || 10;
        let val = Number(e.target.value) || 0;
        if (val > 0 && val < moq) {
          store.emit('toast', { message: `Minimum order for this item is ${moq} units`, type: 'info' });
          val = moq;
          input.value = moq;
        }
        orderPad[id] = val;
        renderTableRows();
        updateSummary();
      });
    });
  }

  function updateSummary() {
    let activeItems = 0;
    let totalUnits = 0;
    let subtotal = 0;

    Object.keys(orderPad).forEach(id => {
      const q = orderPad[id];
      if (q > 0) {
        activeItems++;
        totalUnits += q;
        const p = products.find(prod => prod.id === id);
        if (p) {
          const rate = getWholesaleTierPrice(p, q);
          subtotal += (rate * q);
        }
      }
    });

    const gst = Math.round(subtotal * 0.18);
    const shipping = subtotal > 15000 || totalUnits >= 25 ? 0 : 750;
    const grand = subtotal + gst + shipping;

    const itemsCountEl = el.querySelector('#sum-items-count');
    const unitsCountEl = el.querySelector('#sum-units-count');
    const grandTotalEl = el.querySelector('#sum-grand-total');

    if (itemsCountEl) itemsCountEl.textContent = activeItems;
    if (unitsCountEl) unitsCountEl.textContent = totalUnits;
    if (grandTotalEl) grandTotalEl.textContent = formatPrice(grand);
  }

  el.querySelector('#btn-clear-matrix')?.addEventListener('click', () => {
    Object.keys(orderPad).forEach(k => orderPad[k] = 0);
    renderTableRows();
    updateSummary();
  });

  el.querySelector('#btn-submit-bulk-order')?.addEventListener('click', () => {
    let addedCount = 0;
    store.clearWholesaleCart();

    Object.keys(orderPad).forEach(id => {
      const q = orderPad[id];
      if (q > 0) {
        store.addToWholesaleCart(id, q);
        addedCount++;
      }
    });

    if (addedCount === 0) {
      store.emit('toast', { message: 'Please enter quantity for at least one item', type: 'error' });
      return;
    }

    navigate('wholesale/checkout');
  });

  renderTableRows();
  updateSummary();

  const nav = renderWholesaleBottomNav('bulk-order');
  el.appendChild(nav);
  appEl.appendChild(el);

  return { 
    unmount() { 
      if (nav._unsub) nav._unsub(); 
    } 
  };
}
