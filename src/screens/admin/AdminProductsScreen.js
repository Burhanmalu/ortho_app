// ========================================
// Admin Product Catalog Management Screen
// Responsive Table-to-Card Pattern + Clean Filtering
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { formatPrice } from '../../data/products.js';
import { categories } from '../../data/categories.js';
import { icons } from '../../data/icons.js';
import { renderAdminLayout } from './AdminLayout.js';
import { showModal } from '../../components/index.js';

export default function AdminProductsScreen(appEl) {
  const content = document.createElement('div');

  let currentCat = 'all';
  let searchTerm = '';
  let sortBy = 'name';

  content.innerHTML = `
    <!-- Top Header -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px">
      <div>
        <h1 style="font-size:22px;font-weight:700;color:var(--text);margin:0 0 2px">Products Catalog</h1>
        <div style="font-size:13px;color:var(--text-secondary)">Manage pricing, bulk wholesale tiers, MOQ and stock availability</div>
      </div>
      <button id="btn-add-product-modal" class="btn btn-primary btn-sm">
        ${icons.plus} Add Product
      </button>
    </div>

    <!-- Toolbar: Search, Filter, Sort -->
    <div class="card" style="padding:12px 16px;margin-bottom:16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap">
      <div class="search-bar" style="flex:1;min-width:220px;height:40px">
        <span class="search-bar-icon">${icons.search}</span>
        <input type="text" id="prod-search-input" placeholder="Search by name, SKU or brand..." />
      </div>
      <div style="min-width:160px">
        <select id="prod-cat-select" style="height:40px;padding:0 12px;border:1px solid var(--border);border-radius:var(--radius-md);background:#FFFFFF;font-size:13px;color:var(--text);width:100%">
          <option value="all">All Categories</option>
          ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
      </div>
      <div style="min-width:140px">
        <select id="prod-sort-select" style="height:40px;padding:0 12px;border:1px solid var(--border);border-radius:var(--radius-md);background:#FFFFFF;font-size:13px;color:var(--text);width:100%">
          <option value="name">Sort: Name (A-Z)</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="stock-low">Stock: Low to High</option>
        </select>
      </div>
    </div>

    <!-- Products Table / Card Grid -->
    <div class="admin-table-container">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Product & SKU</th>
            <th>Category</th>
            <th>Retail Price</th>
            <th>Wholesale (MOQ)</th>
            <th>Stock</th>
            <th>Status</th>
            <th style="text-align:right">Actions</th>
          </tr>
        </thead>
        <tbody id="admin-prod-tbody"></tbody>
      </table>
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
      list = list.filter(p => p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q)) || (p.brand && p.brand.toLowerCase().includes(q)));
    }

    if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'stock-low') list.sort((a, b) => (a.stock || 0) - (b.stock || 0));
    else if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:36px;color:var(--text-secondary)">No products match the selected criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(p => {
      const isLow = (p.stock || 0) <= (p.lowStockThreshold || 25);
      const isOut = (p.stock || 0) === 0;
      let statusClass = 'success';
      let statusText = 'In Stock';
      if (isOut) { statusClass = 'danger'; statusText = 'Out of Stock'; }
      else if (isLow) { statusClass = 'warning'; statusText = 'Low Stock'; }

      return `
        <tr>
          <td data-label="Product">
            <div style="display:flex;align-items:center;gap:10px">
              <div style="width:36px;height:36px;border-radius:var(--radius-sm);background:var(--primary-bg);color:var(--primary);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                ${p.images && p.images.length > 0 ? `<img src="${p.images[0]}" alt="${p.name}" style="max-height:100%;object-fit:contain" />` : icons.package}
              </div>
              <div>
                <strong style="color:var(--text);font-size:13px">${p.name}</strong>
                <div style="font-size:11px;color:var(--text-secondary)">SKU: <code>${p.sku}</code></div>
              </div>
            </div>
          </td>
          <td data-label="Category">${p.category || 'General'}</td>
          <td data-label="Retail Price"><strong>${formatPrice(p.price)}</strong></td>
          <td data-label="Wholesale">${formatPrice(p.wholesalePrice)} <small style="color:var(--text-secondary)">(${p.moq} MOQ)</small></td>
          <td data-label="Stock"><strong>${p.stock || 0} units</strong></td>
          <td data-label="Status"><span class="status-pill ${statusClass}">${statusText}</span></td>
          <td data-label="Actions" style="text-align:right">
            <button class="btn btn-secondary btn-sm btn-edit-prod" data-id="${p.id}" style="margin-right:6px">
              ${icons.edit} Edit
            </button>
            <button class="btn btn-ghost btn-sm btn-view-prod" data-id="${p.id}">
              ${icons.eye} View
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-edit-prod').forEach(btn => {
      btn.addEventListener('click', () => showEditProductModal(btn.dataset.id));
    });
    tbody.querySelectorAll('.btn-view-prod').forEach(btn => {
      btn.addEventListener('click', () => navigate(`product/${btn.dataset.id}`));
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

  content.querySelector('#prod-sort-select').addEventListener('change', (e) => {
    sortBy = e.target.value;
    renderTable();
  });

  content.querySelector('#btn-add-product-modal').addEventListener('click', () => showAddProductModal());

  function showAddProductModal() {
    const { close, container } = showModal('Add New Orthopedic Product', `
      <form id="form-add-prod" style="display:flex;flex-direction:column;gap:12px">
        <div>
          <label style="font-size:12px;font-weight:700;color:var(--text)">Product Name</label>
          <input type="text" name="name" required class="search-bar" style="margin-top:4px" placeholder="e.g. Hinged Knee Brace with Dual Lateral Support" />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div>
            <label style="font-size:12px;font-weight:700;color:var(--text)">SKU Code</label>
            <input type="text" name="sku" required class="search-bar" style="margin-top:4px" placeholder="OC-KB-101" />
          </div>
          <div>
            <label style="font-size:12px;font-weight:700;color:var(--text)">Category</label>
            <select name="category" style="margin-top:4px;height:44px;padding:0 12px;border:1px solid var(--border);border-radius:var(--radius-md);width:100%">
              ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
          <div>
            <label style="font-size:12px;font-weight:700;color:var(--text)">Retail Price (₹)</label>
            <input type="number" name="price" required class="search-bar" style="margin-top:4px" placeholder="999" />
          </div>
          <div>
            <label style="font-size:12px;font-weight:700;color:var(--text)">Wholesale (₹)</label>
            <input type="number" name="wholesalePrice" required class="search-bar" style="margin-top:4px" placeholder="650" />
          </div>
          <div>
            <label style="font-size:12px;font-weight:700;color:var(--text)">MOQ</label>
            <input type="number" name="moq" value="10" required class="search-bar" style="margin-top:4px" />
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div>
            <label style="font-size:12px;font-weight:700;color:var(--text)">Initial Stock</label>
            <input type="number" name="stock" value="100" class="search-bar" style="margin-top:4px" />
          </div>
          <div>
            <label style="font-size:12px;font-weight:700;color:var(--text)">Brand</label>
            <input type="text" name="brand" value="OrthoCare" class="search-bar" style="margin-top:4px" />
          </div>
        </div>
      </form>
    `, `
      <button class="btn btn-ghost btn-sm" id="btn-cancel-add">Cancel</button>
      <button class="btn btn-primary btn-sm" id="btn-submit-add">Save Product</button>
    `);

    container.querySelector('#btn-cancel-add')?.addEventListener('click', close);
    container.querySelector('#btn-submit-add')?.addEventListener('click', () => {
      const form = container.querySelector('#form-add-prod');
      if (form.checkValidity()) {
        const formData = new FormData(form);
        const newProduct = {
          name: formData.get('name'),
          sku: formData.get('sku'),
          category: formData.get('category'),
          price: Number(formData.get('price')),
          mrp: Math.round(Number(formData.get('price')) * 1.25),
          wholesalePrice: Number(formData.get('wholesalePrice')),
          moq: Number(formData.get('moq')),
          stock: Number(formData.get('stock')),
          brand: formData.get('brand'),
          inStock: true,
          sizes: ['S', 'M', 'L', 'XL'],
          images: [],
          specs: { Material: 'Medical Neoprene' },
          highlights: ['Clinical Grade Support'],
          deliveryDays: 3,
        };
        store.adminAddProduct(newProduct);
        store.emitter.emit('toast', { message: 'Product added successfully to catalog', type: 'success' });
        renderTable();
        close();
      } else {
        form.reportValidity();
      }
    });
  }

  function showEditProductModal(productId) {
    const prod = store.getAdminProducts().find(p => String(p.id) === String(productId));
    if (!prod) return;

    const { close, container } = showModal(`Edit Product — ${prod.name}`, `
      <form id="form-edit-prod" style="display:flex;flex-direction:column;gap:12px">
        <div>
          <label style="font-size:12px;font-weight:700;color:var(--text)">Retail MRP Price (₹)</label>
          <input type="number" name="price" value="${prod.price}" class="search-bar" style="margin-top:4px" />
        </div>
        <div>
          <label style="font-size:12px;font-weight:700;color:var(--text)">B2B Wholesale Price (₹)</label>
          <input type="number" name="wholesalePrice" value="${prod.wholesalePrice}" class="search-bar" style="margin-top:4px" />
        </div>
        <div>
          <label style="font-size:12px;font-weight:700;color:var(--text)">Inventory Units in Stock</label>
          <input type="number" name="stock" value="${prod.stock || 0}" class="search-bar" style="margin-top:4px" />
        </div>
      </form>
    `, `
      <button class="btn btn-ghost btn-sm" id="btn-cancel-edit">Cancel</button>
      <button class="btn btn-primary btn-sm" id="btn-save-edit">Update Product</button>
    `);

    container.querySelector('#btn-cancel-edit')?.addEventListener('click', close);
    container.querySelector('#btn-save-edit')?.addEventListener('click', () => {
      const form = container.querySelector('#form-edit-prod');
      const formData = new FormData(form);
      store.adminUpdateProduct(prod.id, {
        price: Number(formData.get('price')),
        wholesalePrice: Number(formData.get('wholesalePrice')),
        stock: Number(formData.get('stock')),
        inStock: Number(formData.get('stock')) > 0
      });
      store.emitter.emit('toast', { message: `Updated SKU ${prod.sku}`, type: 'success' });
      renderTable();
      close();
    });
  }

  renderTable();

  const layout = renderAdminLayout('products', content);
  appEl.appendChild(layout);
  return layout;
}
