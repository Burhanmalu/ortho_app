// ========================================
// Wholesale B2B 5-Step Checkout Screen
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { formatPrice } from '../../data/products.js';
import { renderBackHeader, showGSTTaxInvoiceModal } from '../../components/index.js';

export default function WholesaleCheckoutScreen(appEl) {
  const el = document.createElement('div');
  el.className = 'screen-content';
  el.style.background = '#f8fafc';

  let currentStep = 1;
  const user = store.getWholesaleUser();
  const summary = store.getWholesaleCartSummary();

  const checkoutState = {
    facility: 'Central Receiving Dock #2',
    shippingAddress: user ? user.address : 'Plot 42, Industrial Area',
    city: user ? user.city : 'New Delhi',
    state: user ? user.state : 'Delhi',
    pincode: user ? user.pincode : '110092',
    contactPerson: user ? user.ownerName : 'Procurement Manager',
    contactPhone: user ? user.phone : '+91 98201 44821',
    sameBilling: true,
    billingLegalName: user ? user.businessName : 'Apollo Pharmacy Retail Pvt Ltd',
    billingGstin: user ? user.gstin : '07AAAAA0000A1Z5',
    billingPan: user ? user.pan : 'AAAAA0000A',
    paymentMethod: '30-Day Credit Terms (Approved)'
  };

  el.appendChild(renderBackHeader('Wholesale B2B Checkout', () => {
    if (currentStep > 1 && currentStep < 5) {
      currentStep--;
      renderStep();
    } else {
      navigate('wholesale/cart');
    }
  }));

  const container = document.createElement('div');
  container.style.padding = '16px 20px 100px';
  container.style.maxWidth = '640px';
  container.style.margin = '0 auto';
  el.appendChild(container);

  function renderStep() {
    container.innerHTML = `
      <!-- Stepper Indicator -->
      ${currentStep < 5 ? `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; background:#ffffff; padding:12px 16px; border-radius:12px; border:1px solid #e2e8f0; font-size:11px; font-weight:700">
          <span style="color:${currentStep >= 1 ? '#0d9488' : '#94a3b8'}">1. Receiving Bay</span>
          <span>→</span>
          <span style="color:${currentStep >= 2 ? '#0d9488' : '#94a3b8'}">2. Tax Billing</span>
          <span>→</span>
          <span style="color:${currentStep >= 3 ? '#0d9488' : '#94a3b8'}">3. Order Audit</span>
          <span>→</span>
          <span style="color:${currentStep >= 4 ? '#0d9488' : '#94a3b8'}">4. Payment Terms</span>
        </div>
      ` : ''}
    `;

    if (currentStep === 1) {
      // Step 1: Receiving Dock / Shipping Facility
      container.innerHTML += `
        <div class="card" style="padding:20px; border-radius:14px">
          <h3 style="font-size:16px; font-weight:800; color:#0f3647; margin-bottom:14px">
            Step 1 — Delivery Facility & Receiving Bay
          </h3>
          <p style="font-size:12px; color:#64748b; margin-bottom:16px">
            Heavy cargo & carton lots will be dispatched via Blue Dart / GATI B2B Surface Logistics.
          </p>

          <div style="display:flex; flex-direction:column; gap:12px">
            <div>
              <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">Facility / Department Name</label>
              <input type="text" id="chk-facility" value="${checkoutState.facility}" class="input" style="width:100%">
            </div>

            <div>
              <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">Warehouse Street Address</label>
              <textarea id="chk-address" rows="2" class="input" style="width:100%">${checkoutState.shippingAddress}</textarea>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px">
              <div>
                <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">City</label>
                <input type="text" id="chk-city" value="${checkoutState.city}" class="input" style="width:100%">
              </div>
              <div>
                <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">State</label>
                <input type="text" id="chk-state" value="${checkoutState.state}" class="input" style="width:100%">
              </div>
              <div>
                <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">PIN Code</label>
                <input type="text" id="chk-pincode" value="${checkoutState.pincode}" class="input" style="width:100%">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
              <div>
                <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">Receiving Gate Incharge</label>
                <input type="text" id="chk-contact" value="${checkoutState.contactPerson}" class="input" style="width:100%">
              </div>
              <div>
                <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">Contact Mobile</label>
                <input type="tel" id="chk-phone" value="${checkoutState.contactPhone}" class="input" style="width:100%">
              </div>
            </div>
          </div>

          <button id="btn-to-step2" class="btn btn-primary btn-pill" style="width:100%; padding:12px; font-weight:800; margin-top:20px">
            Continue to Billing Details →
          </button>
        </div>
      `;

      container.querySelector('#btn-to-step2').addEventListener('click', () => {
        checkoutState.facility = container.querySelector('#chk-facility').value;
        checkoutState.shippingAddress = container.querySelector('#chk-address').value;
        checkoutState.city = container.querySelector('#chk-city').value;
        checkoutState.state = container.querySelector('#chk-state').value;
        checkoutState.pincode = container.querySelector('#chk-pincode').value;
        checkoutState.contactPerson = container.querySelector('#chk-contact').value;
        checkoutState.contactPhone = container.querySelector('#chk-phone').value;
        currentStep = 2;
        renderStep();
      });

    } else if (currentStep === 2) {
      // Step 2: Billing & GSTIN
      container.innerHTML += `
        <div class="card" style="padding:20px; border-radius:14px">
          <h3 style="font-size:16px; font-weight:800; color:#0f3647; margin-bottom:14px">
            Step 2 — Legal Billing & GSTIN Pass-Through
          </h3>

          <div style="display:flex; align-items:center; gap:8px; margin-bottom:16px; background:#f8fafc; padding:10px 14px; border-radius:8px">
            <input type="checkbox" id="chk-same-billing" ${checkoutState.sameBilling ? 'checked' : ''}>
            <label for="chk-same-billing" style="font-size:12px; font-weight:700; color:#0f172a; cursor:pointer">
              Billing address is same as delivery facility
            </label>
          </div>

          <div style="display:flex; flex-direction:column; gap:12px">
            <div>
              <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">Registered Entity Legal Name</label>
              <input type="text" id="chk-bill-legal" value="${checkoutState.billingLegalName}" class="input" style="width:100%">
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
              <div>
                <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">GSTIN Number</label>
                <input type="text" id="chk-bill-gstin" value="${checkoutState.billingGstin}" class="input" style="width:100%; text-transform:uppercase">
              </div>
              <div>
                <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px">PAN Number</label>
                <input type="text" id="chk-bill-pan" value="${checkoutState.billingPan}" class="input" style="width:100%; text-transform:uppercase">
              </div>
            </div>

            <div style="font-size:11px; color:#16a34a; background:#f0fdf4; padding:8px 12px; border-radius:6px; border:1px solid #bbf7d0">
              ✓ Verified GSTIN: 18% Input Tax Credit (ITC) will be reflected in your GSTR-2B.
            </div>
          </div>

          <div style="display:flex; gap:10px; margin-top:20px">
            <button id="btn-back-step1" class="btn btn-secondary btn-pill" style="flex:1; padding:12px">Back</button>
            <button id="btn-to-step3" class="btn btn-primary btn-pill" style="flex:2; padding:12px; font-weight:800">Continue to Order Audit →</button>
          </div>
        </div>
      `;

      container.querySelector('#btn-back-step1').addEventListener('click', () => {
        currentStep = 1;
        renderStep();
      });

      container.querySelector('#btn-to-step3').addEventListener('click', () => {
        checkoutState.sameBilling = container.querySelector('#chk-same-billing').checked;
        checkoutState.billingLegalName = container.querySelector('#chk-bill-legal').value;
        checkoutState.billingGstin = container.querySelector('#chk-bill-gstin').value;
        checkoutState.billingPan = container.querySelector('#chk-bill-pan').value;
        currentStep = 3;
        renderStep();
      });

    } else if (currentStep === 3) {
      // Step 3: Order Summary & Review
      container.innerHTML += `
        <div class="card" style="padding:20px; border-radius:14px">
          <h3 style="font-size:16px; font-weight:800; color:#0f3647; margin-bottom:14px">
            Step 3 — Review Wholesale Order Audit
          </h3>

          <div style="max-height:220px; overflow-y:auto; border:1px solid #e2e8f0; border-radius:10px; padding:10px; margin-bottom:14px">
            ${summary.itemDetails.map(it => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #f1f5f9; font-size:12px">
                <div>
                  <div style="font-weight:700; color:#0f172a">${it.product.name}</div>
                  <div style="color:#64748b">${it.qty} units @ ${formatPrice(it.unitPrice)} ea (Size: ${it.size})</div>
                </div>
                <div style="font-weight:800; color:#0f3647">${formatPrice(it.itemTotal)}</div>
              </div>
            `).join('')}
          </div>

          <!-- Totals -->
          <div style="display:flex; flex-direction:column; gap:6px; font-size:12px; background:#f8fafc; padding:12px; border-radius:8px">
            <div style="display:flex; justify-content:space-between">
              <span>Wholesale Base Subtotal:</span>
              <span>${formatPrice(summary.subtotal)}</span>
            </div>
            ${summary.tierRebate > 0 ? `
              <div style="display:flex; justify-content:space-between; color:#2563eb; font-weight:600">
                <span>Tier Rebate (${summary.tierDiscountPercent}%):</span>
                <span>- ${formatPrice(summary.tierRebate)}</span>
              </div>
            ` : ''}
            <div style="display:flex; justify-content:space-between">
              <span>GST (18% Pass-Through):</span>
              <span>${formatPrice(summary.gstAmount)}</span>
            </div>
            <div style="display:flex; justify-content:space-between">
              <span>Logistics Freight:</span>
              <span style="color:#16a34a; font-weight:700">${summary.shipping === 0 ? 'FREE B2B FREIGHT' : formatPrice(summary.shipping)}</span>
            </div>
            <div style="border-top:1px solid #cbd5e1; padding-top:6px; margin-top:2px; display:flex; justify-content:space-between; font-size:15px; font-weight:800; color:#0f3647">
              <span>Total Payable:</span>
              <span>${formatPrice(summary.finalTotal)}</span>
            </div>
          </div>

          <div style="display:flex; gap:10px; margin-top:20px">
            <button id="btn-back-step2" class="btn btn-secondary btn-pill" style="flex:1; padding:12px">Back</button>
            <button id="btn-to-step4" class="btn btn-primary btn-pill" style="flex:2; padding:12px; font-weight:800">Select Payment Terms →</button>
          </div>
        </div>
      `;

      container.querySelector('#btn-back-step2').addEventListener('click', () => {
        currentStep = 2;
        renderStep();
      });

      container.querySelector('#btn-to-step4').addEventListener('click', () => {
        currentStep = 4;
        renderStep();
      });

    } else if (currentStep === 4) {
      // Step 4: Payment Terms
      container.innerHTML += `
        <div class="card" style="padding:20px; border-radius:14px">
          <h3 style="font-size:16px; font-weight:800; color:#0f3647; margin-bottom:14px">
            Step 4 — Select Payment Method / Credit Terms
          </h3>

          <div style="display:flex; flex-direction:column; gap:10px" id="payment-options">
            <label class="card" style="padding:14px; border-radius:10px; display:flex; align-items:flex-start; gap:10px; cursor:pointer; border:2px solid #0d9488; background:#f0fdfa">
              <input type="radio" name="pay-method" value="30-Day Credit Terms (Approved)" checked style="margin-top:2px">
              <div>
                <div style="font-size:13px; font-weight:700; color:#0f172a">30-Day Pre-Approved B2B Credit (Net 30)</div>
                <div style="font-size:11px; color:#64748b">Invoice issued with 30 days settlement window. Utilizes approved credit limit.</div>
              </div>
            </label>

            <label class="card" style="padding:14px; border-radius:10px; display:flex; align-items:flex-start; gap:10px; cursor:pointer">
              <input type="radio" name="pay-method" value="Bank Transfer (NEFT/RTGS)" style="margin-top:2px">
              <div>
                <div style="font-size:13px; font-weight:700; color:#0f172a">NEFT / RTGS Corporate Bank Transfer</div>
                <div style="font-size:11px; color:#64748b">Direct virtual account transfer: HDFC Bank / OrthoCare B2B Virtual AC</div>
              </div>
            </label>

            <label class="card" style="padding:14px; border-radius:10px; display:flex; align-items:flex-start; gap:10px; cursor:pointer">
              <input type="radio" name="pay-method" value="UPI Corporate Business" style="margin-top:2px">
              <div>
                <div style="font-size:13px; font-weight:700; color:#0f172a">Corporate UPI / Dynamic QR Code</div>
                <div style="font-size:11px; color:#64748b">Instant authorization via BHIM UPI, PhonePe Business, or Google Pay</div>
              </div>
            </label>

            <label class="card" style="padding:14px; border-radius:10px; display:flex; align-items:flex-start; gap:10px; cursor:pointer">
              <input type="radio" name="pay-method" value="Corporate Purchasing Card" style="margin-top:2px">
              <div>
                <div style="font-size:13px; font-weight:700; color:#0f172a">Corporate Visa / Mastercard Purchasing Card</div>
                <div style="font-size:11px; color:#64748b">Standard commercial credit/debit card processing</div>
              </div>
            </label>

            <label class="card" style="padding:14px; border-radius:10px; display:flex; align-items:flex-start; gap:10px; cursor:pointer">
              <input type="radio" name="pay-method" value="Payment on Facility Dispatch (POD)" style="margin-top:2px">
              <div>
                <div style="font-size:13px; font-weight:700; color:#0f172a">Payment on Delivery (POD / Verified Clinics)</div>
                <div style="font-size:11px; color:#64748b">Settlement upon physical master carton receiving at loading dock</div>
              </div>
            </label>
          </div>

          <div style="display:flex; gap:10px; margin-top:20px">
            <button id="btn-back-step3" class="btn btn-secondary btn-pill" style="flex:1; padding:12px">Back</button>
            <button id="btn-place-order" class="btn btn-primary btn-pill" style="flex:2; padding:12px; font-weight:800; font-size:14px; background:#047857">
              Confirm & Place Wholesale Order →
            </button>
          </div>
        </div>
      `;

      container.querySelector('#btn-back-step3').addEventListener('click', () => {
        currentStep = 3;
        renderStep();
      });

      container.querySelectorAll('input[name="pay-method"]').forEach(radio => {
        radio.addEventListener('change', () => {
          checkoutState.paymentMethod = radio.value;
          container.querySelectorAll('#payment-options label').forEach(lbl => {
            lbl.style.border = '1px solid #e2e8f0';
            lbl.style.background = '#ffffff';
          });
          radio.closest('label').style.border = '2px solid #0d9488';
          radio.closest('label').style.background = '#f0fdfa';
        });
      });

      container.querySelector('#btn-place-order').addEventListener('click', () => {
        const placedOrder = store.placeWholesaleOrder({
          paymentMethod: checkoutState.paymentMethod,
          shippingAddress: {
            facility: checkoutState.facility,
            address: checkoutState.shippingAddress,
            city: checkoutState.city,
            state: checkoutState.state,
            pincode: checkoutState.pincode,
            contact: `${checkoutState.contactPerson} (${checkoutState.contactPhone})`
          },
          billingAddress: {
            legalName: checkoutState.billingLegalName,
            address: checkoutState.shippingAddress,
            city: checkoutState.city,
            state: checkoutState.state,
            pincode: checkoutState.pincode,
            gstin: checkoutState.billingGstin,
            pan: checkoutState.billingPan
          }
        });

        currentStep = 5;
        renderConfirmation(placedOrder);
      });

    }
  }

  function renderConfirmation(order) {
    container.innerHTML = `
      <div style="text-align:center; padding:30px 10px">
        <div style="width:72px; height:72px; border-radius:50%; background:#dcfce7; color:#16a34a; font-size:36px; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; box-shadow:0 6px 20px rgba(22, 163, 74, 0.2)">
          ✓
        </div>
        <span class="b2b-badge verified" style="margin-bottom:8px">Wholesale PO Confirmed</span>
        <h2 style="font-size:24px; font-weight:900; color:#0f172a; margin:8px 0 4px">Wholesale Order Placed Successfully!</h2>
        <div style="font-size:16px; font-weight:800; color:#0d9488; margin-bottom:12px">
          Order Number: <strong>${order.id}</strong>
        </div>
        <p style="font-size:13px; color:#64748b; max-width:440px; margin:0 auto 20px">
          Tax Invoice <strong>INV-${order.id}</strong> generated. Master cartons are allocated at warehouse for dispatch to <strong>${order.shippingAddress.facility}</strong>.
        </p>

        <!-- Order Snapshot Card -->
        <div class="card" style="padding:16px; border-radius:12px; text-align:left; margin-bottom:24px; font-size:13px">
          <div style="display:flex; justify-content:space-between; margin-bottom:6px">
            <span style="color:#64748b">Invoice Total:</span>
            <span style="font-weight:800; color:#0f172a">${formatPrice(order.total)}</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:6px">
            <span style="color:#64748b">Payment Mode:</span>
            <span style="font-weight:600">${order.paymentMethod}</span>
          </div>
          <div style="display:flex; justify-content:space-between">
            <span style="color:#64748b">Est. Freight Arrival:</span>
            <span style="font-weight:700; color:#0d9488">2–4 Business Days</span>
          </div>
        </div>

        <!-- Buttons -->
        <div style="display:flex; flex-direction:column; gap:10px">
          <button id="btn-view-invoice-now" class="btn btn-primary btn-pill" style="padding:14px; font-weight:800; font-size:14px">
            🧾 View & Print GST Tax Invoice
          </button>
          <button id="btn-goto-b2b-orders" class="btn btn-secondary btn-pill" style="padding:12px; font-weight:700">
            View in My Wholesale Orders →
          </button>
          <button id="btn-back-dashboard" class="btn btn-pill" style="background:none; border:none; color:#64748b; font-size:12px; font-weight:600; cursor:pointer">
            Return to Wholesale Dashboard
          </button>
        </div>
      </div>
    `;

    container.querySelector('#btn-view-invoice-now')?.addEventListener('click', () => {
      showGSTTaxInvoiceModal(order);
    });

    container.querySelector('#btn-goto-b2b-orders')?.addEventListener('click', () => {
      navigate('wholesale/orders');
    });

    container.querySelector('#btn-back-dashboard')?.addEventListener('click', () => {
      navigate('wholesale/dashboard');
    });
  }

  renderStep();
  appEl.appendChild(el);
  return el;
}
