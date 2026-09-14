// ========================================
// Product Listing Screen
// ========================================
import { navigate } from '../router.js';
import { categories } from '../data/categories.js';
import { products, getProductsByCategory, formatPrice } from '../data/products.js';
import { icons } from '../data/icons.js';
import { renderBackHeader, renderBottomNav, renderProductCard, showModal, closeModal } from '../components/index.js';

export default function ProductListingScreen(appEl, categoryId) {
  const el = document.createElement('div');
  el.className = 'screen screen-with-nav';

  const category = categories.find(c => c.id === categoryId);
  const catName = category ? category.name : 'All Products';
  let productList = categoryId === 'all' ? [...products] : getProductsByCategory(categoryId);
  let filteredList = [...productList];
  let sortBy = 'relevance';
  let activeFilters = { sizes: [], priceRange: null, supportLevel: null, material: null };

  // Header
  el.appendChild(renderBackHeader(catName));

  // Listing header with count + filter/sort
  const listingHeader = document.createElement('div');
  listingHeader.className = 'listing-header';
  function updateListingHeader() {
    listingHeader.innerHTML = `
      <span class="listing-count">${filteredList.length} Products</span>
      <div class="listing-actions">
        <button class="listing-action-btn" id="filter-btn">${icons.filter} Filter</button>
        <button class="listing-action-btn" id="sort-btn">${icons.sort} Sort</button>
      </div>
    `;
    listingHeader.querySelector('#filter-btn').addEventListener('click', showFilterModal);
    listingHeader.querySelector('#sort-btn').addEventListener('click', showSortModal);
  }
  updateListingHeader();
  el.appendChild(listingHeader);

  // Product grid
  const gridContainer = document.createElement('div');
  gridContainer.style.padding = 'var(--sp-md) 0';
  const grid = document.createElement('div');
  grid.className = 'product-grid';
  gridContainer.appendChild(grid);
  el.appendChild(gridContainer);

  function renderGrid() {
    grid.innerHTML = '';
    if (filteredList.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;padding:var(--sp-4xl) var(--sp-2xl);text-align:center">
          <div style="font-size:48px;margin-bottom:var(--sp-lg);opacity:0.4">🔍</div>
          <h3 style="font-size:var(--fs-lg);margin-bottom:var(--sp-sm)">No products found</h3>
          <p style="color:var(--color-text-secondary);font-size:var(--fs-md)">Try adjusting your filters</p>
        </div>
      `;
      return;
    }
    filteredList.forEach(p => grid.appendChild(renderProductCard(p)));
  }
  renderGrid();

  // Sort modal
  function showSortModal() {
    const options = [
      { id: 'relevance', label: 'Relevance' },
      { id: 'price-low', label: 'Price: Low to High' },
      { id: 'price-high', label: 'Price: High to Low' },
      { id: 'rating', label: 'Customer Rating' },
      { id: 'discount', label: 'Discount' },
      { id: 'newest', label: 'Newest First' },
    ];
    const { close, container } = showModal('Sort By', `
      <div style="display:flex;flex-direction:column;gap:4px">
        ${options.map(o => `
          <button class="payment-option ${sortBy === o.id ? 'selected' : ''}" data-sort="${o.id}" style="cursor:pointer">
            <div class="payment-radio"></div>
            <span class="payment-label">${o.label}</span>
          </button>
        `).join('')}
      </div>
    `);

    container.querySelectorAll('[data-sort]').forEach(btn => {
      btn.addEventListener('click', () => {
        sortBy = btn.dataset.sort;
        applySort();
        renderGrid();
        updateListingHeader();
        close();
      });
    });
  }

  function applySort() {
    switch (sortBy) {
      case 'price-low': filteredList.sort((a, b) => a.price - b.price); break;
      case 'price-high': filteredList.sort((a, b) => b.price - a.price); break;
      case 'rating': filteredList.sort((a, b) => b.rating - a.rating); break;
      case 'discount': filteredList.sort((a, b) => b.discount - a.discount); break;
      default: filteredList = [...productList]; break;
    }
  }

  // Filter modal
  function showFilterModal() {
    const { close, container } = showModal('Filters', `
      <div class="filter-section">
        <div class="filter-section-title">Size</div>
        <div class="filter-options">
          ${['S','M','L','XL','XXL','Free Size'].map(s => `
            <button class="filter-option ${activeFilters.sizes.includes(s) ? 'selected' : ''}" data-filter="size" data-val="${s}">${s}</button>
          `).join('')}
        </div>
      </div>
      <div class="filter-section">
        <div class="filter-section-title">Price Range</div>
        <div class="filter-options">
          ${[
            { val: '0-500', label: 'Under ₹500' },
            { val: '500-1000', label: '₹500 – ₹1,000' },
            { val: '1000-2500', label: '₹1,000 – ₹2,500' },
            { val: '2500-99999', label: '₹2,500+' },
          ].map(r => `
            <button class="filter-option ${activeFilters.priceRange === r.val ? 'selected' : ''}" data-filter="price" data-val="${r.val}">${r.label}</button>
          `).join('')}
        </div>
      </div>
      <div class="filter-section">
        <div class="filter-section-title">Rating</div>
        <div class="filter-options">
          ${['4', '3', '2'].map(r => `
            <button class="filter-option" data-filter="rating" data-val="${r}">${r}★ & Above</button>
          `).join('')}
        </div>
      </div>
    `, `
      <button class="btn btn-secondary btn-block" id="filter-clear">Clear All</button>
      <button class="btn btn-primary btn-block" id="filter-apply">Apply Filters</button>
    `);

    // Toggle filter selections
    container.querySelectorAll('.filter-option').forEach(opt => {
      opt.addEventListener('click', () => opt.classList.toggle('selected'));
    });

    container.querySelector('#filter-apply').addEventListener('click', () => {
      // Read selected filters
      const selectedSizes = [...container.querySelectorAll('[data-filter="size"].selected')].map(e => e.dataset.val);
      const selectedPrice = container.querySelector('[data-filter="price"].selected');
      const selectedRating = container.querySelector('[data-filter="rating"].selected');

      activeFilters.sizes = selectedSizes;
      activeFilters.priceRange = selectedPrice ? selectedPrice.dataset.val : null;

      // Apply
      filteredList = [...productList];
      if (selectedSizes.length > 0) {
        filteredList = filteredList.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
      }
      if (selectedPrice) {
        const [min, max] = selectedPrice.dataset.val.split('-').map(Number);
        filteredList = filteredList.filter(p => p.price >= min && p.price <= max);
      }
      if (selectedRating) {
        const minR = parseFloat(selectedRating.dataset.val);
        filteredList = filteredList.filter(p => p.rating >= minR);
      }
      applySort();
      renderGrid();
      updateListingHeader();
      close();
    });

    container.querySelector('#filter-clear').addEventListener('click', () => {
      activeFilters = { sizes: [], priceRange: null, supportLevel: null, material: null };
      filteredList = [...productList];
      renderGrid();
      updateListingHeader();
      close();
    });
  }

  appEl.appendChild(el);
  const nav = renderBottomNav('categories');
  appEl.appendChild(nav);

  return { unmount() { if (nav._unsub) nav._unsub(); } };
}
