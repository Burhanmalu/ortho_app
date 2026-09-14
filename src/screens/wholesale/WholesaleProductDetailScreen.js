// ========================================
// Wholesale Product Detail Screen
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { getProductById, formatPrice, getWholesaleTierPrice } from '../../data/products.js';
import { icons } from '../../data/icons.js';
import { renderBackHeader } from '../../components/index.js';

export default function WholesaleProductDetailScreen(appEl, productId) {
  const el = document.createElement('div');
  el.className = 'screen-content';
  el.style.background = '#f8fafc';

  const product = getProductById(productId);
  if (!product) {
    el.innerHTML = '<div style="padding:40px; text-align:center">Product not found. <a href="#/wholesale/products">Back to Catalog</a></div>';
    appEl.appendChild(el);
    return el;
  }

  let selectedQty = product.moq || 10;
  let selectedSize = (product.sizes && product.sizes[0]) || 'Standard';

  el.appendChild(renderBackHeader('B2B Product Details', () => navigate('wholesale/products')));

  el.innerHTML += `
    <div style="padding-bottom:120px; max-width:680px; margin:0 auto">
      <!-- Hero Product Media -->
      <div style="background:#ffffff; border-bottom:1px solid #e2e8f0; padding:24px; text-align:center">
        <div style="width:120px; height:120px; border-radius:20px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; font-size:64px; margin:0 auto 12px">
          ${product.emoji || '🩺'}
        </div>
        <div style="display:flex; justify-content:center; gap:8px">
          <span class="moq-pill">MOQ: ${product.moq} Units</span>
          <span class="b2b-badge verified">● Clinical Grade</span>
          <span class="stock-indicator in-stock">● In Stock (${product.stock} units)</span>
        </div>
      </div>

      <div style="padding:16px 20px">
        <!-- Title & Meta -->
        <div>
          <div style="font-size:12px; font-weight:700; color:#0d9488">BRAND: ${product.brand.toUpperCase()}</div>
          <h1 style="font-size:20px; font-weight:800; color:#0f172a; margin:4px 0">${product.name}</h1>
          <div style="font-size:12px; color:#64748b">
            SKU: <strong>${product.sku}</strong> • HSN: <strong>90211000</strong> • GST: <strong>18% Pass-Through</strong>
          </div>
        </div>

        <!-- Tier Pricing Matrix Table -->
        <div class="card" style="padding:16px; border-radius:14px; margin:16px 0">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px">
            <h3 style="font-size:14px; font-weight:700; color:#0f3647">Volume Tier Pricing</h3>
            <span style="font-size:11px; color:#64748b">Retail MRP: <del>${formatPrice(product.price)}</del></span>
          </div>

          <table class="bulk-tier-table">
            <thead>
              <tr>
                <th>Tier Volume</th>
                <th>Price / Unit</th>
                <th>Savings vs Retail</th>
              </tr>
            </thead>
            <tbody>
              ${(product.bulkTiers || []).map(t => {
                const isSelected = selectedQty >= t.minQty && (t.maxQty === null || selectedQty <= t.maxQty);
                const savingsPct = Math.round(((product.price - t.price) / product.price) * 100);
                return `
                  <tr class="${isSelected ? 'active-tier' : ''}" id="tier-row-${t.minQty}">
                    <td><strong>${t.label}</strong></td>
                    <td><strong>${formatPrice(t.price)}</strong></td>
                    <td><span style="color:#16a34a; font-weight:700">${savingsPct}% OFF</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div style="font-size:11px; color:#64748b; background:#f8fafc; padding:8px; border-radius:6px">
            💡 Extra wholesale buyer tier discounts (5%–12%) applied automatically at checkout based on your account status.
          </div>
        </div>

        <!-- Packaging & Clinical Specs -->
        <div class="card" style="padding:16px; border-radius:14px; margin-bottom:16px">
          <h3 style="font-size:14px; font-weight:700; color:#0f3647; margin-bottom:12px">Packaging & Logistic Specifications</h3>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:12px">
            <div>
              <span style="color:#64748b">Master Carton Qty:</span>
              <div style="font-weight:700; color:#0f172a">${product.cartonQty || 25} Units / Box</div>
            </div>
            <div>
              <span style="color:#64748b">Packaging Type:</span>
              <div style="font-weight:700; color:#0f172a">Individual Blister Sterilization</div>
            </div>
            <div>
              <span style="color:#64748b">Bulk Dispatch Time:</span>
              <div style="font-weight:700; color:#0f172a">${product.deliveryTimeline || '2–4 Business Days'}</div>
            </div>
            <div>
              <span style="color:#64748b">Material Composition:</span>
              <div style="font-weight:700; color:#0f172a">${product.material}</div>
            </div>
          </div>
        </div>

        <!-- Bulk Quantity Selection Controls -->
        <div class="card" style="padding:16px; border-radius:14px; margin-bottom:16px">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px">
            <h3 style="font-size:14px; font-weight:700; color:#0f3647">Select Quantity & Size</h3>
            <span style="font-size:11px; color:#2563eb; font-weight:700">Min. ${product.moq} Units</span>
          </div>

          <!-- Size Pills -->
          <div style="margin-bottom:14px">
            <label style="font-size:12px; color:#64748b; font-weight:600; display:block; margin-bottom:6px">Size:</label>
            <div style="display:flex; gap:8px">
              ${(product.sizes || ['M']).map(sz => `
                <button class="btn-size ${sz === selectedSize ? 'active' : ''}" data-size="${sz}" style="padding:6px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; background:${sz === selectedSize ? '#0f3647' : '#ffffff'}; color:${sz === selectedSize ? '#ffffff' : '#334155'}">
                  ${sz}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Quantity Stepper -->
          <div>
            <label style="font-size:12px; color:#64748b; font-weight:600; display:block; margin-bottom:6px">Order Quantity (Units):</label>
            <div style="display:flex; gap:10px; align-items:center">
              <button id="btn-qty-minus" style="width:40px; height:40px; border-radius:8px; border:1px solid #cbd5e1; background:#ffffff; font-size:18px; font-weight:700; cursor:pointer">-</button>
              <input type="number" id="detail-qty-input" value="${selectedQty}" min="${product.moq}" style="width:80px; height:40px; text-align:center; font-size:16px; font-weight:800; border:1px solid #cbd5e1; border-radius:8px">
              <button id="btn-qty-plus" style="width:40px; height:40px; border-radius:8px; border:1px solid #cbd5e1; background:#ffffff; font-size:18px; font-weight:700; cursor:pointer">+</button>

              <!-- Quick Presets -->
              <div style="display:flex; gap:6px; margin-left:auto">
                <button class="btn-preset" data-qty="${product.moq}">MOQ (${product.moq})</button>
                <button class="btn-preset" data-qty="25">25</button>
                <button class="btn-preset" data-qty="50">50</button>
                <button class="btn-preset" data-qty="100">100</button>
              </div>
            </div>
          </div>

          <!-- Real-Time Calculation Preview -->
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:12px; margin-top:14px; display:flex; justify-content:space-between; align-items:center">
            <div>
              <div style="font-size:11px; color:#166534">Calculated Unit Rate:</div>
              <div style="font-size:16px; font-weight:800; color:#15803d" id="calc-unit-rate">
                ${formatPrice(getWholesaleTierPrice(product, selectedQty))} / unit
              </div>
            </div>
            <div style="text-align:right">
              <div style="font-size:11px; color:#166534">Subtotal:</div>
              <div style="font-size:18px; font-weight:800; color:#0f172a" id="calc-subtotal">
                ${formatPrice(getWholesaleTierPrice(product, selectedQty) * selectedQty)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sticky Bottom Action CTA -->
      <div style="position:fixed; bottom:0; left:0; right:0; background:#ffffff; border-top:1px solid #e2e8f0; padding:12px 20px; display:flex; gap:12px; z-index:100; max-width:680px; margin:0 auto">
        <button id="btn-add-bulk-cart" class="btn btn-secondary" style="flex:1; padding:14px; font-weight:700; border:1px solid #cbd5e1">
          + Add to Bulk Cart
        </button>
        <button id="btn-instant-bulk-order" class="btn btn-primary" style="flex:1; padding:14px; font-weight:700">
          Instant Order →
        </button>
      </div>
    </div>
  `;

  const qtyInput = el.querySelector('#detail-qty-input');
  const unitRateEl = el.querySelector('#calc-unit-rate');
  const subtotalEl = el.querySelector('#calc-subtotal');

  function updateCalculations() {
    let q = Number(qtyInput.value) || product.moq;
    if (q < product.moq) q = product.moq;
    selectedQty = q;
    qtyInput.value = q;

    const unitPrice = getWholesaleTierPrice(product, selectedQty);
    const subtotal = unitPrice * selectedQty;
    unitRateEl.textContent = `${formatPrice(unitPrice)} / unit`;
    subtotalEl.textContent = formatPrice(subtotal);

    // Highlight active tier
    (product.bulkTiers || []).forEach(t => {
      const row = el.querySelector(`#tier-row-${t.minQty}`);
      if (row) {
        if (selectedQty >= t.minQty && (t.maxQty === null || selectedQty <= t.maxQty)) {
          row.classList.add('active-tier');
        } else {
          row.classList.remove('active-tier');
        }
      }
    });
  }

  el.querySelector('#btn-qty-minus').addEventListener('click', () => {
    qtyInput.value = Math.max(product.moq, Number(qtyInput.value) - 5);
    updateCalculations();
  });

  el.querySelector('#btn-qty-plus').addEventListener('click', () => {
    qtyInput.value = Number(qtyInput.value) + 5;
    updateCalculations();
  });

  qtyInput.addEventListener('change', updateCalculations);

  el.querySelectorAll('.btn-preset').forEach(btn => {
    btn.style.padding = '4px 8px';
    btn.style.border = '1px solid #cbd5e1';
    btn.style.borderRadius = '6px';
    btn.style.fontSize = '11px';
    btn.style.fontWeight = '700';
    btn.style.cursor = 'pointer';
    btn.style.background = '#ffffff';

    btn.addEventListener('click', () => {
      qtyInput.value = Number(btn.dataset.qty);
      updateCalculations();
    });
  });

  el.querySelectorAll('.btn-size').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.btn-size').forEach(b => {
        b.style.background = '#ffffff';
        b.style.color = '#334155';
      });
      btn.style.background = '#0f3647';
      btn.style.color = '#ffffff';
      selectedSize = btn.dataset.size;
    });
  });

  el.querySelector('#btn-add-bulk-cart').addEventListener('click', () => {
    store.addToWholesaleCart(product.id, selectedQty, selectedSize);
  });

  el.querySelector('#btn-instant-bulk-order').addEventListener('click', () => {
    store.addToWholesaleCart(product.id, selectedQty, selectedSize);
    navigate('wholesale/cart');
  });

  appEl.appendChild(el);
  return el;
}
