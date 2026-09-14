// ========================================
// Checkout Screen — Retail Customer
// Focused 4-Step Flow: Address -> Order Summary -> Payment -> Confirmation
// ========================================

import { navigate } from '../router.js';
import { getProductById, formatPrice } from '../data/products.js';
import { addresses, paymentMethods } from '../data/banners.js';
import { icons } from '../data/icons.js';
import * as store from '../store.js';
import { renderBackHeader } from '../components/index.js';

export default function CheckoutScreen(appEl) {
  const cart = store.getCart();
  if (cart.length === 0) { navigate('cart'); return { unmount() {} }; }

  let step = 1; // 1: Address, 2: Summary, 3: Payment, 4: Confirm
  let selectedPayment = 'upi';

  const el = document.createElement('div');
  el.className = 'screen';
  el.style.paddingBottom = '96px';

  el.appendChild(renderBackHeader('Checkout'));

  const stepsContainer = document.createElement('div');
  stepsContainer.style.background = '#FFFFFF';
  stepsContainer.style.borderBottom = '1px solid var(--border)';
  stepsContainer.style.padding = '12px 16px';

  const contentArea = document.createElement('div');
  contentArea.style.padding = '16px';

  el.appendChild(stepsContainer);
  el.appendChild(contentArea);
  appEl.appendChild(el);

  // Sticky Bottom Next/Confirm Bar
  const stickyBar = document.createElement('div');
  stickyBar.style.position = 'fixed';
  stickyBar.style.bottom = '0';
  stickyBar.style.left = '50%';
  stickyBar.style.transform = 'translateX(-50%)';
  stickyBar.style.width = '100%';
  stickyBar.style.maxWidth = 'var(--max-width)';
  stickyBar.style.background = '#FFFFFF';
  stickyBar.style.borderTop = '1px solid var(--border)';
  stickyBar.style.boxShadow = 'var(--shadow-lg)';
  stickyBar.style.padding = '12px 16px';
  stickyBar.style.zIndex = 'var(--z-bottom-nav)';
  appEl.appendChild(stickyBar);

  function renderStepper() {
    const steps = ['Address', 'Summary', 'Payment', 'Confirm'];
    stepsContainer.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;max-width:360px;margin:0 auto">
        ${steps.map((s, idx) => {
          const num = idx + 1;
          const isDone = num < step;
          const isCurrent = num === step;
          return `
            <div style="display:flex;align-items:center;gap:6px">
              <div style="width:24px;height:24px;border-radius:50%;background:${isCurrent ? 'var(--primary)' : (isDone ? 'var(--success)' : 'var(--background)')};color:${isCurrent || isDone ? '#fff' : 'var(--text-secondary)'};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">
                ${isDone ? icons.check : num}
              </div>
              <span style="font-size:11px;font-weight:${isCurrent ? '700' : '500'};color:${isCurrent ? 'var(--text)' : 'var(--text-secondary)'}">${s}</span>
            </div>
            ${idx < steps.length - 1 ? `<div style="flex:1;height:2px;background:${isDone ? 'var(--success)' : 'var(--border)'};margin:0 6px"></div>` : ''}
          `;
        }).join('')}
      </div>
    `;
  }

  function renderCurrentStep() {
    renderStepper();
    contentArea.innerHTML = '';

    if (step === 1) renderAddressStep();
    else if (step === 2) renderSummaryStep();
    else if (step === 3) renderPaymentStep();
    else if (step === 4) renderConfirmStep();
  }

  // 1. Address Step
  function renderAddressStep() {
    contentArea.innerHTML = `
      <h2 style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:12px">Select Delivery Address</h2>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${addresses.map(a => `
          <div class="card address-card" data-id="${a.id}" style="padding:14px;cursor:pointer;border:1.5px solid ${store.getSelectedAddress() === a.id ? 'var(--primary)' : 'var(--border)'};background:${store.getSelectedAddress() === a.id ? 'var(--primary-bg)' : '#FFFFFF'}">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <span style="font-size:11px;font-weight:700;color:var(--primary);text-transform:uppercase">${a.type}</span>
              ${store.getSelectedAddress() === a.id ? `<span style="color:var(--primary)">${icons.check}</span>` : ''}
            </div>
            <div style="font-weight:700;font-size:14px;color:var(--text)">${a.name}</div>
            <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;line-height:1.4">
              ${a.line1}, ${a.line2}<br>${a.city}, ${a.state} - ${a.pin}<br>Phone: ${a.phone}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    contentArea.querySelectorAll('.address-card').forEach(card => {
      card.addEventListener('click', () => {
        store.setSelectedAddress(Number(card.dataset.id));
        renderAddressStep();
      });
    });

    stickyBar.innerHTML = `
      <button class="btn btn-primary btn-block" id="btn-next-address">
        Deliver to this Address
      </button>
    `;
    stickyBar.querySelector('#btn-next-address')?.addEventListener('click', () => {
      step = 2;
      renderCurrentStep();
    });
  }

  // 2. Order Summary Step
  function renderSummaryStep() {
    let subtotal = 0;
    contentArea.innerHTML = `
      <h2 style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:12px">Order Summary</h2>
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px">
        ${cart.map(item => {
          const p = getProductById(item.productId);
          if (!p) return '';
          const lineTotal = p.price * item.qty;
          subtotal += lineTotal;
          return `
            <div class="card" style="padding:12px;display:flex;align-items:center;gap:12px">
              <div style="width:48px;height:48px;border-radius:var(--radius-sm);background:var(--primary-bg);display:flex;align-items:center;justify-content:center;color:var(--primary);flex-shrink:0">
                ${p.images && p.images.length > 0 ? `<img src="${p.images[0]}" alt="${p.name}" style="max-height:100%;object-fit:contain" />` : icons.package}
              </div>
              <div style="flex:1">
                <div style="font-size:13px;font-weight:700;color:var(--text)">${p.name}</div>
                <div style="font-size:11px;color:var(--text-secondary)">Size: ${item.size} • Qty: <strong>${item.qty}</strong></div>
              </div>
              <div style="font-size:13px;font-weight:700;color:var(--text)">${formatPrice(lineTotal)}</div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="card" style="padding:14px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px">
          <span style="color:var(--text-secondary)">Subtotal</span>
          <strong style="color:var(--text)">${formatPrice(subtotal)}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px">
          <span style="color:var(--text-secondary)">Express Medical Delivery</span>
          <span style="color:var(--success);font-weight:700">FREE</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:700;border-top:1px solid var(--border-light);padding-top:8px;margin-top:6px">
          <span style="color:var(--text)">Order Total</span>
          <span style="color:var(--primary)">${formatPrice(subtotal)}</span>
        </div>
      </div>
    `;

    stickyBar.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <button class="btn btn-secondary btn-block" id="btn-back-1">Back</button>
        <button class="btn btn-primary btn-block" id="btn-next-summary">Proceed to Pay</button>
      </div>
    `;
    stickyBar.querySelector('#btn-back-1')?.addEventListener('click', () => { step = 1; renderCurrentStep(); });
    stickyBar.querySelector('#btn-next-summary')?.addEventListener('click', () => { step = 3; renderCurrentStep(); });
  }

  // 3. Payment Step
  function renderPaymentStep() {
    contentArea.innerHTML = `
      <h2 style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:12px">Select Payment Method</h2>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${paymentMethods.map(pm => `
          <div class="card payment-method-card" data-id="${pm.id}" style="padding:14px;cursor:pointer;border:1.5px solid ${selectedPayment === pm.id ? 'var(--primary)' : 'var(--border)'};background:${selectedPayment === pm.id ? 'var(--primary-bg)' : '#FFFFFF'};display:flex;align-items:center;gap:12px">
            <div style="color:var(--primary)">${icons[pm.iconKey] || icons.creditCard}</div>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:700;color:var(--text)">${pm.label}</div>
              <div style="font-size:11px;color:var(--text-secondary)">${pm.desc}</div>
            </div>
            ${selectedPayment === pm.id ? `<span style="color:var(--primary)">${icons.check}</span>` : ''}
          </div>
        `).join('')}
      </div>
    `;

    contentArea.querySelectorAll('.payment-method-card').forEach(card => {
      card.addEventListener('click', () => {
        selectedPayment = card.dataset.id;
        renderPaymentStep();
      });
    });

    stickyBar.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <button class="btn btn-secondary btn-block" id="btn-back-2">Back</button>
        <button class="btn btn-primary btn-block" id="btn-next-payment">Review & Confirm</button>
      </div>
    `;
    stickyBar.querySelector('#btn-back-2')?.addEventListener('click', () => { step = 2; renderCurrentStep(); });
    stickyBar.querySelector('#btn-next-payment')?.addEventListener('click', () => { step = 4; renderCurrentStep(); });
  }

  // 4. Confirmation Step
  function renderConfirmStep() {
    let subtotal = 0;
    cart.forEach(it => {
      const p = getProductById(it.productId);
      if (p) subtotal += p.price * it.qty;
    });

    contentArea.innerHTML = `
      <h2 style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:12px">Final Confirmation</h2>
      <div class="card" style="padding:16px;margin-bottom:14px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;color:var(--primary)">
          ${icons.shield}
          <span style="font-size:13px;font-weight:700">Verified Clinical Order</span>
        </div>
        <div style="font-size:12px;color:var(--text-secondary);line-height:1.5">
          By clicking Place Order, you confirm your order for <strong>${cart.length} item(s)</strong> with total value of <strong style="color:var(--text)">${formatPrice(subtotal)}</strong>.
          Payment Method: <strong>${paymentMethods.find(x => x.id === selectedPayment)?.label || 'UPI'}</strong>.
        </div>
      </div>
    `;

    stickyBar.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1.5fr;gap:10px">
        <button class="btn btn-secondary btn-block" id="btn-back-3">Back</button>
        <button class="btn btn-primary btn-block" id="btn-place-order">Place Order (${formatPrice(subtotal)})</button>
      </div>
    `;
    stickyBar.querySelector('#btn-back-3')?.addEventListener('click', () => { step = 3; renderCurrentStep(); });
    stickyBar.querySelector('#btn-place-order')?.addEventListener('click', () => {
      const order = store.placeOrder(selectedPayment);
      store.emitter.emit('toast', { message: 'Order placed successfully!', type: 'success' });
      navigate('order-success/' + order.id);
    });
  }

  renderCurrentStep();

  return {
    unmount() {
      stickyBar.remove();
    }
  };
}
