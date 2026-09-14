// ========================================
// Admin Portal Responsive Layout Frame — OrthoCare
// Deep Navy (#123B4A) Sidebar with Clean Hierarchical Sections
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { icons } from '../../data/icons.js';

export function renderAdminLayout(activeSection, contentElement) {
  const pendingCount = store.getWholesaleBuyers().filter(b => b.status === 'pending').length;

  const layout = document.createElement('div');
  layout.className = 'admin-viewport';

  layout.innerHTML = `
    <!-- Mobile Sidebar Backdrop -->
    <div class="admin-sidebar-backdrop" id="sidebar-backdrop"></div>

    <!-- Deep Navy Sidebar -->
    <aside class="admin-sidebar" id="admin-sidebar">
      <div class="admin-sidebar-header">
        <div class="admin-logo-mark">OC</div>
        <div>
          <div class="admin-brand-title">OrthoCare Admin</div>
          <div class="admin-brand-sub">Master Marketplace Portal</div>
        </div>
      </div>

      <nav class="admin-nav">
        <button class="admin-nav-item ${activeSection === 'dashboard' ? 'active' : ''}" data-route="admin/dashboard">
          <span class="admin-nav-icon">${icons.barChart}</span>
          <span>Dashboard</span>
        </button>

        <div class="admin-nav-section-title">CATALOG</div>
        <button class="admin-nav-item ${activeSection === 'products' ? 'active' : ''}" data-route="admin/products">
          <span class="admin-nav-icon">${icons.package}</span>
          <span>Products</span>
        </button>
        <button class="admin-nav-item ${activeSection === 'categories' ? 'active' : ''}" data-route="admin/categories">
          <span class="admin-nav-icon">${icons.grid}</span>
          <span>Categories</span>
        </button>
        <button class="admin-nav-item ${activeSection === 'inventory' ? 'active' : ''}" data-route="admin/inventory">
          <span class="admin-nav-icon">${icons.layers}</span>
          <span>Inventory</span>
        </button>

        <div class="admin-nav-section-title">ORDERS</div>
        <button class="admin-nav-item ${activeSection === 'orders' ? 'active' : ''}" data-route="admin/orders">
          <span class="admin-nav-icon">${icons.cart}</span>
          <span>Retail Orders</span>
        </button>
        <button class="admin-nav-item ${activeSection === 'wholesale-orders' ? 'active' : ''}" data-route="admin/wholesale-orders">
          <span class="admin-nav-icon">${icons.building}</span>
          <span>Wholesale Orders</span>
        </button>

        <div class="admin-nav-section-title">CUSTOMERS</div>
        <button class="admin-nav-item ${activeSection === 'customers' ? 'active' : ''}" data-route="admin/customers">
          <span class="admin-nav-icon">${icons.users}</span>
          <span>Customers</span>
        </button>
        <button class="admin-nav-item ${activeSection === 'wholesale-buyers' ? 'active' : ''}" data-route="admin/wholesale-buyers">
          <span class="admin-nav-icon">${icons.hospital}</span>
          <span>Wholesale Buyers</span>
          ${pendingCount > 0 ? `<span class="admin-nav-badge">${pendingCount}</span>` : ''}
        </button>

        <div class="admin-nav-section-title">MARKETING</div>
        <button class="admin-nav-item ${activeSection === 'coupons' ? 'active' : ''}" data-route="admin/coupons">
          <span class="admin-nav-icon">${icons.tag}</span>
          <span>Coupons & Offers</span>
        </button>
        <button class="admin-nav-item ${activeSection === 'notifications' ? 'active' : ''}" data-route="admin/notifications">
          <span class="admin-nav-icon">${icons.bell}</span>
          <span>Notifications</span>
        </button>

        <div class="admin-nav-section-title">ANALYTICS</div>
        <button class="admin-nav-item ${activeSection === 'reports' ? 'active' : ''}" data-route="admin/reports">
          <span class="admin-nav-icon">${icons.fileText}</span>
          <span>Reports</span>
        </button>

        <div class="admin-nav-section-title">SYSTEM</div>
        <button class="admin-nav-item ${activeSection === 'settings' ? 'active' : ''}" data-route="admin/settings">
          <span class="admin-nav-icon">${icons.settings}</span>
          <span>Settings</span>
        </button>
      </nav>

      <!-- Sidebar Footer -->
      <div style="padding:16px 20px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:#8CA0A8">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span>Quick Switch:</span>
          <button id="admin-switch-customer" style="background:none;border:none;color:var(--primary-light);font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:4px">
            ${icons.user} Customer
          </button>
        </div>
        <div>OrthoCare Healthcare v2.4</div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="admin-main">
      <!-- Top Navbar -->
      <header class="admin-topbar">
        <div style="display:flex;align-items:center;gap:12px;flex:1;max-width:440px">
          <button class="admin-menu-toggle" id="sidebar-toggle" aria-label="Toggle Navigation">
            ${icons.menu}
          </button>
          <div class="search-bar" style="height:38px;flex:1">
            <span class="search-bar-icon">${icons.search}</span>
            <input type="text" placeholder="Search products, orders, customers..." />
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:10px">
          <button id="topbar-switch-b2b" class="btn btn-secondary btn-sm" style="display:inline-flex;align-items:center;gap:6px">
            ${icons.building} <span>Wholesale View</span>
          </button>
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:36px;height:36px;border-radius:var(--radius-full);background:var(--deep-navy);color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px">
              AD
            </div>
          </div>
        </div>
      </header>

      <!-- Injected Screen Content -->
      <main style="padding:24px;flex:1;min-width:0" id="admin-content-slot"></main>
    </div>
  `;

  layout.querySelector('#admin-content-slot').appendChild(contentElement);

  // Toggle Sidebar for Mobile/Tablet
  const sidebar = layout.querySelector('#admin-sidebar');
  const backdrop = layout.querySelector('#sidebar-backdrop');
  const toggleBtn = layout.querySelector('#sidebar-toggle');

  function toggleSidebar() {
    sidebar.classList.toggle('open');
    if (backdrop) backdrop.classList.toggle('open');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
  }

  toggleBtn.addEventListener('click', toggleSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);

  // Nav Item Clicks
  layout.querySelectorAll('.admin-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      closeSidebar();
      navigate(btn.dataset.route);
    });
  });

  layout.querySelector('#admin-switch-customer').addEventListener('click', () => {
    closeSidebar();
    store.setRole('customer');
    navigate('home');
  });

  layout.querySelector('#topbar-switch-b2b').addEventListener('click', () => {
    closeSidebar();
    store.setRole('wholesale');
    navigate('wholesale/dashboard');
  });

  return layout;
}
