// ========================================
// Wholesale Product Listing Screen - Redesigned
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { categories } from '../../data/categories.js';
import { products, getProductsByCategory, formatPrice, searchProducts } from '../../data/products.js';
import { icons } from '../../data/icons.js';
import { renderWholesaleBottomNav, renderEmptyState } from '../../components/index.js';

export default function WholesaleProductListingScreen(appEl, initialCat = 'all') {
  const el = document.createElement('div');
  el.className = 'screen-content';
  el.style.background = 'var(--bg-light)';
  el.style.paddingBottom = '110px';

  let currentCat = initialCat;
  let currentSearch = '';

  el.innerHTML = `
    <!-- Top B2B Header -->
    <div style="background:var(--deep-navy); color:var(--text-white); padding:16px; position:sticky; top:0; z-index:40">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px">
        <div>
          <h2 style="font-size:16px; font-weight:700; margin:0">Wholesale B2B Catalog</h2>
          <div style="font-size:11px; color:var(--border); margin-top:2px">Institutional Pricing & Master Carton Lots</div>
        </div>
        <button id="btn-open-bulk-pad" class="btn btn-primary btn-sm" style="font-size:11px; padding:6px 12px; display:inline-flex; align-items:center; gap:6px">
          ${icons.fileText} Bulk Pad
        </button>
      </div>

      <!-- Search Input -->
      <div style="display:flex; align-items:center; gap:8px; background:var(--bg-white); border-radius:var(--radius-md); padding:8px 12px">
        <span style="color:var(--text-secondary); width:16px; height:16px; display:inline-flex">${icons.search}</span>
        <input type="text" id="b2b-search" placeholder="Search by name, SKU or medical specs..." style="border:none; outline:none; width:100%; font-size:13px; color:var(--text); background:transparent" />
      </div>
    </div>

    <!-- Category Filter Horizontal Strip -->
    <div style="background:var(--bg-white); border-bottom:1px solid var(--border); padding:10px 16px; overflow-x:auto; white-space:nowrap; display:flex; gap:8px" id="category-strip">
      <button class="filter-chip ${currentCat === 'all' ? 'active' : ''}" data-cat="all">All Ortho (${products.length})</button>
      ${categories.map(c => `
        <button class="filter-chip ${currentCat === c.id ? 'active' : ''}" data-cat="${c.id}">${c.name}</button>
      `).join('')}
    </div>

    <!-- Product Grid Container -->
    <div style="padding:16px" id="b2b-products-container"></div>
  `;

  function renderProducts() {
    const container = el.querySelector('#b2b-products-container');
    let list = currentCat === 'all' ? products : getProductsByCategory(currentCat);
    if (currentSearch.trim()) {
      list = searchProducts(currentSearch);
    }

    if (list.length === 0) {
      container.innerHTML = '';
      container.appendChild(renderEmptyState({
        icon: icons.search,
        title: 'No B2B products match your criteria',
        desc: 'Try changing the category or clearing your search keywords.',
        ctaLabel: 'Show All Products',
        ctaAction: () => {
          currentCat = 'all';
          currentSearch = '';
          el.querySelector('#b2b-search').value = '';
          el.querySelectorAll('.filter-chip').forEach(b => b.classList.toggle('active', b.dataset.cat === 'all'));
          renderProducts();
        }
      }));
      return;
    }

    container.innerHTML = `
      <div style="font-size:12px; color:var(--text-secondary); margin-bottom:12px; font-weight:600">
        Showing ${list.length} certified products with wholesale volume tiers
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:14px">
        ${list.map(p => {
          const tiers = p.bulkTiers || [];
          const stockClass = p.stock > 30 ? 'status-active' : (p.stock > 0 ? 'status-pending' : 'status-inactive');
          const stockLabel = p.stock > 30 ? `In Stock (${p.stock})` : (p.stock > 0 ? `Low Stock (${p.stock})` : 'Out of Stock');
          const firstImg = (p.images && p.images[0]) || '';

          return `
            <div class="card wholesale-product-card" data-id="${p.id}" style="padding:14px; display:flex; flex-direction:column; gap:10px">
              <div style="display:flex; justify-content:space-between; align-items:center">
                <span class="status-pill status-shipped" style="font-size:10px; padding:2px 8px">MOQ: ${p.moq} Units</span>
                <span class="status-pill ${stockClass}" style="font-size:10px; padding:2px 8px">
                  <span class="status-pill-dot"></span>
                  ${stockLabel}
                </span>
              </div>

              <div style="display:flex; gap:12px; align-items:center">
                <div style="width:56px; height:56px; border-radius:var(--radius-md); background:var(--bg-light); display:flex; align-items:center; justify-content:center; flex-shrink:0; border:1px solid var(--border); overflow:hidden">
                  ${firstImg 
                    ? `<img src="${firstImg}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover" />` 
                    : `<span style="width:24px;height:24px;color:var(--primary);display:inline-flex">${icons.knee}</span>`}
                </div>
                <div style="flex:1; min-width:0">
                  <div style="font-size:11px; font-weight:700; color:var(--primary)">${p.brand || 'OrthoCare Clinical'} • SKU: ${p.sku}</div>
                  <h4 style="font-size:13px; font-weight:700; color:var(--text); margin:2px 0; line-height:1.3; cursor:pointer; overflow:hidden; text-overflow:ellipsis; white-space:nowrap" class="b2b-prod-title" data-id="${p.id}">
                    ${p.name}
                  </h4>
                  <div style="font-size:11px; color:var(--text-secondary)">${p.material || 'Medical Grade Fabric'}</div>
                </div>
              </div>

              <!-- Price Box -->
              <div style="background:var(--bg-light); border-radius:var(--radius-sm); padding:10px; border:1px solid var(--border)">
                <div style="display:flex; justify-content:space-between; align-items:baseline">
                  <div>
                    <span style="font-size:10px; color:var(--text-secondary); text-transform:uppercase; font-weight:700">Wholesale Rate</span>
                    <div style="font-size:15px; font-weight:800; color:var(--deep-navy)">
                      ${formatPrice(p.wholesalePrice)} <small style="font-size:10px; font-weight:500; color:var(--text-secondary)">/ unit</small>
                    </div>
                  </div>
                  <div style="text-align:right">
                    <span style="font-size:10px; color:var(--text-secondary)">Retail MRP</span>
                    <div style="font-size:11px; text-decoration:line-through; color:var(--text-secondary)">${formatPrice(p.price)}</div>
                  </div>
                </div>

                <!-- Tier Pricing Badges -->
                ${tiers.length > 0 ? `
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:8px; font-size:11px">
                    ${tiers.slice(0, 2).map(t => `
                      <div style="background:var(--bg-white); border:1px solid var(--border); border-radius:var(--radius-sm); padding:4px 6px">
                        <div style="color:var(--text-secondary); font-size:9px">${t.label}</div>
                        <div style="font-weight:700; color:var(--primary)">${formatPrice(t.price)}/ea</div>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
              </div>

              <!-- Add to Wholesale Cart Quick Controls -->
              <div style="display:flex; gap:8px; align-items:center">
                <div style="display:flex; align-items:center; border:1px solid var(--border); border-radius:var(--radius-sm); overflow:hidden; background:var(--bg-white)">
                  <button class="btn-step-qty" data-id="${p.id}" data-delta="-5" style="background:var(--bg-light); border:none; padding:6px 10px; font-weight:700; cursor:pointer">−</button>
                  <input type="number" id="qty-input-${p.id}" value="${p.moq}" min="${p.moq}" style="width:40px; border:none; text-align:center; font-size:12px; font-weight:700; outline:none">
                  <button class="btn-step-qty" data-id="${p.id}" data-delta="5" style="background:var(--bg-light); border:none; padding:6px 10px; font-weight:700; cursor:pointer">+</button>
                </div>
                <button class="btn btn-primary btn-sm btn-add-b2b" data-id="${p.id}" style="flex:1; height:34px; font-size:12px; font-weight:700">
                  Add to Cart
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Click events
    container.querySelectorAll('.b2b-prod-title').forEach(item => {
      item.addEventListener('click', () => {
        navigate(`wholesale/product/${item.dataset.id}`);
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

  const nav = renderWholesaleBottomNav('products');
  el.appendChild(nav);
  appEl.appendChild(el);

  return { 
    unmount() { 
      if (nav._unsub) nav._unsub(); 
    } 
  };
}
