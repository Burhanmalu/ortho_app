// ========================================
// Admin Wholesale Buyers & Verification Screen
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { formatPrice } from '../../data/products.js';
import { renderAdminLayout } from './AdminLayout.js';
import { showModal } from '../../components/index.js';

export default function AdminWholesaleBuyersScreen(appEl) {
  const content = document.createElement('div');

  let currentFilter = 'all'; // all | pending | verified | rejected | suspended

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px; flex-wrap:wrap; gap:12px">
      <div>
        <h1 style="font-size:24px; font-weight:800; color:#0f172a; margin:0 0 4px">Wholesale Buyer Directory & Verification Desk</h1>
        <div style="font-size:13px; color:#64748b">Review B2B institutional accounts, inspect medical licenses, and approve wholesale pricing</div>
      </div>
      <div style="display:flex; gap:8px">
        <button class="filter-chip ${currentFilter === 'all' ? 'active' : ''}" data-status="all">All Accounts</button>
        <button class="filter-chip ${currentFilter === 'pending' ? 'active' : ''}" data-status="pending" style="color:#d97706">🟡 Pending</button>
        <button class="filter-chip ${currentFilter === 'verified' ? 'active' : ''}" data-status="verified" style="color:#16a34a">🟢 Verified</button>
        <button class="filter-chip ${currentFilter === 'suspended' ? 'active' : ''}" data-status="suspended" style="color:#475569">⚫ Suspended</button>
      </div>
    </div>

    <!-- Buyers Table Card -->
    <div class="admin-card">
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Business Entity</th>
              <th>Type</th>
              <th>Contact Person</th>
              <th>City / State</th>
              <th>GSTIN</th>
              <th>Verification</th>
              <th>Orders / Spend</th>
              <th style="text-align:right">Actions</th>
            </tr>
          </thead>
          <tbody id="buyers-tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  function renderBuyers() {
    const tbody = content.querySelector('#buyers-tbody');
    let list = store.getWholesaleBuyers();

    if (currentFilter !== 'all') {
      list = list.filter(b => b.status === currentFilter);
    }

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:#64748b">No wholesale buyers match this status.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(b => {
      const statusIcon = b.status === 'verified' ? '🟢' : (b.status === 'pending' ? '🟡' : (b.status === 'rejected' ? '🔴' : '⚫'));

      return `
        <tr>
          <td>
            <strong style="color:#0f172a; font-size:14px">${b.businessName}</strong>
            <div style="font-size:11px; color:#64748b">ID: ${b.id} • Registered: ${b.registrationDate || '12 Jan 2025'}</div>
          </td>
          <td><span class="admin-status-badge pending">${b.businessType}</span></td>
          <td>
            <strong>${b.ownerName}</strong>
            <div style="font-size:11px; color:#64748b">${b.phone}</div>
          </td>
          <td>${b.city}, ${b.state}</td>
          <td><code>${b.gstin}</code></td>
          <td>
            <span class="admin-status-badge ${b.status}">
              ${statusIcon} ${b.status.toUpperCase()}
            </span>
          </td>
          <td>
            <strong>${b.ordersCount || 0}</strong> orders<br>
            <span style="font-size:11px; color:#0d9488; font-weight:700">${formatPrice(b.totalPurchases || 0)}</span>
          </td>
          <td style="text-align:right">
            <div style="display:flex; gap:6px; justify-content:flex-end">
              <button class="admin-btn admin-btn-secondary admin-btn-sm btn-view-buyer" data-id="${b.id}" title="Inspect Application Details">
                👁️ View
              </button>
              ${b.status === 'pending' ? `
                <button class="admin-btn admin-btn-primary admin-btn-sm btn-approve-buyer" data-id="${b.id}" style="background:#16a34a">
                  ✓ Approve
                </button>
                <button class="admin-btn admin-btn-danger admin-btn-sm btn-reject-buyer" data-id="${b.id}">
                  ✕
                </button>
              ` : `
                <button class="admin-btn admin-btn-secondary admin-btn-sm btn-suspend-buyer" data-id="${b.id}">
                  ${b.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                </button>
              `}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-view-buyer').forEach(btn => {
      btn.addEventListener('click', () => openBuyerDrawer(btn.dataset.id));
    });

    tbody.querySelectorAll('.btn-approve-buyer').forEach(btn => {
      btn.addEventListener('click', () => {
        store.approveWholesaleBuyer(btn.dataset.id);
        renderBuyers();
      });
    });

    tbody.querySelectorAll('.btn-reject-buyer').forEach(btn => {
      btn.addEventListener('click', () => {
        const reason = prompt('Please enter rejection reason:', 'Documents expired or GSTIN mismatch');
        if (reason) {
          store.rejectWholesaleBuyer(btn.dataset.id, reason);
          renderBuyers();
        }
      });
    });

    tbody.querySelectorAll('.btn-suspend-buyer').forEach(btn => {
      btn.addEventListener('click', () => {
        store.suspendWholesaleBuyer(btn.dataset.id);
        renderBuyers();
      });
    });
  }

  function openBuyerDrawer(buyerId) {
    const b = store.getWholesaleBuyers().find(buyer => buyer.id === buyerId);
    if (!b) return;

    const modalHtml = `
      <div style="display:flex; flex-direction:column; gap:14px; font-size:13px">
        <div style="background:#f8fafc; padding:12px; border-radius:10px; border:1px solid #e2e8f0">
          <div style="font-size:16px; font-weight:800; color:#0f172a">${b.businessName}</div>
          <div style="color:#64748b; font-size:12px">${b.businessType} • Operating for ${b.yearsInBusiness || 5} Years</div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
          <div><strong>Authorized Signatory:</strong><br>${b.ownerName}</div>
          <div><strong>Contact Phone:</strong><br>${b.phone}</div>
          <div><strong>Official Email:</strong><br>${b.email}</div>
          <div><strong>Assigned Tier:</strong><br><span style="color:#d97706; font-weight:700">${b.tier || 'Silver'} Tier</span></div>
        </div>

        <div>
          <strong>Registered Facility Address:</strong><br>
          ${b.address}, ${b.city}, ${b.state} - ${b.pincode}
        </div>

        <div style="background:#f0fdf4; padding:10px; border-radius:8px; border:1px solid #bbf7d0">
          <div><strong>GSTIN:</strong> <code>${b.gstin}</code></div>
          <div><strong>PAN:</strong> <code>${b.pan}</code></div>
          <div><strong>Medical / Drug License:</strong> <code>${b.medLicense}</code></div>
        </div>

        <div>
          <strong style="color:#0f3647">Uploaded Statutory Verification Documents:</strong>
          <div style="display:flex; flex-direction:column; gap:6px; margin-top:6px">
            ${(b.documents || [{ name: 'GST_Certificate.pdf', size: '1.4 MB' }]).map(doc => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:#ffffff; border:1px solid #cbd5e1; border-radius:8px">
                <div>
                  <div style="font-weight:700; color:#0d9488">📄 ${doc.name}</div>
                  <div style="font-size:10px; color:#64748b">${doc.size}</div>
                </div>
                <button class="admin-btn admin-btn-secondary admin-btn-sm" onclick="alert('Viewing document preview (Simulated)')">
                  Preview
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const footerHtml = `
      ${b.status === 'pending' ? `
        <button class="admin-btn admin-btn-primary admin-btn-sm" id="modal-approve-btn" style="background:#16a34a">
          ✓ Approve Account
        </button>
        <button class="admin-btn admin-btn-danger admin-btn-sm" id="modal-reject-btn">
          ✕ Reject
        </button>
      ` : `
        <button class="admin-btn admin-btn-secondary admin-btn-sm" id="modal-suspend-btn">
          ${b.status === 'suspended' ? 'Reactivate' : 'Suspend Account'}
        </button>
      `}
      <button class="admin-btn admin-btn-secondary admin-btn-sm" onclick="document.querySelector('#modal-close').click()">
        Close
      </button>
    `;

    const modal = showModal(`Verification Details — ${b.businessName}`, modalHtml, footerHtml);

    document.getElementById('modal-approve-btn')?.addEventListener('click', () => {
      store.approveWholesaleBuyer(b.id);
      modal.close();
      renderBuyers();
    });

    document.getElementById('modal-reject-btn')?.addEventListener('click', () => {
      store.rejectWholesaleBuyer(b.id);
      modal.close();
      renderBuyers();
    });

    document.getElementById('modal-suspend-btn')?.addEventListener('click', () => {
      store.suspendWholesaleBuyer(b.id);
      modal.close();
      renderBuyers();
    });
  }

  content.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      content.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.status;
      renderBuyers();
    });
  });

  renderBuyers();

  const fullLayout = renderAdminLayout('wholesale-buyers', content);
  appEl.appendChild(fullLayout);
  return fullLayout;
}
