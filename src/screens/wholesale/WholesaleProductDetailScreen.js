// ========================================
// Wholesale Product Detail Screen - Redesigned
// ========================================

import { navigate } from '../../router.js';
import * as store from '../../store.js';
import { getProductById, formatPrice, getWholesaleTierPrice } from '../../data/products.js';
import { icons } from '../../data/icons.js';
import { renderBackHeader } from '../../components/index.js';

export default function WholesaleProductDetailScreen(appEl, productId) {
  const el = document.createElement('div');
  el.className = 'screen-content';
  el.style.background = 'var(--bg-light)';
  el.style.paddingBottom = '100px';

  const product = getProductById(productId);
  if (!product) {
    el.innerHTML = '<div style="padding:40px; text-align:center">Product not found. <a href="#/wholesale/products" style="color:var(--primary);font-weight:600">Back to Catalog</a></div>';
    appEl.appendChild(el);
    return el;
  }

  let selectedQty = product.moq || 10;
  let selectedSize = (product.sizes && product.sizes[0]) || 'Standard';
  const firstImg = (product.images && product.images.length > 0) ? product.images[0] : '';

  el.appendChild(renderBackHeader('B2B Product Details', () => navigate('wholesale/products')));

  const container = document.createElement('div');
  container.style.maxWidth = '680px';
  container.style.margin = '0 auto';

  container.innerHTML = `
    <!-- Hero Product Media -->
    <div style="background:var(--bg-white); border-bottom:1px solid var(--border); padding:24px 16px; text-align:center">
      <div style="width:130px; height:130px; border-radius:var(--radius-lg); background:var(--bg-light); display:flex; align-items:center; justify-content:center; margin:0 auto 14px; border:1px solid var(--border); overflow:hidden">
        ${firstImg 
          ? `<img src="${firstImg}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover" />` 
          : `<span style="width:48px;height:48px;color:var(--primary);display:inline-flex">${icons.knee}</span>`}
      </div>
      <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap">
        <span class="status-pill status-shipped" style="font-size:11px; padding:3px 10px">MOQ: ${product.moq} Units</span>
        <span class="status-pill status-active" style="font-size:11px; padding:3px 10px">
          <span class="status-pill-dot"></span>
          Clinical Certified
        </span>
        <span class="status-pill status-active" style="font-size:11px; padding:3px 10px">In Stock (${product.stock} units)</span>
      </div>
    </div>

    <div style="padding:16px">
      <!-- Title & Meta -->
      <div>
        <div style="font-size:11px; font-weight:700; color:var(--primary); letter-spacing:0.5px">BRAND: ${(product.brand || 'OrthoCare Clinical').toUpperCase()}</div>
        <h1 style="font-size:18px; font-weight:700; color:var(--text); margin:4px 0">${product.name}</h1>
        <div style="font-size:12px; color:var(--text-secondary)">
          SKU: <strong>${product.sku}</strong> • HSN: <strong>90211000</strong> • GST: <strong>18% Pass-Through ITC</strong>
        </div>
      </div>

      <!-- Tier Pricing Matrix Table -->
      <div class="card" style="padding:16px; margin:16px 0">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px">
          <h3 style="font-size:13px; font-weight:700; color:var(--deep-navy); text-transform:uppercase; letter-spacing:0.5px">Volume Tier Pricing</h3>
          <span style="font-size:11px; color:var(--text-secondary)">Retail MRP: <del>${formatPrice(product.price)}</del></span>
        </div>

        <table class="bulk-tier-table" style="width:100%; border-collapse:collapse; font-size:12px; margin-bottom:10px">
          <thead>
            <tr style="border-bottom:1px solid var(--border); text-align:left; color:var(--text-secondary)">
              <th style="padding:8px 6px">Volume Tier</th>
              <th style="padding:8px 6px">Rate / Unit</th>
              <th style="padding:8px 6px; text-align:right">Savings</th>
            </tr>
          </thead>
          <tbody>
            ${(product.bulkTiers || []).map(t => {
              const isSelected = selectedQty >= t.minQty && (t.maxQty === null || selectedQty <= t.maxQty);
              const savingsPct = Math.round(((product.price - t.price) / product.price) * 100);
              return `
                <tr class="${isSelected ? 'active-tier' : ''}" id="tier-row-${t.minQty}" style="border-bottom:1px solid var(--border); background:${isSelected ? 'rgba(57, 169, 107, 0.08)' : 'transparent'}">
                  <td style="padding:8px 6px; font-weight:600; color:var(--text)">${t.label}</td>
                  <td style="padding:8px 6px; font-weight:700; color:var(--deep-navy)">${formatPrice(t.price)}</td>
                  <td style="padding:8px 6px; text-align:right"><span style="color:var(--success); font-weight:700">${savingsPct}% OFF</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div style="font-size:11px; color:var(--text-secondary); background:var(--bg-light); padding:8px 10px; border-radius:var(--radius-sm); border:1px solid var(--border)">
          Institutional buyer rebate tiers (5% to 12%) apply automatically on total invoice volume during checkout.
        </div>
      </div>

      <!-- Packaging & Clinical Specs -->
      <div class="card" style="padding:16px; margin-bottom:16px">
        <h3 style="font-size:13px; font-weight:700; color:var(--deep-navy); margin-bottom:12px; text-transform:uppercase; letter-spacing:0.5px">Packaging & Logistic Specs</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:12px">
          <div>
            <span style="color:var(--text-secondary)">Master Carton Qty:</span>
            <div style="font-weight:700; color:var(--text); margin-top:2px">${product.cartonQty || 25} Units / Box</div>
          </div>
          <div>
            <span style="color:var(--text-secondary)">Packaging Type:</span>
            <div style="font-weight:700; color:var(--text); margin-top:2px">Clinical Blister Sterilized</div>
          </div>
          <div>
            <span style="color:var(--text-secondary)">Bulk Freight Time:</span>
            <div style="font-weight:700; color:var(--text); margin-top:2px">${product.deliveryTimeline || '2–4 Business Days'}</div>
          </div>
          <div>
            <span style="color:var(--text-secondary)">Material Composition:</span>
            <div style="font-weight:700; color:var(--text); margin-top:2px">${product.material || 'Medical Neoprene'}</div>
          </div>
        </div>
      </div>

      <!-- Bulk Quantity Selection Controls -->
      <div class="card" style="padding:16px; margin-bottom:16px">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px">
          <h3 style="font-size:13px; font-weight:700; color:var(--deep-navy); text-transform:uppercase; letter-spacing:0.5px">Select Quantity & Size</h3>
          <span style="font-size:11px; color:var(--primary); font-weight:700">Min. ${product.moq} Units</span>
        </div>

        <!-- Size Pills -->
        <div style="margin-bottom:14px">
          <label style="font-size:11px; color:var(--text-secondary); font-weight:600; display:block; margin-bottom:6px">SIZE OPTION:</label>
          <div style="display:flex; gap:8px" id="size-options">
            ${(product.sizes || ['M']).map(sz => `
              <button class="btn-size ${sz === selectedSize ? 'active' : ''}" data-size="${sz}" style="padding:6px 14px; border:1px solid ${sz === selectedSize ? 'var(--deep-navy)' : 'var(--border)'}; border-radius:var(--radius-sm); font-size:12px; font-weight:700; cursor:pointer; background:${sz === selectedSize ? 'var(--deep-navy)' : 'var(--bg-white)'}; color:${sz === selectedSize ? 'var(--text-white)' : 'var(--text)'}">
                ${sz}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Quantity Stepper -->
        <div>
          <label style="font-size:11px; color:var(--text-secondary); font-weight:600; display:block; margin-bottom:6px">ORDER QUANTITY (UNITS):</label>
          <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap">
            <button id="btn-qty-minus" style="width:38px; height:38px; border-radius:var(--radius-sm); border:1px solid var(--border); background:var(--bg-white); font-size:16px; font-weight:700; cursor:pointer">−</button>
            <input type="number" id="detail-qty-input" value="${selectedQty}" min="${product.moq}" style="width:72px; height:38px; text-align:center; font-size:15px; font-weight:700; border:1px solid var(--border); border-radius:var(--radius-sm); outline:none">
            <button id="btn-qty-plus" style="width:38px; height:38px; border-radius:var(--radius-sm); border:1px solid var(--border); background:var(--bg-white); font-size:16px; font-weight:700; cursor:pointer">+</button>

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
        <div style="background:rgba(57, 169, 107, 0.08); border:1px solid rgba(57, 169, 107, 0.25); border-radius:var(--radius-md); padding:12px; margin-top:14px; display:flex; justify-content:space-between; align-items:center">
          <div>
            <div style="font-size:11px; color:var(--success); font-weight:600">Calculated Unit Rate:</div>
            <div style="font-size:15px; font-weight:800; color:var(--deep-navy)" id="calc-unit-rate">
              ${formatPrice(getWholesaleTierPrice(product, selectedQty))} / unit
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-size:11px; color:var(--success); font-weight:600">Total Taxable Value:</div>
            <div style="font-size:16px; font-weight:800; color:var(--primary)" id="calc-subtotal">
              ${formatPrice(getWholesaleTierPrice(product, selectedQty) * selectedQty)}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Bottom Action CTA -->
    <div style="position:fixed; bottom:0; left:0; right:0; background:var(--bg-white); border-top:1px solid var(--border); padding:12px 16px; display:flex; gap:10px; z-index:45; max-width:680px; margin:0 auto; box-shadow:var(--shadow-lg)">
      <button id="btn-add-bulk-cart" class="btn btn-secondary" style="flex:1; height:44px; font-weight:700">
        Add to Bulk Cart
      </button>
      <button id="btn-instant-bulk-order" class="btn btn-primary" style="flex:1; height:44px; font-weight:700">
        Instant Order
      </button>
    </div>
  `;

  el.appendChild(container);

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
    if (unitRateEl) unitRateEl.textContent = `${formatPrice(unitPrice)} / unit`;
    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);

    (product.bulkTiers || []).forEach(t => {
      const row = el.querySelector(`#tier-row-${t.minQty}`);
      if (row) {
        if (selectedQty >= t.minQty && (t.maxQty === null || selectedQty <= t.maxQty)) {
          row.style.background = 'rgba(57, 169, 107, 0.08)';
        } else {
          row.style.background = 'transparent';
        }
      }
    });
  }

  el.querySelector('#btn-qty-minus')?.addEventListener('click', () => {
    qtyInput.value = Math.max(product.moq, Number(qtyInput.value) - 5);
    updateCalculations();
  });

  el.querySelector('#btn-qty-plus')?.addEventListener('click', () => {
    qtyInput.value = Number(qtyInput.value) + 5;
    updateCalculations();
  });

  qtyInput?.addEventListener('change', updateCalculations);

  el.querySelectorAll('.btn-preset').forEach(btn => {
    btn.style.padding = '4px 8px';
    btn.style.border = '1px solid var(--border)';
    btn.style.borderRadius = 'var(--radius-sm)';
    btn.style.fontSize = '11px';
    btn.style.fontWeight = '700';
    btn.style.cursor = 'pointer';
    btn.style.background = 'var(--bg-white)';
    btn.style.color = 'var(--text)';

    btn.addEventListener('click', () => {
      qtyInput.value = Number(btn.dataset.qty);
      updateCalculations();
    });
  });

  el.querySelectorAll('.btn-size').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.btn-size').forEach(b => {
        b.style.background = 'var(--bg-white)';
        b.style.color = 'var(--text)';
        b.style.borderColor = 'var(--border)';
      });
      btn.style.background = 'var(--deep-navy)';
      btn.style.color = 'var(--text-white)';
      btn.style.borderColor = 'var(--deep-navy)';
      selectedSize = btn.dataset.size;
    });
  });

  el.querySelector('#btn-add-bulk-cart')?.addEventListener('click', () => {
    store.addToWholesaleCart(product.id, selectedQty, selectedSize);
    store.emit('toast', { message: `${selectedQty} units added to Wholesale Cart`, type: 'success' });
  });

  el.querySelector('#btn-instant-bulk-order')?.addEventListener('click', () => {
    store.addToWholesaleCart(product.id, selectedQty, selectedSize);
    navigate('wholesale/cart');
  });

  appEl.appendChild(el);
  return el;
}
