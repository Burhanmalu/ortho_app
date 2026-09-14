// ========================================
// Admin Reports & Analytics (With Real CSV Export) - Redesigned
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { monthlySalesData, adminKPIs } from '../../data/adminData.js';
import { formatPrice } from '../../data/products.js';
import { icons } from '../../data/icons.js';
import { renderAdminLayout } from './AdminLayout.js';

export default function AdminReportsScreen(appEl) {
  const content = document.createElement('div');

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px; flex-wrap:wrap; gap:12px">
      <div>
        <h1 style="font-size:20px; font-weight:800; color:var(--deep-navy); margin:0 0 4px">Business Intelligence & Reports</h1>
        <div style="font-size:12px; color:var(--text-secondary)">Generate and export consolidated financial, sales, inventory, and B2B audit records</div>
      </div>
      <button id="btn-dl-csv-full" class="btn btn-primary btn-sm" style="display:inline-flex; align-items:center; gap:6px">
        ${icons.download} Export Consolidated CSV
      </button>
    </div>

    <!-- Quick Report Metrics -->
    <div class="admin-kpi-grid" style="margin-bottom:20px">
      <div class="admin-kpi-card">
        <span class="kpi-label">Avg Wholesale Order Value (AOV)</span>
        <div class="kpi-value" style="color:var(--primary)">₹57,200</div>
        <div class="kpi-trend positive" style="font-size:11px">Based on 184 B2B POs</div>
      </div>
      <div class="admin-kpi-card">
        <span class="kpi-label">Avg Retail Order Value</span>
        <div class="kpi-value" style="color:var(--deep-navy)">₹1,029</div>
        <div class="kpi-trend positive" style="font-size:11px">Based on 1,248 B2C orders</div>
      </div>
      <div class="admin-kpi-card">
        <span class="kpi-label">Input Tax Credit (ITC 18%)</span>
        <div class="kpi-value" style="color:var(--success)">₹1,95,800</div>
        <div class="kpi-trend neutral" style="font-size:11px">Eligible for GSTR-3B offset</div>
      </div>
    </div>

    <!-- Reports Table Card -->
    <div class="card" style="padding:0; overflow:hidden">
      <div style="padding:14px 16px; border-bottom:1px solid var(--border); background:var(--bg-white)">
        <h3 style="font-size:14px; font-weight:700; color:var(--deep-navy); margin:0">Standard Platform Report Downloads</h3>
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
              <td data-label="Report Title">
                <strong>Monthly Sales Ledger & Revenue Breakdown</strong>
                <div style="font-size:11px; color:var(--text-secondary); margin-top:2px">Month-by-month retail vs institutional procurement revenue</div>
              </td>
              <td data-label="Channel Scope"><span class="status-pill status-active" style="font-size:10px">Omnichannel</span></td>
              <td data-label="Period">FY 2024-25</td>
              <td data-label="Format"><code style="font-size:11px">.CSV</code></td>
              <td data-label="Download" style="text-align:right">
                <button class="btn btn-secondary btn-sm btn-export-sales-csv" style="display:inline-flex; align-items:center; gap:6px; font-size:11px; padding:4px 10px">
                  ${icons.download} Download CSV
                </button>
              </td>
            </tr>

            <tr>
              <td data-label="Report Title">
                <strong>Institutional Buyer Procurement & Tax Audit</strong>
                <div style="font-size:11px; color:var(--text-secondary); margin-top:2px">Hospital/Clinic purchasing volumes, GSTINs, and tier rebates</div>
              </td>
              <td data-label="Channel Scope"><span class="status-pill status-shipped" style="font-size:10px">Wholesale B2B</span></td>
              <td data-label="Period">Fiscal Year 2026</td>
              <td data-label="Format"><code style="font-size:11px">.CSV</code></td>
              <td data-label="Download" style="text-align:right">
                <button class="btn btn-secondary btn-sm btn-export-buyers-csv" style="display:inline-flex; align-items:center; gap:6px; font-size:11px; padding:4px 10px">
                  ${icons.download} Download CSV
                </button>
              </td>
            </tr>

            <tr>
              <td data-label="Report Title">
                <strong>Inventory Stock Velocity & Reorder Markers</strong>
                <div style="font-size:11px; color:var(--text-secondary); margin-top:2px">Unit counts, carton sizes, and warehouse replenishment alerts</div>
              </td>
              <td data-label="Channel Scope"><span class="status-pill status-pending" style="font-size:10px">Logistics</span></td>
              <td data-label="Period">Current Snapshot</td>
              <td data-label="Format"><code style="font-size:11px">.CSV</code></td>
              <td data-label="Download" style="text-align:right">
                <button class="btn btn-secondary btn-sm btn-export-inventory-csv" style="display:inline-flex; align-items:center; gap:6px; font-size:11px; padding:4px 10px">
                  ${icons.download} Download CSV
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

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
    store.emit('toast', { message: `Exported ${filename}`, type: 'success' });
  }

  content.querySelector('.btn-export-sales-csv')?.addEventListener('click', () => {
    let csv = 'Month,Retail Sales (INR),Wholesale Sales (INR),Total Revenue (INR)\n';
    monthlySalesData.forEach(d => {
      csv += `"${d.month}",${d.retail},${d.wholesale},${d.total}\n`;
    });
    downloadCsvFile('OrthoCare_Sales_Ledger_2026.csv', csv);
  });

  content.querySelector('.btn-export-buyers-csv')?.addEventListener('click', () => {
    let csv = 'Buyer ID,Business Name,Type,City,GSTIN,Verification,Orders,Total Purchases (INR)\n';
    (store.getWholesaleBuyers() || []).forEach(b => {
      csv += `"${b.id}","${b.businessName}","${b.businessType}","${b.city}","${b.gstin}","${b.status}",${b.ordersCount || 0},${b.totalPurchases || 0}\n`;
    });
    downloadCsvFile('OrthoCare_Wholesale_Buyers_Audit.csv', csv);
  });

  content.querySelector('.btn-export-inventory-csv')?.addEventListener('click', () => {
    let csv = 'SKU,Product Name,Category,Retail MRP,Wholesale Starting,MOQ,Total Stock,Threshold\n';
    (store.getAdminProducts() || []).forEach(p => {
      csv += `"${p.sku}","${p.name}","${p.category}",${p.mrp},${p.wholesalePrice},${p.moq},${p.stock || 0},${p.lowStockThreshold || 25}\n`;
    });
    downloadCsvFile('OrthoCare_Inventory_Velocity.csv', csv);
  });

  content.querySelector('#btn-dl-csv-full')?.addEventListener('click', () => {
    content.querySelector('.btn-export-sales-csv')?.click();
  });

  const fullLayout = renderAdminLayout('reports', content);
  appEl.appendChild(fullLayout);
  return fullLayout;
}
