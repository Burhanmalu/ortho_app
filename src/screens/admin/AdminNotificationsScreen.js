// ========================================
// Admin Notifications & Broadcast Center
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { renderAdminLayout } from './AdminLayout.js';

export default function AdminNotificationsScreen(appEl) {
  const content = document.createElement('div');

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px; flex-wrap:wrap; gap:12px">
      <div>
        <h1 style="font-size:24px; font-weight:800; color:#0f172a; margin:0 0 4px">Broadcast Notification Center</h1>
        <div style="font-size:13px; color:#64748b">Dispatch instant push notifications & in-app banners to patients or wholesale hospitals</div>
      </div>
    </div>

    <!-- Compose & History Grid -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px">
      <!-- Composer Card -->
      <div class="admin-card" style="padding:20px">
        <h3 style="font-size:16px; font-weight:800; color:#0f3647; margin-bottom:14px">
          📣 Compose Broadcast Dispatch
        </h3>

        <form id="broadcast-form" style="display:flex; flex-direction:column; gap:14px; font-size:13px">
          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Target Audience Channel *</label>
            <select id="notif-target" class="input" style="width:100%" required>
              <option value="wholesale">Wholesale Buyers Only (326 verified institutions)</option>
              <option value="retail">Retail Customers Only (8,420 registered patients)</option>
              <option value="all">Omnichannel Broadcast (All 8,746 Users)</option>
            </select>
          </div>

          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Notification Title *</label>
            <input type="text" id="notif-title" required placeholder="e.g. New Bulk Pallet Pricing on Cervical Collars" class="input" style="width:100%">
          </div>

          <div>
            <label style="font-weight:700; display:block; margin-bottom:4px">Message Content *</label>
            <textarea id="notif-body" required rows="3" placeholder="Enter concise broadcast alert copy..." class="input" style="width:100%"></textarea>
          </div>

          <!-- Quick Template Presets -->
          <div>
            <span style="font-size:11px; color:#64748b; font-weight:700">Quick Clinical Templates:</span>
            <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:4px">
              <button type="button" class="btn-tpl admin-btn admin-btn-secondary admin-btn-sm" data-target="retail" data-title="Joint Health Alert: 20% OFF Knee Braces" data-msg="Take care of knee pain with certified OrthoFlex braces. Use code KNEE20 today!">
                Retail: Knee Promo
              </button>
              <button type="button" class="btn-tpl admin-btn admin-btn-secondary admin-btn-sm" data-target="wholesale" data-title="Institutional Alert: Cervical Collar Carton Stock" data-msg="New pallet stock ready for hospital dispatch. Net 30 terms active for verified clinics.">
                Wholesale: Pallet Supply
              </button>
            </div>
          </div>

          <button type="submit" class="admin-btn admin-btn-primary" style="padding:12px; font-weight:800; margin-top:8px">
            🚀 Dispatch Broadcast Now
          </button>
        </form>
      </div>

      <!-- Broadcast History Feed -->
      <div class="admin-card" style="padding:20px">
        <h3 style="font-size:16px; font-weight:800; color:#0f3647; margin-bottom:14px">
          Recent Broadcast Dispatches
        </h3>

        <div id="broadcast-history" style="display:flex; flex-direction:column; gap:12px"></div>
      </div>
    </div>
  `;

  function renderHistory() {
    const list = store.getAdminNotifications();
    const container = content.querySelector('#broadcast-history');

    container.innerHTML = list.map(n => `
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px">
          <span class="b2b-badge ${n.target === 'wholesale' ? 'tier-gold' : 'verified'}">
            ${n.target.toUpperCase()}
          </span>
          <span style="font-size:11px; color:#64748b">${n.sentAt}</span>
        </div>
        <div style="font-weight:700; color:#0f172a; font-size:13px; margin:4px 0">${n.title}</div>
        <p style="font-size:12px; color:#64748b; margin:0 0 8px">${n.message}</p>
        <div style="font-size:11px; color:#0d9488; font-weight:600">
          Delivered: ${(n.delivered || 100).toLocaleString()} recipients
        </div>
      </div>
    `).join('');
  }

  // Template pre-fills
  content.querySelectorAll('.btn-tpl').forEach(btn => {
    btn.addEventListener('click', () => {
      content.querySelector('#notif-target').value = btn.dataset.target;
      content.querySelector('#notif-title').value = btn.dataset.title;
      content.querySelector('#notif-body').value = btn.dataset.msg;
    });
  });

  // Form Submit
  content.querySelector('#broadcast-form').addEventListener('submit', (e) => {
    e.preventDefault();
    store.sendBroadcastNotification({
      target: content.querySelector('#notif-target').value,
      title: content.querySelector('#notif-title').value,
      message: content.querySelector('#notif-body').value
    });
    content.querySelector('#notif-title').value = '';
    content.querySelector('#notif-body').value = '';
    renderHistory();
  });

  renderHistory();

  const fullLayout = renderAdminLayout('notifications', content);
  appEl.appendChild(fullLayout);
  return fullLayout;
}
