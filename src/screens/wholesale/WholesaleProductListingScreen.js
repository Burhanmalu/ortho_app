// ========================================
// Wholesale Product Listing Screen
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { categories } from '../../data/categories.js';
import { products, getProductsByCategory, formatPrice, searchProducts } from '../../data/products.js';
import { icons } from '../../data/icons.js';
import { renderWholesaleBottomNav } from '../../components/index.js';

export default function WholesaleProductListingScreen(appEl, initialCat = 'all') {
  const el = document.createElement('div');
  el.className = 'screen-content';
  el.style.background = '#f8fafc';

  let currentCat = initialCat;
  let currentSearch = '';

  el.innerHTML = `
    <!-- Top B2B Header -->
    <div style="background:#0f3647; color:#ffffff; padding:16px 20px; position:sticky; top:0; z-index:50">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px">
        <div>
          <h2 style="font-size:18px; font-weight:800; margin:0">Wholesale B2B Catalog</h2>
          <div style="font-size:11px; opacity:0.8">Institutional Pricing & Master Carton Lots</div>
        </div>
        <button id="btn-open-bulk-pad" class="btn btn-sm" style="background:#0d9488; color:#ffffff; border:none; font-weight:700; font-size:11px; padding:6px 12px; border-radius:6px">
          📝 Bulk Pad Mode
        </button>
      </div>

      <!-- Search Input -->
      <div style="display:flex; align-items:center; gap:8px; background:#ffffff; border-radius:8px; padding:6px 12px">
        <span style="color:#64748b">${icons.search}</span>
        <input type="text" id="b2b-search" placeholder="Search product name, SKU or medical specs..." style="border:none; outline:none; width:100%; font-size:13px; color:#0f172a">
      </div>
    </div>

    <!-- Category Filter Horizontal Strip -->
    <div style="background:#ffffff; border-bottom:1px solid #e2e8f0; padding:10px 16px; overflow-x:auto; white-space:nowrap; display:flex; gap:8px" id="category-strip">
      <button class="filter-chip ${currentCat === 'all' ? 'active' : ''}" data-cat="all">All Ortho (${products.length})</button>
      ${categories.map(c => `
        <button class="filter-chip ${currentCat === c.id ? 'active' : ''}" data-cat="${c.id}">${c.name}</button>
      `).join('')}
    </div>

    <!-- Product Grid Container -->
    <div style="padding:16px; padding-bottom:120px" id="b2b-products-container"></div>
  `;

  function renderProducts() {
    const container = el.querySelector('#b2b-products-container');
    let list = currentCat === 'all' ? products : getProductsByCategory(currentCat);
    if (currentSearch.trim()) {
      list = searchProducts(currentSearch);
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:40px 20px; color:#64748b">
          <div style="font-size:36px; margin-bottom:8px">🔍</div>
          <div style="font-weight:700">No B2B products match your filter</div>
          <div style="font-size:12px; margin-top:4px">Try selecting "All Ortho" or clearing your search</div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="font-size:12px; color:#64748b; margin-bottom:12px; font-weight:600">
        Showing ${list.length} certified products with wholesale tier rates
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:16px">
        ${list.map(p => {
          const tiers = p.bulkTiers || [];
          const stockClass = p.stock > 30 ? 'in-stock' : (p.stock > 0 ? 'low-stock' : 'out-of-stock');
          const stockLabel = p.stock > 30 ? `In Stock (${p.stock} units)` : (p.stock > 0 ? `Low Stock (${p.stock} units)` : 'Out of Stock');

          return `
            <div class="wholesale-product-card" data-id="${p.id}">
              <div style="display:flex; justify-content:space-between; align-items:flex-start">
                <span class="moq-pill">MOQ: ${p.moq} Units</span>
                <span class="stock-indicator ${stockClass}">● ${stockLabel}</span>
              </div>

              <div style="display:flex; gap:12px; align-items:center; margin:4px 0">
                <div style="width:64px; height:64px; border-radius:10px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; font-size:32px; flex-shrink:0">
                  ${p.emoji || '🩺'}
                </div>
                <div>
                  <div style="font-size:11px; font-weight:700; color:#0d9488">${p.brand} • SKU: ${p.sku}</div>
                  <h4 style="font-size:13px; font-weight:700; color:#0f172a; margin:2px 0 4px; line-height:1.3; cursor:pointer" class="b2b-prod-title" data-id="${p.id}">
                    ${p.name}
                  </h4>
                  <div style="font-size:11px; color:#64748b">${p.material}</div>
                </div>
              </div>

              <!-- Price Box -->
              <div style="background:#f8fafc; border-radius:8px; padding:8px 10px; margin:4px 0">
                <div style="display:flex; justify-content:space-between; align-items:baseline">
                  <div>
                    <span style="font-size:10px; color:#64748b; text-transform:uppercase; font-weight:700">Wholesale Starting Price</span>
                    <div style="font-size:16px; font-weight:800; color:#0f172a">
                      ${formatPrice(p.wholesalePrice)} <small style="font-size:11px; font-weight:500; color:#64748b">/ unit</small>
                    </div>
                  </div>
                  <div style="text-align:right">
                    <span style="font-size:10px; color:#94a3b8">Retail MRP</span>
                    <div style="font-size:12px; text-decoration:line-through; color:#94a3b8">${formatPrice(p.price)}</div>
                  </div>
                </div>

                <!-- Tier Pricing Badges -->
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:8px; font-size:11px">
                  ${tiers.slice(0, 2).map(t => `
                    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:4px; padding:4px 6px">
                      <div style="color:#64748b; font-size:10px">${t.label}</div>
                      <div style="font-weight:700; color:#0d9488">${formatPrice(t.price)}/ea</div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Add to Wholesale Cart Quick Controls -->
              <div style="display:flex; gap:8px; margin-top:6px">
                <div style="display:flex; align-items:center; border:1px solid #cbd5e1; border-radius:8px; overflow:hidden">
                  <button class="btn-step-qty" data-id="${p.id}" data-delta="-5" style="background:#f1f5f9; border:none; padding:6px 8px; font-weight:700; cursor:pointer">-</button>
                  <input type="number" id="qty-input-${p.id}" value="${p.moq}" min="${p.moq}" style="width:44px; border:none; text-align:center; font-size:12px; font-weight:700">
                  <button class="btn-step-qty" data-id="${p.id}" data-delta="5" style="background:#f1f5f9; border:none; padding:6px 8px; font-weight:700; cursor:pointer">+</button>
                </div>
                <button class="btn btn-primary btn-add-b2b" data-id="${p.id}" style="flex:1; padding:8px; font-size:12px; font-weight:700">
                  + Add Bulk
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Attach click events on rendered cards
    container.querySelectorAll('.b2b-prod-title').forEach(el => {
      el.addEventListener('click', () => {
        navigate(`wholesale/product/${el.dataset.id}`);
      });
    });

    container.querySelectorAll('.btn-step-qty').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const delta = Number(btn.dataset.delta);
        const input = container.querySelector(`#qty-input-${id}`);
        const prod = products.find(p => p.id === id);
        const minMoq = prod ? prod.moq : 10;
        let val = Number(input.value) + delta;
        if (val < minMoq) val = minMoq;
        input.value = val;
      });
    });

    container.querySelectorAll('.btn-add-b2b').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const input = container.querySelector(`#qty-input-${id}`);
        const qty = Number(input.value) || 10;
        store.addToWholesaleCart(id, qty);
      });
    });
  }

  // Category Filter clicks
  el.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.dataset.cat;
      renderProducts();
    });
  });

  // Search Input
  el.querySelector('#b2b-search').addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderProducts();
  });

  el.querySelector('#btn-open-bulk-pad').addEventListener('click', () => {
    navigate('wholesale/bulk-order');
  });

  renderProducts();

  el.appendChild(renderWholesaleBottomNav('products'));
  appEl.appendChild(el);
  return el;
}
