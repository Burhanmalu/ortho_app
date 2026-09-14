// ========================================
// Product Detail Screen — OrthoCare
// Medical-Grade Progressive Disclosure with Accordions
// ========================================

import { navigate } from '../router.js';
import { getProductById, formatPrice } from '../data/products.js';
import { icons, renderStars } from '../data/icons.js';
import * as store from '../store.js';
import { renderBackHeader } from '../components/index.js';

export default function ProductDetailScreen(appEl, productId) {
  const product = getProductById(productId);
  if (!product) { navigate('home'); return { unmount() {} }; }

  store.addRecentlyViewed(productId);

  const el = document.createElement('div');
  el.className = 'screen';
  el.style.paddingBottom = '100px';

  let selectedSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Universal';
  const inWishlist = store.isInWishlist(product.id);

  // 1. Compact Header
  const header = renderBackHeader(product.brand || 'OrthoCare', `
    <button class="back-btn" id="pd-wishlist" aria-label="Wishlist" style="color:${inWishlist ? 'var(--danger)' : 'var(--text)'}">
      ${inWishlist ? icons.heartFilled : icons.heart}
    </button>
  `);
  el.appendChild(header);

  // 2. Product Image
  const imgContainer = document.createElement('div');
  imgContainer.style.background = '#FFFFFF';
  imgContainer.style.borderBottom = '1px solid var(--border)';
  imgContainer.style.padding = '20px';
  imgContainer.style.display = 'flex';
  imgContainer.style.alignItems = 'center';
  imgContainer.style.justifyContent = 'center';
  imgContainer.style.minHeight = '280px';
  imgContainer.style.position = 'relative';

  if (product.discount > 0) {
    imgContainer.innerHTML = `<span class="product-card-discount" style="top:16px;left:16px">${product.discount}% OFF</span>`;
  }
  const imgEl = document.createElement('img');
  imgEl.src = product.images && product.images.length > 0 ? product.images[0] : '';
  imgEl.alt = product.name;
  imgEl.style.maxHeight = '260px';
  imgEl.style.objectFit = 'contain';
  imgContainer.appendChild(imgEl);
  el.appendChild(imgContainer);

  // 3. Primary Product Info (Name, Rating, Price, Stock, Delivery)
  const infoSection = document.createElement('div');
  infoSection.style.padding = '16px';
  infoSection.style.background = '#FFFFFF';
  infoSection.style.borderBottom = '1px solid var(--border)';

  infoSection.innerHTML = `
    <div style="font-size:12px;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">
      ${product.brand || 'OrthoCare'} • ${product.category || 'Support'}
    </div>
    <h1 style="font-size:18px;font-weight:700;color:var(--text);line-height:1.35;margin-bottom:8px">
      ${product.name}
    </h1>

    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <div style="display:flex;align-items:center;gap:4px;font-size:12px;font-weight:700;color:var(--text)">
        ${renderStars(product.rating || 4.5)}
        <span>${product.rating || 4.5}</span>
      </div>
      <span style="font-size:12px;color:var(--text-secondary)">• ${(product.reviews || 120).toLocaleString()} Clinical Reviews</span>
    </div>

    <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:14px">
      <span style="font-family:var(--font-heading);font-size:24px;font-weight:700;color:var(--text)">
        ${formatPrice(product.price)}
      </span>
      ${product.mrp > product.price ? `
        <span style="font-size:14px;color:var(--text-tertiary);text-decoration:line-through">
          ${formatPrice(product.mrp)}
        </span>
      ` : ''}
      <span class="status-pill ${product.inStock ? 'success' : 'danger'}">
        ${product.inStock ? 'In Stock' : 'Out of Stock'}
      </span>
    </div>

    <!-- Size Selection -->
    ${product.sizes && product.sizes.length > 0 ? `
      <div style="margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <label style="font-size:12px;font-weight:700;color:var(--text)">Select Anatomical Size:</label>
          <span style="font-size:11px;font-weight:600;color:var(--primary)">Fit Guaranteed</span>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap" id="size-pill-group">
          ${product.sizes.map(s => `
            <button class="btn btn-secondary btn-sm size-btn ${s === selectedSize ? 'active' : ''}" data-size="${s}" style="${s === selectedSize ? 'background:var(--primary);color:#fff;border-color:var(--primary)' : ''}">
              ${s}
            </button>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Delivery Strip -->
    <div style="background:var(--background);border-radius:var(--radius-md);padding:12px;display:flex;align-items:center;gap:12px">
      <div style="color:var(--primary)">${icons.truck}</div>
      <div style="font-size:12px">
        <div style="font-weight:700;color:var(--text)">Free Express Medical Delivery</div>
        <div style="color:var(--text-secondary)">Estimated arrival: <strong>${product.deliveryDays || 3} Business Days</strong> to Indore</div>
      </div>
    </div>
  `;

  infoSection.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedSize = btn.dataset.size;
      infoSection.querySelectorAll('.size-btn').forEach(b => {
        b.style.background = '#FFFFFF';
        b.style.color = 'var(--primary)';
        b.style.borderColor = 'var(--border)';
      });
      btn.style.background = 'var(--primary)';
      btn.style.color = '#FFFFFF';
      btn.style.borderColor = 'var(--primary)';
    });
  });
  el.appendChild(infoSection);

  // 4. Clinical Highlights
  if (product.highlights && product.highlights.length > 0) {
    const hlSection = document.createElement('div');
    hlSection.style.padding = '16px';
    hlSection.style.background = '#FFFFFF';
    hlSection.style.marginTop = '10px';
    hlSection.style.borderTop = '1px solid var(--border)';
    hlSection.style.borderBottom = '1px solid var(--border)';

    hlSection.innerHTML = `
      <h3 style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:10px">Clinical Highlights</h3>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${product.highlights.map(h => `
          <div style="display:flex;align-items:flex-start;gap:8px;font-size:13px;color:var(--text)">
            <span style="color:var(--success);margin-top:2px">${icons.check}</span>
            <span>${h}</span>
          </div>
        `).join('')}
      </div>
    `;
    el.appendChild(hlSection);
  }

  // 5. Accordions Section (Specifications, Description, Care, Shipping & Returns)
  const accordionContainer = document.createElement('div');
  accordionContainer.style.marginTop = '10px';
  accordionContainer.style.background = '#FFFFFF';
  accordionContainer.style.borderTop = '1px solid var(--border)';
  accordionContainer.style.borderBottom = '1px solid var(--border)';

  const specsRows = [
    { label: 'Brand', val: product.brand },
    { label: 'SKU', val: product.sku },
    { label: 'Primary Material', val: product.material },
    ...Object.entries(product.specs || {}).map(([k, v]) => ({ label: k, val: v }))
  ];

  const accordionItems = [
    {
      id: 'acc-specs',
      title: 'Specifications & Materials',
      content: `
        <div style="display:flex;flex-direction:column;gap:6px">
          ${specsRows.map(r => `
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:6px 0;border-bottom:1px solid var(--border-light)">
              <span style="color:var(--text-secondary)">${r.label}</span>
              <strong style="color:var(--text)">${r.val}</strong>
            </div>
          `).join('')}
        </div>
      `,
      open: true
    },
    {
      id: 'acc-desc',
      title: 'Product Description & Usage',
      content: `<p style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin:0">${product.description || 'Certified ergonomic design engineered for stability and compression.'}</p>`,
      open: false
    },
    {
      id: 'acc-care',
      title: 'Care & Washing Instructions',
      content: `<p style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin:0">${product.care || 'Hand wash in cold water with mild detergent. Air dry away from direct heat.'}</p>`,
      open: false
    },
    {
      id: 'acc-returns',
      title: 'Shipping & Easy Returns',
      content: `
        <p style="font-size:13px;color:var(--text-secondary);line-height:1.5;margin:0 0 6px">
          ${product.returnPolicy || '7-day replacement guarantee for size and manufacturing defects.'}
        </p>
        <p style="font-size:12px;color:var(--text-secondary);margin:0">
          All dispatched items are hygienically inspected and sealed.
        </p>
      `,
      open: false
    }
  ];

  accordionContainer.innerHTML = accordionItems.map(item => `
    <div class="accordion-block" style="border-bottom:1px solid var(--border-light)">
      <div class="accordion-header" data-target="${item.id}" style="padding:14px 16px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;user-select:none">
        <span style="font-size:14px;font-weight:700;color:var(--text)">${item.title}</span>
        <span class="acc-chevron" style="color:var(--text-secondary);transition:transform 0.2s">${item.open ? icons.chevronUp : icons.chevronDown}</span>
      </div>
      <div class="accordion-content" id="${item.id}" style="padding:0 16px 14px;display:${item.open ? 'block' : 'none'}">
        ${item.content}
      </div>
    </div>
  `).join('');

  accordionContainer.querySelectorAll('.accordion-header').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const targetId = hdr.dataset.target;
      const contentEl = accordionContainer.querySelector(`#${targetId}`);
      const chevronEl = hdr.querySelector('.acc-chevron');
      const isVisible = contentEl.style.display === 'block';
      contentEl.style.display = isVisible ? 'none' : 'block';
      chevronEl.innerHTML = isVisible ? icons.chevronDown : icons.chevronUp;
    });
  });
  el.appendChild(accordionContainer);

  appEl.appendChild(el);

  // 6. Fixed Bottom Action Bar (Clear reserved padding)
  const stickyBar = document.createElement('div');
  stickyBar.style.position = 'fixed';
  stickyBar.style.bottom = '0';
  stickyBar.style.left = '50%';
  stickyBar.style.transform = 'translateX(-50%)';
  stickyBar.style.width = '100%';
  stickyBar.style.maxWidth = 'var(--max-width)';
  stickyBar.style.background = '#FFFFFF';
  stickyBar.style.borderTop = '1px solid var(--border)';
  stickyBar.style.boxShadow = 'var(--shadow-lg)';
  stickyBar.style.padding = '10px 16px';
  stickyBar.style.display = 'grid';
  stickyBar.style.gridTemplateColumns = '1fr 1.2fr';
  stickyBar.style.gap = '10px';
  stickyBar.style.zIndex = 'var(--z-bottom-nav)';

  stickyBar.innerHTML = `
    <button class="btn btn-secondary btn-block" id="pd-add-cart">
      ${icons.cart} Add to Cart
    </button>
    <button class="btn btn-primary btn-block" id="pd-buy-now">
      Buy Now
    </button>
  `;
  appEl.appendChild(stickyBar);

  stickyBar.querySelector('#pd-add-cart').addEventListener('click', () => {
    store.addToCart(product.id, selectedSize);
  });

  stickyBar.querySelector('#pd-buy-now').addEventListener('click', () => {
    store.addToCart(product.id, selectedSize);
    navigate('cart');
  });

  // Wishlist toggle in header
  header.querySelector('#pd-wishlist').addEventListener('click', () => {
    store.toggleWishlist(product.id);
    const btn = header.querySelector('#pd-wishlist');
    const isNow = store.isInWishlist(product.id);
    btn.innerHTML = isNow ? icons.heartFilled : icons.heart;
    btn.style.color = isNow ? 'var(--danger)' : 'var(--text)';
  });

  return {
    unmount() {
      stickyBar.remove();
    }
  };
}
