// ========================================
// Onboarding Screen
// ========================================
import { navigate } from '../router.js';
import * as store from '../store.js';

const slides = [
  {
    icon: '🦵',
    bg: '#E3F2F7',
    title: 'Support Every Step',
    desc: 'Explore a wide range of orthopedic supports and braces designed for your comfort and mobility.',
  },
  {
    icon: '🚶',
    bg: '#E8F7EF',
    title: 'Comfort Meets Mobility',
    desc: 'From walking aids to rehabilitation equipment — find the right mobility solution for your needs.',
  },
  {
    icon: '📦',
    bg: '#F0E8F7',
    title: 'Orthopedic Care, Delivered',
    desc: 'Quality orthopedic products delivered to your doorstep with easy returns and secure payments.',
  },
];

export default function OnboardingScreen(appEl) {
  let current = 0;

  const el = document.createElement('div');
  el.className = 'onboarding-screen';
  el.innerHTML = `
    <div class="onboarding-slides">
      ${slides.map((s, i) => `
        <div class="onboarding-slide ${i === 0 ? 'active' : ''}" data-slide="${i}">
          <div class="onboarding-illustration" style="background:${s.bg}">
            <span style="font-size:80px">${s.icon}</span>
          </div>
          <h2 class="onboarding-title">${s.title}</h2>
          <p class="onboarding-desc">${s.desc}</p>
        </div>
      `).join('')}
    </div>
    <div class="onboarding-footer">
      <div class="onboarding-dots">
        ${slides.map((_, i) => `<div class="onboarding-dot ${i === 0 ? 'active' : ''}" data-dot="${i}"></div>`).join('')}
      </div>
      <div class="onboarding-actions">
        <button class="onboarding-skip" id="ob-skip">Skip</button>
        <button class="btn btn-primary btn-pill" id="ob-next">Next →</button>
      </div>
    </div>
  `;

  appEl.appendChild(el);

  function goToSlide(idx) {
    const slideEls = el.querySelectorAll('.onboarding-slide');
    const dotEls = el.querySelectorAll('.onboarding-dot');
    slideEls.forEach((s, i) => {
      s.classList.remove('active', 'prev');
      if (i < idx) s.classList.add('prev');
      if (i === idx) s.classList.add('active');
    });
    dotEls.forEach((d, i) => d.classList.toggle('active', i === idx));
    current = idx;

    const nextBtn = el.querySelector('#ob-next');
    if (current === slides.length - 1) {
      nextBtn.textContent = 'Get Started';
    } else {
      nextBtn.textContent = 'Next →';
    }
  }

  function finish() {
    store.setSeenOnboarding();
    navigate('login');
  }

  el.querySelector('#ob-next').addEventListener('click', () => {
    if (current < slides.length - 1) {
      goToSlide(current + 1);
    } else {
      finish();
    }
  });

  el.querySelector('#ob-skip').addEventListener('click', finish);

  return { unmount() {} };
}
