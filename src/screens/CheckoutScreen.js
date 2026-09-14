// ========================================
// Checkout Screen — 4-Step Wizard
// ========================================
import { navigate } from '../router.js';
import { getProductById, formatPrice } from '../data/products.js';
import { addresses, paymentMethods } from '../data/banners.js';
import { icons } from '../data/icons.js';
import * as store from '../store.js';
import { renderBackHeader, showToast } from '../components/index.js';

export default function CheckoutScreen(appEl) {
  const cart = store.getCart();
  if (cart.length === 0) { navigate('cart'); return { unmount() {} }; }

  let step = 1;
  const el = document.createElement('div');
  el.className = 'screen';

  el.appendChild(renderBackHeader('Checkout'));

  const stepsBar = document.createElement('div');
  const contentArea = document.createElement('div');
  el.appendChild(stepsBar);
  el.appendChild(contentArea);
  appEl.appendChild(el);

  // Sticky CTA
  const sticky = document.createElement('div');
  sticky.className = 'sticky-bottom';
  appEl.appendChild(sticky);

  function renderSteps() {
    const labels = ['Address', 'Summary', 'Payment', 'Confirm'];
    stepsBar.className = 'steps';
    stepsBar.innerHTML = labels.map((l, i) => `
      <div class="step ${i + 1 < step ? 'completed' : ''} ${i + 1 === step ? 'active' : ''}">
        <span class="step-number">${i + 1 < step ? '✓' : i + 1}</span>
        <span style="font-size:var(--fs-xs)">${l}</span>
      </div>
      ${i < labels.length - 1 ? `<div class="step-connector ${i + 1 < step ? 'completed' : ''} ${i + 1 === step ? 'active' : ''}"></div>` : ''}
    `).join('');
  }

  function renderStep() {
    renderSteps();
    contentArea.innerHTML = '';

    if (step === 1) renderAddressStep();
    else if (step === 2) renderSummaryStep();
    else if (step === 3) renderPaymentStep();
    else if (step === 4) renderConfirmStep();
  }

  function renderAddressStep() {
    const sec = document.createElement('div');
    sec.className = 'checkout-section';
    sec.innerHTML = `
      <h3 class="pd-section-title" style="margin-bottom:var(--sp-lg)">Select Delivery Address</h3>
      ${addresses.map(a => `
        <div class="address-card ${store.getSelectedAddress() === a.id ? 'selected' : ''}" data-aid="${a.id}">
          <div class="address-card-type">${a.type}</div>
          <div class="address-card-name">${a.name}</div>
          <div class="address-card-details">${a.line1}, ${a.line2}<br>${a.city}, ${a.state} — ${a.pin}<br>Phone: ${a.phone}</div>
        </div>
      `).join('')}
      <button class="btn btn-secondary btn-block" style="margin-top:var(--sp-sm)">+ Add New Address</button>
    `;
    sec.querySelectorAll('.address-card').forEach(card => {
      card.addEventListener('click', () => {
        store.setSelectedAddress(parseInt(card.dataset.aid));
        sec.querySelectorAll('.address-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });
    });
    contentArea.appendChild(sec);

    sticky.innerHTML = `<button class="btn btn-primary btn-block btn-lg" id="next-step">Continue</button>`;
    sticky.querySelector('#next-step').addEventListener('click', () => { step = 2; renderStep(); });
  }

  function renderSummaryStep() {
    let total = 0;
    const sec = document.createElement('div');
    sec.className = 'checkout-section';
    sec.innerHTML = `
      <h3 class="pd-section-title" style="margin-bottom:var(--sp-lg)">Order Summary</h3>
      ${cart.map(item => {
        const p = getProductById(item.productId);
        if (!p) return '';
        total += p.price * item.qty;
        return `
          <div style="display:flex;gap:var(--sp-md);margin-bottom:var(--sp-lg);padding-bottom:var(--sp-lg);border-bottom:1px solid var(--color-divider)">
            <div style="width:60px;height:60px;background:var(--color-bg);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <span style="font-size:28px;opacity:0.3">${p.emoji || '🩹'}</span>
            </div>
            <div style="flex:1">
              <div style="font-weight:var(--fw-medium);margin-bottom:2px">${p.name}</div>
              <div style="font-size:var(--fs-sm);color:var(--color-text-secondary)">Size: ${item.size} · Qty: ${item.qty}</div>
              <div style="font-weight:var(--fw-bold);margin-top:4px">${formatPrice(p.price * item.qty)}</div>
            </div>
          </div>
        `;
      }).join('')}
      <div class="price-row price-row-total" style="border-top:1px solid var(--color-divider);padding-top:var(--sp-lg)">
        <span class="price-row-label">Total</span>
        <span class="price-row-value">${formatPrice(total)}</span>
      </div>
    `;
    contentArea.appendChild(sec);

    sticky.innerHTML = `
      <button class="btn btn-secondary btn-block" id="prev-step">Back</button>
      <button class="btn btn-primary btn-block btn-lg" id="next-step">Continue</button>
    `;
    sticky.querySelector('#prev-step').addEventListener('click', () => { step = 1; renderStep(); });
    sticky.querySelector('#next-step').addEventListener('click', () => { step = 3; renderStep(); });
  }

  function renderPaymentStep() {
    const sec = document.createElement('div');
    sec.className = 'checkout-section';
    sec.innerHTML = `
      <h3 class="pd-section-title" style="margin-bottom:var(--sp-lg)">Payment Method</h3>
      ${paymentMethods.map(m => `
        <div class="payment-option ${store.getSelectedPayment() === m.id ? 'selected' : ''}" data-pid="${m.id}">
          <div class="payment-radio"></div>
          <div class="payment-icon">${m.icon}</div>
          <div>
            <div class="payment-label">${m.label}</div>
            <div class="payment-desc">${m.desc}</div>
          </div>
        </div>
      `).join('')}
    `;
    sec.querySelectorAll('.payment-option').forEach(opt => {
      opt.addEventListener('click', () => {
        store.setSelectedPayment(opt.dataset.pid);
        sec.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      });
    });
    contentArea.appendChild(sec);

    sticky.innerHTML = `
      <button class="btn btn-secondary btn-block" id="prev-step">Back</button>
      <button class="btn btn-primary btn-block btn-lg" id="next-step">Continue</button>
    `;
    sticky.querySelector('#prev-step').addEventListener('click', () => { step = 2; renderStep(); });
    sticky.querySelector('#next-step').addEventListener('click', () => { step = 4; renderStep(); });
  }

  function renderConfirmStep() {
    let total = 0;
    cart.forEach(item => {
      const p = getProductById(item.productId);
      if (p) total += p.price * item.qty;
    });
    const delivery = total >= 999 ? 0 : 49;
    const addr = addresses.find(a => a.id === store.getSelectedAddress()) || addresses[0];
    const payment = paymentMethods.find(m => m.id === store.getSelectedPayment()) || paymentMethods[0];

    const sec = document.createElement('div');
    sec.className = 'checkout-section';
    sec.innerHTML = `
      <h3 class="pd-section-title" style="margin-bottom:var(--sp-lg)">Confirm Order</h3>
      <div style="padding:var(--sp-lg);background:var(--color-bg);border-radius:var(--radius-md);margin-bottom:var(--sp-lg)">
        <div style="font-weight:var(--fw-semibold);margin-bottom:var(--sp-sm)">Delivering to</div>
        <div style="font-size:var(--fs-sm);color:var(--color-text-secondary)">${addr.name}, ${addr.line1}, ${addr.city} — ${addr.pin}</div>
      </div>
      <div style="padding:var(--sp-lg);background:var(--color-bg);border-radius:var(--radius-md);margin-bottom:var(--sp-lg)">
        <div style="font-weight:var(--fw-semibold);margin-bottom:var(--sp-sm)">Payment</div>
        <div style="font-size:var(--fs-sm);color:var(--color-text-secondary)">${payment.icon} ${payment.label}</div>
      </div>
      <div class="price-row"><span class="price-row-label">Items (${cart.reduce((s, c) => s + c.qty, 0)})</span><span class="price-row-value">${formatPrice(total)}</span></div>
      <div class="price-row"><span class="price-row-label">Delivery</span><span class="price-row-value ${delivery === 0 ? 'price-row-discount' : ''}">${delivery === 0 ? 'FREE' : formatPrice(delivery)}</span></div>
      <div class="price-row price-row-total"><span class="price-row-label">Total</span><span class="price-row-value">${formatPrice(total + delivery)}</span></div>
    `;
    contentArea.appendChild(sec);

    sticky.innerHTML = `
      <button class="btn btn-secondary btn-block" id="prev-step">Back</button>
      <button class="btn btn-primary btn-block btn-lg" id="place-order">Place Order</button>
    `;
    sticky.querySelector('#prev-step').addEventListener('click', () => { step = 3; renderStep(); });
    sticky.querySelector('#place-order').addEventListener('click', () => {
      // Create order
      const orderId = 'OR' + Math.floor(10000 + Math.random() * 90000);
      const order = {
        id: orderId,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'confirmed',
        items: cart.map(c => ({ ...c, price: getProductById(c.productId)?.price || 0 })),
        total: total + delivery,
        address: addr.type,
      };
      // Save order and clear cart
      const orders = store.getOrders();
      orders.unshift(order);
      store.clearCart();
      navigate(`success/${orderId}`);
    });
  }

  renderStep();

  return { unmount() {} };
}
