// ========================================
// Categories Screen — Orthopedic Product Directory
// ========================================

import { navigate } from '../router.js';
import { categories } from '../data/categories.js';
import { icons } from '../data/icons.js';
import { renderBottomNav, renderBackHeader } from '../components/index.js';

export default function CategoriesScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen screen-with-nav';

  el.appendChild(renderBackHeader('Orthopedic Categories'));

  const container = document.createElement('div');
  container.style.padding = '16px';

  container.innerHTML = `
    <div style="margin-bottom:14px;font-size:13px;color:var(--text-secondary)">
      Select an anatomical focus or specialized support category
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      ${categories.map(c => `
        <div class="category-card card" data-cat="${c.id}" style="padding:16px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;cursor:pointer;transition:all var(--duration-fast)">
          <div style="width:48px;height:48px;border-radius:var(--radius-md);background:var(--primary-bg);color:var(--primary);display:flex;align-items:center;justify-content:center">
            ${icons[c.iconKey] || icons.package}
          </div>
          <div>
            <div style="font-size:14px;font-weight:700;color:var(--text);line-height:1.25">${c.name}</div>
            <div style="font-size:11px;color:var(--text-secondary);margin-top:2px">${c.count} Products</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => navigate(`listing/${card.dataset.cat}`));
  });

  el.appendChild(container);
  appEl.appendChild(el);

  const nav = renderBottomNav('categories');
  appEl.appendChild(nav);

  return { unmount() { if (nav._unsub) nav._unsub(); } };
}
