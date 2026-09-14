// ========================================
// Home Screen — Main Shopping Feed
// ========================================
import { navigate } from '../router.js';
import * as store from '../store.js';
import { icons } from '../data/icons.js';
import { quickCategories, concerns } from '../data/categories.js';
import { banners } from '../data/banners.js';
import { getBestSellers, getTrending, getMobilityEssentials, getRehabPicks, getProductById, formatPrice } from '../data/products.js';
import { renderBottomNav, renderProductCard, renderProductCarousel } from '../components/index.js';

export default function HomeScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen screen-with-nav';

  // ---- Header ----
  const header = document.createElement('header');
  header.className = 'home-header';
  const cartCount = store.getCartCount();
  header.innerHTML = `
    <div class="home-header-top">
      <div>
        <div class="home-logo">Ortho<span>Care</span></div>
        <div class="home-location">
          ${icons.location} Deliver to — <strong>Indore</strong>
        </div>
      </div>
      <div class="home-header-icons">
        <button class="home-header-icon" id="hdr-notif" style="position:relative">
          ${icons.bell}
          <span class="badge-dot" style="font-size:0;width:8px;height:8px;top:4px;right:4px;border:2px solid var(--color-primary)"></span>
        </button>
        <button class="home-header-icon" id="hdr-wishlist">${icons.heart}</button>
        <button class="home-header-icon" id="hdr-cart" style="position:relative">
          ${icons.cart}
          ${cartCount > 0 ? `<span class="badge-dot">${cartCount}</span>` : ''}
        </button>
      </div>
    </div>
    <div class="home-search" id="home-search">
      <span class="home-search-icon">${icons.search}</span>
      <span class="home-search-text">Search braces, supports, mobility aids...</span>
      <span class="home-search-voice">${icons.mic}</span>
    </div>
  `;
  el.appendChild(header);

  header.querySelector('#home-search').addEventListener('click', () => navigate('search'));
  header.querySelector('#hdr-cart').addEventListener('click', () => navigate('cart'));
  header.querySelector('#hdr-wishlist').addEventListener('click', () => navigate('wishlist'));
  header.querySelector('#hdr-notif').addEventListener('click', () => navigate('notifications'));

  // ---- Category Strip ----
  const strip = document.createElement('div');
  strip.className = 'category-strip';
  strip.innerHTML = quickCategories.map(c => `
    <div class="category-strip-item" data-cat="${c.id}">
      <div class="category-strip-icon">${c.icon}</div>
      <span class="category-strip-label">${c.name}</span>
    </div>
  `).join('');
  strip.querySelectorAll('.category-strip-item').forEach(item => {
    item.addEventListener('click', () => navigate(`listing/${item.dataset.cat}`));
  });
  el.appendChild(strip);

  // ---- Banner Carousel ----
  let bannerIdx = 0;
  const bannerSection = document.createElement('div');
  bannerSection.className = 'banner-carousel';
  bannerSection.innerHTML = `
    <div class="banner-track" id="banner-track">
      ${banners.map(b => `
        <div class="banner-slide" style="background:${b.bgGradient};color:${b.textColor}" data-route="${b.route}">
          <div class="banner-content">
            <div class="banner-subtitle">${b.subtitle}</div>
            <div class="banner-title">${b.title}</div>
            <span class="banner-cta" style="background:${b.ctaBg};color:${b.ctaColor}">${b.cta} →</span>
          </div>
          <div style="position:absolute;right:20px;bottom:20px;font-size:64px;opacity:0.15">🩹</div>
        </div>
      `).join('')}
    </div>
    <div class="banner-dots">
      ${banners.map((_, i) => `<div class="banner-dot ${i === 0 ? 'active' : ''}" data-bidx="${i}"></div>`).join('')}
    </div>
  `;
  el.appendChild(bannerSection);

  // Banner auto-slide
  function slideBanner(idx) {
    bannerIdx = idx;
    const track = el.querySelector('#banner-track');
    if (track) track.style.transform = `translateX(-${idx * 100}%)`;
    el.querySelectorAll('.banner-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
  }
  const bannerInterval = setInterval(() => {
    slideBanner((bannerIdx + 1) % banners.length);
  }, 4000);

  bannerSection.querySelectorAll('.banner-dot').forEach(d => {
    d.addEventListener('click', () => slideBanner(parseInt(d.dataset.bidx)));
  });
  bannerSection.querySelectorAll('.banner-slide').forEach(s => {
    s.addEventListener('click', () => { if (s.dataset.route) window.location.hash = s.dataset.route; });
  });

  // ---- Shop by Concern ----
  const concernSection = document.createElement('section');
  concernSection.className = 'section';
  concernSection.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Shop by Concern</h2>
      <a class="section-link" href="#/categories">View All →</a>
    </div>
    <div class="concern-grid">
      ${concerns.map(c => `
        <div class="concern-card" data-cat="${c.id}">
          <div class="concern-icon" style="background:${c.color}">${c.icon}</div>
          <div class="concern-name">${c.name}</div>
        </div>
      `).join('')}
    </div>
  `;
  concernSection.querySelectorAll('.concern-card').forEach(card => {
    card.addEventListener('click', () => navigate(`listing/${card.dataset.cat}`));
  });
  el.appendChild(concernSection);

  // ---- Best Sellers ----
  el.appendChild(renderProductCarousel(getBestSellers(), 'Best Sellers', '#/listing/all'));

  // ---- Trending Products ----
  const trendingSection = document.createElement('section');
  trendingSection.className = 'section';
  trendingSection.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Trending Products</h2>
      <a class="section-link" href="#/listing/all">View All →</a>
    </div>
    <div class="product-grid" id="trending-grid"></div>
  `;
  const trendingGrid = trendingSection.querySelector('#trending-grid');
  getTrending().slice(0, 4).forEach(p => trendingGrid.appendChild(renderProductCard(p)));
  el.appendChild(trendingSection);

  // ---- Mobility Essentials ----
  el.appendChild(renderProductCarousel(getMobilityEssentials(), 'Mobility Essentials', '#/listing/mobility'));

  // ---- Rehabilitation Picks ----
  el.appendChild(renderProductCarousel(getRehabPicks(), 'Rehabilitation Picks', '#/listing/rehab'));

  // ---- Recently Viewed ----
  const recentIds = store.getRecentlyViewed();
  if (recentIds.length > 0) {
    const recentProducts = recentIds.map(id => getProductById(id)).filter(Boolean).slice(0, 6);
    if (recentProducts.length > 0) {
      el.appendChild(renderProductCarousel(recentProducts, 'Recently Viewed'));
    }
  }

  // ---- Why Choose OrthoCare ----
  const trustSection = document.createElement('section');
  trustSection.className = 'section';
  trustSection.innerHTML = `
    <h2 class="section-title">Why Choose OrthoCare</h2>
    <div class="trust-grid">
      <div class="trust-card">
        <div class="trust-icon">${icons.shield}</div>
        <div class="trust-info">
          <h4>Quality Products</h4>
          <p>Curated orthopedic products from trusted brands</p>
        </div>
      </div>
      <div class="trust-card">
        <div class="trust-icon">${icons.lock}</div>
        <div class="trust-info">
          <h4>Secure Payments</h4>
          <p>100% secure payment options</p>
        </div>
      </div>
      <div class="trust-card">
        <div class="trust-icon">${icons.truck}</div>
        <div class="trust-info">
          <h4>Reliable Delivery</h4>
          <p>Fast delivery across India</p>
        </div>
      </div>
      <div class="trust-card">
        <div class="trust-icon">${icons.repeat}</div>
        <div class="trust-info">
          <h4>Easy Returns</h4>
          <p>Hassle-free return process</p>
        </div>
      </div>
    </div>
  `;
  el.appendChild(trustSection);

  // Spacer
  el.appendChild(document.createElement('div')).style.height = '16px';

  appEl.appendChild(el);

  // ---- Bottom Nav ----
  const nav = renderBottomNav('home');
  appEl.appendChild(nav);

  return {
    unmount() {
      clearInterval(bannerInterval);
      if (nav._unsub) nav._unsub();
    }
  };
}
