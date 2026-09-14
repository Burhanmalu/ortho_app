// ========================================
// Admin Pricing & Wholesale Tiers Management - Redesigned
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
        <h1 style="font-size:20px; font-weight:800; color:var(--deep-navy); margin:0 0 4px">Wholesale Tier & Margin Rules</h1>
        <div style="font-size:12px; color:var(--text-secondary)">Define institutional volume rebates, credit terms, and qualification criteria</div>
      </div>
      <button id="btn-save-tier-rules" class="btn btn-primary btn-sm">
        Save Policy Changes
      </button>
    </div>

    <!-- Tiers Grid -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:14px; margin-bottom:20px">
      ${wholesaleTiers.map(t => `
        <div class="card" style="padding:16px; border-top:3px solid ${t.badgeColor || 'var(--primary)'}">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
            <h3 style="font-size:14px; font-weight:700; color:var(--deep-navy); margin:0">${t.tier} Tier</h3>
            <span class="status-pill status-active" style="font-size:10px; padding:2px 8px">Active</span>
          </div>
          <p style="font-size:11px; color:var(--text-secondary); margin-bottom:12px; line-height:1.4">${t.description}</p>

          <div style="display:flex; flex-direction:column; gap:10px; font-size:12px">
            <div>
              <label style="color:var(--text-secondary); font-size:11px; font-weight:600; display:block; margin-bottom:4px">Extra Volume Rebate (%):</label>
              <input type="number" value="${t.discountPercent}" style="width:100%; padding:6px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); font-weight:700; outline:none">
            </div>
            <div>
              <label style="color:var(--text-secondary); font-size:11px; font-weight:600; display:block; margin-bottom:4px">Min Order Units (MOQ):</label>
              <input type="number" value="${t.minOrderQty}" style="width:100%; padding:6px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); font-weight:700; outline:none">
            </div>
            <div>
              <label style="color:var(--text-secondary); font-size:11px; font-weight:600; display:block; margin-bottom:4px">Approved Credit Terms:</label>
              <input type="text" value="${t.creditDays === 0 ? 'Advance / COD' : `Net ${t.creditDays} Days`}" style="width:100%; padding:6px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); font-weight:700; outline:none">
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Default B2B Tax & Margin Policies -->
    <div class="card" style="padding:18px">
      <h3 style="font-size:14px; font-weight:700; color:var(--deep-navy); margin-bottom:14px; text-transform:uppercase; letter-spacing:0.5px">
        Statutory Taxation & Freight Policies
      </h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:14px; font-size:12px">
        <div>
          <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Medical Device GST Rate</label>
          <input type="text" value="18% (HSN 9021)" disabled style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); background:var(--bg-light); color:var(--text); font-weight:600">
        </div>
        <div>
          <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Free B2B Freight Threshold (₹)</label>
          <input type="number" value="15000" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
        </div>
        <div>
          <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Default Base Margin (%)</label>
          <input type="number" value="25" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
        </div>
      </div>
    </div>
  `;

  content.querySelector('#btn-save-tier-rules')?.addEventListener('click', () => {
    store.emit('toast', { message: 'Wholesale pricing rules updated across all channels', type: 'success' });
  });

  const fullLayout = renderAdminLayout('pricing', content);
  appEl.appendChild(fullLayout);
  return fullLayout;
}
