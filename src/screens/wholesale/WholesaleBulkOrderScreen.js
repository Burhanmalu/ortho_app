// ========================================
// Wholesale Bulk Order Matrix Pad Screen
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { products, formatPrice, getWholesaleTierPrice } from '../../data/products.js';
import { renderBackHeader, renderWholesaleBottomNav } from '../../components/index.js';

export default function WholesaleBulkOrderScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen-content';
  el.style.background = '#f8fafc';

  // State of matrix: map of productId -> quantity (default 0 or pre-filled for popular items)
  const orderPad = {};
  // Pre-fill a few sample items to give a rich experience immediately
  const samplePicks = ['OC0001', 'OC0013', 'OC0025', 'OC0037', 'OC0085'];
  products.slice(0, 15).forEach(p => {
    if (samplePicks.includes(p.id)) {
      orderPad[p.id] = p.moq;
    } else {
      orderPad[p.id] = 0;
    }
  });

  el.appendChild(renderBackHeader('Quick Bulk Order Matrix', () => navigate('wholesale/dashboard')));

  el.innerHTML += `
    <div style="padding-bottom:130px">
      <!-- Instruction Banner -->
      <div style="background:#0f3647; color:#ffffff; padding:14px 20px">
        <h2 style="font-size:16px; font-weight:800; margin:0 0 4px">Matrix Order Pad for Clinics & Pharmacies</h2>
        <p style="font-size:12px; opacity:0.85; margin:0">
          Enter quantities for multiple orthopedic items simultaneously. Volume tier rates and 18% GST compute automatically.
        </p>
      </div>

      <!-- Quick Action Toolbar -->
      <div style="padding:10px 16px; display:flex; justify-content:space-between; align-items:center; background:#ffffff; border-bottom:1px solid #e2e8f0">
        <span style="font-size:12px; font-weight:700; color:#475569">15 Fast-Moving Items</span>
        <button id="btn-clear-matrix" style="background:none; border:none; color:#dc2626; font-size:11px; font-weight:700; cursor:pointer">
          ✕ Clear Quantities
        </button>
      </div>

      <!-- Bulk Table Matrix -->
      <div class="bulk-matrix-table-container">
        <table class="bulk-matrix-table">
          <thead>
            <tr>
              <th style="width:40px">#</th>
              <th>Product Description</th>
              <th>SKU / MOQ</th>
              <th style="text-align:center">Qty (Units)</th>
              <th style="text-align:right">Tier Rate</th>
              <th style="text-align:right">Amount</th>
            </tr>
          </thead>
          <tbody id="matrix-tbody"></tbody>
        </table>
      </div>

      <!-- Sticky Matrix Bottom Summary Bar -->
      <div style="position:fixed; bottom:55px; left:0; right:0; background:#ffffff; border-top:2px solid #0f3647; padding:12px 20px; z-index:100; box-shadow:0 -4px 16px rgba(0,0,0,0.06); max-width:800px; margin:0 auto">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; font-size:12px">
          <div>
            <span style="color:#64748b">Total Items: <strong id="sum-items-count" style="color:#0f172a">0</strong></span> • 
            <span style="color:#64748b">Total Units: <strong id="sum-units-count" style="color:#0f172a">0</strong></span>
          </div>
          <div style="text-align:right">
            <span style="color:#64748b">Net Payable (Inc. 18% GST):</span>
            <div style="font-size:18px; font-weight:800; color:#0f3647" id="sum-grand-total">₹0</div>
          </div>
        </div>

        <button id="btn-submit-bulk-order" class="btn btn-primary btn-pill" style="width:100%; padding:12px; font-weight:800; font-size:14px">
          Proceed to Wholesale Checkout →
        </button>
      </div>
    </div>
  `;

  function renderTableRows() {
    const tbody = el.querySelector('#matrix-tbody');
    tbody.innerHTML = products.slice(0, 15).map((p, idx) => {
      const q = orderPad[p.id] || 0;
      const rate = getWholesaleTierPrice(p, q > 0 ? q : p.moq);
      const rowTotal = q * rate;
      const isSelected = q > 0;

      return `
        <tr style="background:${isSelected ? '#f0fdf4' : 'transparent'}">
          <td>${idx + 1}</td>
          <td>
            <div style="font-weight:700; color:#0f172a">${p.name}</div>
            <div style="font-size:11px; color:#64748b">${p.material}</div>
          </td>
          <td>
            <span style="font-weight:600">${p.sku}</span><br>
            <span style="font-size:11px; color:#2563eb">MOQ: ${p.moq}</span>
          </td>
          <td style="text-align:center">
            <input type="number" class="bulk-qty-input matrix-qty-input" data-id="${p.id}" data-moq="${p.moq}" value="${q}" min="0" step="5">
          </td>
          <td style="text-align:right; font-weight:600">
            ${formatPrice(rate)}
          </td>
          <td style="text-align:right; font-weight:800; color:${isSelected ? '#15803d' : '#94a3b8'}">
            ${formatPrice(rowTotal)}
          </td>
        </tr>
      `;
    }).join('');

    // Attach listeners on inputs
    tbody.querySelectorAll('.matrix-qty-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const id = input.dataset.id;
        const moq = Number(input.dataset.moq) || 10;
        let val = Number(e.target.value) || 0;
        if (val > 0 && val < moq) {
          store.emitter.emit('toast', { message: `Minimum order for this item is ${moq} units`, type: 'info' });
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

    el.querySelector('#sum-items-count').textContent = activeItems;
    el.querySelector('#sum-units-count').textContent = totalUnits;
    el.querySelector('#sum-grand-total').textContent = formatPrice(grand);
  }

  el.querySelector('#btn-clear-matrix').addEventListener('click', () => {
    Object.keys(orderPad).forEach(k => orderPad[k] = 0);
    renderTableRows();
    updateSummary();
  });

  el.querySelector('#btn-submit-bulk-order').addEventListener('click', () => {
    // Populate wholesale cart
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
      store.emitter.emit('toast', { message: 'Please enter quantity for at least one item', type: 'error' });
      return;
    }

    navigate('wholesale/checkout');
  });

  renderTableRows();
  updateSummary();

  el.appendChild(renderWholesaleBottomNav('bulk-order'));
  appEl.appendChild(el);
  return el;
}
