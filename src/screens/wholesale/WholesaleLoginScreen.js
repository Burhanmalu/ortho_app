// ========================================
// Wholesale Partner Login Screen - Redesigned
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { icons } from '../../data/icons.js';
import { renderBackHeader } from '../../components/index.js';

export default function WholesaleLoginScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen-content';
  el.style.background = 'var(--bg-light)';

  el.appendChild(renderBackHeader('Wholesale Partner Portal', () => navigate('login')));

  el.innerHTML += `
    <div style="padding:24px 16px 80px; max-width:480px; margin:0 auto">
      <div style="text-align:center; margin-bottom:24px">
        <div style="width:56px; height:56px; border-radius:var(--radius-lg); background:var(--deep-navy); color:var(--text-white); display:flex; align-items:center; justify-content:center; margin:0 auto 12px; box-shadow:var(--shadow-md)">
          <span style="width:28px; height:28px; display:inline-flex">${icons.hospital || icons.building}</span>
        </div>
        <h2 style="font-size:22px; font-weight:800; color:var(--deep-navy)">Wholesale Partner Login</h2>
        <p style="font-size:12px; color:var(--text-secondary); margin-top:4px">
          Enter registered business credentials to access B2B pricing & bulk procurement
        </p>
      </div>

      <!-- Quick Demo Accounts Widget -->
      <div class="card" style="padding:14px; margin-bottom:16px; background:rgba(23, 107, 135, 0.06); border:1px solid rgba(23, 107, 135, 0.2)">
        <div style="font-size:11px; font-weight:700; color:var(--primary); text-transform:uppercase; margin-bottom:8px; letter-spacing:0.5px">
          1-Click Demo Partner Access
        </div>
        <div style="display:flex; flex-direction:column; gap:8px">
          <button type="button" id="quick-login-verified" class="btn btn-sm btn-secondary" style="background:var(--bg-white); text-align:left; padding:8px 12px; display:flex; justify-content:space-between; align-items:center">
            <div>
              <div style="font-weight:700; font-size:12px; color:var(--deep-navy)">Apollo Pharmacy (Verified Partner)</div>
              <div style="font-size:10px; color:var(--text-secondary)">Platinum Tier • ₹5,00,000 Credit • B2B Pricing</div>
            </div>
            <span style="font-weight:700; color:var(--primary); font-size:11px">Login</span>
          </button>

          <button type="button" id="quick-login-pending" class="btn btn-sm btn-secondary" style="background:var(--bg-white); text-align:left; padding:8px 12px; display:flex; justify-content:space-between; align-items:center">
            <div>
              <div style="font-weight:700; font-size:12px; color:var(--deep-navy)">CareMed Surgical (Verification Pending)</div>
              <div style="font-size:10px; color:var(--text-secondary)">Submitted Docs • Under Compliance Review</div>
            </div>
            <span style="font-weight:700; color:var(--danger); font-size:11px">Review</span>
          </button>
        </div>
      </div>

      <!-- Standard Login Form -->
      <form id="wholesale-login-form" class="card" style="padding:20px; display:flex; flex-direction:column; gap:14px">
        <div>
          <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">
            Registered Business Mobile or Email
          </label>
          <input type="text" id="login-identifier" required value="procurement@apolloregional.in" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
        </div>

        <div>
          <div style="display:flex; justify-content:space-between; margin-bottom:4px">
            <label style="font-size:11px; font-weight:600; color:var(--text-secondary)">Password / OTP</label>
            <a href="javascript:void(0)" style="font-size:11px; color:var(--primary); font-weight:600">Send OTP</a>
          </div>
          <input type="password" id="login-pwd" required value="••••••••" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
        </div>

        <button type="submit" class="btn btn-primary btn-block" style="height:44px; font-weight:700; margin-top:4px">
          Enter Wholesale Dashboard
        </button>

        <div style="text-align:center; padding-top:10px; border-top:1px solid var(--border); display:flex; flex-direction:column; gap:8px">
          <a href="#/wholesale/register" style="font-size:12px; font-weight:700; color:var(--primary)">
            New Institutional Buyer? Apply for Wholesale Account
          </a>
          <a href="#/home" style="font-size:12px; color:var(--text-secondary)">
            Return to Retail Customer Shopping
          </a>
        </div>
      </form>
    </div>
  `;

  // Demo Buttons
  el.querySelector('#quick-login-verified')?.addEventListener('click', () => {
    const verifiedUser = (store.getWholesaleBuyers() || []).find(b => b.status === 'verified');
    if (verifiedUser) store.setWholesaleUser(verifiedUser);
    store.setRole('wholesale');
    navigate('wholesale/dashboard');
  });

  el.querySelector('#quick-login-pending')?.addEventListener('click', () => {
    const pendingUser = (store.getWholesaleBuyers() || []).find(b => b.status === 'pending');
    if (pendingUser) store.setWholesaleUser(pendingUser);
    store.setRole('wholesale');
    navigate('wholesale/verification-pending');
  });

  // Form Submit
  el.querySelector('#wholesale-login-form')?.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' && e.target.type === 'submit') {
      e.preventDefault();
      store.setRole('wholesale');
      const user = store.getWholesaleUser();
      if (user && user.status === 'pending') {
        navigate('wholesale/verification-pending');
      } else {
        navigate('wholesale/dashboard');
      }
    }
  });

  appEl.appendChild(el);
  return el;
}
