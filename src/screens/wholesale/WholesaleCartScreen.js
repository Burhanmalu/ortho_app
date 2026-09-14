// ========================================
// Wholesale B2B Cart Screen - Redesigned
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { formatPrice } from '../../data/products.js';
import { icons } from '../../data/icons.js';
import { renderBackHeader, renderWholesaleBottomNav, renderEmptyState } from '../../components/index.js';

export default function WholesaleCartScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen-content';
  el.style.background = 'var(--bg-light)';
  el.style.paddingBottom = '110px';

  let nav = null;

  function renderCart() {
    el.innerHTML = '';
    el.appendChild(renderBackHeader('Wholesale Bulk Cart', () => navigate('wholesale/dashboard')));

    const summary = store.getWholesaleCartSummary();
    const items = summary.itemDetails || [];

    const contentContainer = document.createElement('div');
    contentContainer.style.padding = '16px';
    contentContainer.style.maxWidth = '720px';
    contentContainer.style.margin = '0 auto';

    if (items.length === 0) {
      contentContainer.appendChild(renderEmptyState({
        icon: icons.cart,
        title: 'Your Wholesale Cart is Empty',
        desc: 'Add institutional cartons from the catalog or build purchase orders using the Matrix Pad.',
        ctaLabel: 'Browse B2B Catalog',
        ctaAction: () => navigate('wholesale/products')
      }));
      el.appendChild(contentContainer);
      nav = renderWholesaleBottomNav('cart');
      el.appendChild(nav);
      return;
    }

    contentContainer.innerHTML = `
      <!-- MOQ Warning Notice if applicable -->
      ${summary.hasMoqViolation ? `
        <div class="card" style="padding:12px 14px; margin-bottom:14px; background:rgba(232, 93, 74, 0.08); border:1px solid rgba(232, 93, 74, 0.25); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px">
          <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--danger);font-weight:600">
            <span style="width:16px;height:16px;display:inline-flex">${icons.alertTriangle || icons.info}</span>
            One or more items are below clinical minimum order quantity (MOQ).
          </div>
          <button id="btn-auto-fix-moq" class="btn btn-danger btn-sm" style="font-size:11px;padding:4px 10px">Fix All to MOQ</button>
        </div>
      ` : ''}

      <!-- Cart Header & Items -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px">
        <span style="font-size:13px; font-weight:700; color:var(--text-secondary)">${summary.totalUnits} Units Across ${items.length} Products</span>
        <button id="btn-clear-cart" style="background:none; border:none; color:var(--danger); font-size:12px; font-weight:600; cursor:pointer">Clear Cart</button>
      </div>

      <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:16px">
        ${items.map(it => `
          <div class="card" style="padding:14px; border:${it.isBelowMoq ? '1.5px solid var(--danger)' : '1px solid var(--border)'}">
            <div style="display:flex; gap:12px; align-items:flex-start">
              <div style="width:50px; height:50px; border-radius:var(--radius-md); background:var(--bg-light); display:flex; align-items:center; justify-content:center; flex-shrink:0; border:1px solid var(--border)">
                <span style="width:24px;height:24px;color:var(--primary);display:inline-flex">${icons.knee}</span>
              </div>

              <div style="flex:1; min-width:0">
                <div style="display:flex; justify-content:space-between; align-items:flex-start">
                  <div>
                    <div style="font-size:11px; font-weight:700; color:var(--primary)">${it.product.brand || 'OrthoCare Clinical'} • ${it.product.sku}</div>
                    <h4 style="font-size:13px; font-weight:700; color:var(--text); margin:2px 0; line-height:1.3">${it.product.name}</h4>
                    <div style="font-size:11px; color:var(--text-secondary)">Size: <strong>${it.size}</strong> • Carton Pack: <strong>${it.product.cartonQty || 25} Units</strong></div>
                  </div>
                  <button class="btn-remove-item" data-id="${it.productId}" data-size="${it.size}" style="background:none; border:none; color:var(--text-secondary); font-size:18px; line-height:1; cursor:pointer; padding:0 4px">×</button>
                </div>

                ${it.isBelowMoq ? `
                  <div style="color:var(--danger); font-size:11px; font-weight:600; margin:4px 0">
                    Quantity (${it.qty}) is below MOQ (${it.product.moq} units).
                  </div>
                ` : ''}

                <!-- Quantity and Rate Row -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; padding-top:8px; border-top:1px solid var(--border)">
                  <div style="display:flex; align-items:center; gap:6px">
                    <button class="btn-cart-qty" data-id="${it.productId}" data-size="${it.size}" data-delta="-5" style="width:28px; height:28px; border-radius:var(--radius-sm); border:1px solid var(--border); background:var(--bg-white); font-weight:700; cursor:pointer">−</button>
                    <span style="font-size:13px; font-weight:700; min-width:36px; text-align:center">${it.qty}</span>
                    <button class="btn-cart-qty" data-id="${it.productId}" data-size="${it.size}" data-delta="5" style="width:28px; height:28px; border-radius:var(--radius-sm); border:1px solid var(--border); background:var(--bg-white); font-weight:700; cursor:pointer">+</button>
                    <span style="font-size:11px; color:var(--text-secondary); margin-left:4px">@ ${formatPrice(it.unitPrice)}/ea</span>
                  </div>

                  <div style="text-align:right">
                    <div style="font-size:14px; font-weight:700; color:var(--deep-navy)">${formatPrice(it.itemTotal)}</div>
                    <div style="font-size:10px; color:var(--success); font-weight:600">Saved ${formatPrice(it.savings)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Financial Summary Card -->
      <div class="card" style="padding:16px; margin-bottom:16px">
        <h3 style="font-size:13px; font-weight:700; color:var(--deep-navy); margin-bottom:12px; text-transform:uppercase; letter-spacing:0.5px">B2B Financial Summary</h3>

        <div style="display:flex; flex-direction:column; gap:8px; font-size:12px">
          <div style="display:flex; justify-content:space-between; color:var(--text-secondary)">
            <span>Standard Retail Value:</span>
            <span style="text-decoration:line-through">${formatPrice(summary.retailTotal)}</span>
          </div>
          <div style="display:flex; justify-content:space-between; color:var(--success); font-weight:600">
            <span>Wholesale Bulk Margin Savings:</span>
            <span>− ${formatPrice(summary.overallSavings)}</span>
          </div>
          <div style="display:flex; justify-content:space-between; color:var(--text)">
            <span>Wholesale Base Subtotal:</span>
            <span style="font-weight:700">${formatPrice(summary.subtotal)}</span>
          </div>
          ${summary.tierRebate > 0 ? `
            <div style="display:flex; justify-content:space-between; color:var(--primary); font-weight:600">
              <span>Account Tier Discount (${summary.tierDiscountPercent}%):</span>
              <span>− ${formatPrice(summary.tierRebate)}</span>
            </div>
          ` : ''}
          <div style="display:flex; justify-content:space-between; color:var(--text)">
            <span>GST (18% Pass-Through ITC):</span>
            <span style="font-weight:700">${formatPrice(summary.gstAmount)}</span>
          </div>
          <div style="display:flex; justify-content:space-between; color:var(--text)">
            <span>Heavy Logistics Freight:</span>
            <span style="font-weight:700; color:${summary.shipping === 0 ? 'var(--success)' : 'var(--text)'}">
              ${summary.shipping === 0 ? 'FREE B2B FREIGHT' : formatPrice(summary.shipping)}
            </span>
          </div>
          <div style="border-top:1px solid var(--border); padding-top:10px; margin-top:4px; display:flex; justify-content:space-between; align-items:baseline">
            <span style="font-size:14px; font-weight:700; color:var(--deep-navy)">Net Invoice Total:</span>
            <span style="font-size:18px; font-weight:800; color:var(--primary)">${formatPrice(summary.finalTotal)}</span>
          </div>
        </div>
      </div>

      <!-- Checkout Button -->
      <button id="btn-proceed-checkout" class="btn btn-primary btn-block" style="height:46px; font-size:14px; font-weight:700" ${summary.hasMoqViolation ? 'disabled' : ''}>
        ${summary.hasMoqViolation ? 'Adjust Quantities to Meet MOQ' : 'Proceed to Wholesale Checkout'}
      </button>
    `;

    // Event handlers
    contentContainer.querySelector('#btn-clear-cart')?.addEventListener('click', () => {
      store.clearWholesaleCart();
      renderCart();
    });

    contentContainer.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        store.removeFromWholesaleCart(btn.dataset.id, btn.dataset.size);
        renderCart();
      });
    });

    contentContainer.querySelectorAll('.btn-cart-qty').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const sz = btn.dataset.size;
        const delta = Number(btn.dataset.delta);
        const item = items.find(it => it.productId === id && it.size === sz);
        if (item) {
          store.updateWholesaleCartQty(id, sz, item.qty + delta);
          renderCart();
        }
      });
    });

    contentContainer.querySelector('#btn-auto-fix-moq')?.addEventListener('click', () => {
      items.forEach(it => {
        if (it.isBelowMoq) {
          store.updateWholesaleCartQty(it.productId, it.size, it.product.moq);
        }
      });
      renderCart();
      store.emit('toast', { message: 'All items adjusted to meet MOQ', type: 'success' });
    });

    contentContainer.querySelector('#btn-proceed-checkout')?.addEventListener('click', () => {
      if (!summary.hasMoqViolation) {
        navigate('wholesale/checkout');
      }
    });

    el.appendChild(contentContainer);
    nav = renderWholesaleBottomNav('cart');
    el.appendChild(nav);
  }

  renderCart();
  appEl.appendChild(el);

  return { 
    unmount() { 
      if (nav && nav._unsub) nav._unsub(); 
    } 
  };
}
