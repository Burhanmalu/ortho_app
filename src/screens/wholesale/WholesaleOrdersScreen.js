// ========================================
// Wholesale B2B Orders Screen
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { formatPrice } from '../../data/products.js';
import { renderBackHeader, renderWholesaleBottomNav, showGSTTaxInvoiceModal, showModal } from '../../components/index.js';

export default function WholesaleOrdersScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen-content';
  el.style.background = '#f8fafc';

  let currentTab = 'all';

  el.appendChild(renderBackHeader('Wholesale B2B Orders', () => navigate('wholesale/dashboard')));

  el.innerHTML += `
    <!-- Status Filter Tabs -->
    <div style="background:#ffffff; border-bottom:1px solid #e2e8f0; padding:10px 16px; overflow-x:auto; white-space:nowrap; display:flex; gap:8px" id="order-tabs-strip">
      <button class="filter-chip active" data-tab="all">All Orders</button>
      <button class="filter-chip" data-tab="processing">Processing</button>
      <button class="filter-chip" data-tab="shipped">Shipped</button>
      <button class="filter-chip" data-tab="delivered">Delivered</button>
      <button class="filter-chip" data-tab="cancelled">Cancelled</button>
    </div>

    <!-- Orders Feed Container -->
    <div style="padding:16px 20px 120px; max-width:720px; margin:0 auto" id="b2b-orders-list"></div>
  `;

  function renderList() {
    const container = el.querySelector('#b2b-orders-list');
    const allOrders = store.getWholesaleOrders();
    const filtered = currentTab === 'all' ? allOrders : allOrders.filter(o => o.status === currentTab);

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:50px 20px; color:#64748b">
          <div style="font-size:40px; margin-bottom:10px">📦</div>
          <h3 style="font-size:16px; font-weight:700; color:#0f172a">No ${currentTab} wholesale orders found</h3>
          <p style="font-size:12px; margin-top:4px">Your institutional purchase history will appear here.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(order => {
      const statusColors = {
        pending: '#f59e0b',
        processing: '#2563eb',
        shipped: '#7c3aed',
        delivered: '#16a34a',
        cancelled: '#dc2626'
      };
      const totalUnits = (order.items || []).reduce((s, it) => s + it.qty, 0);

      return `
        <div class="card" style="padding:16px; border-radius:14px; margin-bottom:16px; border:1px solid #e2e8f0">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; border-bottom:1px solid #f1f5f9; padding-bottom:10px">
            <div>
              <div style="font-size:14px; font-weight:800; color:#0f3647">${order.id}</div>
              <div style="font-size:11px; color:#64748b">PO Date: ${order.date} • ${totalUnits} Units Total</div>
            </div>
            <span class="admin-status-badge ${order.status}">
              ● ${order.status.toUpperCase()}
            </span>
          </div>

          <!-- Items Summary -->
          <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:12px">
            ${(order.items || []).map(it => `
              <div style="display:flex; justify-content:space-between; font-size:12px">
                <span style="color:#334155"><strong>${it.qty}x</strong> ${it.name || 'Orthopedic Item'}</span>
                <span style="font-weight:700; color:#0f172a">${formatPrice(it.total || (it.unitPrice * it.qty))}</span>
              </div>
            `).join('')}
          </div>

          <!-- Total & Financials -->
          <div style="background:#f8fafc; border-radius:8px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; font-size:12px">
            <div>
              <span style="color:#64748b">Payment Mode: <strong>${order.paymentMethod || 'Net 30 Credit'}</strong></span>
            </div>
            <div style="text-align:right">
              <span style="font-size:11px; color:#64748b">Grand Total (Inc. GST): </span>
              <span style="font-size:15px; font-weight:800; color:#0f3647">${formatPrice(order.total)}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display:flex; gap:8px; flex-wrap:wrap">
            <button class="btn btn-secondary btn-sm btn-inv" data-id="${order.id}" style="flex:1; padding:8px 12px; font-weight:700">
              🧾 Tax Invoice
            </button>
            <button class="btn btn-secondary btn-sm btn-track" data-id="${order.id}" style="flex:1; padding:8px 12px; font-weight:700">
              📍 Track Freight
            </button>
            <button class="btn btn-primary btn-sm btn-reorder" data-id="${order.id}" style="flex:1; padding:8px 12px; font-weight:700">
              🔄 Buy Again
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
          courier: 'Blue Dart Surface B2B',
          awb: 'BLUEDT-' + Math.floor(100000 + Math.random() * 900000),
          status: 'In Transit — Estimated Arrival in 2 Days'
        };
        const contentHtml = `
          <div style="font-size:13px; line-height:1.6">
            <div><strong>Consignment AWB:</strong> ${tr.awb}</div>
            <div><strong>Logistics Partner:</strong> ${tr.courier}</div>
            <div style="margin:8px 0; padding:10px; background:#eff6ff; border-radius:8px; color:#1e40af; font-weight:600">
              Status: ${tr.status}
            </div>
            <div><strong>Destination Facility:</strong> ${order.shippingAddress ? order.shippingAddress.facility : 'Receiving Dock'}</div>
          </div>
        `;
        showModal(`Freight Tracking — ${order.id}`, contentHtml, '<button class="btn btn-primary btn-sm" onclick="document.querySelector(\'#modal-close\').click()">Close</button>');
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
        store.emitter.emit('toast', { message: `Reorder loaded: ${order.items.length} products added to cart`, type: 'success' });
        navigate('wholesale/cart');
      });
    });
  }

  el.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.dataset.tab;
      renderList();
    });
  });

  renderList();

  el.appendChild(renderWholesaleBottomNav('orders'));
  appEl.appendChild(el);
  return el;
}
