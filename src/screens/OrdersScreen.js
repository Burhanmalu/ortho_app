// ========================================
// Orders Screen - Redesigned
// ========================================
import { navigate } from '../router.js';
import { getProductById, formatPrice } from '../data/products.js';
import { icons } from '../data/icons.js';
import * as store from '../store.js';
import { renderBackHeader, renderBottomNav, renderEmptyState, showGSTTaxInvoiceModal } from '../components/index.js';

const statusConfig = {
  confirmed: { label: 'Confirmed', pillClass: 'status-shipped' },
  shipped: { label: 'Shipped', pillClass: 'status-shipped' },
  'out-for-delivery': { label: 'Out for Delivery', pillClass: 'status-pending' },
  delivered: { label: 'Delivered', pillClass: 'status-active' },
  cancelled: { label: 'Cancelled', pillClass: 'status-inactive' },
};

export default function OrdersScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen screen-with-nav';
  el.style.paddingBottom = '100px';

  el.appendChild(renderBackHeader('My Orders'));

  let activeTab = 'all';

  const tabBar = document.createElement('div');
  tabBar.className = 'tabs';
  tabBar.style.padding = '0 16px 12px';

  const contentEl = document.createElement('div');
  el.appendChild(tabBar);
  el.appendChild(contentEl);

  function render() {
    const orders = store.getOrders() || [];
    const tabs = [
      { id: 'all', label: 'All Orders' },
      { id: 'active', label: 'Active' },
      { id: 'delivered', label: 'Delivered' },
      { id: 'cancelled', label: 'Cancelled' }
    ];

    tabBar.innerHTML = tabs.map(t => `
      <button class="tab ${t.id === activeTab ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>
    `).join('');

    tabBar.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => { 
        activeTab = tab.dataset.tab; 
        render(); 
      });
    });

    let filtered = orders;
    if (activeTab === 'active') {
      filtered = orders.filter(o => ['confirmed', 'shipped', 'out-for-delivery'].includes(o.status));
    } else if (activeTab === 'delivered') {
      filtered = orders.filter(o => o.status === 'delivered');
    } else if (activeTab === 'cancelled') {
      filtered = orders.filter(o => o.status === 'cancelled');
    }

    if (filtered.length === 0) {
      contentEl.innerHTML = '';
      contentEl.appendChild(renderEmptyState({
        icon: icons.package,
        title: activeTab === 'all' ? 'No orders yet' : `No ${activeTab} orders`,
        desc: 'Certified medical supports and rehabilitation equipment will appear here after checkout.',
        ctaLabel: 'Explore Catalog',
        ctaAction: () => navigate('categories')
      }));
      return;
    }

    contentEl.innerHTML = `
      <div style="padding:4px 16px 16px;display:flex;flex-direction:column;gap:12px">
        ${filtered.map(order => {
          const item = (order.items && order.items[0]) || {};
          const product = getProductById(item.productId);
          const s = statusConfig[order.status] || { label: order.status || 'Processed', pillClass: 'status-shipped' };
          const firstImg = (product && product.images && product.images[0]) || '';

          return `
            <div class="card" style="padding:14px;display:flex;flex-direction:column;gap:12px">
              <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);padding-bottom:10px">
                <div>
                  <div style="font-size:13px;font-weight:700;color:var(--text)">Order #${order.id}</div>
                  <div style="font-size:11px;color:var(--text-secondary);margin-top:2px">${order.date || 'Recent Order'}</div>
                </div>
                <span class="status-pill ${s.pillClass}">
                  <span class="status-pill-dot"></span>
                  ${s.label}
                </span>
              </div>

              <div style="display:flex;gap:12px;align-items:center">
                <div style="width:54px;height:54px;border-radius:var(--radius-md);background:var(--bg-light);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;border:1px solid var(--border)">
                  ${firstImg 
                    ? `<img src="${firstImg}" alt="Product" style="width:100%;height:100%;object-fit:cover" />` 
                    : `<span style="width:24px;height:24px;color:var(--primary);display:inline-flex">${icons.knee}</span>`}
                </div>
                <div style="flex:1;min-width:0">
                  <div style="font-size:13px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                    ${product ? product.name : (item.name || 'Orthopedic Support Item')}
                  </div>
                  <div style="font-size:12px;color:var(--text-secondary);margin-top:2px">
                    ${order.items && order.items.length > 1 ? `${order.items.length} items included` : `Qty: ${item.qty || 1} · Size: ${item.size || 'Universal'}`}
                  </div>
                  <div style="font-size:13px;font-weight:700;color:var(--primary);margin-top:4px">
                    ${formatPrice(order.total || 0)}
                  </div>
                </div>
              </div>

              <div style="display:flex;justify-content:flex-end;align-items:center;gap:8px;padding-top:10px;border-top:1px solid var(--border)">
                <button class="btn btn-secondary btn-sm" data-invoice="${order.id}" style="display:inline-flex;align-items:center;gap:6px">
                  ${icons.fileText} Invoice
                </button>
                <button class="btn btn-primary btn-sm" data-action="${order.status === 'delivered' ? 'reorder' : 'track'}" data-oid="${order.id}" style="display:inline-flex;align-items:center;gap:6px">
                  ${order.status === 'delivered' ? `${icons.repeat} Reorder` : `${icons.truck} Track`}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Invoice button handlers
    contentEl.querySelectorAll('[data-invoice]').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.dataset.invoice;
        const ord = orders.find(o => String(o.id) === String(orderId));
        if (ord) {
          showGSTTaxInvoiceModal(ord);
        }
      });
    });

    // Action button handlers
    contentEl.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const oid = btn.dataset.oid;
        if (action === 'reorder') {
          const ord = orders.find(o => String(o.id) === String(oid));
          if (ord && ord.items) {
            ord.items.forEach(it => store.addToCart(it.productId, it.size, it.qty || 1));
            store.emit('toast', { message: 'Items added back to your cart!', type: 'success' });
            navigate('cart');
          }
        } else {
          store.emit('toast', { message: `Tracking order #${oid}: Package in transit with Bluedart Healthcare Express.`, type: 'info' });
        }
      });
    });
  }

  render();
  appEl.appendChild(el);

  const nav = renderBottomNav('profile');
  appEl.appendChild(nav);

  return { unmount() { if (nav._unsub) nav._unsub(); } };
}
