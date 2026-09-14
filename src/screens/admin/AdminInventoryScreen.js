// ========================================
// Admin Inventory Dashboard Screen — OrthoCare
// Inventory Overview Metrics + Low Stock Alerts & Responsive Table
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { icons } from '../../data/icons.js';
import { renderAdminLayout } from './AdminLayout.js';
import { showModal } from '../../components/index.js';

export default function AdminInventoryScreen(appEl) {
  const content = document.createElement('div');

  const products = store.getAdminProducts();
  const totalCount = products.length;
  const inStockCount = products.filter(p => (p.stock || 0) > (p.lowStockThreshold || 25)).length;
  const lowStockCount = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= (p.lowStockThreshold || 25)).length;
  const outOfStockCount = products.filter(p => (p.stock || 0) <= 0).length;

  content.innerHTML = `
    <!-- Top Header -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px">
      <div>
        <h1 style="font-size:22px;font-weight:700;color:var(--text);margin:0 0 2px">Inventory Dashboard</h1>
        <div style="font-size:13px;color:var(--text-secondary)">Warehouse stock tracking, clinical allocation, and replenishments</div>
      </div>
    </div>

    <!-- 23. Inventory Overview (4 Metric Cards) -->
    <div class="admin-kpi-grid-4" style="margin-bottom:24px">
      <div class="card" style="padding:16px">
        <div style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-bottom:4px">Total Products</div>
        <div style="font-size:24px;font-weight:700;color:var(--text)">${totalCount}</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:4px">Across 12 Categories</div>
      </div>

      <div class="card" style="padding:16px">
        <div style="font-size:12px;font-weight:600;color:var(--success);margin-bottom:4px">In Stock</div>
        <div style="font-size:24px;font-weight:700;color:var(--success)">${inStockCount}</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:4px">Optimal Supply Level</div>
      </div>

      <div class="card" style="padding:16px">
        <div style="font-size:12px;font-weight:600;color:#D97706;margin-bottom:4px">Low Stock</div>
        <div style="font-size:24px;font-weight:700;color:#D97706">${lowStockCount}</div>
        <div style="font-size:11px;color:#D97706;margin-top:4px">Below Restock Threshold</div>
      </div>

      <div class="card" style="padding:16px">
        <div style="font-size:12px;font-weight:600;color:var(--danger);margin-bottom:4px">Out of Stock</div>
        <div style="font-size:24px;font-weight:700;color:var(--danger)">${outOfStockCount}</div>
        <div style="font-size:11px;color:var(--danger);margin-top:4px">Urgent Replenishment</div>
      </div>
    </div>

    <!-- 23. Low Stock Products Action Table -->
    <div class="card" style="margin-bottom:24px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div>
          <h3 style="font-size:16px;font-weight:700;color:var(--text);margin:0 0 2px">Low Stock & Out of Stock Items</h3>
          <div style="font-size:12px;color:var(--text-secondary)">Quickly add physical units to inventory</div>
        </div>
      </div>

      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Stock</th>
              <th>Threshold</th>
              <th>Status</th>
              <th style="text-align:right">Action</th>
            </tr>
          </thead>
          <tbody id="inventory-low-tbody"></tbody>
        </table>
      </div>
    </div>

    <!-- Full Inventory List -->
    <div class="card">
      <div style="margin-bottom:14px">
        <h3 style="font-size:16px;font-weight:700;color:var(--text);margin:0 0 2px">All Product Stock Levels</h3>
        <div style="font-size:12px;color:var(--text-secondary)">Warehouse counts and safety stock</div>
      </div>

      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Stock</th>
              <th>Threshold</th>
              <th>Status</th>
              <th style="text-align:right">Action</th>
            </tr>
          </thead>
          <tbody id="inventory-all-tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  function renderTables() {
    const lowTbody = content.querySelector('#inventory-low-tbody');
    const allTbody = content.querySelector('#inventory-all-tbody');
    const prods = store.getAdminProducts();

    const lowList = prods.filter(p => (p.stock || 0) <= (p.lowStockThreshold || 25));

    if (lowList.length === 0) {
      lowTbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--success)">All items are well above safety threshold.</td></tr>`;
    } else {
      lowTbody.innerHTML = lowList.map(p => {
        const stock = p.stock || 0;
        const thresh = p.lowStockThreshold || 25;
        const isOut = stock <= 0;
        return `
          <tr>
            <td data-label="Product"><strong>${p.name}</strong></td>
            <td data-label="SKU"><code>${p.sku}</code></td>
            <td data-label="Stock"><strong style="color:${isOut ? 'var(--danger)' : '#D97706'}">${stock} units</strong></td>
            <td data-label="Threshold">${thresh}</td>
            <td data-label="Status">
              <span class="status-pill ${isOut ? 'danger' : 'warning'}">${isOut ? 'Out of Stock' : 'Low Stock'}</span>
            </td>
            <td data-label="Action" style="text-align:right">
              <button class="btn btn-secondary btn-sm btn-quick-add" data-id="${p.id}" data-delta="25" style="margin-right:4px">
                +25
              </button>
              <button class="btn btn-secondary btn-sm btn-quick-add" data-id="${p.id}" data-delta="50" style="margin-right:4px">
                +50
              </button>
              <button class="btn btn-primary btn-sm btn-set-stock" data-id="${p.id}">
                Adjust
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    allTbody.innerHTML = prods.map(p => {
      const stock = p.stock || 0;
      const thresh = p.lowStockThreshold || 25;
      const isOut = stock <= 0;
      const isLow = stock > 0 && stock <= thresh;
      return `
        <tr>
          <td data-label="Product"><strong>${p.name}</strong></td>
          <td data-label="SKU"><code>${p.sku}</code></td>
          <td data-label="Stock"><strong>${stock} units</strong></td>
          <td data-label="Threshold">${thresh}</td>
          <td data-label="Status">
            <span class="status-pill ${isOut ? 'danger' : (isLow ? 'warning' : 'success')}">
              ${isOut ? 'Out of Stock' : (isLow ? 'Low Stock' : 'In Stock')}
            </span>
          </td>
          <td data-label="Action" style="text-align:right">
            <button class="btn btn-secondary btn-sm btn-quick-add" data-id="${p.id}" data-delta="25" style="margin-right:4px">
              +25
            </button>
            <button class="btn btn-primary btn-sm btn-set-stock" data-id="${p.id}">
              Adjust
            </button>
          </td>
        </tr>
      `;
    }).join('');

    content.querySelectorAll('.btn-quick-add').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = btn.dataset.id;
        const delta = Number(btn.dataset.delta) || 25;
        const target = prods.find(p => String(p.id) === String(pid));
        if (target) {
          const newStock = (target.stock || 0) + delta;
          store.adminUpdateProduct(target.id, { stock: newStock, inStock: true });
          store.emitter.emit('toast', { message: `Added ${delta} units to ${target.sku}. New stock: ${newStock}`, type: 'success' });
          renderTables();
        }
      });
    });

    content.querySelectorAll('.btn-set-stock').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = btn.dataset.id;
        const target = prods.find(p => String(p.id) === String(pid));
        if (!target) return;

        const { close, container } = showModal(`Adjust Stock — ${target.name}`, `
          <div style="display:flex;flex-direction:column;gap:12px">
            <label style="font-size:12px;font-weight:700;color:var(--text)">Current Stock: ${target.stock || 0} units</label>
            <input type="number" id="input-new-stock" class="search-bar" value="${target.stock || 0}" placeholder="Enter new quantity" />
          </div>
        `, `
          <button class="btn btn-ghost btn-sm" id="btn-cancel-stock">Cancel</button>
          <button class="btn btn-primary btn-sm" id="btn-confirm-stock">Update</button>
        `);

        container.querySelector('#btn-cancel-stock')?.addEventListener('click', close);
        container.querySelector('#btn-confirm-stock')?.addEventListener('click', () => {
          const val = Number(container.querySelector('#input-new-stock').value) || 0;
          store.adminUpdateProduct(target.id, { stock: val, inStock: val > 0 });
          store.emitter.emit('toast', { message: `Stock updated for ${target.sku} to ${val}`, type: 'success' });
          renderTables();
          close();
        });
      });
    });
  }

  renderTables();

  const layout = renderAdminLayout('inventory', content);
  appEl.appendChild(layout);
  return layout;
}
