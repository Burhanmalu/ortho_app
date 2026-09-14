// ========================================
// Admin Product Catalog Management Screen
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { formatPrice } from '../../data/products.js';
import { categories } from '../../data/categories.js';
import { renderAdminLayout } from './AdminLayout.js';
import { showModal } from '../../components/index.js';

export default function AdminProductsScreen(appEl) {
  const content = document.createElement('div');

  let currentCat = 'all';
  let searchTerm = '';

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px; flex-wrap:wrap; gap:12px">
      <div>
        <h1 style="font-size:24px; font-weight:800; color:#0f172a; margin:0 0 4px">Product Catalog & Pricing Management</h1>
        <div style="font-size:13px; color:#64748b">Manage retail MRP, wholesale tier pricing, MOQ rules, and clinical inventory</div>
      </div>
      <button id="btn-add-product-modal" class="admin-btn admin-btn-primary">
        + Add New Orthopedic Product
      </button>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="admin-card" style="padding:14px 18px; margin-bottom:16px; display:flex; gap:14px; align-items:center; flex-wrap:wrap">
      <div style="flex:1; min-width:240px">
        <input type="text" id="prod-search-input" placeholder="Search by name, brand, SKU..." class="input" style="width:100%; font-size:13px">
      </div>
      <div style="width:200px">
        <select id="prod-cat-select" class="input" style="width:100%; font-size:13px">
          <option value="all">All Categories</option>
          ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
      </div>
    </div>

    <!-- Products Table Card -->
    <div class="admin-card">
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>SKU / Product</th>
              <th>Category</th>
              <th>Retail Price</th>
              <th>Wholesale Starting</th>
              <th>MOQ</th>
              <th>Current Stock</th>
              <th>Status</th>
              <th style="text-align:right">Actions</th>
            </tr>
          </thead>
          <tbody id="admin-prod-tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  function renderTable() {
    const tbody = content.querySelector('#admin-prod-tbody');
    let list = store.getAdminProducts();

    if (currentCat !== 'all') {
      list = list.filter(p => p.category === currentCat);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q)) || p.brand.toLowerCase().includes(q));
    }

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:#64748b">No products found.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(p => {
      const isLow = (p.stock || 0) <= (p.lowStockThreshold || 25);
      return `
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:10px">
              <span style="font-size:22px">${p.emoji || '🩺'}</span>
              <div>
                <strong style="color:#0f172a">${p.name}</strong>
                <div style="font-size:11px; color:#64748b">SKU: <code>${p.sku}</code> • Brand: ${p.brand}</div>
              </div>
            </div>
          </td>
          <td><span style="font-weight:600; text-transform:capitalize">${p.category}</span></td>
          <td>
            <strong>${formatPrice(p.price)}</strong><br>
            <small style="color:#94a3b8; text-decoration:line-through">${formatPrice(p.mrp)}</small>
          </td>
          <td>
            <strong style="color:#0d9488">${formatPrice(p.wholesalePrice)}</strong><br>
            <small style="color:#64748b">Tier 1 Rate</small>
          </td>
          <td><span class="moq-pill">${p.moq} Units</span></td>
          <td>
            <strong>${p.stock || 0}</strong> units<br>
            <small style="color:#64748b">Wholesale: ${p.wholesaleStock || 0}</small>
          </td>
          <td>
            <span class="admin-status-badge ${p.stock > 0 ? (isLow ? 'low-stock' : 'active') : 'out-of-stock'}">
              ${p.stock > 0 ? (isLow ? 'Low Stock' : 'In Stock') : 'Out of Stock'}
            </span>
          </td>
          <td style="text-align:right">
            <div style="display:flex; gap:6px; justify-content:flex-end">
              <button class="admin-btn admin-btn-secondary admin-btn-sm btn-edit-prod" data-id="${p.id}" title="Edit Product & Pricing">
                ✏️ Edit
              </button>
              <button class="admin-btn admin-btn-secondary admin-btn-sm btn-dup-prod" data-id="${p.id}" title="Duplicate SKU">
                📋
              </button>
              <button class="admin-btn admin-btn-danger admin-btn-sm btn-del-prod" data-id="${p.id}" title="Delete">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach row button actions
    tbody.querySelectorAll('.btn-edit-prod').forEach(btn => {
      btn.addEventListener('click', () => openEditProductModal(btn.dataset.id));
    });

    tbody.querySelectorAll('.btn-dup-prod').forEach(btn => {
      btn.addEventListener('click', () => {
        store.duplicateAdminProduct(btn.dataset.id);
        renderTable();
      });
    });

    tbody.querySelectorAll('.btn-del-prod').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Are you sure you want to remove this product from catalog?')) {
          store.deleteAdminProduct(btn.dataset.id);
          renderTable();
        }
      });
    });
  }

  function openEditProductModal(productId) {
    const p = store.getAdminProducts().find(prod => prod.id === productId);
    if (!p) return;

    const modalHtml = `
      <form id="edit-prod-form" style="display:flex; flex-direction:column; gap:12px; font-size:13px">
        <div>
          <label style="font-weight:700; display:block; margin-bottom:4px">Product Name</label>
          <input type="text" id="edit-name" value="${p.name}" class="input" style="width:100%" required>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Retail MRP (₹)</label>
            <input type="number" id="edit-mrp" value="${p.mrp}" class="input" style="width:100%" required>
          </div>
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Retail Selling Price (₹)</label>
            <input type="number" id="edit-price" value="${p.price}" class="input" style="width:100%" required>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Wholesale Base Price (₹)</label>
            <input type="number" id="edit-wh-price" value="${p.wholesalePrice}" class="input" style="width:100%" required>
          </div>
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Minimum Order Qty (MOQ)</label>
            <input type="number" id="edit-moq" value="${p.moq}" class="input" style="width:100%" required>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Inventory Stock</label>
            <input type="number" id="edit-stock" value="${p.stock || 100}" class="input" style="width:100%" required>
          </div>
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Low Stock Threshold</label>
            <input type="number" id="edit-threshold" value="${p.lowStockThreshold || 25}" class="input" style="width:100%">
          </div>
        </div>

        <div>
          <label style="font-weight:700; display:block; margin-bottom:4px">Clinical Description</label>
          <textarea id="edit-desc" rows="2" class="input" style="width:100%">${p.description || ''}</textarea>
        </div>

        <button type="submit" class="admin-btn admin-btn-primary" style="padding:10px; width:100%; margin-top:8px">
          Save Changes
        </button>
      </form>
    `;

    const modal = showModal(`Edit Product — ${p.sku}`, modalHtml);

    document.getElementById('edit-prod-form').addEventListener('submit', (e) => {
      e.preventDefault();
      store.updateAdminProduct(p.id, {
        name: document.getElementById('edit-name').value,
        mrp: Number(document.getElementById('edit-mrp').value),
        price: Number(document.getElementById('edit-price').value),
        wholesalePrice: Number(document.getElementById('edit-wh-price').value),
        moq: Number(document.getElementById('edit-moq').value),
        stock: Number(document.getElementById('edit-stock').value),
        lowStockThreshold: Number(document.getElementById('edit-threshold').value),
        description: document.getElementById('edit-desc').value
      });
      modal.close();
      renderTable();
    });
  }

  function openAddProductModal() {
    const modalHtml = `
      <form id="add-prod-form" style="display:flex; flex-direction:column; gap:12px; font-size:13px">
        <div>
          <label style="font-weight:700; display:block; margin-bottom:4px">Product Name *</label>
          <input type="text" id="add-name" placeholder="e.g. Advanced Rigid Wrist Brace" class="input" style="width:100%" required>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Category *</label>
            <select id="add-cat" class="input" style="width:100%" required>
              ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Brand</label>
            <input type="text" id="add-brand" value="OrthoCare Pro" class="input" style="width:100%">
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Retail MRP (₹) *</label>
            <input type="number" id="add-mrp" value="1299" class="input" style="width:100%" required>
          </div>
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Retail Price (₹) *</label>
            <input type="number" id="add-price" value="899" class="input" style="width:100%" required>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Wholesale Base (₹) *</label>
            <input type="number" id="add-wh-price" value="649" class="input" style="width:100%" required>
          </div>
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">MOQ Units *</label>
            <input type="number" id="add-moq" value="10" class="input" style="width:100%" required>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Initial Stock Units *</label>
            <input type="number" id="add-stock" value="150" class="input" style="width:100%" required>
          </div>
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Material</label>
            <input type="text" id="add-material" value="Clinical Grade Breathable Mesh" class="input" style="width:100%">
          </div>
        </div>

        <button type="submit" class="admin-btn admin-btn-primary" style="padding:10px; width:100%; margin-top:8px">
          Add to Catalog
        </button>
      </form>
    `;

    const modal = showModal('Add New Orthopedic Product', modalHtml);

    document.getElementById('add-prod-form').addEventListener('submit', (e) => {
      e.preventDefault();
      store.addAdminProduct({
        name: document.getElementById('add-name').value,
        category: document.getElementById('add-cat').value,
        brand: document.getElementById('add-brand').value,
        mrp: document.getElementById('add-mrp').value,
        price: document.getElementById('add-price').value,
        wholesalePrice: document.getElementById('add-wh-price').value,
        moq: document.getElementById('add-moq').value,
        stock: document.getElementById('add-stock').value,
        material: document.getElementById('add-material').value
      });
      modal.close();
      renderTable();
    });
  }

  content.querySelector('#prod-search-input').addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderTable();
  });

  content.querySelector('#prod-cat-select').addEventListener('change', (e) => {
    currentCat = e.target.value;
    renderTable();
  });

  content.querySelector('#btn-add-product-modal').addEventListener('click', openAddProductModal);

  renderTable();

  const fullLayout = renderAdminLayout('products', content);
  appEl.appendChild(fullLayout);
  return fullLayout;
}
