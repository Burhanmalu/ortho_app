// ========================================
// Splash Screen
// ========================================
import { navigate } from '../router.js';
import * as store from '../store.js';

export default function SplashScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'splash-screen';
  el.innerHTML = `
    <div class="splash-logo">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="38" fill="#176B87" opacity="0.1" stroke="#176B87" stroke-width="2"/>
        <circle cx="40" cy="40" r="28" fill="#176B87" opacity="0.06"/>
        <path d="M40 18 C28 18, 18 28, 18 40 C18 52, 28 62, 40 62" stroke="#176B87" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.4"/>
        <path d="M40 18 C52 18, 62 28, 62 40 C62 52, 52 62, 40 62" stroke="#39A96B" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.4"/>
        <circle cx="40" cy="40" r="8" fill="#176B87"/>
        <circle cx="40" cy="40" r="4" fill="white"/>
        <path d="M32 48 L40 36 L48 48" stroke="#176B87" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="splash-brand">Ortho<span>Care</span></div>
    <div class="splash-tagline">Move Better. Live Better.</div>
    <div class="splash-loader"><div class="splash-loader-bar"></div></div>
  `;
  appEl.appendChild(el);

  const timeout = setTimeout(() => {
    el.classList.add('fade-out');
    setTimeout(() => {
      store.setSeenSplash();
      if (!store.hasSeenOnboarding()) {
        navigate('onboarding');
      } else {
        navigate('home');
      }
    }, 400);
  }, 2500);

  return {
    unmount() { clearTimeout(timeout); }
  };
}
