// ========================================
// Login / Sign Up Screen
// ========================================
import { navigate } from '../router.js';
import * as store from '../store.js';
import { icons } from '../data/icons.js';

export default function LoginScreen(appEl) {
  let isOtp = false;

  const el = document.createElement('div');
  el.className = 'login-screen';

  function renderLogin() {
    el.innerHTML = `
      <div class="login-header">
        <div class="login-logo">
          <svg width="36" height="36" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" fill="#176B87" opacity="0.1" stroke="#176B87" stroke-width="3"/>
            <circle cx="40" cy="40" r="8" fill="#176B87"/>
            <circle cx="40" cy="40" r="4" fill="white"/>
            <path d="M32 48 L40 36 L48 48" stroke="#176B87" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="login-logo-text">Ortho<span>Care</span></span>
        </div>
        <h1 class="login-title">Welcome Back</h1>
        <p class="login-subtitle">Sign in to continue shopping for orthopedic products</p>
      </div>

      <div class="login-form">
        <div class="input-group">
          <span class="input-icon">📱</span>
          <input type="tel" id="login-phone" placeholder="Enter mobile number" maxlength="10" />
        </div>
        <button class="btn btn-primary btn-block btn-lg" id="login-continue">Continue as Customer</button>
      </div>

      <!-- Prominent Business Buyer Section -->
      <div style="background:#f0fdfa; border:2px solid #0d9488; border-radius:14px; padding:16px; margin:20px 0; text-align:center">
        <div style="font-size:12px; font-weight:800; color:#0f766e; text-transform:uppercase; letter-spacing:0.5px">
          🏥 Are you a Business Buyer?
        </div>
        <p style="font-size:12px; color:#134e4a; margin:6px 0 14px">
          Hospitals, Clinics, Pharmacies & Distributors get wholesale pricing, bulk discounts, and 30-day credit.
        </p>
        <div style="display:flex; flex-direction:column; gap:8px">
          <button type="button" class="btn btn-block btn-sm" id="btn-goto-wholesale-reg" style="background:#0d9488; color:#ffffff; font-weight:700; padding:10px">
            Register as Wholesale Buyer →
          </button>
          <div style="display:flex; justify-content:center; gap:16px; margin-top:4px">
            <a href="#/wholesale/login" id="btn-goto-wholesale-login" style="font-size:12px; font-weight:700; color:#0f766e">
              Wholesale Partner Login
            </a>
            <span style="color:#cbd5e1">•</span>
            <a href="#/home" id="btn-shop-customer-fast" style="font-size:12px; font-weight:700; color:#64748b">
              Shop as Customer
            </a>
          </div>
        </div>
      </div>

      <div class="login-divider">or continue with</div>

      <button class="login-google" id="login-google">
        ${icons.google}
        <span>Continue with Google</span>
      </button>

      <div class="login-secure">
        ${icons.lock}
        <span>Your information is secure with us</span>
      </div>

      <div class="login-footer">
        <p>By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
      </div>
    `;

    el.querySelector('#btn-goto-wholesale-reg').addEventListener('click', () => {
      navigate('wholesale/register');
    });
    el.querySelector('#btn-goto-wholesale-login').addEventListener('click', (e) => {
      e.preventDefault();
      navigate('wholesale/login');
    });
    el.querySelector('#btn-shop-customer-fast').addEventListener('click', (e) => {
      e.preventDefault();
      store.setLoggedIn(true);
      navigate('home');
    });

    el.querySelector('#login-continue').addEventListener('click', () => {
      const phone = el.querySelector('#login-phone').value;
      if (phone.length >= 10) {
        renderOtp(phone);
      } else {
        el.querySelector('.input-group').style.borderColor = 'var(--color-error)';
      }
    });

    el.querySelector('#login-google').addEventListener('click', () => {
      store.setLoggedIn(true);
      navigate('home');
    });
  }

  function renderOtp(phone) {
    isOtp = true;
    el.innerHTML = `
      <div class="login-header">
        <button class="back-btn" id="otp-back" style="margin-bottom:var(--sp-2xl)">${icons.back}</button>
        <h1 class="login-title">Verify OTP</h1>
        <p class="login-subtitle">Enter the 4-digit code sent to +91 ${phone}</p>
      </div>

      <div class="otp-inputs">
        <input class="otp-input" type="tel" maxlength="1" data-idx="0" autofocus />
        <input class="otp-input" type="tel" maxlength="1" data-idx="1" />
        <input class="otp-input" type="tel" maxlength="1" data-idx="2" />
        <input class="otp-input" type="tel" maxlength="1" data-idx="3" />
      </div>

      <button class="btn btn-primary btn-block btn-lg" id="otp-verify">Verify & Continue</button>

      <div style="text-align:center;margin-top:var(--sp-2xl)">
        <p style="font-size:var(--fs-sm);color:var(--color-text-secondary)">
          Didn't receive the code? <a href="#" id="otp-resend" style="color:var(--color-primary);font-weight:600">Resend OTP</a>
        </p>
      </div>

      <div class="login-secure" style="margin-top:var(--sp-3xl)">
        ${icons.lock}
        <span>Your information is secure with us</span>
      </div>
    `;

    // Auto-focus next input
    const inputs = el.querySelectorAll('.otp-input');
    inputs.forEach((input, idx) => {
      input.addEventListener('input', (e) => {
        if (e.target.value && idx < 3) inputs[idx + 1].focus();
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && idx > 0) inputs[idx - 1].focus();
      });
    });

    el.querySelector('#otp-verify').addEventListener('click', () => {
      const code = [...inputs].map(i => i.value).join('');
      if (code.length === 4) {
        store.setLoggedIn(true);
        navigate('home');
      }
    });

    el.querySelector('#otp-back').addEventListener('click', renderLogin);
    el.querySelector('#otp-resend').addEventListener('click', (e) => {
      e.preventDefault();
      e.target.textContent = 'OTP Sent!';
      setTimeout(() => { e.target.textContent = 'Resend OTP'; }, 2000);
    });
  }

  renderLogin();
  appEl.appendChild(el);

  return { unmount() {} };
}
