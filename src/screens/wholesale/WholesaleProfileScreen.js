// ========================================
// Wholesale Business Profile Screen
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { formatPrice } from '../../data/products.js';
import { renderBackHeader, renderWholesaleBottomNav, showModal } from '../../components/index.js';

export default function WholesaleProfileScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen-content';
  el.style.background = '#f8fafc';

  const user = store.getWholesaleUser();

  el.appendChild(renderBackHeader('Business Account Profile', () => navigate('wholesale/dashboard')));

  el.innerHTML += `
    <div style="padding:16px 20px 120px; max-width:640px; margin:0 auto">
      <!-- Business Identity Card -->
      <div class="card" style="padding:20px; border-radius:14px; margin-bottom:16px">
        <div style="display:flex; justify-content:space-between; align-items:flex-start">
          <div style="display:flex; gap:14px; align-items:center">
            <div style="width:54px; height:54px; border-radius:12px; background:#0f3647; color:#ffffff; display:flex; align-items:center; justify-content:center; font-size:26px">
              🏥
            </div>
            <div>
              <h2 style="font-size:17px; font-weight:800; color:#0f172a; margin:0 0 2px">${user.businessName}</h2>
              <div style="font-size:12px; color:#64748b">${user.businessType} • Authorized: <strong>${user.ownerName}</strong></div>
              <div style="font-size:11px; color:#0d9488; font-weight:700; margin-top:4px">${user.email} • ${user.phone}</div>
            </div>
          </div>
          <span class="b2b-badge verified">● Verified</span>
        </div>

        <div style="margin-top:16px; padding-top:14px; border-top:1px solid #f1f5f9; display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:12px">
          <div>
            <span style="color:#64748b">GSTIN:</span>
            <div style="font-weight:700; color:#0f172a">${user.gstin}</div>
          </div>
          <div>
            <span style="color:#64748b">PAN:</span>
            <div style="font-weight:700; color:#0f172a">${user.pan}</div>
          </div>
          <div>
            <span style="color:#64748b">Medical License:</span>
            <div style="font-weight:700; color:#0f172a">${user.medLicense}</div>
          </div>
          <div>
            <span style="color:#64748b">Wholesale Tier:</span>
            <div style="font-weight:700; color:#d97706">${user.tier || 'Gold'} Partner</div>
          </div>
        </div>
      </div>

      <!-- Account Management Menu Links -->
      <div class="card" style="border-radius:14px; overflow:hidden; margin-bottom:16px">
        <div style="padding:14px 18px; border-bottom:1px solid #f1f5f9; font-weight:700; font-size:12px; color:#64748b; text-transform:uppercase">
          Procurement Management
        </div>

        <div class="profile-menu-item" id="menu-orders" style="display:flex; justify-content:space-between; padding:14px 18px; border-bottom:1px solid #f1f5f9; cursor:pointer; font-size:13px; font-weight:600">
          <span>📦 Wholesale Purchase Orders</span>
          <span style="color:#94a3b8">→</span>
        </div>

        <div class="profile-menu-item" id="menu-invoices" style="display:flex; justify-content:space-between; padding:14px 18px; border-bottom:1px solid #f1f5f9; cursor:pointer; font-size:13px; font-weight:600">
          <span>🧾 GST Tax Invoices & ITC Pass-Through</span>
          <span style="color:#94a3b8">→</span>
        </div>

        <div class="profile-menu-item" id="menu-tiers" style="display:flex; justify-content:space-between; padding:14px 18px; border-bottom:1px solid #f1f5f9; cursor:pointer; font-size:13px; font-weight:600">
          <span>💰 Wholesale Volume Discount Tiers</span>
          <span style="color:#94a3b8">→</span>
        </div>

        <div class="profile-menu-item" id="menu-addresses" style="display:flex; justify-content:space-between; padding:14px 18px; border-bottom:1px solid #f1f5f9; cursor:pointer; font-size:13px; font-weight:600">
          <span>🏢 Saved Receiving Docks & Facilities</span>
          <span style="color:#94a3b8">→</span>
        </div>

        <div class="profile-menu-item" id="menu-support" style="display:flex; justify-content:space-between; padding:14px 18px; cursor:pointer; font-size:13px; font-weight:600">
          <span>👨‍⚕️ Key Account Clinical Support</span>
          <span style="color:#94a3b8">→</span>
        </div>
      </div>

      <!-- Switch & Logout Buttons -->
      <div style="display:flex; flex-direction:column; gap:10px">
        <button id="btn-switch-retail" class="btn btn-secondary btn-pill" style="padding:12px; font-weight:700; font-size:13px">
          🛒 Switch to Retail Customer Store
        </button>

        <button id="btn-wh-logout" class="btn btn-pill" style="background:#fee2e2; color:#dc2626; border:none; padding:12px; font-weight:700; font-size:13px; cursor:pointer">
          Logout from Wholesale Partner Account
        </button>
      </div>
    </div>
  `;

  // Attach Menu Handlers
  el.querySelector('#menu-orders').addEventListener('click', () => navigate('wholesale/orders'));
  el.querySelector('#menu-invoices').addEventListener('click', () => navigate('wholesale/invoices'));

  el.querySelector('#menu-tiers').addEventListener('click', () => {
    const contentHtml = `
      <div style="font-size:13px">
        <div style="margin-bottom:10px">Your Current Status: <strong style="color:#d97706">${user.tier || 'Gold'} Tier</strong></div>
        <table class="bulk-tier-table">
          <thead>
            <tr><th>Tier</th><th>Min Order</th><th>Extra Rebate</th><th>Credit Terms</th></tr>
          </thead>
          <tbody>
            <tr><td>Bronze</td><td>10 Units</td><td>Base Wholesale</td><td>Advance / POD</td></tr>
            <tr><td>Silver</td><td>25 Units</td><td>+5% Margin</td><td>Net 15 Days</td></tr>
            <tr class="active-tier"><td>Gold (You)</td><td>50 Units</td><td>+8% Margin</td><td>Net 30 Days</td></tr>
            <tr><td>Platinum</td><td>100 Units</td><td>+12% Margin</td><td>Net 45 Days</td></tr>
          </tbody>
        </table>
      </div>
    `;
    showModal('Wholesale Buyer Tiers & Rebates', contentHtml, '<button class="btn btn-primary btn-sm" onclick="document.querySelector(\'#modal-close\').click()">Close</button>');
  });

  el.querySelector('#menu-addresses').addEventListener('click', () => {
    const contentHtml = `
      <div style="font-size:13px; line-height:1.6">
        <div style="padding:10px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:8px">
          <strong>Primary Facility / Central Receiving Dock</strong><br>
          ${user.address}<br>
          ${user.city}, ${user.state} - ${user.pincode}<br>
          <span style="font-size:11px; color:#10b981; font-weight:700">✓ Default Heavy Freight Bay</span>
        </div>
      </div>
    `;
    showModal('Saved Facilities & Receiving Docks', contentHtml, '<button class="btn btn-primary btn-sm" onclick="document.querySelector(\'#modal-close\').click()">Close</button>');
  });

  el.querySelector('#menu-support').addEventListener('click', () => {
    store.emitter.emit('toast', { message: 'Dedicated Account Manager: Satish Verma (+91 98201 44821)', type: 'info' });
  });

  el.querySelector('#btn-switch-retail').addEventListener('click', () => {
    store.setRole('customer');
    navigate('home');
  });

  el.querySelector('#btn-wh-logout').addEventListener('click', () => {
    store.emitter.emit('toast', { message: 'Logged out from Wholesale Partner account', type: 'info' });
    navigate('wholesale/login');
  });

  el.appendChild(renderWholesaleBottomNav('profile'));
  appEl.appendChild(el);
  return el;
}
