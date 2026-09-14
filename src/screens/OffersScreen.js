// ========================================
// Offers Screen
// ========================================
import { navigate } from '../router.js';
import { icons } from '../data/icons.js';
import { coupons, bankOffers } from '../data/banners.js';
import { getTrending, formatPrice } from '../data/products.js';
import { renderBackHeader, renderBottomNav, renderProductCard, showToast } from '../components/index.js';

export default function OffersScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen screen-with-nav';

  el.appendChild(renderBackHeader('Offers & Deals'));

  // Flash Sale Timer
  const flashSale = document.createElement('div');
  flashSale.style.padding = 'var(--sp-lg) 0';
  flashSale.innerHTML = `
    <div class="flash-sale-timer">
      <div>
        <div class="flash-sale-label">${icons.zap} Flash Sale</div>
        <div style="font-size:var(--fs-sm);opacity:0.8;margin-top:2px">Ends in</div>
      </div>
      <div style="display:flex;gap:4px;align-items:center">
        <span class="timer-box" id="timer-h">02</span>
        <span class="timer-sep">:</span>
        <span class="timer-box" id="timer-m">18</span>
        <span class="timer-sep">:</span>
        <span class="timer-box" id="timer-s">42</span>
      </div>
    </div>
  `;
  el.appendChild(flashSale);

  // Countdown
  let totalSecs = 2 * 3600 + 18 * 60 + 42;
  const timerInterval = setInterval(() => {
    totalSecs--;
    if (totalSecs < 0) totalSecs = 0;
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    const hEl = el.querySelector('#timer-h');
    const mEl = el.querySelector('#timer-m');
    const sEl = el.querySelector('#timer-s');
    if (hEl) hEl.textContent = String(h).padStart(2, '0');
    if (mEl) mEl.textContent = String(m).padStart(2, '0');
    if (sEl) sEl.textContent = String(s).padStart(2, '0');
  }, 1000);

  // Flash sale products
  const dealSection = document.createElement('section');
  dealSection.className = 'section';
  dealSection.innerHTML = `<h2 class="section-title">Today's Deals</h2><div class="product-grid" id="deal-grid"></div>`;
  const dealGrid = dealSection.querySelector('#deal-grid');
  getTrending().slice(0, 4).forEach(p => dealGrid.appendChild(renderProductCard(p)));
  el.appendChild(dealSection);

  // Coupons
  const couponSection = document.createElement('section');
  couponSection.className = 'section';
  couponSection.innerHTML = `
    <h2 class="section-title">Coupon Codes</h2>
    ${coupons.map(c => `
      <div class="coupon-card">
        <div class="coupon-code">${c.code}</div>
        <div class="coupon-details">
          <div class="coupon-offer">${c.offer}</div>
          <div class="coupon-condition">${c.condition}</div>
        </div>
        <button class="btn btn-sm btn-primary" data-coupon="${c.code}">Copy</button>
      </div>
    `).join('')}
  `;
  couponSection.querySelectorAll('[data-coupon]').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard?.writeText(btn.dataset.coupon);
      showToast(`Coupon ${btn.dataset.coupon} copied!`, 'success');
    });
  });
  el.appendChild(couponSection);

  // Bank Offers
  const bankSection = document.createElement('section');
  bankSection.className = 'section';
  bankSection.innerHTML = `
    <h2 class="section-title">Bank Offers</h2>
    ${bankOffers.map(b => `
      <div class="deal-card" style="margin-bottom:var(--sp-md)">
        <div class="deal-card-banner" style="background:var(--color-bg)">
          <div>
            <div style="font-size:20px;margin-bottom:4px">${b.icon}</div>
            <div class="deal-card-title" style="font-size:var(--fs-md)">${b.bank}</div>
            <div class="deal-card-desc">${b.offer}</div>
          </div>
        </div>
      </div>
    `).join('')}
  `;
  el.appendChild(bankSection);

  // Spacer
  const spacer = document.createElement('div');
  spacer.style.height = '16px';
  el.appendChild(spacer);

  appEl.appendChild(el);

  const nav = renderBottomNav('home');
  appEl.appendChild(nav);

  return {
    unmount() {
      clearInterval(timerInterval);
      if (nav._unsub) nav._unsub();
    }
  };
}
