// ========================================
// Wholesale B2B Cart Screen
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { formatPrice } from '../../data/products.js';
import { renderBackHeader, renderWholesaleBottomNav } from '../../components/index.js';

export default function WholesaleCartScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen-content';
  el.style.background = '#f8fafc';

  el.appendChild(renderBackHeader('Wholesale Bulk Cart', () => navigate('wholesale/dashboard')));

  function renderCart() {
    const summary = store.getWholesaleCartSummary();
    const items = summary.itemDetails || [];

    const contentContainer = document.createElement('div');
    contentContainer.style.paddingBottom = '130px';
    contentContainer.style.maxWidth = '720px';
    contentContainer.style.margin = '0 auto';

    if (items.length === 0) {
      contentContainer.innerHTML = `
        <div style="text-align:center; padding:60px 20px; color:#64748b">
          <div style="font-size:48px; margin-bottom:12px">🛒</div>
          <h3 style="font-size:18px; font-weight:700; color:#0f172a">Your Wholesale Cart is Empty</h3>
          <p style="font-size:13px; margin:6px 0 20px">Add institutional cartons from the catalog or use the Matrix Pad.</p>
          <div style="display:flex; justify-content:center; gap:12px">
            <button id="btn-empty-catalog" class="btn btn-primary btn-pill" style="padding:10px 20px">Browse Catalog</button>
            <button id="btn-empty-matrix" class="btn btn-secondary btn-pill" style="padding:10px 20px">Open Bulk Pad</button>
          </div>
        </div>
      `;
      el.appendChild(contentContainer);
      el.appendChild(renderWholesaleBottomNav('cart'));
      appEl.appendChild(el);

      contentContainer.querySelector('#btn-empty-catalog')?.addEventListener('click', () => navigate('wholesale/products'));
      contentContainer.querySelector('#btn-empty-matrix')?.addEventListener('click', () => navigate('wholesale/bulk-order'));
      return;
    }

    contentContainer.innerHTML = `
      <!-- MOQ Warning Notice if applicable -->
      ${summary.hasMoqViolation ? `
        <div class="moq-warning-banner">
          <div>
            ⚠️ <strong>MOQ Violation:</strong> One or more items are below clinical minimum order quantity.
          </div>
          <button id="btn-auto-fix-moq" class="moq-fix-btn">Fix All to MOQ</button>
        </div>
      ` : ''}

      <!-- Cart Item List -->
      <div style="padding:16px 20px; display:flex; flex-direction:column; gap:14px">
        <div style="display:flex; justify-content:space-between; align-items:center">
          <span style="font-size:13px; font-weight:700; color:#475569">${summary.totalUnits} Total Units Across ${items.length} Products</span>
          <button id="btn-clear-cart" style="background:none; border:none; color:#dc2626; font-size:12px; font-weight:700; cursor:pointer">Clear Cart</button>
        </div>

        ${items.map(it => `
          <div class="card" style="padding:16px; border-radius:12px; border:${it.isBelowMoq ? '2px solid #ea580c' : '1px solid #e2e8f0'}">
            <div style="display:flex; gap:14px; align-items:flex-start">
              <div style="width:54px; height:54px; border-radius:10px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; font-size:28px; flex-shrink:0">
                ${it.product.emoji || '🩺'}
              </div>

              <div style="flex:1">
                <div style="display:flex; justify-content:space-between; align-items:flex-start">
                  <div>
                    <div style="font-size:11px; font-weight:700; color:#0d9488">${it.product.brand} • ${it.product.sku}</div>
                    <h4 style="font-size:14px; font-weight:700; color:#0f172a; margin:2px 0">${it.product.name}</h4>
                    <div style="font-size:11px; color:#64748b">Size: <strong>${it.size}</strong> • Carton Pack: <strong>${it.product.cartonQty || 25} Units</strong></div>
                  </div>
                  <button class="btn-remove-item" data-id="${it.productId}" data-size="${it.size}" style="background:none; border:none; color:#94a3b8; font-size:18px; cursor:pointer">×</button>
                </div>

                ${it.isBelowMoq ? `
                  <div style="color:#c2410c; font-size:11px; font-weight:700; margin:6px 0">
                    ⚠️ Quantity (${it.qty}) is below MOQ (${it.product.moq} units).
                  </div>
                ` : ''}

                <!-- Quantity and Rate Row -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; padding-top:8px; border-top:1px solid #f1f5f9">
                  <div style="display:flex; align-items:center; gap:6px">
                    <button class="btn-cart-qty" data-id="${it.productId}" data-size="${it.size}" data-delta="-5" style="width:30px; height:30px; border-radius:6px; border:1px solid #cbd5e1; background:#ffffff; font-weight:700; cursor:pointer">-</button>
                    <span style="font-size:14px; font-weight:800; min-width:40px; text-align:center">${it.qty}</span>
                    <button class="btn-cart-qty" data-id="${it.productId}" data-size="${it.size}" data-delta="5" style="width:30px; height:30px; border-radius:6px; border:1px solid #cbd5e1; background:#ffffff; font-weight:700; cursor:pointer">+</button>
                    <span style="font-size:11px; color:#64748b; margin-left:4px">@ ${formatPrice(it.unitPrice)}/ea</span>
                  </div>

                  <div style="text-align:right">
                    <div style="font-size:15px; font-weight:800; color:#0f172a">${formatPrice(it.itemTotal)}</div>
                    <div style="font-size:10px; color:#16a34a; font-weight:600">Saved ${formatPrice(it.savings)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}

        <!-- Price Breakdown Card -->
        <div class="card" style="padding:18px; border-radius:14px; margin-top:6px">
          <h3 style="font-size:14px; font-weight:700; color:#0f3647; margin-bottom:12px">B2B Financial Summary</h3>

          <div style="display:flex; flex-direction:column; gap:8px; font-size:13px">
            <div style="display:flex; justify-content:space-between; color:#64748b">
              <span>Standard Retail Value:</span>
              <span style="text-decoration:line-through">${formatPrice(summary.retailTotal)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; color:#16a34a; font-weight:600">
              <span>Wholesale Bulk Margin Savings:</span>
              <span>- ${formatPrice(summary.overallSavings)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; color:#475569">
              <span>Wholesale Base Subtotal:</span>
              <span style="font-weight:700">${formatPrice(summary.subtotal)}</span>
            </div>
            ${summary.tierRebate > 0 ? `
              <div style="display:flex; justify-content:space-between; color:#2563eb; font-weight:600">
                <span>Account Tier Discount (${summary.tierDiscountPercent}%):</span>
                <span>- ${formatPrice(summary.tierRebate)}</span>
              </div>
            ` : ''}
            <div style="display:flex; justify-content:space-between; color:#475569">
              <span>GST (18% Pass-Through):</span>
              <span style="font-weight:700">${formatPrice(summary.gstAmount)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; color:#475569">
              <span>Heavy Logistics Freight:</span>
              <span style="font-weight:700; color:${summary.shipping === 0 ? '#16a34a' : '#0f172a'}">
                ${summary.shipping === 0 ? 'FREE B2B FREIGHT' : formatPrice(summary.shipping)}
              </span>
            </div>
            <div style="border-top:2px solid #0f3647; padding-top:10px; margin-top:4px; display:flex; justify-content:space-between; align-items:baseline">
              <span style="font-size:15px; font-weight:800; color:#0f3647">Net Invoice Total:</span>
              <span style="font-size:20px; font-weight:900; color:#0f3647">${formatPrice(summary.finalTotal)}</span>
            </div>
          </div>
        </div>

        <!-- Checkout Button -->
        <button id="btn-proceed-checkout" class="btn btn-primary btn-pill" style="padding:14px; font-size:15px; font-weight:800; margin-top:8px" ${summary.hasMoqViolation ? 'disabled' : ''}>
          ${summary.hasMoqViolation ? 'Fix MOQ Violations to Proceed' : 'Proceed to Wholesale Checkout →'}
        </button>
      </div>
    `;

    // Attach Event Listeners
    contentContainer.querySelector('#btn-clear-cart')?.addEventListener('click', () => {
      store.clearWholesaleCart();
      el.innerHTML = '';
      el.appendChild(renderBackHeader('Wholesale Bulk Cart', () => navigate('wholesale/dashboard')));
      renderCart();
    });

    contentContainer.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        store.removeFromWholesaleCart(btn.dataset.id, btn.dataset.size);
        el.innerHTML = '';
        el.appendChild(renderBackHeader('Wholesale Bulk Cart', () => navigate('wholesale/dashboard')));
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
          const newQty = item.qty + delta;
          store.updateWholesaleCartQty(id, sz, newQty);
          el.innerHTML = '';
          el.appendChild(renderBackHeader('Wholesale Bulk Cart', () => navigate('wholesale/dashboard')));
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
      el.innerHTML = '';
      el.appendChild(renderBackHeader('Wholesale Bulk Cart', () => navigate('wholesale/dashboard')));
      renderCart();
      store.emitter.emit('toast', { message: 'All items adjusted to MOQ', type: 'success' });
    });

    contentContainer.querySelector('#btn-proceed-checkout')?.addEventListener('click', () => {
      if (!summary.hasMoqViolation) {
        navigate('wholesale/checkout');
      }
    });

    el.appendChild(contentContainer);
    el.appendChild(renderWholesaleBottomNav('cart'));
    appEl.appendChild(el);
  }

  renderCart();
  return el;
}
