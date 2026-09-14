// ========================================
// Wholesale Partner Login Screen
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { icons } from '../../data/icons.js';
import { renderBackHeader } from '../../components/index.js';

export default function WholesaleLoginScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen-content';
  el.style.background = '#f8fafc';

  el.appendChild(renderBackHeader('Wholesale Partner Portal', () => navigate('login')));

  el.innerHTML += `
    <div style="padding:24px 20px 80px; max-width:480px; margin:0 auto">
      <div style="text-align:center; margin-bottom:28px">
        <div style="width:60px; height:60px; border-radius:16px; background:#0f3647; color:#ffffff; display:flex; align-items:center; justify-content:center; font-size:28px; margin:0 auto 12px; box-shadow:0 8px 24px rgba(15, 54, 71, 0.25)">
          🏥
        </div>
        <h2 style="font-size:24px; font-weight:800; color:#0f172a">Wholesale Partner Login</h2>
        <p style="font-size:13px; color:#64748b; margin-top:4px">
          Enter registered business credentials to access B2B pricing & bulk procurement
        </p>
      </div>

      <!-- Quick Demo Accounts Widget -->
      <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:12px; padding:14px; margin-bottom:20px">
        <div style="font-size:11px; font-weight:800; color:#1e40af; text-transform:uppercase; margin-bottom:8px">
          ⚡ 1-Click Demo Partner Access
        </div>
        <div style="display:flex; flex-direction:column; gap:8px">
          <button type="button" id="quick-login-verified" class="btn btn-sm" style="background:#ffffff; border:1px solid #93c5fd; color:#1e3a8a; text-align:left; padding:8px 12px; display:flex; justify-content:space-between; align-items:center">
            <div>
              <div style="font-weight:700; font-size:12px">🏢 Apollo Pharmacy (Verified Partner)</div>
              <div style="font-size:10px; color:#64748b">Platinum Tier • ₹5,00,000 Credit • B2B Pricing</div>
            </div>
            <span style="font-weight:700; color:#2563eb">Login →</span>
          </button>

          <button type="button" id="quick-login-pending" class="btn btn-sm" style="background:#ffffff; border:1px solid #fde68a; color:#92400e; text-align:left; padding:8px 12px; display:flex; justify-content:space-between; align-items:center">
            <div>
              <div style="font-weight:700; font-size:12px">⏳ CareMed Surgical (Verification Pending)</div>
              <div style="font-size:10px; color:#64748b">Submitted Docs • Under Compliance Review</div>
            </div>
            <span style="font-weight:700; color:#d97706">Login →</span>
          </button>
        </div>
      </div>

      <!-- Standard Login Form -->
      <form id="wholesale-login-form" class="card" style="padding:20px; border-radius:14px; display:flex; flex-direction:column; gap:14px">
        <div>
          <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">
            Registered Business Mobile / Email
          </label>
          <input type="text" id="login-identifier" required value="procurement@apolloregional.in" class="input" style="width:100%">
        </div>

        <div>
          <div style="display:flex; justify-content:space-between; margin-bottom:4px">
            <label style="font-size:12px; font-weight:600; color:#475569">Password / OTP</label>
            <a href="javascript:void(0)" style="font-size:11px; color:#0d9488; font-weight:600">Send OTP</a>
          </div>
          <input type="password" id="login-pwd" required value="••••••••" class="input" style="width:100%">
        </div>

        <button type="submit" class="btn btn-primary btn-pill" style="padding:12px; font-weight:700; margin-top:4px">
          Enter Wholesale Dashboard →
        </button>

        <div style="text-align:center; padding-top:8px; border-top:1px solid #f1f5f9; display:flex; flex-direction:column; gap:8px">
          <a href="#/wholesale/register" style="font-size:13px; font-weight:700; color:#0d9488">
            New Business? Register as Wholesale Buyer
          </a>
          <a href="#/home" style="font-size:12px; color:#64748b">
            ← Switch to Retail Customer Shopping
          </a>
        </div>
      </form>
    </div>
  `;

  // Demo Buttons
  el.querySelector('#quick-login-verified').addEventListener('click', () => {
    const verifiedUser = store.getWholesaleBuyers().find(b => b.status === 'verified');
    if (verifiedUser) store.setWholesaleUser(verifiedUser);
    store.setRole('wholesale');
    navigate('wholesale/dashboard');
  });

  el.querySelector('#quick-login-pending').addEventListener('click', () => {
    const pendingUser = store.getWholesaleBuyers().find(b => b.status === 'pending');
    if (pendingUser) store.setWholesaleUser(pendingUser);
    store.setRole('wholesale');
    navigate('wholesale/verification-pending');
  });

  // Form Submit
  el.querySelector('#wholesale-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    store.setRole('wholesale');
    const user = store.getWholesaleUser();
    if (user && user.status === 'pending') {
      navigate('wholesale/verification-pending');
    } else {
      navigate('wholesale/dashboard');
    }
  });

  appEl.appendChild(el);
  return el;
}
