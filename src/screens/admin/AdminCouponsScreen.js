// ========================================
// Admin Coupons & Promotional Offers Screen - Redesigned
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
        <h1 style="font-size:20px; font-weight:800; color:var(--deep-navy); margin:0 0 4px">Promotions & Coupons</h1>
        <div style="font-size:12px; color:var(--text-secondary)">Manage promotional discount codes and institutional subsidies</div>
      </div>
      <button id="btn-add-coupon-modal" class="btn btn-primary btn-sm">
        + Create Coupon
      </button>
    </div>

    <!-- Coupons Table -->
    <div class="card" style="padding:0; overflow:hidden">
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Audience</th>
              <th>Discount</th>
              <th>Min. Order</th>
              <th>Max Cap</th>
              <th>Usage</th>
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
    const coupons = store.getAdminCoupons() || [];

    tbody.innerHTML = coupons.map(c => {
      const audienceBadge = c.userType === 'wholesale' ? 'Wholesale B2B' : (c.userType === 'retail' ? 'Retail Only' : 'Universal');
      const audienceClass = c.userType === 'wholesale' ? 'status-shipped' : 'status-active';

      return `
        <tr>
          <td data-label="Coupon Code">
            <code style="font-size:13px; font-weight:700; color:var(--deep-navy); background:var(--bg-light); padding:2px 6px; border-radius:var(--radius-sm)">${c.code}</code>
            <div style="font-size:11px; color:var(--text-secondary); margin-top:2px">${c.title}</div>
          </td>
          <td data-label="Audience">
            <span class="status-pill ${audienceClass}" style="font-size:10px; padding:2px 8px">
              ${audienceBadge}
            </span>
          </td>
          <td data-label="Discount">
            <strong style="color:var(--primary)">${c.discountType === 'percentage' ? `${c.discountValue}% OFF` : formatPrice(c.discountValue)}</strong>
          </td>
          <td data-label="Min. Order">${formatPrice(c.minOrder)}</td>
          <td data-label="Max Cap">${c.maxDiscount ? formatPrice(c.maxDiscount) : 'No Cap'}</td>
          <td data-label="Usage">${(c.usedCount || 0).toLocaleString()} / ${(c.usageLimit || 1000).toLocaleString()}</td>
          <td data-label="Status">
            <span class="status-pill ${c.active ? 'status-active' : 'status-inactive'}">
              <span class="status-pill-dot"></span>
              ${c.active ? 'Active' : 'Disabled'}
            </span>
          </td>
          <td data-label="Action" style="text-align:right">
            <button class="btn btn-secondary btn-sm btn-toggle-coupon" data-code="${c.code}" style="padding:4px 10px; font-size:11px">
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
            <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Coupon Code *</label>
            <input type="text" id="cp-code" required placeholder="e.g. CLINIC15" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); text-transform:uppercase; outline:none">
          </div>
          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Target Audience *</label>
            <select id="cp-target" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
              <option value="both">Both (Retail & Wholesale)</option>
              <option value="retail">Retail Customers Only</option>
              <option value="wholesale">Wholesale Buyers Only</option>
            </select>
          </div>
        </div>

        <div>
          <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Promotion Title *</label>
          <input type="text" id="cp-title" required placeholder="e.g. Hospital Ortho Support Subsidy" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Discount Type</label>
            <select id="cp-type" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>
          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Discount Value *</label>
            <input type="number" id="cp-val" required value="10" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Min Order Value (₹)</label>
            <input type="number" id="cp-min" value="1000" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
          </div>
          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Max Cap (₹)</label>
            <input type="number" id="cp-max" value="500" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-block" style="margin-top:6px">
          Launch Promotional Coupon
        </button>
      </form>
    `;

    const modal = showModal('Create Promotional Coupon', modalHtml);

    document.getElementById('create-coupon-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      store.addAdminCoupon({
        code: document.getElementById('cp-code').value.toUpperCase(),
        title: document.getElementById('cp-title').value,
        userType: document.getElementById('cp-target').value,
        discountType: document.getElementById('cp-type').value,
        discountValue: Number(document.getElementById('cp-val').value),
        minOrder: Number(document.getElementById('cp-min').value),
        maxDiscount: Number(document.getElementById('cp-max').value)
      });
      document.querySelector('#modal-close')?.click();
      store.emit('toast', { message: 'Coupon code created and live', type: 'success' });
      renderCoupons();
    });
  }

  content.querySelector('#btn-add-coupon-modal')?.addEventListener('click', openCreateCouponModal);

  renderCoupons();

  const fullLayout = renderAdminLayout('coupons', content);
  appEl.appendChild(fullLayout);
  return fullLayout;
}
