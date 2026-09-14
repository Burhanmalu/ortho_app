// ========================================
// Search Screen
// ========================================
import { navigate } from '../router.js';
import { icons } from '../data/icons.js';
import { searchProducts, formatPrice } from '../data/products.js';
import * as store from '../store.js';
import { renderProductCard, renderBottomNav, renderEmptyState } from '../components/index.js';

export default function SearchScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen screen-with-nav';

  const trending = ['Knee support', 'Lumbar belt', 'Walking stick', 'Posture corrector', 'Cervical pillow', 'Ankle brace'];

  el.innerHTML = `
    <div class="search-header">
      <button class="back-btn" id="search-back">${icons.back}</button>
      <div class="search-input-wrap">
        <span style="color:var(--color-text-tertiary)">${icons.search}</span>
        <input type="text" id="search-input" placeholder="Search orthopedic products..." autofocus />
        <button id="search-clear" style="display:none;color:var(--color-text-tertiary)">${icons.close}</button>
      </div>
    </div>
    <div id="search-content"></div>
  `;

  appEl.appendChild(el);

  const input = el.querySelector('#search-input');
  const clearBtn = el.querySelector('#search-clear');
  const content = el.querySelector('#search-content');

  function renderDefault() {
    const history = store.getSearchHistory();
    content.innerHTML = `
      ${history.length > 0 ? `
        <div class="search-section">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--sp-md)">
            <span class="search-section-title" style="margin-bottom:0">Recent Searches</span>
            <button id="clear-history" style="font-size:var(--fs-sm);color:var(--color-primary);font-weight:600">Clear</button>
          </div>
          <div>${history.map(t => `<span class="search-tag" data-term="${t}">${icons.clock} ${t}</span>`).join('')}</div>
        </div>
      ` : ''}
      <div class="search-section">
        <span class="search-section-title">Trending Searches</span>
        <div>${trending.map(t => `<span class="search-tag" data-term="${t}">${icons.trending} ${t}</span>`).join('')}</div>
      </div>
    `;

    content.querySelectorAll('.search-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        input.value = tag.dataset.term;
        doSearch(tag.dataset.term);
      });
    });

    const clearH = content.querySelector('#clear-history');
    if (clearH) {
      clearH.addEventListener('click', () => {
        store.clearSearchHistory();
        renderDefault();
      });
    }
  }

  function doSearch(query) {
    if (!query.trim()) { renderDefault(); return; }
    store.addSearchHistory(query.trim());
    clearBtn.style.display = 'block';

    const results = searchProducts(query);
    if (results.length === 0) {
      content.innerHTML = '';
      content.appendChild(renderEmptyState({
        icon: icons.search,
        title: `No results for "${query}"`,
        desc: 'We couldn’t find products matching your search terms. Try searching for knee, lumbar, or cervical.',
        ctaLabel: 'Browse All Categories',
        ctaAction: () => navigate('categories')
      }));
      return;
    }

    content.innerHTML = `
      <div style="padding:var(--sp-sm) var(--content-padding);font-size:var(--fs-sm);color:var(--color-text-secondary)">${results.length} results for "${query}"</div>
      <div class="product-grid" id="search-results" style="padding:0 var(--content-padding)"></div>
    `;
    const grid = content.querySelector('#search-results');
    results.forEach(p => grid.appendChild(renderProductCard(p)));
  }

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const val = input.value;
    clearBtn.style.display = val ? 'block' : 'none';
    debounceTimer = setTimeout(() => doSearch(val), 300);
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.style.display = 'none';
    renderDefault();
    input.focus();
  });

  el.querySelector('#search-back').addEventListener('click', () => window.history.back());

  renderDefault();

  const nav = renderBottomNav('home');
  appEl.appendChild(nav);

  return { unmount() { clearTimeout(debounceTimer); if (nav._unsub) nav._unsub(); } };
}
