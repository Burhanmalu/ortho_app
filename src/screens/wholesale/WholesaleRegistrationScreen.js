// ========================================
// Wholesale Registration Screen
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { icons } from '../../data/icons.js';
import { businessTypes } from '../../data/wholesaleBuyers.js';
import { renderBackHeader } from '../../components/index.js';

export default function WholesaleRegistrationScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen-content';
  el.style.background = '#f8fafc';

  el.appendChild(renderBackHeader('Wholesale Registration', () => navigate('login')));

  el.innerHTML += `
    <div style="padding:16px 20px 100px; max-width:600px; margin:0 auto">
      <div style="text-align:center; margin-bottom:20px">
        <div style="display:inline-block; padding:8px 16px; background:#eff6ff; border-radius:9999px; color:#2563eb; font-size:12px; font-weight:700; margin-bottom:8px">
          🏥 B2B HEALTHCARE PARTNERSHIP
        </div>
        <h2 style="font-size:22px; font-weight:800; color:#0f172a; margin-bottom:6px">Apply for Wholesale Account</h2>
        <p style="font-size:13px; color:#64748b">
          Access institutional pricing, 10–25% bulk margin rebates, 30-day credit terms, and GST tax invoicing.
        </p>
      </div>

      <form id="wholesale-reg-form" style="display:flex; flex-direction:column; gap:16px">
        <!-- Section 1: Business Information -->
        <div class="card" style="padding:18px; border-radius:14px">
          <h3 style="font-size:14px; font-weight:700; color:#0f3647; margin-bottom:14px; display:flex; align-items:center; gap:8px">
            🏢 Business Information
          </h3>

          <div style="display:flex; flex-direction:column; gap:12px">
            <div>
              <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">Business / Institution Name *</label>
              <input type="text" id="reg-biz-name" required placeholder="e.g. City Ortho Clinic & Surgicals" class="input" style="width:100%">
            </div>

            <div>
              <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">Business Type *</label>
              <select id="reg-biz-type" required class="input" style="width:100%">
                ${businessTypes.map(t => `<option value="${t}">${t}</option>`).join('')}
              </select>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
              <div>
                <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">Authorized Person *</label>
                <input type="text" id="reg-owner" required placeholder="Dr. / Mr. Name" class="input" style="width:100%">
              </div>
              <div>
                <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">Years in Operation *</label>
                <input type="number" id="reg-years" min="1" max="100" value="5" class="input" style="width:100%">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
              <div>
                <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">Business Mobile *</label>
                <input type="tel" id="reg-phone" required placeholder="98XXXXXXXX" class="input" style="width:100%">
              </div>
              <div>
                <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">Official Email *</label>
                <input type="email" id="reg-email" required placeholder="procure@clinic.in" class="input" style="width:100%">
              </div>
            </div>

            <div>
              <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">Facility / Warehouse Address *</label>
              <textarea id="reg-address" required rows="2" placeholder="Street, Building, Area" class="input" style="width:100%"></textarea>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px">
              <div>
                <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">City *</label>
                <input type="text" id="reg-city" required placeholder="City" class="input" style="width:100%">
              </div>
              <div>
                <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">State *</label>
                <input type="text" id="reg-state" required placeholder="State" class="input" style="width:100%">
              </div>
              <div>
                <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">PIN Code *</label>
                <input type="text" id="reg-pincode" required placeholder="110001" class="input" style="width:100%">
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Statutory & Tax Verification -->
        <div class="card" style="padding:18px; border-radius:14px">
          <h3 style="font-size:14px; font-weight:700; color:#0f3647; margin-bottom:14px; display:flex; align-items:center; gap:8px">
            📜 Statutory & Tax Details
          </h3>

          <div style="display:flex; flex-direction:column; gap:12px">
            <div>
              <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">GSTIN (15 Digits) *</label>
              <input type="text" id="reg-gstin" required maxlength="15" placeholder="07AAAAA0000A1Z5" class="input" style="width:100%; text-transform:uppercase">
              <small style="font-size:10px; color:#64748b">Required for B2B input tax credit pass-through</small>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
              <div>
                <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">PAN Card Number *</label>
                <input type="text" id="reg-pan" required maxlength="10" placeholder="AAAAA0000A" class="input" style="width:100%; text-transform:uppercase">
              </div>
              <div>
                <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">Medical / Drug License No.</label>
                <input type="text" id="reg-license" placeholder="DL-20B/21B-XXXX" class="input" style="width:100%">
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Document Upload Simulation -->
        <div class="card" style="padding:18px; border-radius:14px">
          <h3 style="font-size:14px; font-weight:700; color:#0f3647; margin-bottom:10px; display:flex; align-items:center; gap:8px">
            📎 Verification Documents
          </h3>
          <p style="font-size:12px; color:#64748b; margin-bottom:12px">
            Upload clear copies of your GST Certificate & Medical/Trade Establishment License (PDF or JPG).
          </p>

          <div id="upload-zone" style="border:2px dashed #cbd5e1; border-radius:10px; padding:20px; text-align:center; background:#f8fafc; cursor:pointer">
            <div style="font-size:28px; margin-bottom:6px">📄</div>
            <div style="font-size:13px; font-weight:700; color:#0f3647">Click to Select or Drop Documents</div>
            <div style="font-size:11px; color:#64748b; margin-top:2px">Simulated file attachment: GST_Certificate.pdf (1.4 MB)</div>
          </div>
          <div id="upload-status" style="margin-top:8px; font-size:11px; color:#16a34a; font-weight:600; display:none">
            ✓ 2 documents attached for verification review
          </div>
        </div>

        <!-- Terms & Submit -->
        <div style="display:flex; align-items:flex-start; gap:8px; margin-top:4px">
          <input type="checkbox" id="reg-terms" required checked style="margin-top:3px">
          <label for="reg-terms" style="font-size:11px; color:#64748b">
            I certify that I am authorized to purchase on behalf of this medical enterprise and agree to OrthoCare's B2B Terms of Supply.
          </label>
        </div>

        <button type="submit" class="btn btn-primary btn-pill" style="padding:14px; font-size:15px; font-weight:700; width:100%; margin-top:8px">
          Submit Wholesale Application →
        </button>

        <div style="text-align:center; margin-top:10px">
          <span style="font-size:12px; color:#64748b">Already have a wholesale account? </span>
          <a href="#/wholesale/login" style="font-size:12px; font-weight:700; color:#0d9488">Partner Login</a>
        </div>
      </form>
    </div>
  `;

  // Attach interactive events
  const uploadZone = el.querySelector('#upload-zone');
  const uploadStatus = el.querySelector('#upload-status');
  uploadZone.addEventListener('click', () => {
    uploadStatus.style.display = 'block';
    uploadZone.style.borderColor = '#10b981';
    uploadZone.style.background = '#f0fdf4';
    store.emitter.emit('toast', { message: 'Documents attached (Simulated)', type: 'success' });
  });

  const form = el.querySelector('#wholesale-reg-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      businessName: el.querySelector('#reg-biz-name').value,
      businessType: el.querySelector('#reg-biz-type').value,
      ownerName: el.querySelector('#reg-owner').value,
      yearsInBusiness: el.querySelector('#reg-years').value,
      phone: el.querySelector('#reg-phone').value,
      email: el.querySelector('#reg-email').value,
      address: el.querySelector('#reg-address').value,
      city: el.querySelector('#reg-city').value,
      state: el.querySelector('#reg-state').value,
      pincode: el.querySelector('#reg-pincode').value,
      gstin: el.querySelector('#reg-gstin').value,
      pan: el.querySelector('#reg-pan').value,
      medLicense: el.querySelector('#reg-license').value
    };

    const newBuyer = store.registerWholesaleBuyer(formData);
    store.setRole('wholesale');

    store.emitter.emit('toast', {
      message: `Application submitted for ${newBuyer.businessName}!`,
      type: 'success'
    });

    navigate('wholesale/verification-pending');
  });

  appEl.appendChild(el);
  return el;
}
