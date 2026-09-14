// ========================================
// Onboarding Screen - Redesigned
// ========================================
import { navigate } from '../router.js';
import { icons } from '../data/icons.js';
import * as store from '../store.js';

const slides = [
  {
    iconSvg: icons.knee,
    bg: 'rgba(23, 107, 135, 0.08)',
    title: 'Certified Orthopedic Supports',
    desc: 'Explore hospital-grade braces, cervical collars, and joint stabilizers engineered for everyday mobility.',
  },
  {
    iconSvg: icons.mobility,
    bg: 'rgba(57, 169, 107, 0.08)',
    title: 'Mobility Meets Clinical Precision',
    desc: 'Ergonomic walking aids, crutches, and rehabilitation gear vetted by leading orthopedic surgeons.',
  },
  {
    iconSvg: icons.package,
    bg: 'rgba(18, 59, 74, 0.08)',
    title: 'Healthcare Express Delivery',
    desc: 'Sterile medical equipment delivered securely to your door with verified GST compliance and easy returns.',
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
          <div class="onboarding-illustration" style="background:${s.bg}; display:flex; align-items:center; justify-content:center">
            <span style="width:72px; height:72px; color:var(--primary); display:inline-flex">${s.iconSvg}</span>
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
        <button class="btn btn-primary" id="ob-next" style="padding:0 24px; height:44px">Next</button>
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
      nextBtn.textContent = 'Next';
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
