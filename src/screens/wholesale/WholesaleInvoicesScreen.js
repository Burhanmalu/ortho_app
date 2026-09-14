// ========================================
// Wholesale Invoices Screen
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { formatPrice } from '../../data/products.js';
import { renderBackHeader, renderWholesaleBottomNav, showGSTTaxInvoiceModal } from '../../components/index.js';

export default function WholesaleInvoicesScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen-content';
  el.style.background = '#f8fafc';

  const orders = store.getWholesaleOrders();
  const user = store.getWholesaleUser();

  el.appendChild(renderBackHeader('GST Tax Invoices', () => navigate('wholesale/dashboard')));

  el.innerHTML += `
    <div style="padding:16px 20px 120px; max-width:720px; margin:0 auto">
      <!-- Statutory Info Card -->
      <div class="card" style="padding:16px; border-radius:12px; margin-bottom:16px; background:#f0fdfa; border:1px solid #ccfbf1">
        <div style="font-size:11px; font-weight:800; color:#0f766e; text-transform:uppercase">
          GST Compliance & Input Tax Credit (ITC)
        </div>
        <div style="font-size:13px; color:#134e4a; margin-top:4px">
          All tax invoices generated here are GSTR-1 verified with OrthoCare's GSTIN <strong>07AAFCO9918K1ZZ</strong>.
          Billed to: <strong>${user.businessName}</strong> (GSTIN: <strong>${user.gstin}</strong>).
        </div>
      </div>

      <div style="font-size:14px; font-weight:700; color:#0f172a; margin-bottom:12px">
        Available Tax Invoices (${orders.length})
      </div>

      <div style="display:flex; flex-direction:column; gap:12px">
        ${orders.map(order => `
          <div class="card" style="padding:16px; border-radius:12px; display:flex; justify-content:space-between; align-items:center; border:1px solid #e2e8f0">
            <div>
              <div style="font-size:14px; font-weight:800; color:#0f3647">INV-${order.id}</div>
              <div style="font-size:11px; color:#64748b; margin:2px 0">PO Ref: ${order.id} • Issued: ${order.date}</div>
              <div style="font-size:12px; font-weight:700; color:#0d9488">
                Taxable: ${formatPrice(order.taxableAmount || (order.total * 0.84))} • Total: ${formatPrice(order.total)}
              </div>
            </div>

            <div style="display:flex; gap:8px">
              <button class="btn btn-secondary btn-sm btn-view-inv" data-id="${order.id}" style="padding:8px 12px; font-weight:700">
                👁️ View
              </button>
              <button class="btn btn-primary btn-sm btn-dl-pdf" data-id="${order.id}" style="padding:8px 12px; font-weight:700">
                ⬇️ PDF
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  el.querySelectorAll('.btn-view-inv').forEach(btn => {
    btn.addEventListener('click', () => {
      const order = orders.find(o => o.id === btn.dataset.id);
      if (order) showGSTTaxInvoiceModal(order);
    });
  });

  el.querySelectorAll('.btn-dl-pdf').forEach(btn => {
    btn.addEventListener('click', () => {
      store.emitter.emit('toast', { message: `Downloading INV-${btn.dataset.id}.pdf (Simulated)`, type: 'success' });
    });
  });

  el.appendChild(renderWholesaleBottomNav('orders'));
  appEl.appendChild(el);
  return el;
}
