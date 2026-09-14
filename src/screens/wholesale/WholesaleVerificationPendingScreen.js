// ========================================
// Wholesale Verification Pending Screen
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { icons } from '../../data/icons.js';
import { renderBackHeader, showModal } from '../../components/index.js';

export default function WholesaleVerificationPendingScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen-content';
  el.style.background = '#f8fafc';

  const user = store.getWholesaleUser();

  el.appendChild(renderBackHeader('Business Account Status', () => navigate('login')));

  el.innerHTML += `
    <div style="padding:20px; max-width:540px; margin:0 auto 80px">
      <div class="pending-screen-hero">
        <div class="pending-icon-circle">⏳</div>
        <span class="b2b-badge pending" style="margin-bottom:8px">Verification Pending</span>
        <h2 style="font-size:22px; font-weight:800; color:#0f172a; margin-top:8px">
          Your Business Account is Under Verification
        </h2>
        <p style="font-size:13px; color:#64748b; line-height:1.5; margin-top:8px">
          Our compliance & clinical verification team is reviewing <strong>${user ? user.businessName : 'your business details'}</strong>. Wholesale bulk pricing, MOQ ordering, and tax invoicing will activate automatically upon approval.
        </p>
      </div>

      <!-- Verification Timeline -->
      <div class="card" style="padding:20px; border-radius:14px; margin-bottom:16px">
        <h3 style="font-size:14px; font-weight:700; color:#0f3647; margin-bottom:16px">
          Application Progress
        </h3>

        <div style="display:flex; flex-direction:column">
          <div class="timeline-step">
            <div class="timeline-dot done">✓</div>
            <div>
              <div style="font-size:13px; font-weight:700; color:#0f172a">Application & Docs Submitted</div>
              <div style="font-size:11px; color:#64748b">Business info & GST certificate uploaded</div>
            </div>
          </div>

          <div class="timeline-step">
            <div class="timeline-dot active">2</div>
            <div>
              <div style="font-size:13px; font-weight:700; color:#d97706">GST & Medical License Verification</div>
              <div style="font-size:11px; color:#64748b">Under review by OrthoCare compliance desk (Est. 4–12 hours)</div>
            </div>
          </div>

          <div class="timeline-step">
            <div class="timeline-dot">3</div>
            <div>
              <div style="font-size:13px; font-weight:700; color:#94a3b8">B2B Credit & Tier Allocation</div>
              <div style="font-size:11px; color:#64748b">Activation of wholesale catalog and credit line</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display:flex; flex-direction:column; gap:10px">
        <button id="btn-view-details" class="btn btn-secondary btn-pill" style="padding:12px; font-weight:700; font-size:13px">
          📄 View Submitted Details
        </button>

        <button id="btn-contact-support" class="btn btn-secondary btn-pill" style="padding:12px; font-weight:700; font-size:13px">
          📞 Contact B2B Priority Support (+91 1800-ORTHO-B2B)
        </button>

        <!-- Fast Demo Approval Shortcut for Reviewer -->
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:14px; margin-top:10px; text-align:center">
          <div style="font-size:12px; font-weight:700; color:#166534; margin-bottom:4px">
            👑 Reviewer Shortcut: Test Instant Approval
          </div>
          <p style="font-size:11px; color:#15803d; margin-bottom:10px">
            Simulate admin clicking "Approve" on this account to immediately unlock wholesale pricing!
          </p>
          <button id="btn-demo-approve" class="btn btn-primary btn-sm btn-pill" style="background:#16a34a; font-weight:700">
            ✓ Approve Account Now (Simulate Admin)
          </button>
        </div>
      </div>
    </div>
  `;

  // View Submitted Details Modal
  el.querySelector('#btn-view-details').addEventListener('click', () => {
    const b = user || {};
    const contentHtml = `
      <div style="display:flex; flex-direction:column; gap:12px; font-size:13px">
        <div><strong>Business Name:</strong> ${b.businessName || 'CareMed Surgical'}</div>
        <div><strong>Type:</strong> ${b.businessType || 'Retailer'}</div>
        <div><strong>Authorized Person:</strong> ${b.ownerName || 'Mukeshbhai Patel'}</div>
        <div><strong>Contact:</strong> ${b.phone || '+91 98250 99312'} | ${b.email || 'caremed@gmail.com'}</div>
        <div><strong>Address:</strong> ${b.address || 'Shop 14, Relief Road'}, ${b.city || 'Ahmedabad'}, ${b.state || 'Gujarat'} - ${b.pincode || '380001'}</div>
        <div><strong>GSTIN:</strong> ${b.gstin || '24ABCDE1234F1Z5'}</div>
        <div><strong>PAN:</strong> ${b.pan || 'ABCDE1234F'}</div>
        <div><strong>Medical License:</strong> ${b.medLicense || 'GJ-SURG-88219'}</div>
        <div><strong>Uploaded Files:</strong>
          <ul style="margin:4px 0 0 16px; font-size:12px; color:#0d9488">
            <li>GST_Registration_Certificate.pdf (1.2 MB)</li>
            <li>Medical_Establishment_License.pdf (950 KB)</li>
          </ul>
        </div>
      </div>
    `;
    showModal('Submitted Application Details', contentHtml, '<button class="btn btn-primary btn-sm" onclick="document.querySelector(\'#modal-close\').click()">Close</button>');
  });

  // Contact Support
  el.querySelector('#btn-contact-support').addEventListener('click', () => {
    store.emitter.emit('toast', {
      message: 'Calling B2B Helpline: +91 1800-67846-222 (Simulated)',
      type: 'info'
    });
  });

  // Demo Approve
  el.querySelector('#btn-demo-approve').addEventListener('click', () => {
    if (user) {
      store.approveWholesaleBuyer(user.id);
      navigate('wholesale/dashboard');
    }
  });

  appEl.appendChild(el);
  return el;
}
