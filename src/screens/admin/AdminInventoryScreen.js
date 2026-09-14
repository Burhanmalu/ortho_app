// ========================================
// Admin Inventory & Stock Management Screen
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { renderAdminLayout } from './AdminLayout.js';
import { showModal } from '../../components/index.js';

export default function AdminInventoryScreen(appEl) {
  const content = document.createElement('div');

  let stockFilter = 'all'; // all | low | out | healthy

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px; flex-wrap:wrap; gap:12px">
      <div>
        <h1 style="font-size:24px; font-weight:800; color:#0f172a; margin:0 0 4px">Inventory & Warehouse Logistics</h1>
        <div style="font-size:13px; color:#64748b">Monitor physical warehouse units, wholesale allocations, and reorder alerts</div>
      </div>
      <div style="display:flex; gap:8px">
        <button class="filter-chip ${stockFilter === 'all' ? 'active' : ''}" data-filter="all">All Inventory</button>
        <button class="filter-chip ${stockFilter === 'low' ? 'active' : ''}" data-filter="low" style="color:#d97706">⚠️ Low Stock</button>
        <button class="filter-chip ${stockFilter === 'out' ? 'active' : ''}" data-filter="out" style="color:#dc2626">✕ Out of Stock</button>
      </div>
    </div>

    <div class="admin-card">
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Product / SKU</th>
              <th>Total Stock</th>
              <th>Reserved (Retail)</th>
              <th>Wholesale Stock</th>
              <th>Threshold</th>
              <th>Status</th>
              <th style="text-align:right">Quick Adjust</th>
            </tr>
          </thead>
          <tbody id="inventory-tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  function renderRows() {
    const tbody = content.querySelector('#inventory-tbody');
    let list = store.getAdminProducts();

    if (stockFilter === 'low') {
      list = list.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= (p.lowStockThreshold || 25));
    } else if (stockFilter === 'out') {
      list = list.filter(p => (p.stock || 0) <= 0);
    }

    tbody.innerHTML = list.map(p => {
      const stock = p.stock || 0;
      const threshold = p.lowStockThreshold || 25;
      const isOut = stock <= 0;
      const isLow = stock > 0 && stock <= threshold;
      const statusClass = isOut ? 'out-of-stock' : (isLow ? 'low-stock' : 'in-stock');
      const statusLabel = isOut ? 'Out of Stock' : (isLow ? 'Low Stock' : 'In Stock');

      return `
        <tr>
          <td>
            <div style="font-weight:700; color:#0f172a">${p.name}</div>
            <div style="font-size:11px; color:#64748b">SKU: <code>${p.sku}</code></div>
          </td>
          <td><strong style="font-size:14px">${stock}</strong> units</td>
          <td>${p.reservedStock || Math.round(stock * 0.1)}</td>
          <td><strong style="color:#0d9488">${p.wholesaleStock || Math.max(0, stock - Math.round(stock * 0.1))}</strong></td>
          <td>${threshold}</td>
          <td><span class="admin-status-badge ${statusClass}">● ${statusLabel}</span></td>
          <td style="text-align:right">
            <div style="display:flex; gap:6px; justify-content:flex-end">
              <button class="admin-btn admin-btn-secondary admin-btn-sm btn-quick-stock" data-id="${p.id}" data-delta="25" title="Add 25 Units">
                +25
              </button>
              <button class="admin-btn admin-btn-secondary admin-btn-sm btn-quick-stock" data-id="${p.id}" data-delta="100" title="Add 100 Units">
                +100
              </button>
              <button class="admin-btn admin-btn-primary admin-btn-sm btn-set-stock" data-id="${p.id}" title="Set Stock">
                Edit
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-quick-stock').forEach(btn => {
      btn.addEventListener('click', () => {
        store.updateProductStock(btn.dataset.id, Number(btn.dataset.delta));
        renderRows();
      });
    });

    tbody.querySelectorAll('.btn-set-stock').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const prod = list.find(p => p.id === id);
        const modalHtml = `
          <div style="font-size:13px">
            <p>Enter physical stock count for <strong>${prod.name}</strong> (${prod.sku}):</p>
            <input type="number" id="manual-stock-val" value="${prod.stock}" class="input" style="width:100%; margin:10px 0 14px">
            <button id="btn-save-stock-manual" class="admin-btn admin-btn-primary" style="width:100%">Save Stock</button>
          </div>
        `;
        const modal = showModal('Adjust Inventory Stock', modalHtml);
        document.getElementById('btn-save-stock-manual').addEventListener('click', () => {
          const val = Number(document.getElementById('manual-stock-val').value) || 0;
          store.updateProductStock(id, val, true);
          modal.close();
          renderRows();
        });
      });
    });
  }

  content.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      content.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      stockFilter = btn.dataset.filter;
      renderRows();
    });
  });

  renderRows();

  const fullLayout = renderAdminLayout('inventory', content);
  appEl.appendChild(fullLayout);
  return fullLayout;
}
