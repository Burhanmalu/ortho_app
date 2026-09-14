// ========================================
// Admin Order Management Screen (Retail & Wholesale)
// Status Pills + Clean Channel Tabs + Invoice Modal
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { formatPrice } from '../../data/products.js';
import { icons } from '../../data/icons.js';
import { renderAdminLayout } from './AdminLayout.js';
import { showGSTTaxInvoiceModal } from '../../components/index.js';

export default function AdminOrdersScreen(appEl, initialChannel = 'wholesale') {
  const content = document.createElement('div');

  let activeChannel = initialChannel; // 'wholesale' | 'retail'

  content.innerHTML = `
    <!-- Header with Channel Switcher -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px">
      <div>
        <h1 style="font-size:22px;font-weight:700;color:var(--text);margin:0 0 2px">Order Management</h1>
        <div style="font-size:13px;color:var(--text-secondary)">Fulfill B2C consumer dispatches and B2B hospital bulk freight</div>
      </div>
      <div style="display:flex;gap:8px" id="order-channel-tabs">
        <button class="btn ${activeChannel === 'wholesale' ? 'btn-primary' : 'btn-secondary'} btn-sm" id="tab-btn-wholesale">
          ${icons.building} Wholesale Orders (${store.getWholesaleOrders().length})
        </button>
        <button class="btn ${activeChannel === 'retail' ? 'btn-primary' : 'btn-secondary'} btn-sm" id="tab-btn-retail">
          ${icons.cart} Retail Orders (${store.getOrders().length})
        </button>
      </div>
    </div>

    <!-- Orders Table / Cards -->
    <div class="admin-table-container">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Order Ref</th>
            <th>Date</th>
            <th>Customer / Entity</th>
            <th>Items / Volume</th>
            <th>Amount</th>
            <th>Status Pill</th>
            <th style="text-align:right">Actions</th>
          </tr>
        </thead>
        <tbody id="orders-tbody"></tbody>
      </table>
    </div>
  `;

  function getStatusClass(status) {
    const s = (status || '').toLowerCase();
    if (s === 'delivered' || s === 'completed') return 'success';
    if (s === 'processing' || s === 'shipped' || s === 'out for delivery' || s === 'confirmed') return 'processing';
    if (s === 'cancelled' || s === 'refunded') return 'danger';
    return 'warning';
  }

  function renderOrdersTable() {
    const tbody = content.querySelector('#orders-tbody');

    if (activeChannel === 'wholesale') {
      const orders = store.getWholesaleOrders();
      tbody.innerHTML = orders.map(o => {
        const totalUnits = (o.items || []).reduce((s, it) => s + it.qty, 0);
        return `
          <tr>
            <td data-label="Order Ref">
              <strong style="color:var(--primary);font-size:13px">${o.id}</strong>
              <div style="font-size:11px;color:var(--text-secondary)">Tax Inv: INV-${o.id}</div>
            </td>
            <td data-label="Date">${o.date || '14 Sep 2026'}</td>
            <td data-label="Entity">
              <strong style="color:var(--text)">${o.businessName}</strong>
              <div style="font-size:11px;color:var(--text-secondary)">GSTIN: ${o.gstin}</div>
            </td>
            <td data-label="Volume">
              <strong>${totalUnits} Units</strong> (${(o.items || []).length} SKUs)
            </td>
            <td data-label="Amount">
              <strong>${formatPrice(o.total)}</strong>
              <div style="font-size:10px;color:var(--text-secondary)">18% GST Included</div>
            </td>
            <td data-label="Status">
              <span class="status-pill ${getStatusClass(o.status)}">${o.status.toUpperCase()}</span>
            </td>
            <td data-label="Actions" style="text-align:right">
              <button class="btn btn-secondary btn-sm btn-view-invoice" data-id="${o.id}">
                ${icons.fileText} Tax Invoice
              </button>
            </td>
          </tr>
        `;
      }).join('');
    } else {
      const orders = store.getOrders();
      if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:36px;color:var(--text-secondary)">No retail orders placed yet.</td></tr>`;
        return;
      }
      tbody.innerHTML = orders.map(o => {
        const totalUnits = (o.items || []).reduce((s, it) => s + it.qty, 0);
        return `
          <tr>
            <td data-label="Order Ref">
              <strong style="color:var(--primary);font-size:13px">${o.id}</strong>
            </td>
            <td data-label="Date">${o.date || 'Today'}</td>
            <td data-label="Customer">
              <strong style="color:var(--text)">${o.shippingAddress ? o.shippingAddress.name : 'Patient / Retail'}</strong>
              <div style="font-size:11px;color:var(--text-secondary)">${o.shippingAddress ? o.shippingAddress.city : 'Indore'}</div>
            </td>
            <td data-label="Items">
              <strong>${totalUnits} Units</strong> (${(o.items || []).length} Items)
            </td>
            <td data-label="Amount">
              <strong>${formatPrice(o.total)}</strong>
            </td>
            <td data-label="Status">
              <span class="status-pill ${getStatusClass(o.status || 'Confirmed')}">${(o.status || 'Confirmed').toUpperCase()}</span>
            </td>
            <td data-label="Actions" style="text-align:right">
              <button class="btn btn-secondary btn-sm btn-view-invoice" data-id="${o.id}">
                ${icons.fileText} Details
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    tbody.querySelectorAll('.btn-view-invoice').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.dataset.id;
        const allOrders = [...store.getWholesaleOrders(), ...store.getOrders()];
        const targetOrder = allOrders.find(x => String(x.id) === String(orderId));
        if (targetOrder) {
          showGSTTaxInvoiceModal(targetOrder);
        }
      });
    });
  }

  content.querySelector('#tab-btn-wholesale').addEventListener('click', () => {
    activeChannel = 'wholesale';
    content.querySelector('#tab-btn-wholesale').className = 'btn btn-primary btn-sm';
    content.querySelector('#tab-btn-retail').className = 'btn btn-secondary btn-sm';
    renderOrdersTable();
  });

  content.querySelector('#tab-btn-retail').addEventListener('click', () => {
    activeChannel = 'retail';
    content.querySelector('#tab-btn-retail').className = 'btn btn-primary btn-sm';
    content.querySelector('#tab-btn-wholesale').className = 'btn btn-secondary btn-sm';
    renderOrdersTable();
  });

  renderOrdersTable();

  const layout = renderAdminLayout(activeChannel === 'wholesale' ? 'wholesale-orders' : 'orders', content);
  appEl.appendChild(layout);
  return layout;
}
