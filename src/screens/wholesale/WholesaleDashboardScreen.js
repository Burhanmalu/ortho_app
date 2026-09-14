// ========================================
// Wholesale Dashboard Screen
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { icons } from '../../data/icons.js';
import { formatPrice, getBestSellers } from '../../data/products.js';
import { renderWholesaleBottomNav } from '../../components/index.js';

export default function WholesaleDashboardScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen-content';
  el.style.background = '#f8fafc';

  const user = store.getWholesaleUser();
  const wholesaleOrders = store.getWholesaleOrders();
  const bestSellers = getBestSellers().slice(0, 4);

  const pendingCount = wholesaleOrders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const creditLimit = user.creditLimit || 500000;
  const creditUsed = user.creditUsed || 124500;
  const creditAvailable = creditLimit - creditUsed;
  const creditPercent = Math.round((creditUsed / creditLimit) * 100);

  el.innerHTML = `
    <!-- B2B Header -->
    <div class="wholesale-header">
      <div style="display:flex; justify-content:space-between; align-items:flex-start">
        <div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px">
            <span class="b2b-badge verified">● Verified Partner</span>
            <span class="b2b-badge tier-${(user.tier || 'Gold').toLowerCase()}">${user.tier || 'Gold'} Tier</span>
          </div>
          <h1 style="font-size:20px; font-weight:800; margin:0">Welcome, ${user.businessName || 'Apollo Pharmacy'}</h1>
          <div style="font-size:11px; opacity:0.8; margin-top:2px">GSTIN: ${user.gstin || '07AAAAA0000A1Z5'}</div>
        </div>

        <div style="display:flex; gap:8px">
          <button id="btn-wh-notif" style="background:rgba(255,255,255,0.15); border:none; width:36px; height:36px; border-radius:50%; color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer">
            ${icons.bell}
          </button>
        </div>
      </div>
    </div>

    <div style="padding-bottom:100px">
      <!-- Credit & Account Summary Card -->
      <div class="wholesale-credit-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
          <div style="font-size:12px; font-weight:700; color:#475569">Approved Credit Line (Net 30)</div>
          <div style="font-size:13px; font-weight:800; color:#0d9488">${formatPrice(creditAvailable)} Available</div>
        </div>

        <div class="credit-progress-bar">
          <div class="credit-progress-fill" style="width:${creditPercent}%"></div>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:11px; color:#64748b; margin-top:4px">
          <span>Used: <strong>${formatPrice(creditUsed)}</strong> (${creditPercent}%)</span>
          <span>Total Limit: <strong>${formatPrice(creditLimit)}</strong></span>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:14px; padding-top:12px; border-top:1px solid #f1f5f9">
          <div>
            <div style="font-size:11px; color:#64748b">Active B2B Orders</div>
            <div style="font-size:18px; font-weight:800; color:#0f172a">${pendingCount} Processing</div>
          </div>
          <div>
            <div style="font-size:11px; color:#64748b">Lifetime Procurement</div>
            <div style="font-size:18px; font-weight:800; color:#0f172a">${formatPrice(user.totalPurchases || 1845000)}</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions Grid -->
      <div style="padding:0 16px 8px">
        <h3 style="font-size:14px; font-weight:700; color:#0f172a; margin-bottom:10px">Procurement Quick Actions</h3>
      </div>
      <div class="wholesale-actions-grid">
        <div class="wholesale-action-btn" id="action-browse">
          <div class="wholesale-action-icon">📦</div>
          <div class="wholesale-action-label">Browse Catalog</div>
        </div>
        <div class="wholesale-action-btn" id="action-bulk">
          <div class="wholesale-action-icon">📝</div>
          <div class="wholesale-action-label">Bulk Order Pad</div>
        </div>
        <div class="wholesale-action-btn" id="action-orders">
          <div class="wholesale-action-icon">🚚</div>
          <div class="wholesale-action-label">My Orders</div>
        </div>
        <div class="wholesale-action-btn" id="action-invoices">
          <div class="wholesale-action-icon">🧾</div>
          <div class="wholesale-action-label">GST Invoices</div>
        </div>
        <div class="wholesale-action-btn" id="action-reorder">
          <div class="wholesale-action-icon">🔄</div>
          <div class="wholesale-action-label">1-Click Reorder</div>
        </div>
        <div class="wholesale-action-btn" id="action-support">
          <div class="wholesale-action-icon">👨‍⚕️</div>
          <div class="wholesale-action-label">Desk Manager</div>
        </div>
      </div>

      <!-- Wholesale Volume Deals Banner -->
      <div style="margin:10px 16px 20px; background:linear-gradient(135deg, #0284c7 0%, #0d9488 100%); border-radius:14px; padding:16px; color:#ffffff">
        <div style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; opacity:0.9">
          INSTITUTIONAL VOLUME TIERS
        </div>
        <div style="font-size:16px; font-weight:800; margin:4px 0 10px">
          Pallet & Master Carton Savings
        </div>
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; text-align:center">
          <div style="background:rgba(255,255,255,0.15); border-radius:8px; padding:8px 4px">
            <div style="font-size:14px; font-weight:800">10–24 Units</div>
            <div style="font-size:11px; opacity:0.9">10% Off Base</div>
          </div>
          <div style="background:rgba(255,255,255,0.15); border-radius:8px; padding:8px 4px">
            <div style="font-size:14px; font-weight:800">25–49 Units</div>
            <div style="font-size:11px; opacity:0.9">15% Off Base</div>
          </div>
          <div style="background:rgba(255,255,255,0.25); border-radius:8px; padding:8px 4px; border:1px solid rgba(255,255,255,0.4)">
            <div style="font-size:14px; font-weight:800">50+ Units</div>
            <div style="font-size:11px; font-weight:700">20% Off Base</div>
          </div>
        </div>
      </div>

      <!-- Fast Reorder Essentials -->
      <div style="padding:0 16px">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px">
          <h3 style="font-size:15px; font-weight:800; color:#0f172a">Fast Reorder Essentials</h3>
          <a href="#/wholesale/products" style="font-size:12px; font-weight:700; color:#0d9488">View All →</a>
        </div>

        <div style="display:grid; grid-template-columns:1fr; gap:12px">
          ${bestSellers.map(p => `
            <div class="card" style="padding:14px; border-radius:12px; display:flex; align-items:center; gap:14px">
              <div style="width:50px; height:50px; border-radius:10px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; font-size:24px">
                ${p.emoji || '🩺'}
              </div>
              <div style="flex:1">
                <div style="font-size:13px; font-weight:700; color:#0f172a">${p.name}</div>
                <div style="font-size:11px; color:#64748b">SKU: ${p.sku} • MOQ: <strong>${p.moq} units</strong></div>
                <div style="font-size:13px; font-weight:800; color:#0d9488; margin-top:2px">
                  ${formatPrice(p.wholesalePrice)} / unit
                  <span style="font-size:11px; color:#94a3b8; text-decoration:line-through; margin-left:4px">${formatPrice(p.price)}</span>
                </div>
              </div>
              <button class="btn btn-primary btn-sm btn-reorder-quick" data-id="${p.id}" data-moq="${p.moq}" style="padding:8px 12px; font-weight:700">
                + Add ${p.moq} Qty
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Attach navigation events
  el.querySelector('#action-browse').addEventListener('click', () => navigate('wholesale/products'));
  el.querySelector('#action-bulk').addEventListener('click', () => navigate('wholesale/bulk-order'));
  el.querySelector('#action-orders').addEventListener('click', () => navigate('wholesale/orders'));
  el.querySelector('#action-invoices').addEventListener('click', () => navigate('wholesale/invoices'));
  el.querySelector('#action-reorder').addEventListener('click', () => navigate('wholesale/bulk-order'));
  el.querySelector('#action-support').addEventListener('click', () => {
    store.emitter.emit('toast', { message: 'Connecting to Dedicated Key Account Manager...', type: 'info' });
  });

  el.querySelectorAll('.btn-reorder-quick').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.dataset.id;
      const moq = Number(btn.dataset.moq) || 10;
      store.addToWholesaleCart(pid, moq);
    });
  });

  el.appendChild(renderWholesaleBottomNav('dashboard'));
  appEl.appendChild(el);
  return el;
}
