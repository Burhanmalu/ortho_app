// ========================================
// Admin Reports & Analytics (With Real CSV Export)
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { monthlySalesData, adminKPIs, topSellingProducts } from '../../data/adminData.js';
import { formatPrice } from '../../data/products.js';
import { renderAdminLayout } from './AdminLayout.js';

export default function AdminReportsScreen(appEl) {
  const content = document.createElement('div');

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px; flex-wrap:wrap; gap:12px">
      <div>
        <h1 style="font-size:24px; font-weight:800; color:#0f172a; margin:0 0 4px">Business Intelligence & Statutory Reports</h1>
        <div style="font-size:13px; color:#64748b">Download consolidated financial, sales, inventory, and B2B audit exports</div>
      </div>
      <button id="btn-dl-csv-full" class="admin-btn admin-btn-primary">
        📥 Export Consolidated CSV
      </button>
    </div>

    <!-- Quick Report Metrics -->
    <div class="admin-kpi-grid" style="margin-bottom:20px">
      <div class="admin-kpi-card">
        <span class="kpi-label">Avg Wholesale Order Value (AOV)</span>
        <div class="kpi-value" style="color:#0d9488">₹57,200</div>
        <div class="kpi-trend positive">Based on 184 B2B POs</div>
      </div>
      <div class="admin-kpi-card">
        <span class="kpi-label">Avg Retail Order Value</span>
        <div class="kpi-value" style="color:#2563eb">₹1,029</div>
        <div class="kpi-trend positive">Based on 1,248 B2C orders</div>
      </div>
      <div class="admin-kpi-card">
        <span class="kpi-label">Input Tax Credit (ITC 18%)</span>
        <div class="kpi-value">₹1,95,800</div>
        <div class="kpi-trend neutral">Eligible for GSTR-3B offset</div>
      </div>
    </div>

    <!-- Reports Table Card -->
    <div class="admin-card">
      <div class="admin-card-header">
        <h3 style="font-size:15px; font-weight:800; color:#0f172a; margin:0">Standard Platform Report Downloads</h3>
      </div>
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Report Title</th>
              <th>Channel Scope</th>
              <th>Period</th>
              <th>Format</th>
              <th style="text-align:right">Generate & Download</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Monthly Sales Ledger & Channel Breakdown</strong>
                <div style="font-size:11px; color:#64748b">Detailed month-by-month retail vs wholesale revenue</div>
              </td>
              <td><span class="b2b-badge tier-platinum">Omnichannel</span></td>
              <td>Jan – Sep 2026</td>
              <td><code>.CSV</code></td>
              <td style="text-align:right">
                <button class="admin-btn admin-btn-secondary admin-btn-sm btn-export-sales-csv">
                  ⬇️ Download CSV
                </button>
              </td>
            </tr>

            <tr>
              <td>
                <strong>Wholesale Institutional Buyer Procurement Audit</strong>
                <div style="font-size:11px; color:#64748b">Hospital/Clinic purchasing volumes, GSTINs, and tier rebates</div>
              </td>
              <td><span class="b2b-badge tier-gold">Wholesale B2B</span></td>
              <td>Fiscal Year 2026</td>
              <td><code>.CSV</code></td>
              <td style="text-align:right">
                <button class="admin-btn admin-btn-secondary admin-btn-sm btn-export-buyers-csv">
                  ⬇️ Download CSV
                </button>
              </td>
            </tr>

            <tr>
              <td>
                <strong>Inventory Stock Velocity & Low-Stock Alerts</strong>
                <div style="font-size:11px; color:#64748b">Unit counts, carton sizes, and warehouse reorder markers</div>
              </td>
              <td><span class="b2b-badge verified">Logistics</span></td>
              <td>Current Snapshot</td>
              <td><code>.CSV</code></td>
              <td style="text-align:right">
                <button class="admin-btn admin-btn-secondary admin-btn-sm btn-export-inventory-csv">
                  ⬇️ Download CSV
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Utility to download real CSV in browser
  function downloadCsvFile(filename, csvContent) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    store.emitter.emit('toast', { message: `Exported ${filename}`, type: 'success' });
  }

  content.querySelector('.btn-export-sales-csv').addEventListener('click', () => {
    let csv = 'Month,Retail Sales (INR),Wholesale Sales (INR),Total Revenue (INR)\n';
    monthlySalesData.forEach(d => {
      csv += `"${d.month}",${d.retail},${d.wholesale},${d.total}\n`;
    });
    downloadCsvFile('OrthoCare_Sales_Ledger_2026.csv', csv);
  });

  content.querySelector('.btn-export-buyers-csv').addEventListener('click', () => {
    let csv = 'Buyer ID,Business Name,Type,City,GSTIN,Verification,Orders,Total Purchases (INR)\n';
    store.getWholesaleBuyers().forEach(b => {
      csv += `"${b.id}","${b.businessName}","${b.businessType}","${b.city}","${b.gstin}","${b.status}",${b.ordersCount || 0},${b.totalPurchases || 0}\n`;
    });
    downloadCsvFile('OrthoCare_Wholesale_Buyers_Audit.csv', csv);
  });

  content.querySelector('.btn-export-inventory-csv').addEventListener('click', () => {
    let csv = 'SKU,Product Name,Category,Retail MRP,Wholesale Starting,MOQ,Total Stock,Threshold\n';
    store.getAdminProducts().forEach(p => {
      csv += `"${p.sku}","${p.name}","${p.category}",${p.mrp},${p.wholesalePrice},${p.moq},${p.stock || 0},${p.lowStockThreshold || 25}\n`;
    });
    downloadCsvFile('OrthoCare_Inventory_Velocity.csv', csv);
  });

  content.querySelector('#btn-dl-csv-full').addEventListener('click', () => {
    content.querySelector('.btn-export-sales-csv').click();
  });

  const fullLayout = renderAdminLayout('reports', content);
  appEl.appendChild(fullLayout);
  return fullLayout;
}
