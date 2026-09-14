// ========================================
// Admin Coupons & Promotional Offers Screen
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { formatPrice } from '../../data/products.js';
import { renderAdminLayout } from './AdminLayout.js';
import { showModal } from '../../components/index.js';

export default function AdminCouponsScreen(appEl) {
  const content = document.createElement('div');

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px; flex-wrap:wrap; gap:12px">
      <div>
        <h1 style="font-size:24px; font-weight:800; color:#0f172a; margin:0 0 4px">Promotions, Coupons & Bulk Grants</h1>
        <div style="font-size:13px; color:#64748b">Target retail patients or verified wholesale medical institutions</div>
      </div>
      <button id="btn-add-coupon-modal" class="admin-btn admin-btn-primary">
        + Create Promotional Coupon
      </button>
    </div>

    <!-- Coupons Table -->
    <div class="admin-card">
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Coupon Code / Title</th>
              <th>Target Audience</th>
              <th>Discount Value</th>
              <th>Min. Order</th>
              <th>Max Cap</th>
              <th>Usage Count</th>
              <th>Status</th>
              <th style="text-align:right">Action</th>
            </tr>
          </thead>
          <tbody id="coupons-tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  function renderCoupons() {
    const tbody = content.querySelector('#coupons-tbody');
    const coupons = store.getAdminCoupons();

    tbody.innerHTML = coupons.map(c => {
      const userBadgeClass = c.userType === 'wholesale' ? 'tier-gold' : (c.userType === 'retail' ? 'verified' : 'tier-platinum');
      return `
        <tr>
          <td>
            <code style="font-size:13px; font-weight:800; color:#0f3647">${c.code}</code>
            <div style="font-size:11px; color:#64748b">${c.title}</div>
          </td>
          <td>
            <span class="b2b-badge ${userBadgeClass}">
              ${c.userType.toUpperCase()}
            </span>
          </td>
          <td>
            <strong>${c.discountType === 'percentage' ? `${c.discountValue}% OFF` : formatPrice(c.discountValue)}</strong>
          </td>
          <td>${formatPrice(c.minOrder)}</td>
          <td>${c.maxDiscount ? formatPrice(c.maxDiscount) : 'No Cap'}</td>
          <td>${(c.usedCount || 0).toLocaleString()} / ${(c.usageLimit || 1000).toLocaleString()}</td>
          <td>
            <span class="admin-status-badge ${c.active ? 'active' : 'cancelled'}">
              ● ${c.active ? 'Active' : 'Disabled'}
            </span>
          </td>
          <td style="text-align:right">
            <button class="admin-btn admin-btn-secondary admin-btn-sm btn-toggle-coupon" data-code="${c.code}">
              ${c.active ? 'Deactivate' : 'Activate'}
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-toggle-coupon').forEach(btn => {
      btn.addEventListener('click', () => {
        store.toggleAdminCoupon(btn.dataset.code);
        renderCoupons();
      });
    });
  }

  function openCreateCouponModal() {
    const modalHtml = `
      <form id="create-coupon-form" style="display:flex; flex-direction:column; gap:12px; font-size:13px">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Coupon Code *</label>
            <input type="text" id="cp-code" required placeholder="e.g. CLINIC15" class="input" style="width:100%; text-transform:uppercase">
          </div>
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Target Audience *</label>
            <select id="cp-target" class="input" style="width:100%">
              <option value="both">Both (Retail & Wholesale)</option>
              <option value="retail">Retail Customers Only</option>
              <option value="wholesale">Wholesale Buyers Only</option>
            </select>
          </div>
        </div>

        <div>
          <label style="font-weight:700; display:block; margin-bottom:4px">Promotion Title *</label>
          <input type="text" id="cp-title" required placeholder="e.g. Monsoon Joint Relief Offer" class="input" style="width:100%">
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Discount Type</label>
            <select id="cp-type" class="input" style="width:100%">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Discount Value *</label>
            <input type="number" id="cp-val" required value="10" class="input" style="width:100%">
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Min Order Value (₹)</label>
            <input type="number" id="cp-min" value="1000" class="input" style="width:100%">
          </div>
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Max Cap (₹)</label>
            <input type="number" id="cp-max" value="500" class="input" style="width:100%">
          </div>
        </div>

        <button type="submit" class="admin-btn admin-btn-primary" style="padding:10px; width:100%; margin-top:8px">
          Launch Coupon
        </button>
      </form>
    `;

    const modal = showModal('Create Promotional Coupon', modalHtml);

    document.getElementById('create-coupon-form').addEventListener('submit', (e) => {
      e.preventDefault();
      store.addAdminCoupon({
        code: document.getElementById('cp-code').value,
        title: document.getElementById('cp-title').value,
        userType: document.getElementById('cp-target').value,
        discountType: document.getElementById('cp-type').value,
        discountValue: document.getElementById('cp-val').value,
        minOrder: document.getElementById('cp-min').value,
        maxDiscount: document.getElementById('cp-max').value
      });
      modal.close();
      renderCoupons();
    });
  }

  content.querySelector('#btn-add-coupon-modal').addEventListener('click', openCreateCouponModal);

  renderCoupons();

  const fullLayout = renderAdminLayout('coupons', content);
  appEl.appendChild(fullLayout);
  return fullLayout;
}
