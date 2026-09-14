// ========================================
// Notifications Screen
// ========================================
import { icons } from '../data/icons.js';
import { notifications } from '../data/banners.js';
import { renderBackHeader, renderBottomNav } from '../components/index.js';

export default function NotificationsScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen screen-with-nav';

  el.appendChild(renderBackHeader('Notifications'));

  const content = document.createElement('div');
  content.innerHTML = notifications.map(n => `
    <div class="notification-item ${n.unread ? 'unread' : ''}">
      <div class="notification-icon" style="background:${n.iconBg}">${n.icon}</div>
      <div class="notification-content">
        <div class="notification-title">${n.title}</div>
        <div class="notification-text">${n.text}</div>
        <div class="notification-time">${n.time}</div>
      </div>
    </div>
  `).join('');

  el.appendChild(content);
  appEl.appendChild(el);

  const nav = renderBottomNav('profile');
  appEl.appendChild(nav);

  return { unmount() { if (nav._unsub) nav._unsub(); } };
}
