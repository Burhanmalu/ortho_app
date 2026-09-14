// ========================================
// Profile Screen
// ========================================
import { navigate } from '../router.js';
import { icons } from '../data/icons.js';
import * as store from '../store.js';
import { renderBackHeader, renderBottomNav, showToast } from '../components/index.js';

export default function ProfileScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen screen-with-nav';

  el.appendChild(renderBackHeader('Profile'));

  const user = store.getUser();

  const content = document.createElement('div');
  content.innerHTML = `
    <!-- Profile Header -->
    <div class="profile-header">
      <div class="profile-avatar">${user.name[0]}</div>
      <div>
        <div class="profile-name">${user.name}</div>
        <div class="profile-email">${user.email}</div>
      </div>
    </div>

    <!-- Menu Groups -->
    <div class="profile-menu">
      <div class="profile-menu-group">
        <div class="profile-menu-item" data-route="orders">
          <div class="profile-menu-icon">${icons.package}</div>
          <span class="profile-menu-text">My Orders</span>
          <span class="profile-menu-arrow">${icons.chevronRight}</span>
        </div>
        <div class="profile-menu-item" data-route="wishlist">
          <div class="profile-menu-icon">${icons.heart}</div>
          <span class="profile-menu-text">My Wishlist</span>
          <span class="profile-menu-arrow">${icons.chevronRight}</span>
        </div>
        <div class="profile-menu-item" data-action="addresses">
          <div class="profile-menu-icon">${icons.mapPin}</div>
          <span class="profile-menu-text">Saved Addresses</span>
          <span class="profile-menu-arrow">${icons.chevronRight}</span>
        </div>
        <div class="profile-menu-item" data-action="payments">
          <div class="profile-menu-icon">${icons.creditCard}</div>
          <span class="profile-menu-text">Payment Methods</span>
          <span class="profile-menu-arrow">${icons.chevronRight}</span>
        </div>
        <div class="profile-menu-item" data-action="recent">
          <div class="profile-menu-icon">${icons.eye}</div>
          <span class="profile-menu-text">Recently Viewed</span>
          <span class="profile-menu-arrow">${icons.chevronRight}</span>
        </div>
      </div>

      <div class="profile-menu-group">
        <div class="profile-menu-item" data-route="offers">
          <div class="profile-menu-icon">${icons.tag}</div>
          <span class="profile-menu-text">Coupons & Offers</span>
          <span class="profile-menu-arrow">${icons.chevronRight}</span>
        </div>
        <div class="profile-menu-item" data-route="notifications">
          <div class="profile-menu-icon">${icons.bell}</div>
          <span class="profile-menu-text">Notifications</span>
          <span class="profile-menu-arrow">${icons.chevronRight}</span>
        </div>
      </div>

      <div class="profile-menu-group">
        <div class="profile-menu-item" data-action="help">
          <div class="profile-menu-icon">${icons.helpCircle}</div>
          <span class="profile-menu-text">Help & Support</span>
          <span class="profile-menu-arrow">${icons.chevronRight}</span>
        </div>
        <div class="profile-menu-item" data-action="faq">
          <div class="profile-menu-icon">${icons.info}</div>
          <span class="profile-menu-text">FAQs</span>
          <span class="profile-menu-arrow">${icons.chevronRight}</span>
        </div>
        <div class="profile-menu-item" data-action="privacy">
          <div class="profile-menu-icon">${icons.shield}</div>
          <span class="profile-menu-text">Privacy Policy</span>
          <span class="profile-menu-arrow">${icons.chevronRight}</span>
        </div>
        <div class="profile-menu-item" data-action="terms">
          <div class="profile-menu-icon">${icons.bookmark}</div>
          <span class="profile-menu-text">Terms & Conditions</span>
          <span class="profile-menu-arrow">${icons.chevronRight}</span>
        </div>
        <div class="profile-menu-item" data-action="settings">
          <div class="profile-menu-icon">${icons.settings}</div>
          <span class="profile-menu-text">Settings</span>
          <span class="profile-menu-arrow">${icons.chevronRight}</span>
        </div>
      </div>

      <div class="profile-menu-group">
        <div class="profile-menu-item danger" data-action="logout">
          <div class="profile-menu-icon">${icons.logOut}</div>
          <span class="profile-menu-text">Logout</span>
          <span class="profile-menu-arrow">${icons.chevronRight}</span>
        </div>
      </div>
    </div>

    <div style="text-align:center;padding:var(--sp-2xl);font-size:var(--fs-xs);color:var(--color-text-tertiary)">
      OrthoCare v1.0.0<br>© 2026 OrthoCare. All rights reserved.
    </div>
  `;

  // Route navigation
  content.querySelectorAll('[data-route]').forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.route));
  });

  // Action items
  content.querySelectorAll('[data-action]').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      if (action === 'logout') {
        store.setLoggedIn(false);
        showToast('Logged out successfully', 'info');
        navigate('login');
      } else {
        showToast('Coming soon!', 'info');
      }
    });
  });

  el.appendChild(content);
  appEl.appendChild(el);

  const nav = renderBottomNav('profile');
  appEl.appendChild(nav);

  return { unmount() { if (nav._unsub) nav._unsub(); } };
}
