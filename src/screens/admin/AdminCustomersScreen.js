// ========================================
// Admin Retail Customers Directory Screen - Redesigned
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { formatPrice } from '../../data/products.js';
import { icons } from '../../data/icons.js';
import { renderAdminLayout } from './AdminLayout.js';
import { showModal } from '../../components/index.js';

export default function AdminCustomersScreen(appEl) {
  const content = document.createElement('div');
  const customers = store.getAdminCustomers() || [];

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px; flex-wrap:wrap; gap:12px">
      <div>
        <h1 style="font-size:20px; font-weight:800; color:var(--deep-navy); margin:0 0 4px">Retail Customers Directory</h1>
        <div style="font-size:12px; color:var(--text-secondary)">Manage registered patients, order histories, and verified retail accounts</div>
      </div>
      <div style="font-size:12px; font-weight:700; color:var(--primary)">
        Total Registered: ${customers.length} Patients
      </div>
    </div>

    <!-- Customer Table -->
    <div class="card" style="padding:0; overflow:hidden">
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Contact Info</th>
              <th>Location</th>
              <th>Orders</th>
              <th>Total Spend</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th style="text-align:right">Action</th>
            </tr>
          </thead>
          <tbody>
            ${customers.map(c => `
              <tr>
                <td data-label="Customer Name">
                  <strong style="color:var(--text)">${c.name}</strong><br>
                  <small style="color:var(--text-secondary); font-size:11px">${c.id}</small>
                </td>
                <td data-label="Contact Info">
                  <div style="font-size:12px; color:var(--text)">${c.phone}</div>
                  <small style="color:var(--text-secondary); font-size:11px">${c.email}</small>
                </td>
                <td data-label="Location">${c.city}, ${c.state}</td>
                <td data-label="Orders"><strong>${c.orders}</strong> orders</td>
                <td data-label="Total Spend" style="font-weight:700; color:var(--primary)">${formatPrice(c.totalSpend)}</td>
                <td data-label="Joined Date">${c.joinDate}</td>
                <td data-label="Status">
                  <span class="status-pill ${c.status === 'VIP' ? 'status-active' : 'status-shipped'}">
                    <span class="status-pill-dot"></span>
                    ${c.status}
                  </span>
                </td>
                <td data-label="Action" style="text-align:right">
                  <button class="btn btn-secondary btn-sm btn-view-orders" data-id="${c.id}" data-name="${c.name}" style="padding:4px 10px; font-size:11px">
                    View Profile
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  content.querySelectorAll('.btn-view-orders').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalHtml = `
        <div style="font-size:13px; line-height:1.6; display:flex; flex-direction:column; gap:10px">
          <div><strong>Customer Account:</strong> ${btn.dataset.name} (<code>${btn.dataset.id}</code>)</div>
          <div><strong>Account Verification:</strong> OTP Mobile Verified (UIDAI Compliant)</div>
          <div style="padding:10px 12px; background:var(--bg-light); border-radius:var(--radius-md); border:1px solid var(--border)">
            <div><strong>Active Prescription on File:</strong> Lumbar Support L4-L5 Post-Op</div>
            <div><strong>Default Shipping Hub:</strong> South Delhi Delivery Zone A</div>
          </div>
          <button class="btn btn-primary btn-block" onclick="document.querySelector('#modal-close').click()">Done</button>
        </div>
      `;
      showModal(`Patient Profile — ${btn.dataset.name}`, modalHtml);
    });
  });

  const fullLayout = renderAdminLayout('customers', content);
  appEl.appendChild(fullLayout);
  return fullLayout;
}
