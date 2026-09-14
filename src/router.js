// ========================================
// OrthoCare — SPA Router
// ========================================

const routes = {};
let currentScreen = null;
let currentRoute = null;

export function registerRoute(path, handler) {
  routes[path] = handler;
}

export function navigate(hash) {
  if (!hash.startsWith('#/')) hash = '#/' + hash;
  window.location.hash = hash;
}

export function getCurrentRoute() { return currentRoute; }

export function getRouteParams() {
  const hash = window.location.hash.slice(2); // remove #/
  const parts = hash.split('/');
  return parts;
}

export function startRouter(appEl) {
  function handleRoute() {
    const hash = window.location.hash || '#/splash';
    const path = hash.slice(2).split('/')[0] || 'splash'; // first segment
    const params = hash.slice(2).split('/').slice(1);

    currentRoute = path;

    // Find matching handler
    const handler = routes[path];
    if (handler) {
      // Cleanup previous screen
      if (currentScreen && currentScreen.unmount) {
        currentScreen.unmount();
      }
      // Clear app
      appEl.innerHTML = '';
      // Mount new screen
      currentScreen = handler(appEl, ...params);
    } else {
      // 404 — navigate home
      navigate('home');
    }
  }

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
