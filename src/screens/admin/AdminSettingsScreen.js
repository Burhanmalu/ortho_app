// ========================================
// Admin Settings Screen
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { renderAdminLayout } from './AdminLayout.js';

export default function AdminSettingsScreen(appEl) {
  const content = document.createElement('div');

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px; flex-wrap:wrap; gap:12px">
      <div>
        <h1 style="font-size:24px; font-weight:800; color:#0f172a; margin:0 0 4px">Platform & Statutory Configuration</h1>
        <div style="font-size:13px; color:#64748b">Legal company identity, GST filing parameters, and default procurement rules</div>
      </div>
      <button id="btn-save-settings" class="admin-btn admin-btn-primary">
        Save Changes
      </button>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px">
      <!-- Legal Entity Details -->
      <div class="admin-card" style="padding:20px">
        <h3 style="font-size:15px; font-weight:800; color:#0f3647; margin-bottom:14px">
          🏢 Registered Enterprise Entity
        </h3>
        <div style="display:flex; flex-direction:column; gap:12px; font-size:13px">
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Legal Seller Company Name</label>
            <input type="text" value="OrthoCare Healthcare India Private Limited" class="input" style="width:100%">
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
            <div>
              <label style="font-weight:700; display:block; margin-bottom:4px">Master GSTIN</label>
              <input type="text" value="07AAFCO9918K1ZZ" class="input" style="width:100%">
            </div>
            <div>
              <label style="font-weight:700; display:block; margin-bottom:4px">Corporate CIN</label>
              <input type="text" value="U85110DL2024PTC391024" class="input" style="width:100%">
            </div>
          </div>
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Central Dispatch Hub Address</label>
            <textarea rows="2" class="input" style="width:100%">Plot 104, Okhla Industrial Area Phase III, New Delhi 110020</textarea>
          </div>
        </div>
      </div>

      <!-- Demo Controls & Reset -->
      <div class="admin-card" style="padding:20px">
        <h3 style="font-size:15px; font-weight:800; color:#0f3647; margin-bottom:14px">
          ⚡ Prototype & Demo Controls
        </h3>
        <p style="font-size:13px; color:#64748b; margin-bottom:16px">
          Reset all mock data (orders, verification status, updated stocks) back to pristine initial state for demonstration purposes.
        </p>

        <div style="display:flex; flex-direction:column; gap:10px">
          <button id="btn-reset-demo-all" class="admin-btn admin-btn-danger" style="padding:12px; font-weight:700">
            🔄 Reset Entire Mock Database to Factory State
          </button>
          <button id="btn-switch-cust-now" class="admin-btn admin-btn-secondary" style="padding:12px; font-weight:700">
            🛒 Open Retail Customer View
          </button>
        </div>
      </div>
    </div>
  `;

  content.querySelector('#btn-save-settings').addEventListener('click', () => {
    store.emitter.emit('toast', { message: 'Platform settings saved successfully', type: 'success' });
  });

  content.querySelector('#btn-reset-demo-all').addEventListener('click', () => {
    if (confirm('Reset entire prototype data back to initial mock state?')) {
      store.resetStore();
      navigate('admin/dashboard');
    }
  });

  content.querySelector('#btn-switch-cust-now').addEventListener('click', () => {
    store.setRole('customer');
    navigate('home');
  });

  const fullLayout = renderAdminLayout('settings', content);
  appEl.appendChild(fullLayout);
  return fullLayout;
}
