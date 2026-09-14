// ========================================
// Wholesale Business Profile Screen — OrthoCare B2B
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { icons } from '../../data/icons.js';
import { formatPrice } from '../../data/products.js';
import { renderBackHeader, renderWholesaleBottomNav } from '../../components/index.js';

export default function WholesaleProfileScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen-content screen-with-nav';
  el.style.background = 'var(--background)';

  const user = store.getWholesaleUser();

  el.appendChild(renderBackHeader('Business Account Profile'));

  const content = document.createElement('div');
  content.style.padding = '16px';

  content.innerHTML = `
    <!-- 1. Business Identity Card -->
    <div class="card" style="padding:18px;margin-bottom:18px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div style="display:flex;gap:12px;align-items:center">
          <div style="width:48px;height:48px;border-radius:var(--radius-md);background:var(--primary-bg);color:var(--primary);display:flex;align-items:center;justify-content:center">
            ${icons.hospital}
          </div>
          <div>
            <h2 style="font-size:16px;font-weight:700;color:var(--text);margin:0 0 2px">${user.businessName || 'Apollo Pharmacy Ltd'}</h2>
            <div style="font-size:12px;color:var(--text-secondary)">${user.businessType || 'Pharmacy Chain'} • Auth: <strong>${user.ownerName || 'Dr. K. Sharma'}</strong></div>
          </div>
        </div>
        <span class="b2b-badge verified">${icons.badgeCheck} Verified</span>
      </div>

      <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border-light);display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px">
        <div>
          <span style="color:var(--text-secondary)">GSTIN:</span>
          <div style="font-weight:700;color:var(--text)">${user.gstin || '07AAAAA0000A1Z5'}</div>
        </div>
        <div>
          <span style="color:var(--text-secondary)">PAN:</span>
          <div style="font-weight:700;color:var(--text)">${user.pan || 'AAACA1234F'}</div>
        </div>
        <div>
          <span style="color:var(--text-secondary)">Drug License:</span>
          <div style="font-weight:700;color:var(--text)">${user.medLicense || 'DL-20B-184920'}</div>
        </div>
        <div>
          <span style="color:var(--text-secondary)">Wholesale Tier:</span>
          <div style="font-weight:700;color:var(--primary)">${user.tier || 'Gold'} Partner</div>
        </div>
      </div>
    </div>

    <!-- 2. Grouped Procurement Menu -->
    <div style="display:flex;flex-direction:column;gap:16px">
      <div>
        <div style="font-size:11px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;padding-left:4px">
          PROCUREMENT MANAGEMENT
        </div>
        <div class="card" style="padding:0;overflow:hidden">
          <div class="profile-row" id="menu-orders" style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;cursor:pointer;border-bottom:1px solid var(--border-light)">
            <div style="display:flex;align-items:center;gap:12px;color:var(--text)">
              <span style="color:var(--primary)">${icons.truck}</span>
              <span style="font-size:13px;font-weight:600">Wholesale Purchase Orders</span>
            </div>
            <span style="color:var(--text-tertiary)">${icons.chevronRight}</span>
          </div>
          <div class="profile-row" id="menu-invoices" style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;cursor:pointer;border-bottom:1px solid var(--border-light)">
            <div style="display:flex;align-items:center;gap:12px;color:var(--text)">
              <span style="color:var(--primary)">${icons.fileText}</span>
              <span style="font-size:13px;font-weight:600">GST Tax Invoices & ITC Pass</span>
            </div>
            <span style="color:var(--text-tertiary)">${icons.chevronRight}</span>
          </div>
          <div class="profile-row" id="menu-bulk" style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;cursor:pointer;border-bottom:1px solid var(--border-light)">
            <div style="display:flex;align-items:center;gap:12px;color:var(--text)">
              <span style="color:var(--primary)">${icons.bulk}</span>
              <span style="font-size:13px;font-weight:600">Rapid Bulk Order Pad</span>
            </div>
            <span style="color:var(--text-tertiary)">${icons.chevronRight}</span>
          </div>
          <div class="profile-row" id="menu-support" style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;cursor:pointer">
            <div style="display:flex;align-items:center;gap:12px;color:var(--text)">
              <span style="color:var(--primary)">${icons.phone}</span>
              <span style="font-size:13px;font-weight:600">Key Account Desk (+91 800 200 4400)</span>
            </div>
            <span style="color:var(--text-tertiary)">${icons.chevronRight}</span>
          </div>
        </div>
      </div>

      <div>
        <div class="card" style="padding:0;overflow:hidden">
          <div class="profile-row" id="btn-switch-retail" style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;cursor:pointer;border-bottom:1px solid var(--border-light)">
            <div style="display:flex;align-items:center;gap:12px;color:var(--text)">
              <span style="color:var(--primary)">${icons.user}</span>
              <span style="font-size:13px;font-weight:600">Switch to Retail Customer View</span>
            </div>
            <span style="color:var(--text-tertiary)">${icons.chevronRight}</span>
          </div>
          <div class="profile-row" id="btn-wh-logout" style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;cursor:pointer">
            <div style="display:flex;align-items:center;gap:12px;color:var(--danger)">
              <span>${icons.logOut}</span>
              <span style="font-size:13px;font-weight:600">Logout B2B Partner Session</span>
            </div>
            <span style="color:var(--danger)">${icons.chevronRight}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  content.querySelector('#menu-orders')?.addEventListener('click', () => navigate('wholesale/orders'));
  content.querySelector('#menu-invoices')?.addEventListener('click', () => navigate('wholesale/invoices'));
  content.querySelector('#menu-bulk')?.addEventListener('click', () => navigate('wholesale/bulk-order'));
  content.querySelector('#menu-support')?.addEventListener('click', () => {
    store.emitter.emit('toast', { message: 'Connecting to Key Account Manager Dr. Rajiv Menon...', type: 'info' });
  });

  content.querySelector('#btn-switch-retail')?.addEventListener('click', () => {
    store.setRole('customer');
    navigate('home');
  });

  content.querySelector('#btn-wh-logout')?.addEventListener('click', () => {
    store.setRole('customer');
    navigate('home');
  });

  el.appendChild(content);
  appEl.appendChild(el);

  const nav = renderWholesaleBottomNav('business');
  appEl.appendChild(nav);

  return { unmount() {} };
}
