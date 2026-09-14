// ========================================
// Categories Screen
// ========================================
import { navigate } from '../router.js';
import { categories } from '../data/categories.js';
import { renderBottomNav, renderBackHeader } from '../components/index.js';

export default function CategoriesScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen screen-with-nav';

  el.appendChild(renderBackHeader('Categories'));

  const grid = document.createElement('div');
  grid.className = 'categories-grid animate-stagger';
  grid.innerHTML = categories.map(c => `
    <div class="category-card" data-cat="${c.id}">
      <div class="category-card-icon" style="background:${c.bgColor};color:${c.color};font-size:30px">${c.icon}</div>
      <div class="category-card-name">${c.name}</div>
      <div class="category-card-count">${c.count} Products</div>
    </div>
  `).join('');

  grid.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => navigate(`listing/${card.dataset.cat}`));
  });

  el.appendChild(grid);
  appEl.appendChild(el);

  const nav = renderBottomNav('categories');
  appEl.appendChild(nav);

  return { unmount() { if (nav._unsub) nav._unsub(); } };
}
