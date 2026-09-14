// ========================================
// Wholesale Invoices Screen - Redesigned
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { formatPrice } from '../../data/products.js';
import { icons } from '../../data/icons.js';
import { renderBackHeader, renderWholesaleBottomNav, renderEmptyState, showGSTTaxInvoiceModal } from '../../components/index.js';

export default function WholesaleInvoicesScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen-content';
  el.style.background = 'var(--bg-light)';
  el.style.paddingBottom = '110px';

  const orders = store.getWholesaleOrders() || [];
  const user = store.getWholesaleUser() || { businessName: 'Orthopedic Partner', gstin: '27AABCU9603R1ZM' };

  el.appendChild(renderBackHeader('GST Tax Invoices', () => navigate('wholesale/dashboard')));

  const container = document.createElement('div');
  container.style.padding = '16px 16px 24px';
  container.style.maxWidth = '720px';
  container.style.margin = '0 auto';

  container.innerHTML = `
    <!-- Statutory Info Card -->
    <div class="card" style="padding:16px; margin-bottom:16px; background:rgba(57, 169, 107, 0.08); border:1px solid rgba(57, 169, 107, 0.25)">
      <div style="display:flex;align-items:center;gap:8px;font-size:11px; font-weight:700; color:var(--success); text-transform:uppercase; letter-spacing:0.5px">
        <span style="width:16px;height:16px;display:inline-flex">${icons.badgeCheck}</span>
        GST Compliance & Input Tax Credit (ITC)
      </div>
      <div style="font-size:12px; color:var(--text); margin-top:6px; line-height:1.5">
        All official tax invoices are GSTR-1 compliant with OrthoCare's GSTIN <strong>07AAFCO9918K1ZZ</strong>.
        Billed to: <strong>${user.businessName}</strong> (GSTIN: <strong>${user.gstin}</strong>).
      </div>
    </div>

    <div style="font-size:14px; font-weight:700; color:var(--deep-navy); margin-bottom:12px; display:flex; justify-content:space-between; align-items:center">
      <span>Available Tax Invoices (${orders.length})</span>
      <span style="font-size:12px; font-weight:500; color:var(--text-secondary)">Financial Year 2024-25</span>
    </div>

    <div style="display:flex; flex-direction:column; gap:12px" id="invoices-list"></div>
  `;

  const listEl = container.querySelector('#invoices-list');

  if (orders.length === 0) {
    listEl.appendChild(renderEmptyState({
      icon: icons.fileText,
      title: 'No invoices available',
      desc: 'Tax invoices will be generated automatically upon order fulfillment.',
      ctaLabel: 'Browse B2B Catalog',
      ctaAction: () => navigate('wholesale/catalog')
    }));
  } else {
    orders.forEach(order => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.padding = '14px 16px';
      card.style.display = 'flex';
      card.style.justifyContent = 'space-between';
      card.style.alignItems = 'center';
      card.style.flexWrap = 'wrap';
      card.style.gap = '12px';

      card.innerHTML = `
        <div style="min-width:180px">
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:14px; font-weight:700; color:var(--deep-navy)">INV-${order.id}</span>
            <span class="status-pill status-active" style="font-size:10px;padding:2px 8px">IRN Generated</span>
          </div>
          <div style="font-size:11px; color:var(--text-secondary); margin:3px 0">PO Ref: #${order.id} • Date: ${order.date}</div>
          <div style="font-size:12px; font-weight:600; color:var(--primary); margin-top:2px">
            Taxable: ${formatPrice(order.taxableAmount || (order.total * 0.84))} • Total: <strong>${formatPrice(order.total)}</strong>
          </div>
        </div>

        <div style="display:flex; gap:8px">
          <button class="btn btn-secondary btn-sm btn-view-inv" style="display:inline-flex;align-items:center;gap:6px">
            ${icons.fileText} View
          </button>
          <button class="btn btn-primary btn-sm btn-dl-pdf" style="display:inline-flex;align-items:center;gap:6px">
            ${icons.download} PDF
          </button>
        </div>
      `;

      card.querySelector('.btn-view-inv').addEventListener('click', () => {
        showGSTTaxInvoiceModal(order);
      });

      card.querySelector('.btn-dl-pdf').addEventListener('click', () => {
        store.emit('toast', { message: `Downloading GST Tax Invoice INV-${order.id}.pdf`, type: 'success' });
      });

      listEl.appendChild(card);
    });
  }

  el.appendChild(container);
  const nav = renderWholesaleBottomNav('orders');
  el.appendChild(nav);
  appEl.appendChild(el);

  return { 
    unmount() { 
      if (nav._unsub) nav._unsub(); 
    } 
  };
}
