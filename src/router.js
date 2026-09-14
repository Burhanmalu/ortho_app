// ========================================
// OrthoCare — Role-Aware SPA Router
// ========================================

import * as store from './store.js';

const routes = {};
let currentScreen = null;
let currentRoute = null;

export function registerRoute(path, handler) {
  // Normalize path without leading slashes or hashes
  const clean = path.replace(/^#?\/?/, '');
  routes[clean] = handler;
}

export function navigate(hash) {
  if (!hash.startsWith('#/')) hash = '#/' + hash;
  window.location.hash = hash;
}

export function getCurrentRoute() { return currentRoute; }

export function getRouteParams() {
  const hash = window.location.hash.slice(2);
  return hash.split('/');
}

export function startRouter(appEl) {
  function handleRoute() {
    const rawHash = window.location.hash || '#/splash';
    const cleanHash = rawHash.replace(/^#?\/?/, '');
    const segments = cleanHash.split('/').filter(Boolean);

    let matchedHandler = null;
    let matchedParams = [];
    let matchedPath = '';

    // 1. Try full exact match (e.g. 'wholesale/dashboard', 'admin/wholesale-orders')
    const fullPath = segments.join('/');
    if (routes[fullPath]) {
      matchedHandler = routes[fullPath];
      matchedParams = [];
      matchedPath = fullPath;
    }

    // 2. Try two-segment prefix + params (e.g. 'wholesale/product' + ['OC0001'])
    if (!matchedHandler && segments.length >= 2) {
      const twoPartPrefix = segments.slice(0, 2).join('/');
      if (routes[twoPartPrefix]) {
        matchedHandler = routes[twoPartPrefix];
        matchedParams = segments.slice(2);
        matchedPath = twoPartPrefix;
      }
    }

    // 3. Try one-segment prefix + params (e.g. 'product' + ['OC0001'], 'listing' + ['knee'])
    if (!matchedHandler && segments.length >= 1) {
      const onePartPrefix = segments[0];
      if (routes[onePartPrefix]) {
        matchedHandler = routes[onePartPrefix];
        matchedParams = segments.slice(1);
        matchedPath = onePartPrefix;
      }
    }

    // Role & Body class synchronization
    if (segments[0] === 'admin') {
      document.body.classList.add('admin-mode');
      if (store.getRole() !== 'admin') store.setRole('admin');
    } else {
      document.body.classList.remove('admin-mode');
      if (segments[0] === 'wholesale') {
        if (store.getRole() !== 'wholesale') store.setRole('wholesale');
      } else if (['home', 'categories', 'listing', 'product', 'cart', 'wishlist', 'orders', 'profile', 'checkout', 'search', 'offers', 'notifications'].includes(segments[0])) {
        if (store.getRole() !== 'customer') store.setRole('customer');
      }
    }

    currentRoute = matchedPath || fullPath;

    if (matchedHandler) {
      // Unmount previous screen
      if (currentScreen && currentScreen.unmount) {
        try { currentScreen.unmount(); } catch(e) {}
      }
      appEl.innerHTML = '';
      window.scrollTo(0, 0);
      currentScreen = matchedHandler(appEl, ...matchedParams);
    } else {
      // Fallback
      navigate('home');
    }
  }

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
