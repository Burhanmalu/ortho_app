// ========================================
// Wholesale Dashboard Screen — OrthoCare B2B
// Professional Orthopedic Procurement Platform
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { icons } from '../../data/icons.js';
import { formatPrice, getBestSellers } from '../../data/products.js';
import { categories } from '../../data/categories.js';
import { renderWholesaleBottomNav } from '../../components/index.js';

export default function WholesaleDashboardScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen-content screen-with-nav';
  el.style.background = 'var(--background)';

  const user = store.getWholesaleUser();
  const wholesaleOrders = store.getWholesaleOrders();
  const bestSellers = getBestSellers().slice(0, 4);

  const activeOrders = wholesaleOrders.filter(o => o.status === 'pending' || o.status === 'processing' || o.status === 'shipped');
  const creditLimit = user.creditLimit || 500000;
  const creditUsed = user.creditUsed || 124500;
  const creditAvailable = creditLimit - creditUsed;
  const creditPercent = Math.round((creditUsed / creditLimit) * 100);

  el.innerHTML = `
    <!-- 1. Business Header -->
    <header class="wholesale-header">
      <div class="wholesale-header-top">
        <div class="b2b-account-info">
          <div class="b2b-badges-row">
            <span class="b2b-badge verified">${icons.badgeCheck} Verified Partner</span>
            <span class="b2b-badge tier-${(user.tier || 'Gold').toLowerCase()}">${user.tier || 'Gold'} Tier</span>
          </div>
          <div style="font-size:12px;color:var(--text-secondary)">Welcome back,</div>
          <h1 class="b2b-business-name">${user.businessName || 'Apollo Pharmacy Ltd'}</h1>
          <div class="b2b-gstin">GSTIN: <strong>${user.gstin || '07AAAAA0000A1Z5'}</strong> • Net-30 Facility</div>
        </div>
        <div>
          <button id="btn-wh-notif" class="app-header-btn" aria-label="Notifications" title="Notifications">
            ${icons.bell}
          </button>
        </div>
      </div>
    </header>

    <div>
      <!-- 2. Credit Line Meter -->
      <div class="wholesale-credit-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div style="font-size:12px;font-weight:700;color:var(--text)">Approved B2B Credit Line (Net 30)</div>
          <div style="font-size:13px;font-weight:800;color:var(--primary)">${formatPrice(creditAvailable)} Available</div>
        </div>

        <div class="credit-progress-bar">
          <div class="credit-progress-fill" style="width:${creditPercent}%"></div>
        </div>

        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-secondary)">
          <span>Utilized: <strong>${formatPrice(creditUsed)}</strong> (${creditPercent}%)</span>
          <span>Sanctioned: <strong>${formatPrice(creditLimit)}</strong></span>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px;padding-top:12px;border-top:1px solid var(--border-light)">
          <div>
            <div style="font-size:11px;color:var(--text-secondary)">Active Institutional Orders</div>
            <div style="font-size:17px;font-weight:800;color:var(--text)">${activeOrders.length} In Progress</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--text-secondary)">Total Procurement</div>
            <div style="font-size:17px;font-weight:800;color:var(--text)">${formatPrice(user.totalPurchases || 1845000)}</div>
          </div>
        </div>
      </div>

      <!-- 3. Quick Actions (Exactly 6, 2-Column Mobile Grid) -->
      <div style="padding:0 16px 10px">
        <h2 style="font-size:15px;font-weight:700;color:var(--text);margin:0">Procurement Quick Actions</h2>
      </div>
      <div class="wholesale-actions-grid">
        <div class="wholesale-action-btn" id="action-browse">
          <div class="wholesale-action-icon">${icons.catalog}</div>
          <div class="wholesale-action-label">Browse Catalog</div>
        </div>
        <div class="wholesale-action-btn" id="action-bulk">
          <div class="wholesale-action-icon">${icons.bulk}</div>
          <div class="wholesale-action-label">Bulk Order</div>
        </div>
        <div class="wholesale-action-btn" id="action-orders">
          <div class="wholesale-action-icon">${icons.truck}</div>
          <div class="wholesale-action-label">My Orders</div>
        </div>
        <div class="wholesale-action-btn" id="action-invoices">
          <div class="wholesale-action-icon">${icons.fileText}</div>
          <div class="wholesale-action-label">GST Invoices</div>
        </div>
        <div class="wholesale-action-btn" id="action-reorder">
          <div class="wholesale-action-icon">${icons.repeat}</div>
          <div class="wholesale-action-label">Quick Reorder</div>
        </div>
        <div class="wholesale-action-btn" id="action-support">
          <div class="wholesale-action-icon">${icons.phone}</div>
          <div class="wholesale-action-label">Business Support</div>
        </div>
      </div>

      <!-- 4. Orthopedic Categories -->
      <div style="padding:0 16px 20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <h2 style="font-size:15px;font-weight:700;color:var(--text);margin:0">Procure by Category</h2>
          <a href="#/wholesale/products" style="font-size:12px;font-weight:600;color:var(--primary);display:flex;align-items:center;gap:4px">View All ${icons.chevronRight}</a>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:10px">
          ${categories.slice(0, 6).map(c => `
            <div class="wh-cat-card" data-cat="${c.id}" style="background:#FFFFFF;border-radius:var(--radius-md);border:1px solid var(--border);padding:12px 8px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;cursor:pointer">
              <div style="width:38px;height:38px;border-radius:var(--radius-md);background:var(--primary-bg);color:var(--primary);display:flex;align-items:center;justify-content:center">
                ${icons[c.iconKey] || icons.knee}
              </div>
              <span style="font-size:11px;font-weight:600;color:var(--text);line-height:1.2">${c.name}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 5. Bulk Savings Tiers -->
      <div class="wholesale-tier-banner">
        <div style="display:flex;align-items:center;gap:6px">
          <span style="color:var(--primary)">${icons.layers}</span>
          <span style="font-size:11px;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:0.5px">INSTITUTIONAL VOLUME PRICING</span>
        </div>
        <div style="font-size:15px;font-weight:700;color:var(--text);margin:4px 0 2px">
          Master Carton & Pallet Tiers
        </div>
        <div style="font-size:12px;color:var(--text-secondary)">Save progressively on bulk hospital and pharmacy replenishments.</div>
        <div class="wholesale-tier-grid">
          <div class="wholesale-tier-box">
            <div class="wholesale-tier-qty">10–24 Units</div>
            <div class="wholesale-tier-discount">10% Off Base</div>
          </div>
          <div class="wholesale-tier-box">
            <div class="wholesale-tier-qty">25–49 Units</div>
            <div class="wholesale-tier-discount">15% Off Base</div>
          </div>
          <div class="wholesale-tier-box active">
            <div class="wholesale-tier-qty">50+ Units</div>
            <div class="wholesale-tier-discount">20% Off Base</div>
          </div>
        </div>
      </div>

      <!-- 6. Active Orders -->
      <div style="padding:0 16px 20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <h2 style="font-size:15px;font-weight:700;color:var(--text);margin:0">Active B2B Dispatches</h2>
          <a href="#/wholesale/orders" style="font-size:12px;font-weight:600;color:var(--primary);display:flex;align-items:center;gap:4px">All Orders ${icons.chevronRight}</a>
        </div>
        ${activeOrders.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:10px">
            ${activeOrders.slice(0, 2).map(o => `
              <div class="card" style="padding:14px">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                  <span style="font-size:13px;font-weight:700;color:var(--text)">${o.id}</span>
                  <span class="status-pill ${o.status === 'processing' ? 'processing' : 'warning'}">${o.status.toUpperCase()}</span>
                </div>
                <div style="font-size:12px;color:var(--text-secondary);margin-bottom:6px">
                  ${(o.items || []).length} Line Items • Total: <strong>${formatPrice(o.total)}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--text-secondary);border-top:1px solid var(--border-light);padding-top:8px">
                  <span>Ordered: ${o.date || '14 Sep 2026'}</span>
                  <span style="color:var(--primary);font-weight:600;cursor:pointer" onclick="window.location.hash='#/wholesale/orders'">Track Logistics →</span>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="card" style="padding:16px;text-align:center;font-size:12px;color:var(--text-secondary)">
            No pending dispatches. All previous orders delivered.
          </div>
        `}
      </div>

      <!-- 7. Fast Reorder -->
      <div style="padding:0 16px 24px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <h2 style="font-size:15px;font-weight:700;color:var(--text);margin:0">Fast Reorder Essentials</h2>
          <a href="#/wholesale/products" style="font-size:12px;font-weight:600;color:var(--primary);display:flex;align-items:center;gap:4px">Full Catalog ${icons.chevronRight}</a>
        </div>

        <div style="display:flex;flex-direction:column;gap:10px">
          ${bestSellers.map(p => `
            <div class="card" style="padding:12px 14px;display:flex;align-items:center;gap:12px">
              <div style="width:48px;height:48px;border-radius:var(--radius-md);background:var(--primary-bg);display:flex;align-items:center;justify-content:center;color:var(--primary);flex-shrink:0">
                ${p.images && p.images.length > 0 ? `<img src="${p.images[0]}" alt="${p.name}" style="max-width:100%;max-height:100%;object-fit:contain" />` : icons.package}
              </div>
              <div style="flex:1;min-width:0">
                <div style="font-size:13px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</div>
                <div style="font-size:11px;color:var(--text-secondary)">SKU: ${p.sku} • MOQ: <strong>${p.moq} pcs</strong></div>
                <div style="font-size:13px;font-weight:800;color:var(--primary);margin-top:2px">
                  ${formatPrice(p.wholesalePrice)} <span style="font-size:11px;font-weight:400;color:var(--text-secondary)">/ unit</span>
                </div>
              </div>
              <button class="btn btn-secondary btn-sm btn-reorder-quick" data-id="${p.id}" data-moq="${p.moq}">
                + ${p.moq}
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
    store.emitter.emit('toast', { message: 'Connecting to Dedicated Key Account Manager (+91 800 200 4400)...', type: 'info' });
  });

  el.querySelectorAll('.wh-cat-card').forEach(card => {
    card.addEventListener('click', () => navigate(`wholesale/products`));
  });

  el.querySelectorAll('.btn-reorder-quick').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.dataset.id;
      const moq = Number(btn.dataset.moq) || 10;
      store.addToWholesaleCart(pid, moq);
      store.emitter.emit('toast', { message: `Added ${moq} units to B2B Cart`, type: 'success' });
    });
  });

  el.appendChild(renderWholesaleBottomNav('home'));
  appEl.appendChild(el);
  return el;
}
