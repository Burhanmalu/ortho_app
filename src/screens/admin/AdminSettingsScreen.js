// ========================================
// Admin Settings Screen - Redesigned
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { icons } from '../../data/icons.js';
import { renderAdminLayout } from './AdminLayout.js';

export default function AdminSettingsScreen(appEl) {
  const content = document.createElement('div');

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px; flex-wrap:wrap; gap:12px">
      <div>
        <h1 style="font-size:20px; font-weight:800; color:var(--deep-navy); margin:0 0 4px">Platform & Statutory Settings</h1>
        <div style="font-size:12px; color:var(--text-secondary)">Legal entity profile, GSTIN parameters, and system reset utilities</div>
      </div>
      <button id="btn-save-settings" class="btn btn-primary btn-sm">
        Save Platform Changes
      </button>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:16px">
      <!-- Legal Entity Details -->
      <div class="card" style="padding:18px">
        <h3 style="font-size:14px; font-weight:700; color:var(--deep-navy); margin-bottom:14px; display:flex; align-items:center; gap:8px">
          <span style="color:var(--primary); width:18px; height:18px; display:inline-flex">${icons.building || icons.hospital}</span>
          Registered Healthcare Enterprise
        </h3>
        <div style="display:flex; flex-direction:column; gap:12px; font-size:12px">
          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Legal Seller Company Name</label>
            <input type="text" value="OrthoCare Healthcare India Private Limited" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
            <div>
              <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Master GSTIN</label>
              <input type="text" value="07AAFCO9918K1ZZ" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
            </div>
            <div>
              <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Corporate CIN</label>
              <input type="text" value="U85110DL2024PTC391024" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
            </div>
          </div>
          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Central Dispatch Logistics Hub</label>
            <textarea rows="2" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none; resize:vertical">Plot 104, Okhla Industrial Area Phase III, New Delhi 110020</textarea>
          </div>
        </div>
      </div>

      <!-- Demo Controls & Reset -->
      <div class="card" style="padding:18px">
        <h3 style="font-size:14px; font-weight:700; color:var(--deep-navy); margin-bottom:14px; display:flex; align-items:center; gap:8px">
          <span style="color:var(--primary); width:18px; height:18px; display:inline-flex">${icons.shield || icons.settings}</span>
          System Environment & Demo Controls
        </h3>
        <p style="font-size:12px; color:var(--text-secondary); margin-bottom:16px; line-height:1.4">
          Reset all mock records (orders, buyers, verifications, modified inventories) back to baseline state for client demonstration.
        </p>

        <div style="display:flex; flex-direction:column; gap:10px">
          <button id="btn-reset-demo-all" class="btn btn-danger" style="height:42px; font-weight:700; display:inline-flex; align-items:center; justify-content:center; gap:6px">
            ${icons.repeat} Reset Database to Factory State
          </button>
          <button id="btn-switch-cust-now" class="btn btn-secondary" style="height:42px; font-weight:700; display:inline-flex; align-items:center; justify-content:center; gap:6px">
            ${icons.cart} Open Retail Customer Experience
          </button>
        </div>
      </div>
    </div>
  `;

  content.querySelector('#btn-save-settings')?.addEventListener('click', () => {
    store.emit('toast', { message: 'Platform settings saved successfully', type: 'success' });
  });

  content.querySelector('#btn-reset-demo-all')?.addEventListener('click', () => {
    if (confirm('Reset entire prototype data back to initial mock state?')) {
      store.resetStore();
      store.emit('toast', { message: 'Database reset to factory state', type: 'info' });
      navigate('admin/dashboard');
    }
  });

  content.querySelector('#btn-switch-cust-now')?.addEventListener('click', () => {
    store.setRole('customer');
    navigate('home');
  });

  const fullLayout = renderAdminLayout('settings', content);
  appEl.appendChild(fullLayout);
  return fullLayout;
}
