// ========================================
// Admin Order Management (Retail & Wholesale)
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { formatPrice } from '../../data/products.js';
import { renderAdminLayout } from './AdminLayout.js';
import { showGSTTaxInvoiceModal, showModal } from '../../components/index.js';

export default function AdminOrdersScreen(appEl, initialChannel = 'wholesale') {
  const content = document.createElement('div');

  let activeChannel = initialChannel; // 'retail' | 'wholesale'

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px; flex-wrap:wrap; gap:12px">
      <div>
        <h1 style="font-size:24px; font-weight:800; color:#0f172a; margin:0 0 4px">Order Processing & Fulfillment</h1>
        <div style="font-size:13px; color:#64748b">Fulfill retail dispatches and allocate wholesale heavy cargo freight</div>
      </div>
      <div style="display:flex; gap:8px">
        <button class="filter-chip ${activeChannel === 'wholesale' ? 'active' : ''}" id="tab-btn-wholesale">
          🏢 Wholesale B2B Orders (${store.getWholesaleOrders().length})
        </button>
        <button class="filter-chip ${activeChannel === 'retail' ? 'active' : ''}" id="tab-btn-retail">
          🛒 Retail B2C Orders (${store.getOrders().length})
        </button>
      </div>
    </div>

    <div class="admin-card">
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer / Buyer</th>
              <th>Items & Units</th>
              <th>Total Amount</th>
              <th>Current Status</th>
              <th style="text-align:right">Update Status & Invoicing</th>
            </tr>
          </thead>
          <tbody id="orders-tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  function renderOrdersTable() {
    const tbody = content.querySelector('#orders-tbody');

    if (activeChannel === 'wholesale') {
      const orders = store.getWholesaleOrders();
      tbody.innerHTML = orders.map(o => {
        const totalUnits = (o.items || []).reduce((s, it) => s + it.qty, 0);
        return `
          <tr>
            <td>
              <strong style="color:#0f3647; font-size:14px">${o.id}</strong><br>
              <small style="color:#64748b">INV-${o.id}</small>
            </td>
            <td>${o.date}</td>
            <td>
              <strong style="color:#0f172a">${o.businessName}</strong><br>
              <small style="color:#64748b">GSTIN: ${o.gstin}</small>
            </td>
            <td>
              <strong>${totalUnits} Units</strong><br>
              <small style="color:#64748b">${(o.items || []).length} SKU(s)</small>
            </td>
            <td>
              <strong style="color:#0f172a">${formatPrice(o.total)}</strong><br>
              <small style="color:#16a34a">GST 18% Inc.</small>
            </td>
            <td>
              <span class="admin-status-badge ${o.status}">
                ● ${o.status.toUpperCase()}
              </span>
            </td>
            <td style="text-align:right">
              <div style="display:flex; gap:6px; justify-content:flex-end">
                <button class="admin-btn admin-btn-secondary admin-btn-sm btn-view-b2b-inv" data-id="${o.id}">
                  🧾 Invoice
                </button>
                <select class="select-order-status input" data-id="${o.id}" data-type="wholesale" style="font-size:11px; padding:4px 8px; width:120px">
                  <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pending</option>
                  <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>Processing</option>
                  <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                  <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                  <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      tbody.querySelectorAll('.btn-view-b2b-inv').forEach(btn => {
        btn.addEventListener('click', () => {
          const ord = orders.find(o => o.id === btn.dataset.id);
          if (ord) showGSTTaxInvoiceModal(ord);
        });
      });

    } else {
      const orders = store.getOrders();
      tbody.innerHTML = orders.map(o => {
        const totalUnits = (o.items || []).reduce((s, it) => s + it.qty, 0);
        return `
          <tr>
            <td><strong>${o.id}</strong></td>
            <td>${o.date}</td>
            <td>
              <strong>Rahul Sharma</strong><br>
              <small style="color:#64748b">Delhi • ${o.address}</small>
            </td>
            <td>${totalUnits} unit(s)</td>
            <td><strong>${formatPrice(o.total)}</strong></td>
            <td><span class="admin-status-badge ${o.status}">● ${o.status.toUpperCase()}</span></td>
            <td style="text-align:right">
              <div style="display:flex; gap:6px; justify-content:flex-end">
                <select class="select-order-status input" data-id="${o.id}" data-type="retail" style="font-size:11px; padding:4px 8px; width:120px">
                  <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>Processing</option>
                  <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                  <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                  <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Status change handler
    tbody.querySelectorAll('.select-order-status').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = sel.dataset.id;
        const type = sel.dataset.type;
        const newStatus = e.target.value;

        if (type === 'wholesale') {
          if (newStatus === 'shipped') {
            const awb = prompt('Enter Blue Dart / GATI Consignment AWB:', 'BLUEDT-WHO-' + Math.floor(100000 + Math.random() * 900000));
            store.updateWholesaleOrderStatus(id, newStatus, awb ? { awb, status: 'In Transit — Heavy Freight Dispatched' } : null);
          } else {
            store.updateWholesaleOrderStatus(id, newStatus);
          }
        } else {
          store.updateRetailOrderStatus(id, newStatus);
        }
        renderOrdersTable();
      });
    });
  }

  content.querySelector('#tab-btn-wholesale').addEventListener('click', () => {
    activeChannel = 'wholesale';
    content.querySelector('#tab-btn-wholesale').classList.add('active');
    content.querySelector('#tab-btn-retail').classList.remove('active');
    renderOrdersTable();
  });

  content.querySelector('#tab-btn-retail').addEventListener('click', () => {
    activeChannel = 'retail';
    content.querySelector('#tab-btn-retail').classList.add('active');
    content.querySelector('#tab-btn-wholesale').classList.remove('active');
    renderOrdersTable();
  });

  renderOrdersTable();

  const fullLayout = renderAdminLayout(activeChannel === 'wholesale' ? 'wholesale-orders' : 'orders', content);
  appEl.appendChild(fullLayout);
  return fullLayout;
}
