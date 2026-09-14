// ========================================
// Wholesale B2B Orders Screen - Redesigned
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { formatPrice } from '../../data/products.js';
import { icons } from '../../data/icons.js';
import { renderBackHeader, renderWholesaleBottomNav, renderEmptyState, showGSTTaxInvoiceModal, showModal } from '../../components/index.js';

export default function WholesaleOrdersScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen-content';
  el.style.background = 'var(--bg-light)';
  el.style.paddingBottom = '110px';

  let currentTab = 'all';

  el.appendChild(renderBackHeader('Wholesale B2B Orders', () => navigate('wholesale/dashboard')));

  const tabsStrip = document.createElement('div');
  tabsStrip.className = 'tabs';
  tabsStrip.style.padding = '0 16px 12px';
  tabsStrip.style.background = 'var(--bg-white)';
  tabsStrip.style.borderBottom = '1px solid var(--border)';

  const tabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  tabsStrip.innerHTML = tabs.map(t => `
    <button class="tab ${t.id === currentTab ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>
  `).join('');

  el.appendChild(tabsStrip);

  const container = document.createElement('div');
  container.style.padding = '16px';
  container.style.maxWidth = '720px';
  container.style.margin = '0 auto';
  container.id = 'b2b-orders-list';
  el.appendChild(container);

  function renderList() {
    const allOrders = store.getWholesaleOrders() || [];
    const filtered = currentTab === 'all' ? allOrders : allOrders.filter(o => o.status === currentTab);

    if (filtered.length === 0) {
      container.innerHTML = '';
      container.appendChild(renderEmptyState({
        icon: icons.package,
        title: `No ${currentTab} wholesale orders found`,
        desc: 'Institutional orders and freight purchase history will be reflected here.',
        ctaLabel: 'Browse B2B Catalog',
        ctaAction: () => navigate('wholesale/catalog')
      }));
      return;
    }

    container.innerHTML = filtered.map(order => {
      const totalUnits = (order.items || []).reduce((s, it) => s + (it.qty || 0), 0);
      const pillClass = order.status === 'delivered' ? 'status-active' : (order.status === 'cancelled' ? 'status-inactive' : 'status-shipped');

      return `
        <div class="card" style="padding:16px; margin-bottom:12px">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; border-bottom:1px solid var(--border); padding-bottom:10px">
            <div>
              <div style="font-size:14px; font-weight:700; color:var(--deep-navy)">PO #${order.id}</div>
              <div style="font-size:11px; color:var(--text-secondary); margin-top:2px">Order Date: ${order.date} • ${totalUnits} Units Total</div>
            </div>
            <span class="status-pill ${pillClass}">
              <span class="status-pill-dot"></span>
              ${(order.status || 'Active').toUpperCase()}
            </span>
          </div>

          <!-- Items Summary -->
          <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:12px">
            ${(order.items || []).map(it => `
              <div style="display:flex; justify-content:space-between; font-size:12px">
                <span style="color:var(--text)"><strong>${it.qty}x</strong> ${it.name || 'Orthopedic Support Item'}</span>
                <span style="font-weight:700; color:var(--deep-navy)">${formatPrice(it.total || (it.unitPrice * it.qty))}</span>
              </div>
            `).join('')}
          </div>

          <!-- Total & Financials -->
          <div style="background:var(--bg-light); border-radius:var(--radius-md); padding:10px 12px; display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; font-size:12px; border:1px solid var(--border)">
            <div>
              <span style="color:var(--text-secondary)">Terms: <strong style="color:var(--text)">${order.paymentMethod || 'Net 30 Verified Credit'}</strong></span>
            </div>
            <div style="text-align:right">
              <span style="font-size:11px; color:var(--text-secondary)">Total (Inc. GST): </span>
              <span style="font-size:15px; font-weight:800; color:var(--primary)">${formatPrice(order.total)}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display:flex; gap:8px; flex-wrap:wrap">
            <button class="btn btn-secondary btn-sm btn-inv" data-id="${order.id}" style="flex:1; display:inline-flex; align-items:center; justify-content:center; gap:6px">
              ${icons.fileText} Tax Invoice
            </button>
            <button class="btn btn-secondary btn-sm btn-track" data-id="${order.id}" style="flex:1; display:inline-flex; align-items:center; justify-content:center; gap:6px">
              ${icons.truck} Freight Track
            </button>
            <button class="btn btn-primary btn-sm btn-reorder" data-id="${order.id}" style="flex:1; display:inline-flex; align-items:center; justify-content:center; gap:6px">
              ${icons.repeat} Buy Again
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach Action Events
    container.querySelectorAll('.btn-inv').forEach(btn => {
      btn.addEventListener('click', () => {
        const order = allOrders.find(o => o.id === btn.dataset.id);
        if (order) showGSTTaxInvoiceModal(order);
      });
    });

    container.querySelectorAll('.btn-track').forEach(btn => {
      btn.addEventListener('click', () => {
        const order = allOrders.find(o => o.id === btn.dataset.id);
        if (!order) return;
        const tr = order.tracking || {
          courier: 'Blue Dart Surface B2B Logistics',
          awb: 'BLUEDT-' + Math.floor(100000 + Math.random() * 900000),
          status: 'In Transit — Estimated Delivery in 2 Business Days'
        };
        const contentHtml = `
          <div style="font-size:13px; line-height:1.6; display:flex; flex-direction:column; gap:8px">
            <div><strong>Consignment AWB:</strong> <code>${tr.awb}</code></div>
            <div><strong>Logistics Partner:</strong> ${tr.courier}</div>
            <div style="padding:10px 12px; background:rgba(23, 107, 135, 0.08); border-radius:var(--radius-md); color:var(--primary); font-weight:600; border:1px solid rgba(23, 107, 135, 0.2)">
              Tracking Status: ${tr.status}
            </div>
            <div><strong>Destination Facility:</strong> ${order.shippingAddress ? (order.shippingAddress.facility || order.shippingAddress.address) : 'Hospital Receiving Dock'}</div>
          </div>
        `;
        showModal(`Freight Logistics Tracking — PO #${order.id}`, contentHtml, '<button class="btn btn-primary btn-sm" onclick="document.querySelector(\'#modal-close\').click()">Dismiss</button>');
      });
    });

    container.querySelectorAll('.btn-reorder').forEach(btn => {
      btn.addEventListener('click', () => {
        const order = allOrders.find(o => o.id === btn.dataset.id);
        if (!order) return;
        store.clearWholesaleCart();
        (order.items || []).forEach(it => {
          store.addToWholesaleCart(it.productId, it.qty);
        });
        store.emit('toast', { message: `Reorder loaded: ${order.items.length} items added to B2B cart`, type: 'success' });
        navigate('wholesale/cart');
      });
    });
  }

  tabsStrip.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      tabsStrip.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.dataset.tab;
      renderList();
    });
  });

  renderList();

  const nav = renderWholesaleBottomNav('orders');
  el.appendChild(nav);
  appEl.appendChild(el);

  return { 
    unmount() { 
      if (nav._unsub) nav._unsub(); 
    } 
  };
}
