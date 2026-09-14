// ========================================
// Order Success Screen
// ========================================
import { navigate } from '../router.js';
import { icons } from '../data/icons.js';

export default function OrderSuccessScreen(appEl, orderId) {
  const el = document.createElement('div');
  el.className = 'success-screen';

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);
  const dateStr = deliveryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  el.innerHTML = `
    <div class="success-icon" style="color:var(--color-success)">
      ${icons.checkCircle}
    </div>
    <h1 class="success-title">Order Placed Successfully!</h1>
    <p class="success-subtitle">Thank you for your order. We'll send you a confirmation shortly.</p>
    <div class="success-details">
      <div class="success-detail-row">
        <span class="success-detail-label">Order ID</span>
        <span class="success-detail-value">#${orderId || 'OR00000'}</span>
      </div>
      <div class="success-detail-row">
        <span class="success-detail-label">Estimated Delivery</span>
        <span class="success-detail-value">${dateStr}</span>
      </div>
      <div class="success-detail-row" style="margin-bottom:0">
        <span class="success-detail-label">Payment</span>
        <span class="success-detail-value" style="color:var(--color-success)">✓ Confirmed</span>
      </div>
    </div>
    <div class="success-actions">
      <button class="btn btn-primary btn-block btn-lg" id="track-order">Track Order</button>
      <button class="btn btn-secondary btn-block btn-lg" id="continue-shopping">Continue Shopping</button>
    </div>
  `;

  el.querySelector('#track-order').addEventListener('click', () => navigate('orders'));
  el.querySelector('#continue-shopping').addEventListener('click', () => navigate('home'));

  appEl.appendChild(el);
  return { unmount() {} };
}
