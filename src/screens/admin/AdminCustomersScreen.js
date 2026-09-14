// ========================================
// Admin Retail Customers Directory Screen
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { formatPrice } from '../../data/products.js';
import { renderAdminLayout } from './AdminLayout.js';

export default function AdminCustomersScreen(appEl) {
  const content = document.createElement('div');
  const customers = store.getAdminCustomers();

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px; flex-wrap:wrap; gap:12px">
      <div>
        <h1 style="font-size:24px; font-weight:800; color:#0f172a; margin:0 0 4px">Retail Customers Directory</h1>
        <div style="font-size:13px; color:#64748b">Manage individual patient and family accounts, order histories, and VIP tags</div>
      </div>
      <div style="font-size:13px; font-weight:700; color:#0d9488">
        Total Registered: ${customers.length} Patients
      </div>
    </div>

    <!-- Customer Table -->
    <div class="admin-card">
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
                <td>
                  <strong style="color:#0f172a">${c.name}</strong><br>
                  <small style="color:#64748b">${c.id}</small>
                </td>
                <td>
                  <div>${c.phone}</div>
                  <small style="color:#64748b">${c.email}</small>
                </td>
                <td>${c.city}, ${c.state}</td>
                <td><strong>${c.orders}</strong> orders</td>
                <td style="font-weight:700; color:#0d9488">${formatPrice(c.totalSpend)}</td>
                <td>${c.joinDate}</td>
                <td>
                  <span class="admin-status-badge ${c.status === 'VIP' ? 'verified' : 'active'}">
                    ● ${c.status}
                  </span>
                </td>
                <td style="text-align:right">
                  <button class="admin-btn admin-btn-secondary admin-btn-sm" onclick="alert('Viewing customer orders profile (Simulated)')">
                    View Orders
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const fullLayout = renderAdminLayout('customers', content);
  appEl.appendChild(fullLayout);
  return fullLayout;
}
