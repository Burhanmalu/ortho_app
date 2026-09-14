// ========================================
// Admin Categories Management Screen - Redesigned
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { categories } from '../../data/categories.js';
import { icons } from '../../data/icons.js';
import { renderAdminLayout } from './AdminLayout.js';
import { showModal } from '../../components/index.js';

export default function AdminCategoriesScreen(appEl) {
  const content = document.createElement('div');

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px; flex-wrap:wrap; gap:12px">
      <div>
        <h1 style="font-size:20px; font-weight:800; color:var(--deep-navy); margin:0 0 4px">Category Taxonomy</h1>
        <div style="font-size:12px; color:var(--text-secondary)">Manage 12 medical categories, SVG icon assignments, and storefront hierarchy</div>
      </div>
      <button id="btn-add-cat" class="btn btn-primary btn-sm" style="display:inline-flex; align-items:center; gap:6px">
        + Add New Category
      </button>
    </div>

    <!-- Category Grid -->
    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:14px">
      ${categories.map((c, idx) => {
        const svgIcon = (c.iconKey && icons[c.iconKey]) ? icons[c.iconKey] : icons.knee;
        return `
          <div class="card" style="padding:14px; display:flex; gap:12px; align-items:center">
            <div style="width:44px; height:44px; border-radius:var(--radius-md); background:rgba(23, 107, 135, 0.08); color:var(--primary); display:flex; align-items:center; justify-content:center; flex-shrink:0">
              <span style="width:22px; height:22px; display:inline-flex">${svgIcon}</span>
            </div>
            <div style="flex:1; min-width:0">
              <div style="font-weight:700; color:var(--text); font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">${c.name}</div>
              <div style="font-size:11px; color:var(--text-secondary); margin-top:2px">ID: <code>${c.id}</code> • Seq: #${idx + 1}</div>
              <div style="margin-top:6px; display:flex; gap:6px">
                <span class="status-pill status-active" style="font-size:10px; padding:2px 8px">
                  <span class="status-pill-dot"></span>
                  Storefront Live
                </span>
              </div>
            </div>
            <button class="btn btn-secondary btn-sm btn-edit-cat" data-id="${c.id}" style="padding:4px 10px; font-size:11px">
              Edit
            </button>
          </div>
        `;
      }).join('')}
    </div>
  `;

  content.querySelector('#btn-add-cat')?.addEventListener('click', () => {
    const modalHtml = `
      <div style="font-size:13px; display:flex; flex-direction:column; gap:12px">
        <div>
          <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Category Title</label>
          <input type="text" id="new-cat-name" placeholder="e.g. Spine & Vertebrae Orthotics" style="width:100%; padding:8px 12px; border:1px solid var(--border); border-radius:var(--radius-sm); font-size:13px; outline:none">
        </div>
        <div>
          <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">URL Slug</label>
          <input type="text" id="new-cat-slug" placeholder="e.g. spine-supports" style="width:100%; padding:8px 12px; border:1px solid var(--border); border-radius:var(--radius-sm); font-size:13px; outline:none">
        </div>
        <button class="btn btn-primary btn-block" id="btn-modal-save-cat" style="margin-top:6px">Save Category</button>
      </div>
    `;
    showModal('Add Orthopedic Category', modalHtml);
    setTimeout(() => {
      document.querySelector('#btn-modal-save-cat')?.addEventListener('click', () => {
        store.emit('toast', { message: 'New medical category published to catalog', type: 'success' });
        document.querySelector('#modal-close')?.click();
      });
    }, 50);
  });

  content.querySelectorAll('.btn-edit-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      const c = categories.find(cat => cat.id === btn.dataset.id);
      const modalHtml = `
        <div style="font-size:13px; display:flex; flex-direction:column; gap:12px">
          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Category Name</label>
            <input type="text" value="${c ? c.name : ''}" style="width:100%; padding:8px 12px; border:1px solid var(--border); border-radius:var(--radius-sm); font-size:13px; outline:none">
          </div>
          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Status</label>
            <select style="width:100%; padding:8px 12px; border:1px solid var(--border); border-radius:var(--radius-sm); font-size:13px; outline:none">
              <option value="active" selected>Active / Visible</option>
              <option value="inactive">Hidden</option>
            </select>
          </div>
          <button class="btn btn-primary btn-block" id="btn-modal-update-cat" style="margin-top:6px">Update Category</button>
        </div>
      `;
      showModal(`Edit Category — ${c ? c.name : ''}`, modalHtml);
      setTimeout(() => {
        document.querySelector('#btn-modal-update-cat')?.addEventListener('click', () => {
          store.emit('toast', { message: 'Category settings updated successfully', type: 'success' });
          document.querySelector('#modal-close')?.click();
        });
      }, 50);
    });
  });

  const fullLayout = renderAdminLayout('categories', content);
  appEl.appendChild(fullLayout);
  return fullLayout;
}
