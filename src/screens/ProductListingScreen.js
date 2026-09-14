// ========================================
// Product Listing Screen — OrthoCare
// ========================================

import { navigate } from '../router.js';
import { categories } from '../data/categories.js';
import { products, getProductsByCategory, formatPrice } from '../data/products.js';
import { icons } from '../data/icons.js';
import { renderBackHeader, renderBottomNav, renderProductCard, renderEmptyState, showModal } from '../components/index.js';

export default function ProductListingScreen(appEl, categoryId) {
  const el = document.createElement('div');
  el.className = 'screen screen-with-nav';

  const category = categories.find(c => c.id === categoryId);
  const catName = category ? category.name : (categoryId === 'all' ? 'All Products' : 'Orthopedic Products');
  let productList = categoryId === 'all' ? [...products] : getProductsByCategory(categoryId);
  let filteredList = [...productList];
  let sortBy = 'relevance';
  let activeFilters = { sizes: [], priceRange: null, supportLevel: null };

  // 1. Header
  el.appendChild(renderBackHeader(catName));

  // 2. Bar with count & Filter/Sort buttons
  const bar = document.createElement('div');
  bar.style.padding = '12px 16px';
  bar.style.display = 'flex';
  bar.style.justifyContent = 'space-between';
  bar.style.alignItems = 'center';
  bar.style.background = '#FFFFFF';
  bar.style.borderBottom = '1px solid var(--border)';

  function updateBar() {
    bar.innerHTML = `
      <span style="font-size:12px;font-weight:600;color:var(--text-secondary)">${filteredList.length} Products</span>
      <div style="display:flex;gap:8px">
        <button class="btn btn-secondary btn-sm" id="filter-btn">
          ${icons.filter} Filter
        </button>
        <button class="btn btn-secondary btn-sm" id="sort-btn">
          ${icons.sort} Sort
        </button>
      </div>
    `;
    bar.querySelector('#filter-btn').addEventListener('click', showFilterModal);
    bar.querySelector('#sort-btn').addEventListener('click', showSortModal);
  }
  updateBar();
  el.appendChild(bar);

  // 3. Grid Container
  const gridContainer = document.createElement('div');
  gridContainer.style.padding = '16px';
  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = '1fr 1fr';
  grid.style.gap = '12px';
  gridContainer.appendChild(grid);
  el.appendChild(gridContainer);

  function renderGrid() {
    grid.innerHTML = '';
    if (filteredList.length === 0) {
      grid.style.display = 'block';
      grid.appendChild(renderEmptyState({
        icon: icons.search,
        title: 'No products found',
        desc: 'Try adjusting your filters or price range to find matching supports.',
        ctaLabel: 'Clear Filters',
        ctaAction: () => {
          activeFilters = { sizes: [], priceRange: null, supportLevel: null };
          filteredList = [...productList];
          updateBar();
          grid.style.display = 'grid';
          renderGrid();
        }
      }));
      return;
    }
    grid.style.display = 'grid';
    filteredList.forEach(p => grid.appendChild(renderProductCard(p)));
  }
  renderGrid();

  // Sort Modal
  function showSortModal() {
    const options = [
      { id: 'relevance', label: 'Relevance & Popularity' },
      { id: 'price-low', label: 'Price: Low to High' },
      { id: 'price-high', label: 'Price: High to Low' },
      { id: 'rating', label: 'Customer Rating' },
      { id: 'discount', label: 'Discount %' },
    ];
    const { close, container } = showModal('Sort Products', `
      <div style="display:flex;flex-direction:column;gap:6px">
        ${options.map(o => `
          <div class="sort-option" data-sort="${o.id}" style="padding:12px 14px;border-radius:var(--radius-md);border:1px solid ${sortBy === o.id ? 'var(--primary)' : 'var(--border)'};background:${sortBy === o.id ? 'var(--primary-bg)' : '#FFFFFF'};display:flex;justify-content:space-between;align-items:center;cursor:pointer">
            <span style="font-size:13px;font-weight:${sortBy === o.id ? '700' : '500'};color:var(--text)">${o.label}</span>
            ${sortBy === o.id ? `<span style="color:var(--primary)">${icons.check}</span>` : ''}
          </div>
        `).join('')}
      </div>
    `);

    container.querySelectorAll('[data-sort]').forEach(btn => {
      btn.addEventListener('click', () => {
        sortBy = btn.dataset.sort;
        applySort();
        renderGrid();
        close();
      });
    });
  }

  function applySort() {
    if (sortBy === 'price-low') filteredList.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') filteredList.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') filteredList.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === 'discount') filteredList.sort((a, b) => (b.discount || 0) - (a.discount || 0));
  }

  // Filter Modal
  function showFilterModal() {
    const { close, container } = showModal('Filter Products', `
      <div style="display:flex;flex-direction:column;gap:18px">
        <div>
          <label style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:8px;display:block">Price Range</label>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <button class="btn btn-secondary btn-sm ${activeFilters.priceRange === 'under-1000' ? 'active' : ''}" data-price="under-1000">Under ₹1,000</button>
            <button class="btn btn-secondary btn-sm ${activeFilters.priceRange === '1000-2500' ? 'active' : ''}" data-price="1000-2500">₹1,000 – ₹2,500</button>
            <button class="btn btn-secondary btn-sm ${activeFilters.priceRange === 'above-2500' ? 'active' : ''}" data-price="above-2500">Above ₹2,500</button>
            <button class="btn btn-secondary btn-sm ${!activeFilters.priceRange ? 'active' : ''}" data-price="all">All Prices</button>
          </div>
        </div>
        <div>
          <label style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:8px;display:block">Available Sizes</label>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${['Universal', 'S', 'M', 'L', 'XL', 'XXL'].map(sz => `
              <button class="size-chip btn btn-secondary btn-sm ${activeFilters.sizes.includes(sz) ? 'active' : ''}" data-size="${sz}">${sz}</button>
            `).join('')}
          </div>
        </div>
      </div>
    `, `
      <button class="btn btn-ghost btn-sm" id="btn-reset-filters">Reset</button>
      <button class="btn btn-primary btn-sm" id="btn-apply-filters">Apply Filters</button>
    `);

    container.querySelectorAll('[data-price]').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('[data-price]').forEach(b => b.classList.remove('btn-primary'));
        btn.classList.add('btn-primary');
        activeFilters.priceRange = btn.dataset.price === 'all' ? null : btn.dataset.price;
      });
    });

    container.querySelectorAll('.size-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const sz = btn.dataset.size;
        if (activeFilters.sizes.includes(sz)) {
          activeFilters.sizes = activeFilters.sizes.filter(s => s !== sz);
          btn.classList.remove('btn-primary');
        } else {
          activeFilters.sizes.push(sz);
          btn.classList.add('btn-primary');
        }
      });
    });

    container.querySelector('#btn-reset-filters')?.addEventListener('click', () => {
      activeFilters = { sizes: [], priceRange: null, supportLevel: null };
      filteredList = [...productList];
      applySort();
      updateBar();
      renderGrid();
      close();
    });

    container.querySelector('#btn-apply-filters')?.addEventListener('click', () => {
      filteredList = productList.filter(p => {
        if (activeFilters.priceRange === 'under-1000' && p.price >= 1000) return false;
        if (activeFilters.priceRange === '1000-2500' && (p.price < 1000 || p.price > 2500)) return false;
        if (activeFilters.priceRange === 'above-2500' && p.price <= 2500) return false;
        if (activeFilters.sizes.length > 0 && p.sizes) {
          const match = p.sizes.some(s => activeFilters.sizes.includes(s));
          if (!match) return false;
        }
        return true;
      });
      applySort();
      updateBar();
      renderGrid();
      close();
    });
  }

  appEl.appendChild(el);

  const nav = renderBottomNav('categories');
  appEl.appendChild(nav);

  return { unmount() { if (nav._unsub) nav._unsub(); } };
}
