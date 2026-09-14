// ========================================
// Admin Portal Responsive Layout Frame
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';

export function renderAdminLayout(activeSection, contentElement) {
  const pendingCount = store.getWholesaleBuyers().filter(b => b.status === 'pending').length;

  const layout = document.createElement('div');
  layout.className = 'admin-viewport';

  layout.innerHTML = `
    <!-- Mobile Sidebar Backdrop -->
    <div class="admin-sidebar-backdrop" id="sidebar-backdrop"></div>

    <!-- Sidebar -->
    <aside class="admin-sidebar" id="admin-sidebar">
      <div class="admin-sidebar-header">
        <div class="admin-logo-mark">OC</div>
        <div>
          <div style="font-size:15px; font-weight:800; color:#ffffff">OrthoCare Admin</div>
          <div style="font-size:11px; color:#64748b">Master Control Portal</div>
        </div>
      </div>

      <nav class="admin-nav">
        <button class="admin-nav-item ${activeSection === 'dashboard' ? 'active' : ''}" data-route="admin/dashboard">
          <span>📊</span> Dashboard
        </button>
        <button class="admin-nav-item ${activeSection === 'products' ? 'active' : ''}" data-route="admin/products">
          <span>📦</span> Products Catalog
        </button>
        <button class="admin-nav-item ${activeSection === 'categories' ? 'active' : ''}" data-route="admin/categories">
          <span>🏷️</span> Categories
        </button>
        <button class="admin-nav-item ${activeSection === 'inventory' ? 'active' : ''}" data-route="admin/inventory">
          <span>📈</span> Inventory & Stock
        </button>
        <button class="admin-nav-item ${activeSection === 'orders' ? 'active' : ''}" data-route="admin/orders">
          <span>🛒</span> Retail Orders
        </button>
        <button class="admin-nav-item ${activeSection === 'wholesale-orders' ? 'active' : ''}" data-route="admin/wholesale-orders">
          <span>🏢</span> Wholesale Orders
        </button>
        <button class="admin-nav-item ${activeSection === 'customers' ? 'active' : ''}" data-route="admin/customers">
          <span>👥</span> Retail Customers
        </button>
        <button class="admin-nav-item ${activeSection === 'wholesale-buyers' ? 'active' : ''}" data-route="admin/wholesale-buyers">
          <span>🏥</span> Wholesale Buyers
          ${pendingCount > 0 ? `<span class="admin-nav-badge">${pendingCount}</span>` : ''}
        </button>
        <button class="admin-nav-item ${activeSection === 'pricing' ? 'active' : ''}" data-route="admin/pricing">
          <span>💰</span> Pricing & Tiers
        </button>
        <button class="admin-nav-item ${activeSection === 'coupons' ? 'active' : ''}" data-route="admin/coupons">
          <span>🎟️</span> Coupons & Offers
        </button>
        <button class="admin-nav-item ${activeSection === 'notifications' ? 'active' : ''}" data-route="admin/notifications">
          <span>🔔</span> Broadcast Center
        </button>
        <button class="admin-nav-item ${activeSection === 'reports' ? 'active' : ''}" data-route="admin/reports">
          <span>📑</span> Reports & CSV
        </button>
        <button class="admin-nav-item ${activeSection === 'settings' ? 'active' : ''}" data-route="admin/settings">
          <span>⚙️</span> Portal Settings
        </button>
      </nav>

      <!-- Sidebar Footer -->
      <div style="padding:16px; border-top:1px solid rgba(255,255,255,0.08); font-size:11px; color:#64748b">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
          <span style="color:#94a3b8">Quick Perspective:</span>
          <button id="admin-switch-customer" style="background:none; border:none; color:#0d9488; font-weight:700; cursor:pointer">
            🛒 Customer View
          </button>
        </div>
        <div>OrthoCare Healthcare v2.4 (Multi-Role)</div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="admin-main">
      <!-- Top Navbar -->
      <header class="admin-topbar">
        <div style="display:flex; align-items:center; gap:12px">
          <button class="admin-menu-toggle" id="sidebar-toggle">☰</button>
          <div class="admin-search-box">
            <span>🔍</span>
            <input type="text" placeholder="Search orders, buyers, SKUs...">
          </div>
        </div>

        <div class="admin-topbar-actions">
          <button id="topbar-switch-b2b" class="admin-btn admin-btn-secondary admin-btn-sm" style="font-weight:700">
            🏢 Switch to Wholesale
          </button>
          <div style="display:flex; align-items:center; gap:8px">
            <div style="width:34px; height:34px; border-radius:50%; background:#0f172a; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px">
              AD
            </div>
            <div style="display:none; font-size:12px">
              <strong style="color:#0f172a">Admin Supervisor</strong>
              <div style="font-size:10px; color:#64748b">Superadmin</div>
            </div>
          </div>
        </div>
      </header>

      <!-- Injected Screen Content -->
      <main style="padding:24px; flex:1" id="admin-content-slot"></main>
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
