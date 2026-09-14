// ========================================
// Admin Notifications & Broadcast Center - Redesigned
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { icons } from '../../data/icons.js';
import { renderAdminLayout } from './AdminLayout.js';

export default function AdminNotificationsScreen(appEl) {
  const content = document.createElement('div');

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px; flex-wrap:wrap; gap:12px">
      <div>
        <h1 style="font-size:20px; font-weight:800; color:var(--deep-navy); margin:0 0 4px">Broadcast Notification Center</h1>
        <div style="font-size:12px; color:var(--text-secondary)">Dispatch clinical alerts, stock notices, and targeted broadcasts to patients or wholesale hospitals</div>
      </div>
    </div>

    <!-- Compose & History Grid -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:16px">
      <!-- Composer Card -->
      <div class="card" style="padding:18px">
        <h3 style="font-size:14px; font-weight:700; color:var(--deep-navy); margin-bottom:14px; display:flex; align-items:center; gap:8px">
          <span style="color:var(--primary); width:18px; height:18px; display:inline-flex">${icons.bell || icons.info}</span>
          Compose Broadcast Dispatch
        </h3>

        <form id="broadcast-form" style="display:flex; flex-direction:column; gap:12px; font-size:13px">
          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Target Audience Channel *</label>
            <select id="notif-target" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none" required>
              <option value="wholesale">Wholesale Buyers Only (326 verified institutions)</option>
              <option value="retail">Retail Customers Only (8,420 registered patients)</option>
              <option value="all">Omnichannel Broadcast (All 8,746 Users)</option>
            </select>
          </div>

          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Notification Title *</label>
            <input type="text" id="notif-title" required placeholder="e.g. New Bulk Pallet Pricing on Cervical Collars" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
          </div>

          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Message Content *</label>
            <textarea id="notif-body" required rows="3" placeholder="Enter concise broadcast alert copy..." style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none; resize:vertical"></textarea>
          </div>

          <!-- Quick Template Presets -->
          <div>
            <span style="font-size:11px; color:var(--text-secondary); font-weight:600">Quick Clinical Presets:</span>
            <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:6px">
              <button type="button" class="btn-tpl btn btn-secondary btn-sm" data-target="retail" data-title="Joint Health Alert: 20% OFF Knee Braces" data-msg="Certified OrthoFlex knee supports are on special pricing this week. Use code KNEE20 today!" style="font-size:11px; padding:4px 8px">
                Retail: Knee Promo
              </button>
              <button type="button" class="btn-tpl btn btn-secondary btn-sm" data-target="wholesale" data-title="Institutional Alert: Cervical Collar Carton Stock" data-msg="New pallet stock ready for hospital dispatch. Net 30 terms active for verified clinics." style="font-size:11px; padding:4px 8px">
                Wholesale: Pallet Supply
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block" style="height:42px; margin-top:6px; font-size:13px; font-weight:700">
            Dispatch Broadcast Now
          </button>
        </form>
      </div>

      <!-- Broadcast History Feed -->
      <div class="card" style="padding:18px">
        <h3 style="font-size:14px; font-weight:700; color:var(--deep-navy); margin-bottom:14px">
          Recent Broadcast Dispatches
        </h3>

        <div id="broadcast-history" style="display:flex; flex-direction:column; gap:10px"></div>
      </div>
    </div>
  `;

  function renderHistory() {
    const list = store.getAdminNotifications() || [];
    const container = content.querySelector('#broadcast-history');

    container.innerHTML = list.map(n => `
      <div style="background:var(--bg-light); border:1px solid var(--border); border-radius:var(--radius-md); padding:12px">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px">
          <span class="status-pill ${n.target === 'wholesale' ? 'status-shipped' : 'status-active'}" style="font-size:10px; padding:2px 8px">
            ${n.target.toUpperCase()}
          </span>
          <span style="font-size:11px; color:var(--text-secondary)">${n.sentAt || 'Recently'}</span>
        </div>
        <div style="font-weight:700; color:var(--text); font-size:13px; margin:4px 0">${n.title}</div>
        <p style="font-size:12px; color:var(--text-secondary); margin:0 0 8px; line-height:1.4">${n.message}</p>
        <div style="font-size:11px; color:var(--success); font-weight:600">
          Delivered to ${(n.delivered || 100).toLocaleString()} recipients
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
    store.emit('toast', { message: 'Broadcast notification dispatched', type: 'success' });
    renderHistory();
  });

  renderHistory();

  const fullLayout = renderAdminLayout('notifications', content);
  appEl.appendChild(fullLayout);
  return fullLayout;
}
