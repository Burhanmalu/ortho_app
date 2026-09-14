// ========================================
// Admin Dashboard Screen
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { adminKPIs, monthlySalesData, revenueSplit, topSellingProducts } from '../../data/adminData.js';
import { formatPrice } from '../../data/products.js';
import { renderAdminLayout } from './AdminLayout.js';

export default function AdminDashboardScreen(appEl) {
  const content = document.createElement('div');

  const buyers = store.getWholesaleBuyers();
  const pendingBuyers = buyers.filter(b => b.status === 'pending');
  const recentOrders = store.getWholesaleOrders().slice(0, 5);
  const products = store.getAdminProducts();
  const lowStockCount = products.filter(p => (p.stock || 0) <= (p.lowStockThreshold || 25)).length;

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px; flex-wrap:wrap; gap:12px">
      <div>
        <h1 style="font-size:24px; font-weight:800; color:#0f172a; margin:0 0 4px">Platform Overview & Analytics</h1>
        <div style="font-size:13px; color:#64748b">Real-time performance across Retail Customers & B2B Wholesale Channels</div>
      </div>
      <div style="display:flex; gap:8px">
        <button id="btn-export-quick-csv" class="admin-btn admin-btn-secondary admin-btn-sm">
          📑 Export Executive Summary
        </button>
        <button id="btn-add-product-quick" class="admin-btn admin-btn-primary admin-btn-sm">
          + Add New Product
        </button>
      </div>
    </div>

    <!-- 7 KPI Metric Cards -->
    <div class="admin-kpi-grid">
      <div class="admin-kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Total Sales</span>
          <span class="kpi-icon" style="background:#f0fdf4; color:#16a34a">₹</span>
        </div>
        <div class="kpi-value">${formatPrice(adminKPIs.totalSales)}</div>
        <div class="kpi-trend positive">↑ +14.2% vs last month</div>
      </div>

      <div class="admin-kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Retail Orders</span>
          <span class="kpi-icon" style="background:#eff6ff; color:#2563eb">🛒</span>
        </div>
        <div class="kpi-value">${adminKPIs.retailOrders.toLocaleString('en-IN')}</div>
        <div class="kpi-trend positive">↑ 8.4% growth</div>
      </div>

      <div class="admin-kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Wholesale Orders</span>
          <span class="kpi-icon" style="background:#f0fdfa; color:#0d9488">🏢</span>
        </div>
        <div class="kpi-value">${adminKPIs.wholesaleOrders}</div>
        <div class="kpi-trend positive">↑ 22.5% bulk uptick</div>
      </div>

      <div class="admin-kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Total Customers</span>
          <span class="kpi-icon" style="background:#f5f3ff; color:#7c3aed">👥</span>
        </div>
        <div class="kpi-value">${adminKPIs.totalCustomers.toLocaleString('en-IN')}</div>
        <div class="kpi-trend neutral">Active B2C users</div>
      </div>

      <div class="admin-kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Wholesale Buyers</span>
          <span class="kpi-icon" style="background:#fffbeb; color:#d97706">🏥</span>
        </div>
        <div class="kpi-value">${adminKPIs.wholesaleBuyers}</div>
        <div class="kpi-trend warning">${pendingBuyers.length} pending review</div>
      </div>

      <div class="admin-kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Active SKUs</span>
          <span class="kpi-icon" style="background:#f8fafc; color:#334155">📦</span>
        </div>
        <div class="kpi-value">${products.length}</div>
        <div class="kpi-trend positive">12 Categories</div>
      </div>

      <div class="admin-kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Low Stock Alerts</span>
          <span class="kpi-icon" style="background:#fef2f2; color:#dc2626">⚠️</span>
        </div>
        <div class="kpi-value" style="color:#dc2626">${lowStockCount}</div>
        <div class="kpi-trend warning">Action required</div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="admin-charts-grid">
      <!-- Monthly Sales SVG Bar/Line Chart -->
      <div class="admin-chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Revenue Trajectory (Monthly Breakdown)</div>
            <div style="font-size:12px; color:#64748b">Retail B2C vs Institutional Wholesale (in INR)</div>
          </div>
          <div style="display:flex; gap:12px; font-size:11px; font-weight:700">
            <span style="color:#2563eb">■ Retail</span>
            <span style="color:#0d9488">■ Wholesale B2B</span>
          </div>
        </div>

        <div style="height:220px; display:flex; align-items:flex-end; gap:16px; padding-top:16px; border-bottom:1px solid #e2e8f0">
          ${monthlySalesData.map(d => {
            const maxVal = 250000;
            const retailH = Math.round((d.retail / maxVal) * 160);
            const whH = Math.round((d.wholesale / maxVal) * 160);

            return `
              <div style="flex:1; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end">
                <div style="display:flex; gap:4px; align-items:flex-end; width:100%; justify-content:center">
                  <div style="width:14px; height:${retailH}px; background:#2563eb; border-radius:4px 4px 0 0" title="Retail: ${formatPrice(d.retail)}"></div>
                  <div style="width:14px; height:${whH}px; background:#0d9488; border-radius:4px 4px 0 0" title="Wholesale: ${formatPrice(d.wholesale)}"></div>
                </div>
                <div style="font-size:10px; color:#64748b; font-weight:700; margin-top:8px">${d.month}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Retail vs Wholesale Donut Split -->
      <div class="admin-chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Channel Revenue Split</div>
            <div style="font-size:12px; color:#64748b">YTD Contribution</div>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:10px 0">
          <!-- SVG Donut Chart -->
          <svg width="150" height="150" viewBox="0 0 42 42">
            <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#ffffff"></circle>
            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#e2e8f0" stroke-width="6"></circle>
            <!-- Retail Segment (57%) -->
            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#2563eb" stroke-width="6" stroke-dasharray="57 43" stroke-dashoffset="25"></circle>
            <!-- Wholesale Segment (43%) -->
            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#0d9488" stroke-width="6" stroke-dasharray="43 57" stroke-dashoffset="68"></circle>
            <text x="50%" y="50%" text-anchor="middle" dy="0.3em" font-size="6" font-weight="bold" fill="#0f172a">₹12.8L</text>
          </svg>

          <div style="width:100%; display:flex; justify-content:space-around; margin-top:16px; font-size:12px">
            <div style="text-align:center">
              <div style="color:#2563eb; font-weight:800">57% Retail</div>
              <div style="font-size:11px; color:#64748b">${formatPrice(revenueSplit.retailTotal)}</div>
            </div>
            <div style="text-align:center">
              <div style="color:#0d9488; font-weight:800">43% Wholesale</div>
              <div style="font-size:11px; color:#64748b">${formatPrice(revenueSplit.wholesaleTotal)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pending Wholesale Verifications Alert Section -->
    <div class="admin-card" style="border-left:4px solid #f59e0b">
      <div class="admin-card-header">
        <div>
          <h3 style="font-size:15px; font-weight:800; color:#0f172a; margin:0">
            ⚠️ Pending Wholesale Buyer Verifications (${pendingBuyers.length})
          </h3>
          <div style="font-size:12px; color:#64748b">Review statutory GST & medical establishment licenses to approve wholesale pricing</div>
        </div>
        <button id="btn-view-all-buyers" class="admin-btn admin-btn-secondary admin-btn-sm">
          View All Wholesale Buyers →
        </button>
      </div>

      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Type</th>
              <th>Contact Person</th>
              <th>City / State</th>
              <th>GSTIN</th>
              <th>Uploaded Docs</th>
              <th style="text-align:right">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${pendingBuyers.map(b => `
              <tr>
                <td>
                  <strong style="color:#0f172a">${b.businessName}</strong>
                </td>
                <td><span class="admin-status-badge pending">${b.businessType}</span></td>
                <td>${b.ownerName}<br><small style="color:#64748b">${b.phone}</small></td>
                <td>${b.city}, ${b.state}</td>
                <td><code style="font-size:11px">${b.gstin}</code></td>
                <td>
                  <span style="font-size:11px; color:#0d9488; font-weight:600">
                    📄 ${b.documents ? b.documents.length : 1} File(s)
                  </span>
                </td>
                <td style="text-align:right">
                  <button class="admin-btn admin-btn-primary admin-btn-sm btn-quick-approve" data-id="${b.id}" style="background:#16a34a">
                    ✓ Approve
                  </button>
                  <button class="admin-btn admin-btn-danger admin-btn-sm btn-quick-reject" data-id="${b.id}">
                    ✕ Reject
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Top Selling Products & Recent Orders Grid -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px">
      <!-- Top Selling Products -->
      <div class="admin-card">
        <div class="admin-card-header">
          <h3 style="font-size:15px; font-weight:800; color:#0f172a; margin:0">Top-Selling Orthopedic Products</h3>
          <a href="#/admin/products" style="font-size:12px; font-weight:700; color:#0d9488">Catalog →</a>
        </div>
        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Retail</th>
                <th>Bulk Units</th>
                <th style="text-align:right">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              ${topSellingProducts.map(tp => `
                <tr>
                  <td>
                    <div style="font-weight:700; color:#0f172a">${tp.name}</div>
                    <div style="font-size:10px; color:#64748b">${tp.category}</div>
                  </td>
                  <td>${tp.retailUnits}</td>
                  <td><strong style="color:#0d9488">${tp.wholesaleUnits}</strong></td>
                  <td style="text-align:right; font-weight:800">${formatPrice(tp.revenue)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent Orders Live Feed -->
      <div class="admin-card">
        <div class="admin-card-header">
          <h3 style="font-size:15px; font-weight:800; color:#0f172a; margin:0">Recent Wholesale Orders</h3>
          <a href="#/admin/wholesale-orders" style="font-size:12px; font-weight:700; color:#0d9488">All Orders →</a>
        </div>
        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Buyer</th>
                <th>Status</th>
                <th style="text-align:right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${recentOrders.map(ro => `
                <tr>
                  <td><strong>${ro.id}</strong><br><small style="color:#64748b">${ro.date}</small></td>
                  <td>${ro.businessName}</td>
                  <td><span class="admin-status-badge ${ro.status}">${ro.status}</span></td>
                  <td style="text-align:right; font-weight:800; color:#0f3647">${formatPrice(ro.total)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Attach Event Handlers
  content.querySelectorAll('.btn-quick-approve').forEach(btn => {
    btn.addEventListener('click', () => {
      store.approveWholesaleBuyer(btn.dataset.id);
      navigate('admin/dashboard');
    });
  });

  content.querySelectorAll('.btn-quick-reject').forEach(btn => {
    btn.addEventListener('click', () => {
      store.rejectWholesaleBuyer(btn.dataset.id);
      navigate('admin/dashboard');
    });
  });

  content.querySelector('#btn-view-all-buyers').addEventListener('click', () => {
    navigate('admin/wholesale-buyers');
  });

  content.querySelector('#btn-add-product-quick').addEventListener('click', () => {
    navigate('admin/products');
  });

  content.querySelector('#btn-export-quick-csv').addEventListener('click', () => {
    navigate('admin/reports');
  });

  const fullLayout = renderAdminLayout('dashboard', content);
  appEl.appendChild(fullLayout);
  return fullLayout;
}
