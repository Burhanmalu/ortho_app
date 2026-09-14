// ========================================
// Admin Dashboard Screen — OrthoCare Master Marketplace
// 4 Clean KPI Cards, Whitespace Analytics & Responsive Tables
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { adminKPIs, monthlySalesData, revenueSplit, topSellingProducts } from '../../data/adminData.js';
import { formatPrice } from '../../data/products.js';
import { icons } from '../../data/icons.js';
import { renderAdminLayout } from './AdminLayout.js';

export default function AdminDashboardScreen(appEl) {
  const content = document.createElement('div');

  const buyers = store.getWholesaleBuyers();
  const pendingBuyers = buyers.filter(b => b.status === 'pending');
  const recentOrders = store.getWholesaleOrders().slice(0, 5);
  const products = store.getAdminProducts();
  const lowStockCount = products.filter(p => (p.stock || 0) <= (p.lowStockThreshold || 25)).length;

  content.innerHTML = `
    <!-- Top Action Bar -->
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px;flex-wrap:wrap;gap:12px">
      <div>
        <h1 style="font-size:22px;font-weight:700;color:var(--text);margin:0 0 4px">Marketplace Dashboard</h1>
        <div style="font-size:13px;color:var(--text-secondary)">Real-time performance across Retail Customers & B2B Wholesale Channels</div>
      </div>
      <div style="display:flex;gap:8px">
        <button id="btn-export-quick-csv" class="btn btn-secondary btn-sm">
          ${icons.download} Export Report
        </button>
        <button id="btn-add-product-quick" class="btn btn-primary btn-sm">
          ${icons.plus} Add Product
        </button>
      </div>
    </div>

    <!-- 16. Exactly 4 KPI Metric Cards (2 Columns on Mobile/Tablet) -->
    <div class="admin-kpi-grid-4">
      <div class="admin-kpi-card">
        <div class="admin-kpi-header">
          <span class="admin-kpi-title">Total Sales</span>
          <div class="admin-kpi-icon">${icons.creditCard}</div>
        </div>
        <div class="admin-kpi-value">₹12,84,500</div>
        <div class="admin-kpi-trend positive">
          <span>${icons.trendingUp}</span> +14.2% vs last month
        </div>
      </div>

      <div class="admin-kpi-card">
        <div class="admin-kpi-header">
          <span class="admin-kpi-title">Orders</span>
          <div class="admin-kpi-icon">${icons.cart}</div>
        </div>
        <div class="admin-kpi-value">1,432</div>
        <div class="admin-kpi-trend positive">
          <span>${icons.trendingUp}</span> Retail & Wholesale
        </div>
      </div>

      <div class="admin-kpi-card">
        <div class="admin-kpi-header">
          <span class="admin-kpi-title">Customers</span>
          <div class="admin-kpi-icon">${icons.users}</div>
        </div>
        <div class="admin-kpi-value">8,420</div>
        <div class="admin-kpi-trend neutral">
          <span>${icons.check}</span> Active registered users
        </div>
      </div>

      <div class="admin-kpi-card">
        <div class="admin-kpi-header">
          <span class="admin-kpi-title">Wholesale Buyers</span>
          <div class="admin-kpi-icon">${icons.hospital}</div>
        </div>
        <div class="admin-kpi-value">326</div>
        <div class="admin-kpi-trend warning">
          <span>${icons.alertCircle}</span> ${pendingBuyers.length} pending verification
        </div>
      </div>
    </div>

    <!-- 17. Analytics: Sales Overview & Order Distribution -->
    <div class="admin-charts-grid">
      <!-- Sales Overview Chart -->
      <div class="admin-chart-card">
        <div class="admin-chart-header">
          <div>
            <h3 style="font-size:15px;font-weight:700;color:var(--text);margin:0 0 2px">Sales Overview</h3>
            <div style="font-size:12px;color:var(--text-secondary)">Monthly revenue split: Retail vs B2B Wholesale</div>
          </div>
          <div style="display:flex;gap:12px;font-size:11px;font-weight:700">
            <span style="color:#2563EB">■ Retail</span>
            <span style="color:var(--primary)">■ Wholesale</span>
          </div>
        </div>

        <div style="height:190px;display:flex;align-items:flex-end;gap:16px;padding-top:10px;border-bottom:1px solid var(--border)">
          ${monthlySalesData.map(d => {
            const maxVal = 250000;
            const retailH = Math.round((d.retail / maxVal) * 140);
            const whH = Math.round((d.wholesale / maxVal) * 140);

            return `
              <div style="flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end">
                <div style="display:flex;gap:4px;align-items:flex-end;width:100%;justify-content:center">
                  <div style="width:14px;height:${retailH}px;background:#2563EB;border-radius:3px 3px 0 0" title="Retail: ${formatPrice(d.retail)}"></div>
                  <div style="width:14px;height:${whH}px;background:var(--primary);border-radius:3px 3px 0 0" title="Wholesale: ${formatPrice(d.wholesale)}"></div>
                </div>
                <div style="font-size:10px;color:var(--text-secondary);font-weight:600;margin-top:8px">${d.month}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Order Distribution (Retail vs Wholesale) -->
      <div class="admin-chart-card">
        <div class="admin-chart-header">
          <div>
            <h3 style="font-size:15px;font-weight:700;color:var(--text);margin:0 0 2px">Order Distribution</h3>
            <div style="font-size:12px;color:var(--text-secondary)">Channel Volume Contribution</div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px 0">
          <svg width="130" height="130" viewBox="0 0 42 42">
            <circle cx="21" cy="21" r="15.915" fill="#ffffff"></circle>
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#EEF3F5" stroke-width="6"></circle>
            <!-- Retail (57%) -->
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#2563EB" stroke-width="6" stroke-dasharray="57 43" stroke-dashoffset="25"></circle>
            <!-- Wholesale (43%) -->
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--primary)" stroke-width="6" stroke-dasharray="43 57" stroke-dashoffset="68"></circle>
            <text x="50%" y="50%" text-anchor="middle" dy="0.3em" font-size="6" font-weight="700" fill="var(--text)">₹12.8L</text>
          </svg>

          <div style="width:100%;display:flex;justify-content:space-around;margin-top:14px;font-size:12px">
            <div style="text-align:center">
              <div style="color:#2563EB;font-weight:700">57% Retail</div>
              <div style="font-size:11px;color:var(--text-secondary)">${formatPrice(revenueSplit.retailTotal)}</div>
            </div>
            <div style="text-align:center">
              <div style="color:var(--primary);font-weight:700">43% Wholesale</div>
              <div style="font-size:11px;color:var(--text-secondary)">${formatPrice(revenueSplit.wholesaleTotal)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Secondary Analytics: Top Products & Category Performance -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px" class="admin-charts-grid">
      <!-- Top Selling Products -->
      <div class="card" style="padding:18px">
        <h3 style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:12px;display:flex;align-items:center;gap:8px">
          ${icons.package} Top Selling Products
        </h3>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${topSellingProducts.slice(0, 4).map(p => `
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;padding-bottom:8px;border-bottom:1px solid var(--border-light)">
              <div>
                <div style="font-weight:700;color:var(--text)">${p.name}</div>
                <div style="color:var(--text-secondary)">SKU: ${p.sku} • ${p.unitsSold} units sold</div>
              </div>
              <div style="font-weight:700;color:var(--primary)">${formatPrice(p.revenue)}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Inventory Status Alert -->
      <div class="card" style="padding:18px">
        <h3 style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:12px;display:flex;align-items:center;gap:8px">
          ${icons.layers} Inventory & Fulfillment Status
        </h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div style="background:var(--background);border-radius:var(--radius-md);padding:12px;text-align:center">
            <div style="font-size:11px;color:var(--text-secondary);margin-bottom:2px">Total SKUs</div>
            <div style="font-size:20px;font-weight:700;color:var(--text)">${products.length}</div>
          </div>
          <div style="background:#E8F7EF;border-radius:var(--radius-md);padding:12px;text-align:center">
            <div style="font-size:11px;color:var(--success);margin-bottom:2px">In Stock</div>
            <div style="font-size:20px;font-weight:700;color:var(--success)">${products.filter(p => p.stock > 25).length}</div>
          </div>
          <div style="background:#FFF8E6;border-radius:var(--radius-md);padding:12px;text-align:center">
            <div style="font-size:11px;color:#D97706;margin-bottom:2px">Low Stock (< 25)</div>
            <div style="font-size:20px;font-weight:700;color:#D97706">${lowStockCount}</div>
          </div>
          <div style="background:#FDE8E5;border-radius:var(--radius-md);padding:12px;text-align:center">
            <div style="font-size:11px;color:var(--danger);margin-bottom:2px">Out of Stock</div>
            <div style="font-size:20px;font-weight:700;color:var(--danger)">${products.filter(p => p.stock === 0).length}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 18. Responsive Table: Pending Wholesale Verifications -->
    <div class="card" style="margin-bottom:24px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div>
          <h3 style="font-size:15px;font-weight:700;color:var(--text);margin:0 0 2px">
            Pending Wholesale Verifications (${pendingBuyers.length})
          </h3>
          <div style="font-size:12px;color:var(--text-secondary)">Review GSTIN and Drug License documents to grant wholesale tier pricing</div>
        </div>
        <button id="btn-view-all-buyers" class="btn btn-secondary btn-sm">
          All Buyers ${icons.chevronRight}
        </button>
      </div>

      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Business Entity</th>
              <th>Type</th>
              <th>Contact Person</th>
              <th>City</th>
              <th>GSTIN</th>
              <th>Status</th>
              <th style="text-align:right">Action</th>
            </tr>
          </thead>
          <tbody>
            ${pendingBuyers.map(b => `
              <tr>
                <td data-label="Entity"><strong>${b.businessName}</strong></td>
                <td data-label="Type">${b.businessType}</td>
                <td data-label="Contact">${b.ownerName}</td>
                <td data-label="City">${b.city}, ${b.state}</td>
                <td data-label="GSTIN"><code>${b.gstin}</code></td>
                <td data-label="Status"><span class="status-pill warning">Pending</span></td>
                <td data-label="Action" style="text-align:right">
                  <button class="btn btn-primary btn-sm btn-approve-fast" data-id="${b.id}" style="margin-right:6px">
                    Approve
                  </button>
                  <button class="btn btn-ghost btn-sm btn-reject-fast" data-id="${b.id}">
                    Reject
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  content.querySelector('#btn-view-all-buyers')?.addEventListener('click', () => navigate('admin/wholesale-buyers'));
  content.querySelector('#btn-add-product-quick')?.addEventListener('click', () => navigate('admin/products'));
  content.querySelector('#btn-export-quick-csv')?.addEventListener('click', () => {
    store.emitter.emit('toast', { message: 'Exported Executive Marketplace Summary to CSV', type: 'success' });
  });

  content.querySelectorAll('.btn-approve-fast').forEach(btn => {
    btn.addEventListener('click', () => {
      const bid = btn.dataset.id;
      store.updateWholesaleBuyerStatus(bid, 'verified');
      store.emitter.emit('toast', { message: `Approved buyer account #${bid}`, type: 'success' });
      btn.closest('tr')?.remove();
    });
  });

  content.querySelectorAll('.btn-reject-fast').forEach(btn => {
    btn.addEventListener('click', () => {
      const bid = btn.dataset.id;
      store.updateWholesaleBuyerStatus(bid, 'rejected');
      store.emitter.emit('toast', { message: `Rejected buyer account #${bid}`, type: 'info' });
      btn.closest('tr')?.remove();
    });
  });

  const layout = renderAdminLayout('dashboard', content);
  appEl.appendChild(layout);
  return layout;
}
