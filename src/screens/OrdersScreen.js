// ========================================
// Orders Screen
// ========================================
import { navigate } from '../router.js';
import { getProductById, formatPrice } from '../data/products.js';
import { icons } from '../data/icons.js';
import * as store from '../store.js';
import { renderBackHeader, renderBottomNav, renderEmptyState } from '../components/index.js';

const statusMap = {
  confirmed: { label: 'Confirmed', dot: 'confirmed', color: 'var(--color-success)' },
  shipped: { label: 'Shipped', dot: 'shipped', color: 'var(--color-warning)' },
  'out-for-delivery': { label: 'Out for Delivery', dot: 'out-for-delivery', color: 'var(--color-info)' },
  delivered: { label: 'Delivered', dot: 'delivered', color: 'var(--color-success)' },
  cancelled: { label: 'Cancelled', dot: 'cancelled', color: 'var(--color-error)' },
};

export default function OrdersScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen screen-with-nav';

  el.appendChild(renderBackHeader('My Orders'));

  let activeTab = 'active';

  const tabBar = document.createElement('div');
  tabBar.className = 'tabs';

  const contentEl = document.createElement('div');
  el.appendChild(tabBar);
  el.appendChild(contentEl);

  function render() {
    const orders = store.getOrders();
    const tabs = ['active', 'delivered', 'cancelled'];
    tabBar.innerHTML = tabs.map(t => `
      <button class="tab ${t === activeTab ? 'active' : ''}" data-tab="${t}">${t.charAt(0).toUpperCase() + t.slice(1)}</button>
    `).join('');
    tabBar.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => { activeTab = tab.dataset.tab; render(); });
    });

    let filtered;
    if (activeTab === 'active') filtered = orders.filter(o => ['confirmed', 'shipped', 'out-for-delivery'].includes(o.status));
    else if (activeTab === 'delivered') filtered = orders.filter(o => o.status === 'delivered');
    else filtered = orders.filter(o => o.status === 'cancelled');

    if (filtered.length === 0) {
      contentEl.innerHTML = '';
      contentEl.appendChild(renderEmptyState(
        '📦', `No ${activeTab} orders`,
        `You don't have any ${activeTab} orders yet.`,
        'Start Shopping', () => navigate('home')
      ));
      return;
    }

    contentEl.innerHTML = `<div style="padding:var(--sp-lg) var(--content-padding)">
      ${filtered.map(order => {
        const item = order.items[0];
        const product = getProductById(item?.productId);
        const s = statusMap[order.status] || statusMap.confirmed;
        return `
          <div class="order-card">
            <div class="order-card-header">
              <span class="order-id">Order #${order.id}</span>
              <span class="order-date">${order.date}</span>
            </div>
            <div class="order-product">
              <div class="order-product-img">
                ${product ? `<span style="font-size:24px;opacity:0.3">${product.emoji || '🩹'}</span>` : '🩹'}
              </div>
              <div>
                <div class="order-product-name">${product ? product.name : 'Product'}</div>
                <div class="order-product-price">
                  ${formatPrice(order.total)}
                  ${order.items.length > 1 ? ` · ${order.items.length} items` : ` · Size: ${item?.size || 'M'}`}
                </div>
              </div>
            </div>
            <div class="order-card-footer">
              <div class="order-status" style="color:${s.color}">
                <span class="order-status-dot ${s.dot}"></span>
                ${s.label}
              </div>
              <button class="btn btn-sm btn-secondary" data-oid="${order.id}">
                ${order.status === 'delivered' ? 'Reorder' : 'Track Order'}
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>`;

    contentEl.querySelectorAll('[data-oid]').forEach(btn => {
      btn.addEventListener('click', () => {
        // Show toast for now
        store.emit('toast', { message: 'Order tracking coming soon!', type: 'info' });
      });
    });
  }

  render();
  appEl.appendChild(el);

  const nav = renderBottomNav('profile');
  appEl.appendChild(nav);

  return { unmount() { if (nav._unsub) nav._unsub(); } };
}
