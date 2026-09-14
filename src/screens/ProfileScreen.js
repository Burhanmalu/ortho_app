// ========================================
// Profile Screen — Retail Customer
// Unified Grouped List Structure
// ========================================

import { navigate } from '../router.js';
import { icons } from '../data/icons.js';
import * as store from '../store.js';
import { renderBackHeader, renderBottomNav, showToast } from '../components/index.js';

export default function ProfileScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen screen-with-nav';

  el.appendChild(renderBackHeader('Account & Profile'));

  const user = store.getUser();

  const content = document.createElement('div');
  content.style.padding = '16px';

  content.innerHTML = `
    <!-- 1. Profile Summary Card -->
    <div class="card" style="padding:16px;display:flex;align-items:center;gap:14px;margin-bottom:20px">
      <div style="width:52px;height:52px;border-radius:var(--radius-full);background:var(--primary);color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-size:20px;font-weight:700">
        ${user.name ? user.name[0] : 'U'}
      </div>
      <div style="flex:1">
        <div style="font-family:var(--font-heading);font-size:16px;font-weight:700;color:var(--text)">${user.name || 'Rahul Sharma'}</div>
        <div style="font-size:12px;color:var(--text-secondary)">${user.email || 'rahul.sharma@example.com'}</div>
        <div style="margin-top:4px">
          <span class="status-pill success" style="font-size:10px;padding:2px 8px">Verified Patient Account</span>
        </div>
      </div>
    </div>

    <!-- 2. Grouped Sections -->
    <div style="display:flex;flex-direction:column;gap:18px">
      <!-- ACCOUNT -->
      <div>
        <div style="font-size:11px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;padding-left:4px">
          ACCOUNT
        </div>
        <div class="card" style="padding:0;overflow:hidden">
          <div class="profile-row" data-route="orders" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;cursor:pointer;border-bottom:1px solid var(--border-light)">
            <div style="display:flex;align-items:center;gap:12px;color:var(--text)">
              <span style="color:var(--primary)">${icons.package}</span>
              <span style="font-size:13px;font-weight:600">My Orders</span>
            </div>
            <span style="color:var(--text-tertiary)">${icons.chevronRight}</span>
          </div>
          <div class="profile-row" data-route="wishlist" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;cursor:pointer;border-bottom:1px solid var(--border-light)">
            <div style="display:flex;align-items:center;gap:12px;color:var(--text)">
              <span style="color:var(--primary)">${icons.heart}</span>
              <span style="font-size:13px;font-weight:600">Saved Wishlist</span>
            </div>
            <span style="color:var(--text-tertiary)">${icons.chevronRight}</span>
          </div>
          <div class="profile-row" data-action="address" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;cursor:pointer;border-bottom:1px solid var(--border-light)">
            <div style="display:flex;align-items:center;gap:12px;color:var(--text)">
              <span style="color:var(--primary)">${icons.mapPin}</span>
              <span style="font-size:13px;font-weight:600">Saved Addresses</span>
            </div>
            <span style="color:var(--text-tertiary)">${icons.chevronRight}</span>
          </div>
          <div class="profile-row" data-action="payments" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;cursor:pointer">
            <div style="display:flex;align-items:center;gap:12px;color:var(--text)">
              <span style="color:var(--primary)">${icons.creditCard}</span>
              <span style="font-size:13px;font-weight:600">Payment Methods</span>
            </div>
            <span style="color:var(--text-tertiary)">${icons.chevronRight}</span>
          </div>
        </div>
      </div>

      <!-- BUSINESS & INSTITUTIONAL -->
      <div>
        <div style="font-size:11px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;padding-left:4px">
          BUSINESS & PROCUREMENT
        </div>
        <div class="card" style="padding:0;overflow:hidden">
          <div class="profile-row" data-action="b2b-switch" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;cursor:pointer;border-bottom:1px solid var(--border-light)">
            <div style="display:flex;align-items:center;gap:12px;color:var(--text)">
              <span style="color:var(--primary)">${icons.building}</span>
              <div>
                <div style="font-size:13px;font-weight:600">Switch to Wholesale Buyer</div>
                <div style="font-size:11px;color:var(--text-secondary)">Institutional B2B pricing & Net-30 credit</div>
              </div>
            </div>
            <span style="color:var(--text-tertiary)">${icons.chevronRight}</span>
          </div>
          <div class="profile-row" data-action="b2b-invoices" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;cursor:pointer">
            <div style="display:flex;align-items:center;gap:12px;color:var(--text)">
              <span style="color:var(--primary)">${icons.fileText}</span>
              <span style="font-size:13px;font-weight:600">GST Business Invoices</span>
            </div>
            <span style="color:var(--text-tertiary)">${icons.chevronRight}</span>
          </div>
        </div>
      </div>

      <!-- SUPPORT -->
      <div>
        <div style="font-size:11px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;padding-left:4px">
          SUPPORT
        </div>
        <div class="card" style="padding:0;overflow:hidden">
          <div class="profile-row" data-action="support" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;cursor:pointer;border-bottom:1px solid var(--border-light)">
            <div style="display:flex;align-items:center;gap:12px;color:var(--text)">
              <span style="color:var(--primary)">${icons.helpCircle}</span>
              <span style="font-size:13px;font-weight:600">Help & Support Desk</span>
            </div>
            <span style="color:var(--text-tertiary)">${icons.chevronRight}</span>
          </div>
          <div class="profile-row" data-action="faqs" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;cursor:pointer">
            <div style="display:flex;align-items:center;gap:12px;color:var(--text)">
              <span style="color:var(--primary)">${icons.info}</span>
              <span style="font-size:13px;font-weight:600">Frequently Asked Questions</span>
            </div>
            <span style="color:var(--text-tertiary)">${icons.chevronRight}</span>
          </div>
        </div>
      </div>

      <!-- SYSTEM & LOGOUT -->
      <div>
        <div class="card" style="padding:0;overflow:hidden">
          <div class="profile-row" data-action="settings" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;cursor:pointer;border-bottom:1px solid var(--border-light)">
            <div style="display:flex;align-items:center;gap:12px;color:var(--text)">
              <span style="color:var(--text-secondary)">${icons.settings}</span>
              <span style="font-size:13px;font-weight:600">App Settings</span>
            </div>
            <span style="color:var(--text-tertiary)">${icons.chevronRight}</span>
          </div>
          <div class="profile-row" data-action="logout" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;cursor:pointer">
            <div style="display:flex;align-items:center;gap:12px;color:var(--danger)">
              <span>${icons.logOut}</span>
              <span style="font-size:13px;font-weight:600">Logout</span>
            </div>
            <span style="color:var(--danger)">${icons.chevronRight}</span>
          </div>
        </div>
      </div>
    </div>

    <div style="text-align:center;padding:24px 0 12px;font-size:11px;color:var(--text-tertiary)">
      OrthoCare Healthcare Platform v2.4<br>
      Certified Orthopedic & Rehabilitation E-Commerce
    </div>
  `;

  content.querySelectorAll('[data-route]').forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.route));
  });

  content.querySelectorAll('[data-action]').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      if (action === 'logout') {
        store.setLoggedIn(false);
        showToast('Logged out successfully', 'info');
        navigate('login');
      } else if (action === 'b2b-switch') {
        store.setRole('wholesale');
        navigate('wholesale/dashboard');
      } else if (action === 'b2b-invoices') {
        navigate('wholesale/invoices');
      } else {
        showToast(`${action.toUpperCase()} details verified`, 'info');
      }
    });
  });

  el.appendChild(content);
  appEl.appendChild(el);

  const nav = renderBottomNav('profile');
  appEl.appendChild(nav);

  return { unmount() { if (nav._unsub) nav._unsub(); } };
}
