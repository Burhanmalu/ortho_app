// ========================================
// Admin Pricing & Wholesale Tiers Management
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { wholesaleTiers } from '../../data/adminData.js';
import { renderAdminLayout } from './AdminLayout.js';

export default function AdminPricingScreen(appEl) {
  const content = document.createElement('div');

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px; flex-wrap:wrap; gap:12px">
      <div>
        <h1 style="font-size:24px; font-weight:800; color:#0f172a; margin:0 0 4px">Wholesale Tier & Margin Rules</h1>
        <div style="font-size:13px; color:#64748b">Define institutional volume rebates, credit terms, and qualification criteria</div>
      </div>
      <button id="btn-save-tier-rules" class="admin-btn admin-btn-primary">
        Save Policy Changes
      </button>
    </div>

    <!-- Tiers Grid -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px; margin-bottom:24px">
      ${wholesaleTiers.map(t => `
        <div class="card" style="padding:18px; border-radius:14px; border-top:4px solid ${t.badgeColor}">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
            <h3 style="font-size:16px; font-weight:800; color:#0f172a; margin:0">${t.tier} Tier</h3>
            <span class="b2b-badge" style="background:${t.badgeColor}22; color:${t.badgeColor}">Active</span>
          </div>
          <p style="font-size:12px; color:#64748b; margin-bottom:14px">${t.description}</p>

          <div style="display:flex; flex-direction:column; gap:10px; font-size:12px">
            <div>
              <label style="color:#64748b; font-weight:600; display:block; margin-bottom:2px">Extra Volume Rebate (%):</label>
              <input type="number" value="${t.discountPercent}" class="input" style="width:100%; font-weight:700">
            </div>
            <div>
              <label style="color:#64748b; font-weight:600; display:block; margin-bottom:2px">Min Order Units (MOQ):</label>
              <input type="number" value="${t.minOrderQty}" class="input" style="width:100%; font-weight:700">
            </div>
            <div>
              <label style="color:#64748b; font-weight:600; display:block; margin-bottom:2px">Approved Credit Terms:</label>
              <input type="text" value="${t.creditDays === 0 ? 'Advance / COD' : `Net ${t.creditDays} Days`}" class="input" style="width:100%; font-weight:700">
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Default B2B Tax & Margin Policies -->
    <div class="admin-card" style="padding:20px">
      <h3 style="font-size:15px; font-weight:800; color:#0f3647; margin-bottom:14px">
        Statutory Taxation & Freight Margin Settings
      </h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px; font-size:13px">
        <div>
          <label style="font-weight:700; display:block; margin-bottom:4px">Standard Orthopedic GST Rate</label>
          <input type="text" value="18% (HSN 9021)" disabled class="input" style="width:100%; background:#f8fafc">
        </div>
        <div>
          <label style="font-weight:700; display:block; margin-bottom:4px">Free B2B Freight Threshold</label>
          <input type="number" value="15000" class="input" style="width:100%">
        </div>
        <div>
          <label style="font-weight:700; display:block; margin-bottom:4px">Default Base Wholesale Discount</label>
          <input type="number" value="25" class="input" style="width:100%">
        </div>
      </div>
    </div>
  `;

  content.querySelector('#btn-save-tier-rules').addEventListener('click', () => {
    store.emitter.emit('toast', { message: 'Wholesale pricing rules updated across all channels', type: 'success' });
  });

  const fullLayout = renderAdminLayout('pricing', content);
  appEl.appendChild(fullLayout);
  return fullLayout;
}
