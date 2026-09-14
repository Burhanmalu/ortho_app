// ========================================
// Wholesale Registration Screen - Redesigned
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { businessTypes } from '../../data/adminData.js';
import { icons } from '../../data/icons.js';
import { renderBackHeader } from '../../components/index.js';

export default function WholesaleRegistrationScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen-content';
  el.style.background = 'var(--bg-light)';

  el.appendChild(renderBackHeader('Wholesale Registration', () => navigate('login')));

  el.innerHTML += `
    <div style="padding:16px 16px 100px; max-width:600px; margin:0 auto">
      <div style="text-align:center; margin-bottom:20px">
        <div style="display:inline-flex; align-items:center; gap:6px; padding:6px 14px; background:rgba(23, 107, 135, 0.08); border-radius:9999px; color:var(--primary); font-size:11px; font-weight:700; margin-bottom:8px">
          <span style="width:14px; height:14px; display:inline-flex">${icons.hospital || icons.building}</span>
          B2B HEALTHCARE PARTNERSHIP
        </div>
        <h2 style="font-size:20px; font-weight:800; color:var(--deep-navy); margin-bottom:4px">Apply for Wholesale Account</h2>
        <p style="font-size:12px; color:var(--text-secondary); line-height:1.4">
          Access institutional volume pricing, up to 25% bulk margin rebates, 30-day credit terms, and GST tax invoicing.
        </p>
      </div>

      <form id="wholesale-reg-form" style="display:flex; flex-direction:column; gap:14px">
        <!-- Section 1: Business Information -->
        <div class="card" style="padding:16px">
          <h3 style="font-size:13px; font-weight:700; color:var(--deep-navy); margin-bottom:12px; display:flex; align-items:center; gap:8px; text-transform:uppercase; letter-spacing:0.5px">
            <span style="color:var(--primary); width:16px; height:16px; display:inline-flex">${icons.building}</span>
            Business Information
          </h3>

          <div style="display:flex; flex-direction:column; gap:10px; font-size:12px">
            <div>
              <label style="font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Business / Institution Name *</label>
              <input type="text" id="reg-biz-name" required placeholder="e.g. City Ortho Clinic & Surgicals" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
            </div>

            <div>
              <label style="font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Business Type *</label>
              <select id="reg-biz-type" required style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
                ${businessTypes.map(t => `<option value="${t}">${t}</option>`).join('')}
              </select>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
              <div>
                <label style="font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Authorized Contact *</label>
                <input type="text" id="reg-owner" required placeholder="Dr. / Mr. Name" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
              </div>
              <div>
                <label style="font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Years Operating *</label>
                <input type="number" id="reg-years" min="1" max="100" value="5" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
              <div>
                <label style="font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Business Mobile *</label>
                <input type="tel" id="reg-phone" required placeholder="98XXXXXXXX" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
              </div>
              <div>
                <label style="font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Official Email *</label>
                <input type="email" id="reg-email" required placeholder="procure@clinic.in" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
              </div>
            </div>

            <div>
              <label style="font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Facility / Warehouse Address *</label>
              <textarea id="reg-address" required rows="2" placeholder="Street, Building, Area" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none; resize:vertical"></textarea>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px">
              <div>
                <label style="font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">City *</label>
                <input type="text" id="reg-city" required placeholder="City" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
              </div>
              <div>
                <label style="font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">State *</label>
                <input type="text" id="reg-state" required placeholder="State" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
              </div>
              <div>
                <label style="font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">PIN Code *</label>
                <input type="text" id="reg-pincode" required placeholder="110001" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Statutory & Tax Verification -->
        <div class="card" style="padding:16px">
          <h3 style="font-size:13px; font-weight:700; color:var(--deep-navy); margin-bottom:12px; display:flex; align-items:center; gap:8px; text-transform:uppercase; letter-spacing:0.5px">
            <span style="color:var(--primary); width:16px; height:16px; display:inline-flex">${icons.fileText}</span>
            Statutory & Tax Details
          </h3>

          <div style="display:flex; flex-direction:column; gap:10px; font-size:12px">
            <div>
              <label style="font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">GSTIN (15 Digits) *</label>
              <input type="text" id="reg-gstin" required maxlength="15" placeholder="07AAAAA0000A1Z5" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); text-transform:uppercase; outline:none">
              <small style="font-size:10px; color:var(--text-secondary); margin-top:2px; display:block">Required for B2B input tax credit pass-through</small>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
              <div>
                <label style="font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">PAN Card Number *</label>
                <input type="text" id="reg-pan" required maxlength="10" placeholder="AAAAA0000A" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); text-transform:uppercase; outline:none">
              </div>
              <div>
                <label style="font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px">Medical License No.</label>
                <input type="text" id="reg-license" placeholder="DL-20B/21B-XXXX" style="width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Document Upload Simulation -->
        <div class="card" style="padding:16px">
          <h3 style="font-size:13px; font-weight:700; color:var(--deep-navy); margin-bottom:8px; display:flex; align-items:center; gap:8px; text-transform:uppercase; letter-spacing:0.5px">
            <span style="color:var(--primary); width:16px; height:16px; display:inline-flex">${icons.shield}</span>
            Verification Documents
          </h3>
          <p style="font-size:12px; color:var(--text-secondary); margin-bottom:12px">
            Upload clear copies of your GST Certificate & Medical Establishment License (PDF or JPG).
          </p>

          <div id="upload-zone" style="border:1.5px dashed var(--border); border-radius:var(--radius-md); padding:20px; text-align:center; background:var(--bg-light); cursor:pointer">
            <div style="width:32px; height:32px; margin:0 auto 6px; color:var(--primary); display:inline-flex">${icons.fileText}</div>
            <div style="font-size:13px; font-weight:700; color:var(--deep-navy)">Click to Select or Drop Documents</div>
            <div style="font-size:11px; color:var(--text-secondary); margin-top:2px">Simulated attachment: GST_Certificate.pdf (1.4 MB)</div>
          </div>
          <div id="upload-status" style="margin-top:8px; font-size:11px; color:var(--success); font-weight:600; display:none">
            2 documents attached for compliance review
          </div>
        </div>

        <!-- Terms & Submit -->
        <div style="display:flex; align-items:flex-start; gap:8px; margin-top:4px">
          <input type="checkbox" id="reg-terms" required checked style="margin-top:3px">
          <label for="reg-terms" style="font-size:11px; color:var(--text-secondary); line-height:1.4">
            I certify that I am authorized to purchase on behalf of this medical enterprise and agree to OrthoCare's B2B Terms of Supply.
          </label>
        </div>

        <button type="submit" class="btn btn-primary btn-block" style="height:44px; font-size:14px; font-weight:700; margin-top:6px">
          Submit Wholesale Application
        </button>

        <div style="text-align:center; margin-top:4px">
          <a href="#/wholesale/login" style="font-size:12px; font-weight:600; color:var(--primary)">
            Already have a wholesale partner account? Sign In
          </a>
        </div>
      </form>
    </div>
  `;

  let docsUploaded = false;
  const uploadZone = el.querySelector('#upload-zone');
  const uploadStatus = el.querySelector('#upload-status');

  uploadZone.addEventListener('click', () => {
    docsUploaded = true;
    uploadStatus.style.display = 'block';
    uploadZone.style.borderColor = 'var(--success)';
    uploadZone.style.background = 'rgba(57, 169, 107, 0.08)';
    store.emit('toast', { message: 'GST and Drug License attached successfully', type: 'success' });
  });

  el.querySelector('#wholesale-reg-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const newBuyer = {
      businessName: el.querySelector('#reg-biz-name').value,
      businessType: el.querySelector('#reg-biz-type').value,
      ownerName: el.querySelector('#reg-owner').value,
      phone: el.querySelector('#reg-phone').value,
      email: el.querySelector('#reg-email').value,
      address: el.querySelector('#reg-address').value,
      city: el.querySelector('#reg-city').value,
      state: el.querySelector('#reg-state').value,
      pincode: el.querySelector('#reg-pincode').value,
      gstin: el.querySelector('#reg-gstin').value.toUpperCase(),
      pan: el.querySelector('#reg-pan').value.toUpperCase(),
      license: el.querySelector('#reg-license').value,
      status: 'pending',
      tier: 'Silver',
      creditLimit: 50000,
      creditUsed: 0,
      creditDays: 15
    };

    store.registerWholesaleBuyer(newBuyer);
    store.setRole('wholesale');
    navigate('wholesale/verification-pending');
  });

  appEl.appendChild(el);
  return el;
}
