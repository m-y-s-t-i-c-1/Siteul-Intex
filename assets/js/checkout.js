function getLang() {
    return localStorage['intex_language'] || 'ro';
}

function getProductTitle(product) {
    const lang = getLang();
    if (typeof product.title === 'object' && product.title[lang]) {
        return product.title[lang];
    }
    if (typeof product.title === 'object') {
        return product.title.ro || product.title.ru || product.title.en || 'Product';
    }
    return product.title || 'Product';
}

function initCheckout() {
    displayCheckoutItems();
    setupFormSubmit();
    restoreLanguage();
}

function displayCheckoutItems() {
    const cart = JSON.parse(localStorage['intex_cart'] || '[]');
    const container = document.getElementById('checkout-items-container');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (cart.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.padding = '20px';
        emptyMsg.style.color = 'var(--text-secondary)';
        const lang = getLang();
        const t = (window.translations && window.translations[lang]) ? window.translations[lang] : (window.translations && window.translations.ro) || {};
        emptyMsg.textContent = t.cart_empty || 'Coșul este gol';
        container.appendChild(emptyMsg);
        return;
    }
    
    let subtotal = 0;
    const allProducts = getAllProducts();
    console.log('[DEBUG Checkout] Total products available:', allProducts.length);
    console.log('[DEBUG Checkout] Cart items:', cart.length);
    
    cart.forEach((cartItem, index) => {
        console.log(`[DEBUG Checkout] Looking for product with id: ${cartItem.id}`);
        const product = allProducts.find(p => {
            const match = p.id === cartItem.id || p.id.toString() === cartItem.id.toString();
            if (match) console.log(`[DEBUG Checkout] Found product:`, p.title);
            return match;
        });
        
        if (!product) {
            console.warn(`[DEBUG Checkout] Product not found for cart item:`, cartItem.id);
            return;
        }
        
        const title = getProductTitle(product);
        const price = product.price || 0;
        const qty = cartItem.qty || 1;
        const itemTotal = price * qty;
        subtotal += itemTotal;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'checkout-item';
        itemEl.innerHTML = `
            <span class="checkout-item-name">${title}</span>
            <span class="checkout-item-qty">x${qty}</span>
            <span class="checkout-item-price">${itemTotal.toFixed(2)} LEI</span>
        `;
        container.appendChild(itemEl);
    });
    
    console.log('[DEBUG Checkout] Subtotal calculated:', subtotal);
    updateTotals(subtotal);
}

function updateTotals(subtotal) {
    const totalEl = document.getElementById('checkout-total');
    
    if (totalEl) totalEl.textContent = subtotal.toFixed(2) + ' LEI';
}

function getShippingCost() {
    return 0.00;
}

function updateShipping() {
    const cart = JSON.parse(localStorage['intex_cart'] || '[]');
    let subtotal = 0;
    const allProducts = getAllProducts();
    
    cart.forEach(cartItem => {
        const product = allProducts.find(p => p.id === cartItem.id);
        if (product) {
            subtotal += (product.price || 0) * (cartItem.qty || 1);
        }
    });
    
    updateTotals(subtotal);
}

function setupFormSubmit() {
    const form = document.getElementById('checkout-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitOrder();
    });
}

function submitOrder() {
    const form = document.getElementById('checkout-form');
    
    if (!form.checkValidity()) {
        const lang = getLang();
        const t = (window.translations && window.translations[lang]) ? window.translations[lang] : (window.translations && window.translations.ro) || {};
        alert(t.fill_required || 'Completați toate câmpurile obligatorii!');
        return;
    }
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        city: document.getElementById('city').value,
        address: document.getElementById('address').value,
        postal: document.getElementById('postal').value,
        payment: document.querySelector('input[name="payment"]:checked').value,
        notes: document.getElementById('notes').value,
        cart: JSON.parse(localStorage['intex_cart'] || '[]'),
        timestamp: new Date().toISOString()
    };
    
    const orders = JSON.parse(localStorage['intex_orders'] || '[]');
    orders.push(formData);
    localStorage['intex_orders'] = JSON.stringify(orders);
    
    localStorage['intex_cart'] = JSON.stringify([]);
    
    if (window.showSuccessI18n) {
        window.showSuccessI18n('order_placed_toast');
    } else if (window.showSuccess) {
        const lang = getLang();
        const t = (window.translations && window.translations[lang]) ? window.translations[lang] : (window.translations && window.translations.ro) || {};
        window.showSuccess(t.order_placed_toast || 'Comanda a fost plasată cu succes!');
    }

    try {
        const existing = document.querySelector('.order-confirmation');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.className = 'order-confirmation';
        const orderId = 'ORD-' + Date.now().toString().slice(-6);
        const lang = getLang();
        const t = (window.translations && window.translations[lang]) ? window.translations[lang] : (window.translations && window.translations.ro) || {};
        const titleText = t.order_confirm_title || 'Comanda a fost plasată!';
        const messageText = (t.order_confirm_message || 'Mulțumim pentru cumpărături. Comanda ta ({orderId}) a fost înregistrată. Vei fi contactat în curând pentru confirmare și detalii de livrare.').replace('{orderId}', orderId);
        modal.innerHTML = `
            <div class="order-confirmation-card">
                <button class="order-confirm-close" aria-label="Închide">&times;</button>
                <div class="order-confirm-icon">✓</div>
                <h2>${titleText}</h2>
                <p>${messageText}</p>
                <div class="order-confirm-actions">
                    <button class="btn-main" id="oc-view-orders">${t.order_view_orders || 'Vezi comenzile'}</button>
                    <button class="btn-main btn-ghost" id="oc-continue">${t.order_continue || 'Continuă cumpărăturile'}</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        modal.querySelector('.order-confirm-close').addEventListener('click', () => {
            modal.remove(); document.body.style.overflow = '';
            window.location.href = './produse.html';
        });
        modal.querySelector('#oc-continue').addEventListener('click', () => {
            modal.remove(); document.body.style.overflow = '';
            window.location.href = './produse.html';
        });
        modal.querySelector('#oc-view-orders').addEventListener('click', () => {
            modal.remove(); document.body.style.overflow = '';
            window.location.href = './produse.html';
        });
    } catch (e) {
        window.location.href = './produse.html';
    }
}

function getAllProducts() {
    if (typeof getAllProductsWithDescriptions === 'function') {
        console.log('[DEBUG Checkout] Using getAllProductsWithDescriptions from descrieri_produse.js');
        const allProducts = getAllProductsWithDescriptions();
        const accessoryAliases = ['accessories', 'swim-accessories', 'boats_pool_accessories', 'boats_care', 'pool_accessories'];
        
        return allProducts.map(p => {
            let cat = p.category;
            if (cat === 'pools') cat = 'baseine_intex';
            if (accessoryAliases.includes(cat)) cat = 'swim-accessories';
            return { 
                ...p, 
                category: cat 
            };
        });
    }
    
    console.log('[DEBUG Checkout] getAllProductsWithDescriptions NOT available, using fallback');
    
    const list = [];
    const accessoryAliases = ['accessories', 'swim-accessories', 'boats_pool_accessories', 'boats_care', 'pool_accessories'];
    
    if (typeof PRODUCTS_DATA !== 'undefined') {
        PRODUCTS_DATA.forEach(p => {
            let cat = p.category;
            if (cat === 'pools') cat = 'baseine_intex';
            if (accessoryAliases.includes(cat)) cat = 'swim-accessories';
            const newProd = Object.assign({}, p, { 
                category: cat
            });
            list.push(newProd);
        });
    }

    if (typeof POOLS_PRODUCTS !== 'undefined' && POOLS_PRODUCTS.pools) {
        POOLS_PRODUCTS.pools.forEach(p => {
            const pSub = (p.sub || p.subcategory || '').toString();
            const isAccessorySub = accessoryAliases.includes(pSub);

            const item = Object.assign({
                id: p.id || ('pool_' + Math.random().toString(36).slice(2, 9)),
                category: isAccessorySub ? 'swim-accessories' : 'baseine_intex',
                subcategory: p.sub || p.subcategory || null,
                title: p.title,
                price: p.price || 0,
                oldPrice: p.oldPrice || null,
                __fromPools: true
            }, p);

            list.push(item);
        });
    }

    if (typeof enhanceExistingProducts === 'function') {
        try { 
            console.log('[DEBUG Checkout] Using enhanceExistingProducts, list length before:', list.length);
            const enhanced = enhanceExistingProducts(list);
            console.log('[DEBUG Checkout] List enhanced, first product description:', enhanced[0]?.description?.substring(0, 50));
            return enhanced;
        } catch (e) { console.log('[DEBUG Checkout] enhanceExistingProducts error:', e.message); }
    }

    return list;
}

function restoreLanguage() {
    const lang = getLang();
    const langSelect = document.getElementById('language-select');
    if (langSelect) {
        langSelect.value = lang;
    }
}

document.addEventListener('DOMContentLoaded', initCheckout);
