// ========================================
// Admin Categories Management Screen
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { categories } from '../../data/categories.js';
import { renderAdminLayout } from './AdminLayout.js';
import { showModal } from '../../components/index.js';

export default function AdminCategoriesScreen(appEl) {
  const content = document.createElement('div');

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px; flex-wrap:wrap; gap:12px">
      <div>
        <h1 style="font-size:24px; font-weight:800; color:#0f172a; margin:0 0 4px">Orthopedic Category Taxonomy</h1>
        <div style="font-size:13px; color:#64748b">Manage the 12 medical categories, featured icons, and display ordering</div>
      </div>
      <button id="btn-add-cat" class="admin-btn admin-btn-primary">
        + Add New Category
      </button>
    </div>

    <!-- Category Grid -->
    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:16px">
      ${categories.map((c, idx) => `
        <div class="card" style="padding:16px; border-radius:12px; display:flex; gap:14px; align-items:center; border:1px solid #e2e8f0">
          <div style="width:48px; height:48px; border-radius:10px; background:#f0fdfa; color:#0d9488; display:flex; align-items:center; justify-content:center; font-size:24px">
            ${c.icon || '🩺'}
          </div>
          <div style="flex:1">
            <div style="font-weight:700; color:#0f172a; font-size:14px">${c.name}</div>
            <div style="font-size:11px; color:#64748b">ID: <code>${c.id}</code> • Position #${idx + 1}</div>
            <div style="margin-top:6px; display:flex; gap:6px">
              <span class="admin-status-badge active" style="font-size:10px">● Live</span>
              <span class="b2b-badge tier-silver" style="font-size:10px">Featured</span>
            </div>
          </div>
          <button class="admin-btn admin-btn-secondary admin-btn-sm btn-edit-cat" data-id="${c.id}">
            Edit
          </button>
        </div>
      `).join('')}
    </div>
  `;

  content.querySelector('#btn-add-cat').addEventListener('click', () => {
    const modalHtml = `
      <div style="font-size:13px; display:flex; flex-direction:column; gap:10px">
        <label>Category Title</label>
        <input type="text" placeholder="e.g. Spine & Vertebrae" class="input" style="width:100%">
        <button class="admin-btn admin-btn-primary" onclick="alert('Category created (Simulated)'); document.querySelector('#modal-close').click()">Add Category</button>
      </div>
    `;
    showModal('Add Orthopedic Category', modalHtml);
  });

  content.querySelectorAll('.btn-edit-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      alert(`Category edit dialog opened for ${btn.dataset.id} (Simulated)`);
    });
  });

  const fullLayout = renderAdminLayout('categories', content);
  appEl.appendChild(fullLayout);
  return fullLayout;
}
