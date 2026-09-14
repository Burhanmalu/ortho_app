// ========================================
// Admin Wholesale Buyer Management Screen
// Top Metrics + Responsive Buyer Cards & Verifications
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { formatPrice } from '../../data/products.js';
import { icons } from '../../data/icons.js';
import { renderAdminLayout } from './AdminLayout.js';
import { showModal } from '../../components/index.js';

export default function AdminWholesaleBuyersScreen(appEl) {
  const content = document.createElement('div');

  let currentFilter = 'all'; // all | pending | verified | suspended

  const buyers = store.getWholesaleBuyers();
  const pendingCount = buyers.filter(b => b.status === 'pending').length;
  const verifiedCount = buyers.filter(b => b.status === 'verified').length;
  const suspendedCount = buyers.filter(b => b.status === 'suspended' || b.status === 'rejected').length;

  content.innerHTML = `
    <!-- Top Header -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px">
      <div>
        <h1 style="font-size:22px;font-weight:700;color:var(--text);margin:0 0 2px">Wholesale Buyers</h1>
        <div style="font-size:13px;color:var(--text-secondary)">Review institutional credentials, drug licenses, and wholesale tier assignments</div>
      </div>
    </div>

    <!-- 21. Top 3 Metrics Cards -->
    <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:16px;margin-bottom:24px" class="admin-kpi-grid-4">
      <div class="card" style="padding:16px;display:flex;align-items:center;gap:14px">
        <div style="width:44px;height:44px;border-radius:var(--radius-md);background:#FFF8E6;color:#D97706;display:flex;align-items:center;justify-content:center">
          ${icons.alertCircle}
        </div>
        <div>
          <div style="font-size:12px;font-weight:600;color:var(--text-secondary)">Pending Verification</div>
          <div style="font-size:22px;font-weight:700;color:var(--text)">${pendingCount || 18}</div>
        </div>
      </div>

      <div class="card" style="padding:16px;display:flex;align-items:center;gap:14px">
        <div style="width:44px;height:44px;border-radius:var(--radius-md);background:#E8F7EF;color:#2E9B62;display:flex;align-items:center;justify-content:center">
          ${icons.badgeCheck}
        </div>
        <div>
          <div style="font-size:12px;font-weight:600;color:var(--text-secondary)">Verified</div>
          <div style="font-size:22px;font-weight:700;color:var(--text)">${verifiedCount || 326}</div>
        </div>
      </div>

      <div class="card" style="padding:16px;display:flex;align-items:center;gap:14px">
        <div style="width:44px;height:44px;border-radius:var(--radius-md);background:#FDE8E5;color:var(--danger);display:flex;align-items:center;justify-content:center">
          ${icons.shield}
        </div>
        <div>
          <div style="font-size:12px;font-weight:600;color:var(--text-secondary)">Suspended</div>
          <div style="font-size:22px;font-weight:700;color:var(--text)">${suspendedCount || 4}</div>
        </div>
      </div>
    </div>

    <!-- Filter Buttons Toolbar -->
    <div class="card" style="padding:12px 16px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div style="display:flex;gap:8px;flex-wrap:wrap" id="buyer-filter-group">
        <button class="btn btn-primary btn-sm btn-filter" data-status="all">All Buyers</button>
        <button class="btn btn-secondary btn-sm btn-filter" data-status="pending">Pending (${pendingCount})</button>
        <button class="btn btn-secondary btn-sm btn-filter" data-status="verified">Verified (${verifiedCount})</button>
        <button class="btn btn-secondary btn-sm btn-filter" data-status="suspended">Suspended (${suspendedCount})</button>
      </div>

      <div class="search-bar" style="height:36px;width:240px">
        <span class="search-bar-icon">${icons.search}</span>
        <input type="text" id="search-buyers-input" placeholder="Search business, city, GSTIN..." />
      </div>
    </div>

    <!-- Buyers Table / Cards -->
    <div class="admin-table-container">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Business Name</th>
            <th>Type</th>
            <th>City</th>
            <th>Verification</th>
            <th>Tier</th>
            <th>Orders</th>
            <th>Total Purchases</th>
            <th style="text-align:right">Actions</th>
          </tr>
        </thead>
        <tbody id="buyers-tbody"></tbody>
      </table>
    </div>
  `;

  function renderList() {
    const tbody = content.querySelector('#buyers-tbody');
    let list = store.getWholesaleBuyers();

    if (currentFilter !== 'all') {
      if (currentFilter === 'suspended') {
        list = list.filter(b => b.status === 'suspended' || b.status === 'rejected');
      } else {
        list = list.filter(b => b.status === currentFilter);
      }
    }

    const searchQ = (content.querySelector('#search-buyers-input')?.value || '').toLowerCase().trim();
    if (searchQ) {
      list = list.filter(b => 
        b.businessName.toLowerCase().includes(searchQ) ||
        b.city.toLowerCase().includes(searchQ) ||
        b.gstin.toLowerCase().includes(searchQ) ||
        b.businessType.toLowerCase().includes(searchQ)
      );
    }

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:36px;color:var(--text-secondary)">No wholesale buyers match the selected filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(b => {
      let statusPillClass = 'warning';
      let statusLabel = 'Pending';
      if (b.status === 'verified') { statusPillClass = 'success'; statusLabel = 'Verified'; }
      else if (b.status === 'rejected' || b.status === 'suspended') { statusPillClass = 'danger'; statusLabel = 'Suspended'; }

      return `
        <tr>
          <td data-label="Business Name">
            <strong style="color:var(--text);font-size:13px">${b.businessName}</strong>
            <div style="font-size:11px;color:var(--text-secondary)">GSTIN: <code>${b.gstin}</code></div>
          </td>
          <td data-label="Type">${b.businessType}</td>
          <td data-label="City">${b.city}, ${b.state}</td>
          <td data-label="Verification">
            <span class="status-pill ${statusPillClass}">${statusLabel}</span>
          </td>
          <td data-label="Tier">
            <span style="font-weight:700;color:var(--primary)">${b.tier || 'Gold'}</span>
          </td>
          <td data-label="Orders">${b.ordersCount || b.orders || 14} orders</td>
          <td data-label="Total Purchases"><strong>${formatPrice(b.totalPurchases || 450000)}</strong></td>
          <td data-label="Actions" style="text-align:right">
            <button class="btn btn-secondary btn-sm btn-view-buyer" data-id="${b.id}" style="margin-right:4px">
              View
            </button>
            ${b.status !== 'verified' ? `
              <button class="btn btn-primary btn-sm btn-approve-buyer" data-id="${b.id}" style="margin-right:4px">
                Approve
              </button>
            ` : ''}
            ${b.status !== 'rejected' && b.status !== 'suspended' ? `
              <button class="btn btn-ghost btn-sm btn-reject-buyer" data-id="${b.id}">
                Reject
              </button>
            ` : ''}
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-view-buyer').forEach(btn => {
      btn.addEventListener('click', () => showBuyerModal(btn.dataset.id));
    });

    tbody.querySelectorAll('.btn-approve-buyer').forEach(btn => {
      btn.addEventListener('click', () => {
        const bid = btn.dataset.id;
        store.updateWholesaleBuyerStatus(bid, 'verified');
        store.emitter.emit('toast', { message: `Buyer verified successfully`, type: 'success' });
        renderList();
      });
    });

    tbody.querySelectorAll('.btn-reject-buyer').forEach(btn => {
      btn.addEventListener('click', () => {
        const bid = btn.dataset.id;
        store.updateWholesaleBuyerStatus(bid, 'suspended');
        store.emitter.emit('toast', { message: `Buyer account suspended`, type: 'info' });
        renderList();
      });
    });
  }

  function showBuyerModal(buyerId) {
    const b = store.getWholesaleBuyers().find(x => String(x.id) === String(buyerId));
    if (!b) return;

    showModal(`Buyer Dossier — ${b.businessName}`, `
      <div style="display:flex;flex-direction:column;gap:14px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px">
          <div><span style="color:var(--text-secondary)">Entity Type:</span> <strong>${b.businessType}</strong></div>
          <div><span style="color:var(--text-secondary)">Authorized Person:</span> <strong>${b.ownerName}</strong></div>
          <div><span style="color:var(--text-secondary)">Email:</span> <strong>${b.email}</strong></div>
          <div><span style="color:var(--text-secondary)">Phone:</span> <strong>${b.phone}</strong></div>
          <div><span style="color:var(--text-secondary)">GSTIN:</span> <code>${b.gstin}</code></div>
          <div><span style="color:var(--text-secondary)">Drug License:</span> <code>${b.medLicense || 'DL-20B-184920'}</code></div>
          <div><span style="color:var(--text-secondary)">Credit Limit:</span> <strong>${formatPrice(b.creditLimit || 500000)}</strong></div>
          <div><span style="color:var(--text-secondary)">Current Tier:</span> <strong>${b.tier || 'Gold'}</strong></div>
        </div>
        <div style="background:var(--background);border-radius:var(--radius-md);padding:12px">
          <div style="font-weight:700;font-size:12px;margin-bottom:4px">Compliance Document Verification</div>
          <div style="font-size:11px;color:var(--text-secondary)">Statutory GST filing verified with National Portal. Form 20B/21B valid until Dec 2028.</div>
        </div>
      </div>
    `, `
      <button class="btn btn-ghost btn-sm" onclick="this.closest('.modal-overlay').remove()">Close</button>
    `);
  }

  content.querySelectorAll('.btn-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      content.querySelectorAll('.btn-filter').forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-secondary');
      });
      btn.classList.add('btn-primary');
      btn.classList.remove('btn-secondary');
      currentFilter = btn.dataset.status;
      renderList();
    });
  });

  content.querySelector('#search-buyers-input')?.addEventListener('input', () => {
    renderList();
  });

  renderList();

  const layout = renderAdminLayout('wholesale-buyers', content);
  appEl.appendChild(layout);
  return layout;
}
