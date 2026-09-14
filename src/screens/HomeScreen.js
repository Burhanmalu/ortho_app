// ========================================
// Home Screen — Retail Customer Dashboard
// Medical-Grade, Clean, Visual & Product-Focused
// ========================================

import { navigate } from '../router.js';
import * as store from '../store.js';
import { icons } from '../data/icons.js';
import { quickCategories, concerns } from '../data/categories.js';
import { banners } from '../data/banners.js';
import { getBestSellers, getTrending, getMobilityEssentials, getRehabPicks, getProductById } from '../data/products.js';
import { renderBottomNav, renderProductCard, renderProductCarousel } from '../components/index.js';

export default function HomeScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen screen-with-nav';

  // 1. Compact Header
  const header = document.createElement('header');
  header.className = 'app-header';
  const cartCount = store.getCartCount();

  header.innerHTML = `
    <div class="app-header-top">
      <div>
        <div class="app-logo">Ortho<span>Care</span></div>
        <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--text-secondary);margin-top:2px">
          ${icons.location} Deliver to — <strong style="color:var(--text)">Indore 452010</strong>
        </div>
      </div>
      <div class="app-header-actions">
        <button class="app-header-btn" id="hdr-notif" aria-label="Notifications" title="Notifications">
          ${icons.bell}
          <span class="badge-dot" style="width:7px;height:7px;min-width:7px;top:6px;right:6px;padding:0;background:var(--primary)"></span>
        </button>
        <button class="app-header-btn" id="hdr-wishlist" aria-label="Wishlist" title="Wishlist">
          ${icons.heart}
        </button>
        <button class="app-header-btn" id="hdr-cart" aria-label="Cart" title="Cart">
          ${icons.cart}
          ${cartCount > 0 ? `<span class="badge-dot">${cartCount}</span>` : ''}
        </button>
      </div>
    </div>

    <!-- 2. Search -->
    <div class="search-bar" id="home-search" style="cursor:pointer">
      <span class="search-bar-icon">${icons.search}</span>
      <input type="text" placeholder="Search orthopedic products, braces, supports..." readonly style="cursor:pointer" />
      <span class="search-bar-icon">${icons.mic}</span>
    </div>
  `;
  el.appendChild(header);

  header.querySelector('#home-search').addEventListener('click', () => navigate('search'));
  header.querySelector('#hdr-cart').addEventListener('click', () => navigate('cart'));
  header.querySelector('#hdr-wishlist').addEventListener('click', () => navigate('wishlist'));
  header.querySelector('#hdr-notif').addEventListener('click', () => navigate('notifications'));

  // 3. Categories Quick Strip (Clean SVG Icons)
  const strip = document.createElement('div');
  strip.style.padding = '14px 16px 8px';
  strip.style.display = 'flex';
  strip.style.gap = '14px';
  strip.style.overflowX = 'auto';
  strip.style.webkitOverflowScrolling = 'touch';

  strip.innerHTML = quickCategories.map(c => `
    <div class="category-quick-item" data-cat="${c.id}" style="display:flex;flex-direction:column;align-items:center;gap:6px;min-width:62px;cursor:pointer">
      <div style="width:52px;height:52px;border-radius:var(--radius-md);background:#FFFFFF;border:1px solid var(--border);box-shadow:var(--shadow-sm);display:flex;align-items:center;justify-content:center;color:var(--primary);transition:all var(--duration-fast)">
        ${icons[c.iconKey] || icons.package}
      </div>
      <span style="font-size:11px;font-weight:600;color:var(--text);text-align:center">${c.name}</span>
    </div>
  `).join('');

  strip.querySelectorAll('.category-quick-item').forEach(item => {
    item.addEventListener('click', () => navigate(`listing/${item.dataset.cat}`));
  });
  el.appendChild(strip);

  // 4. Hero Banner (No Emojis)
  let bannerIdx = 0;
  const bannerSection = document.createElement('div');
  bannerSection.style.margin = '10px 16px 20px';
  bannerSection.style.borderRadius = 'var(--radius-lg)';
  bannerSection.style.overflow = 'hidden';
  bannerSection.style.position = 'relative';
  bannerSection.style.boxShadow = 'var(--shadow-md)';

  bannerSection.innerHTML = `
    <div id="banner-track" style="display:flex;transition:transform 0.4s ease;width:100%">
      ${banners.map(b => `
        <div style="min-width:100%;background:${b.bgGradient};color:${b.textColor};padding:22px 18px;position:relative;cursor:pointer" data-route="${b.route}">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;opacity:0.9;margin-bottom:4px">
            ${b.subtitle}
          </div>
          <div style="font-family:var(--font-heading);font-size:18px;font-weight:700;line-height:1.25;margin-bottom:12px;max-width:240px">
            ${b.title}
          </div>
          <span style="display:inline-flex;align-items:center;gap:6px;background:${b.ctaBg};color:${b.ctaColor};padding:7px 14px;border-radius:var(--radius-pill);font-size:12px;font-weight:700">
            ${b.cta} ${icons.arrowRight}
          </span>
          <div style="position:absolute;right:16px;bottom:12px;opacity:0.12;color:#ffffff">
            ${icons.shield}
          </div>
        </div>
      `).join('')}
    </div>
    <div style="position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:2">
      ${banners.map((_, i) => `<div class="banner-dot" data-bidx="${i}" style="width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.4);cursor:pointer"></div>`).join('')}
    </div>
  `;
  el.appendChild(bannerSection);

  function slideBanner(idx) {
    bannerIdx = idx;
    const track = el.querySelector('#banner-track');
    if (track) track.style.transform = `translateX(-${idx * 100}%)`;
    el.querySelectorAll('.banner-dot').forEach((d, i) => {
      d.style.background = i === idx ? '#FFFFFF' : 'rgba(255,255,255,0.4)';
      d.style.width = i === idx ? '16px' : '6px';
      d.style.borderRadius = i === idx ? 'var(--radius-pill)' : '50%';
    });
  }
  slideBanner(0);

  const bannerInterval = setInterval(() => {
    slideBanner((bannerIdx + 1) % banners.length);
  }, 4500);

  bannerSection.querySelectorAll('.banner-dot').forEach(d => {
    d.addEventListener('click', () => slideBanner(parseInt(d.dataset.bidx)));
  });
  bannerSection.querySelectorAll('[data-route]').forEach(s => {
    s.addEventListener('click', () => { if (s.dataset.route) window.location.hash = s.dataset.route; });
  });

  // 5. Shop by Orthopedic Category / Concern
  const concernSection = document.createElement('section');
  concernSection.style.padding = '0 16px 24px';
  concernSection.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:17px;font-weight:700;color:var(--text);margin:0">Shop by Orthopedic Category</h2>
      <a href="#/categories" style="font-size:12px;font-weight:600;color:var(--primary);display:flex;align-items:center;gap:4px">View All ${icons.chevronRight}</a>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:10px">
      ${concerns.map(c => `
        <div class="concern-card" data-cat="${c.id}" style="background:#FFFFFF;border-radius:var(--radius-md);border:1px solid var(--border);padding:14px 10px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;cursor:pointer;transition:all var(--duration-fast)">
          <div style="width:42px;height:42px;border-radius:var(--radius-md);background:var(--primary-bg);color:var(--primary);display:flex;align-items:center;justify-content:center">
            ${icons[c.iconKey] || icons.knee}
          </div>
          <span style="font-size:12px;font-weight:600;color:var(--text);line-height:1.2">${c.name}</span>
        </div>
      `).join('')}
    </div>
  `;
  concernSection.querySelectorAll('.concern-card').forEach(card => {
    card.addEventListener('click', () => navigate(`listing/${card.dataset.cat}`));
  });
  el.appendChild(concernSection);

  // 6. Best Sellers
  el.appendChild(renderProductCarousel(getBestSellers(), 'Best Sellers in Orthopedics', '#/listing/all'));

  // 7. Deals & Bundles
  const trendingSection = document.createElement('section');
  trendingSection.style.padding = '0 16px 24px';
  trendingSection.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:17px;font-weight:700;color:var(--text);margin:0">Deals & Patient Favorites</h2>
      <a href="#/offers" style="font-size:12px;font-weight:600;color:var(--primary);display:flex;align-items:center;gap:4px">All Offers ${icons.chevronRight}</a>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px" id="deals-grid"></div>
  `;
  const dealsGrid = trendingSection.querySelector('#deals-grid');
  getTrending().slice(0, 4).forEach(p => dealsGrid.appendChild(renderProductCard(p)));
  el.appendChild(trendingSection);

  // 8. Recommended Support (Mobility & Rehab)
  el.appendChild(renderProductCarousel(getMobilityEssentials(), 'Mobility & Walking Aids', '#/listing/mobility'));
  el.appendChild(renderProductCarousel(getRehabPicks(), 'Doctor-Recommended Rehab Picks', '#/listing/rehab'));

  // 9. Recently Viewed
  const recentIds = store.getRecentlyViewed();
  if (recentIds.length > 0) {
    const recentProducts = recentIds.map(id => getProductById(id)).filter(Boolean).slice(0, 6);
    if (recentProducts.length > 0) {
      el.appendChild(renderProductCarousel(recentProducts, 'Recently Viewed Products'));
    }
  }

  // 10. Trust Section
  const trustSection = document.createElement('section');
  trustSection.style.margin = '0 16px 28px';
  trustSection.innerHTML = `
    <div class="card" style="padding:16px;background:#FFFFFF">
      <h3 style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:14px;display:flex;align-items:center;gap:8px">
        ${icons.shield} The OrthoCare Medical Promise
      </h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div style="display:flex;gap:10px;align-items:flex-start">
          <div style="color:var(--primary)">${icons.badgeCheck}</div>
          <div>
            <div style="font-size:12px;font-weight:700;color:var(--text)">Certified Supports</div>
            <div style="font-size:11px;color:var(--text-secondary)">Clinical grade fabric & splints</div>
          </div>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-start">
          <div style="color:var(--primary)">${icons.truck}</div>
          <div>
            <div style="font-size:12px;font-weight:700;color:var(--text)">Direct Dispatch</div>
            <div style="font-size:11px;color:var(--text-secondary)">Pan-India express delivery</div>
          </div>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-start">
          <div style="color:var(--primary)">${icons.repeat}</div>
          <div>
            <div style="font-size:12px;font-weight:700;color:var(--text)">Easy Sizing Exchange</div>
            <div style="font-size:11px;color:var(--text-secondary)">Guaranteed anatomical fit</div>
          </div>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-start">
          <div style="color:var(--primary)">${icons.lock}</div>
          <div>
            <div style="font-size:12px;font-weight:700;color:var(--text)">Secure Checkout</div>
            <div style="font-size:11px;color:var(--text-secondary)">UPI, Net Banking & Cards</div>
          </div>
        </div>
      </div>
    </div>
  `;
  el.appendChild(trustSection);

  appEl.appendChild(el);

  // 11. Bottom Navigation
  const nav = renderBottomNav('home');
  appEl.appendChild(nav);

  return {
    unmount() {
      clearInterval(bannerInterval);
      if (nav._unsub) nav._unsub();
    }
  };
}
