(function() {
    'use strict';
    
    const CONFIG = {
        STORAGE_KEY: 'intex_orders',
        USER_PREFIX: 'orders_',
        DEMO_MODE: false,
        ITEMS_PER_PAGE: 6,
        DEBOUNCE_DELAY: 300,
        ANIMATION_DURATION: 300
    };


    const ORDER_STATUS = {
        PENDING: { key: 'pending', color: '#92400e', icon: 'fa-clock', text: { ro: 'În așteptare', ru: 'В ожидании', en: 'Pending' } },
        PROCESSING: { key: 'processing', color: '#1e40af', icon: 'fa-cog fa-spin', text: { ro: 'În procesare', ru: 'В обработке', en: 'Processing' } },
        SHIPPED: { key: 'shipped', color: '#3730a3', icon: 'fa-truck', text: { ro: 'Expediată', ru: 'Отправлен', en: 'Shipped' } },
        DELIVERED: { key: 'delivered', color: '#065f46', icon: 'fa-check-circle', text: { ro: 'Livrată', ru: 'Доставлен', en: 'Delivered' } },
        CANCELLED: { key: 'cancelled', color: '#991b1b', icon: 'fa-times-circle', text: { ro: 'Anulată', ru: 'Отменён', en: 'Cancelled' } },
        REFUNDED: { key: 'refunded', color: '#6b7280', icon: 'fa-undo', text: { ro: 'Rambursată', ru: 'Возвращён', en: 'Refunded' } }
    };

    const TranslationManager = {
        getCurrentLang() {
            return localStorage.getItem('intex_language') || 
                   localStorage.getItem('lang') || 
                   document.documentElement.lang || 
                   'ro';
        },

        translate(key, params = {}) {
            const lang = this.getCurrentLang();
            
            if (window.translations && window.translations[lang] && window.translations[lang][key]) {
                let text = window.translations[lang][key];
                Object.keys(params).forEach(k => {
                    text = text.replace(new RegExp(`{${k}}`, 'g'), params[k]);
                });
                return text;
            }

            const inlineTranslations = this.getInlineTranslations();
            if (inlineTranslations[lang] && inlineTranslations[lang][key]) {
                let text = inlineTranslations[lang][key];
                Object.keys(params).forEach(k => {
                    text = text.replace(new RegExp(`{${k}}`, 'g'), params[k]);
                });
                return text;
            }

            if (inlineTranslations['ro'] && inlineTranslations['ro'][key]) {
                return inlineTranslations['ro'][key];
            }

            return key;
        },

        getInlineTranslations() {
            return {
                ro: {
                    payment_method: 'Metodă de plată',
                    order_date: 'Data comenzii',
                    order_timeline: 'Istoric comandă',
                    back_to_orders: 'Înapoi la comenzi',
                    product: 'Produs',
                    quantity: 'Cantitate',
                    price: 'Preț',
                    order_details: 'Detalii',
                    track_order: 'Urmărește comanda',
                    reorder: 'Repetă comanda',
                    cancel_order: 'Anulează comanda',
                    print_order: 'Tipărește',
                    place_order: 'Plasează comanda',
                    items_count: '{count} produse',
                    order_total: 'Total comandă',
                    subtotal: 'Subtotal',
                    shipping: 'Livrare',
                    tax: 'TVA',
                    delivery_to: 'Livrare la',
                    no_orders_title: 'Nu aveți comenzi încă',
                    no_orders_text: 'Descoperiți produsele noastre și plasați prima comandă!',
                    browse_products: 'Vezi Produse',
                    auth_required: 'Trebuie să fiți autentificat',
                    login_to_view_orders: 'Conectați-vă pentru a vedea istoricul comenzilor',
                    login_btn: 'Autentificare',
                    loading_orders: 'Se încarcă comenzile...',
                    confirm_cancel: 'Sigur doriți să anulați această comandă?',
                    confirm_reorder: 'Doriți să plasați o comandă nouă cu aceleași produse?',
                    order_cancelled: 'Comanda a fost anulată cu succes',
                    order_placed_success: 'Comanda nouă a fost plasată cu succes!',
                    items_added_to_cart: 'Produsele au fost adăugate în coș',
                    order_placed_toast: 'Comanda a fost plasată cu succes!',
                    close: 'Închide',
                    new_order: 'Comandă Nouă',
                    order_from_reorder: 'Comandă plasată din recomandare'
                },
                ru: {
                    order_status_pending: 'В ожидании',
                    order_status_processing: 'В обработке',
                    order_status_shipped: 'Отправлен',
                    order_status_delivered: 'Доставлен',
                    order_status_cancelled: 'Отменён',
                    order_status_refunded: 'Возвращён',
                    order_details: 'Детали',
                    track_order: 'Отслеживание',
                    reorder: 'Повторить заказ',
                    cancel_order: 'Отменить',
                    print_order: 'Печать',
                    place_order: 'Разместить заказ',
                    items_count: '{count} товаров',
                    order_total: 'Итого',
                    subtotal: 'Подытог',
                    shipping: 'Доставка',
                    tax: 'НДС',
                    delivery_to: 'Доставка по адресу',
                    payment_method: 'Способ оплаты',
                    order_date: 'Дата заказа',
                    order_timeline: 'История заказа',
                    back_to_orders: 'Назад к заказам',
                    product: 'Товар',
                    quantity: 'Количество',
                    price: 'Цена',
                    no_orders_title: 'У вас пока нет заказов',
                    no_orders_text: 'Откройте для себя наши продукты и сделайте первый заказ!',
                    browse_products: 'Смотреть товары',
                    auth_required: 'Требуется авторизация',
                    login_to_view_orders: 'Войдите, чтобы просмотреть историю заказов',
                    login_btn: 'Вход',
                    loading_orders: 'Загрузка заказов...',
                    confirm_cancel: 'Вы уверены, что хотите отменить этот заказ?',
                    confirm_reorder: 'Хотите разместить новый заказ с теми же товарами?',
                    order_cancelled: 'Заказ успешно отменён',
                    order_placed_success: 'Новый заказ успешно размещён!',
                    items_added_to_cart: 'Товары добавлены в корзину',
                    order_placed_toast: 'Заказ успешно оформлен!',
                    close: 'Закрыть',
                    new_order: 'Новый заказ',
                    order_from_reorder: 'Заказ размещён из повторного заказа'
                },
                en: {
                    order_status_pending: 'Pending',
                    order_status_processing: 'Processing',
                    order_status_shipped: 'Shipped',
                    order_status_delivered: 'Delivered',
                    order_status_cancelled: 'Cancelled',
                    order_status_refunded: 'Refunded',
                    order_details: 'Details',
                    track_order: 'Track',
                    reorder: 'Reorder',
                    cancel_order: 'Cancel',
                    print_order: 'Print',
                    place_order: 'Place Order',
                    items_count: '{count} items',
                    order_total: 'Order Total',
                    subtotal: 'Subtotal',
                    shipping: 'Shipping',
                    tax: 'VAT',
                    delivery_to: 'Delivery to',
                    payment_method: 'Payment Method',
                    order_date: 'Order Date',
                    order_timeline: 'Order Timeline',
                    back_to_orders: 'Back to Orders',
                    product: 'Product',
                    quantity: 'Qty',
                    price: 'Price',
                    no_orders_title: 'No orders yet',
                    no_orders_text: 'Discover our products and place your first order!',
                    browse_products: 'Browse Products',
                    auth_required: 'Authentication required',
                    login_to_view_orders: 'Login to view your order history',
                    login_btn: 'Login',
                    loading_orders: 'Loading orders...',
                    confirm_cancel: 'Are you sure you want to cancel this order?',
                    confirm_reorder: 'Do you want to place a new order with the same products?',
                    order_cancelled: 'Order cancelled successfully',
                    order_placed_success: 'New order placed successfully!',
                    items_added_to_cart: 'Items added to cart',
                    order_placed_toast: 'Order placed successfully!',
                    close: 'Close',
                    new_order: 'New Order',
                    order_from_reorder: 'Order placed from reorder'
                }
            };
        },

        getStatusText(statusKey) {
            const status = Object.values(ORDER_STATUS).find(s => s.key === statusKey);
            if (!status) return statusKey;
            const lang = this.getCurrentLang();
            return status.text[lang] || status.text['ro'] || statusKey;
        },

        getProductTitle(product) {
            if (!product) return 'Unknown Product';
            const lang = this.getCurrentLang();
            
            if (product.title && typeof product.title === 'object') {
                return product.title[lang] || 
                       product.title['ro'] || 
                       product.title['en'] || 
                       product.title[Object.keys(product.title)[0]] || 
                       'Product';
            }
            
            return product.title || product.name || 'Product';
        }
    };

    const Utils = {
        escapeHtml(str) {
            if (!str) return '';
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },

        formatPrice(amount, currency = 'LEI') {
            if (typeof amount !== 'number') amount = parseFloat(amount) || 0;
            return new Intl.NumberFormat('ro-RO', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount) + ' ' + currency;
        },

        formatDate(dateString, includeTime = false) {
            const date = new Date(dateString);
            const options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                ...(includeTime && { hour: '2-digit', minute: '2-digit' })
            };
            return date.toLocaleDateString('ro-RO', options);
        },

        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        generateId() {
            return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        },

        storageAvailable() {
            try {
                const storage = window.localStorage;
                const x = '__storage_test__';
                storage.setItem(x, x);
                storage.removeItem(x);
                return true;
            } catch (e) {
                return false;
            }
        },

        normalizeImagePath(url) {
            if (!url) return (typeof standardizeImagePath === 'function') ? standardizeImagePath('intex.jpg') : './assets/img/intex.jpg';
            if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
            if (/^(?:\.\/|\.\.\/)/.test(url)) return url;
            // remove leading slashes
            url = url.replace(/^\/+/, '');
            if (typeof standardizeImagePath === 'function') {
                return standardizeImagePath(url);
            }
            try {
                const path = window.location && window.location.pathname ? window.location.pathname : '';
                const base = (path.includes('/pagini/') ? '../' : './');
                return base + url;
            } catch (e) {
                return './' + url;
            }
        },

        resolveProductImage(imgEl, title) {
            if (!imgEl) return;
            try {
                const exts = ['jpg','jpeg','png','webp'];
                const attempts = Number(imgEl.dataset.imgAttempts || 0);
                const candidates = [];

                const pid = imgEl.dataset.productId;
                if (pid) {
                    exts.forEach(ext => candidates.push(`assets/img/${pid}.${ext}`));
                }

                if (title) {
                    const slug = String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    if (slug) exts.forEach(ext => candidates.push(`assets/img/${slug}.${ext}`));
                }

                if (title) {
                    const parts = String(title).toLowerCase().split(/\s+/).filter(Boolean).slice(0,4);
                    for (let i = parts.length; i > 0; i--) {
                        const name = parts.slice(0,i).join('-');
                        exts.forEach(ext => candidates.push(`assets/img/${name}.${ext}`));
                    }
                }

                const uniq = [...new Set(candidates)];

                if (attempts >= uniq.length) {
                    imgEl.src = Utils.normalizeImagePath('assets/img/intex.jpg');
                    return;
                }

                const candidate = Utils.normalizeImagePath(uniq[attempts]);
                const tester = new Image();
                tester.onload = function() {
                    imgEl.src = candidate;
                };
                tester.onerror = function() {
                    imgEl.dataset.imgAttempts = attempts + 1;
                    Utils.resolveProductImage(imgEl, title);
                };
                tester.src = candidate;
            } catch (e) {
                imgEl.src = Utils.normalizeImagePath('assets/img/intex.jpg');
            }
        }
    };

    try { window.Utils = Utils; } catch (e) { }

    const ProductManager = {
        products: null,

        loadAllProducts() {
            if (this.products) {
                return this.products;
            }

            const products = [];
            const seenIds = new Set();

            const addProduct = (p, source) => {
                if (!p || !p.id) {
                    console.warn('[ProductManager] Skipping product without ID from', source);
                    return;
                }
                
                if (seenIds.has(p.id)) {
                    return;
                }
                
                seenIds.add(p.id);
                
                const normalizedProduct = {
                    id: p.id,
                    title: p.title,
                    price: parseFloat(p.price) || 0,
                    image: Utils.normalizeImagePath(p.image || p.img || 'assets/img/intex.jpg'),
                    category: p.category || 'uncategorized',
                    subcategory: p.subcategory || p.sub || '',
                    oldPrice: p.oldPrice ? parseFloat(p.oldPrice) : null
                };

                products.push(normalizedProduct);
            };

            if (window.PRODUCTS_DATA && Array.isArray(window.PRODUCTS_DATA)) {
                window.PRODUCTS_DATA.forEach(p => addProduct(p, 'PRODUCTS_DATA'));
            }

            if (window.POOLS_PRODUCTS && window.POOLS_PRODUCTS.pools && Array.isArray(window.POOLS_PRODUCTS.pools)) {
                window.POOLS_PRODUCTS.pools.forEach(p => {
                    const normalized = {
                        ...p,
                        category: p.category || 'baseine_intex',
                        subcategory: p.subcategory || p.sub || ''
                    };
                    addProduct(normalized, 'POOLS_PRODUCTS');
                });
            }

            if (window.ALL_PRODUCTS && Array.isArray(window.ALL_PRODUCTS)) {
                window.ALL_PRODUCTS.forEach(p => addProduct(p, 'ALL_PRODUCTS'));
            }

            if (typeof window !== 'undefined') {
                for (let key in window) {
                    if (key.toLowerCase().includes('product') && Array.isArray(window[key])) {
                        window[key].forEach(p => addProduct(p, key));
                    }
                }
            }

            this.products = products;
            console.log('[ProductManager] Total products loaded:', products.length);
            return products;
        },

        getProductDisplayName(product) {
            if (!product) return 'Unknown';
            if (typeof product.title === 'object') {
                return product.title.ro || product.title.en || JSON.stringify(product.title);
            }
            return product.title || product.name || 'No name';
        },

        findById(id) {
            if (!id) return null;
            
            const products = this.loadAllProducts();
            const found = products.find(p => p.id === id);
            
            if (!found) {
                const partial = products.find(p => p.id.includes(id) || id.includes(p.id));
                if (partial) return partial;
            }
            
            return found;
        },

        findByName(name) {
            if (!name) return null;
            
            const products = this.loadAllProducts();
            const lang = TranslationManager.getCurrentLang();
            
            return products.find(p => {
                if (typeof p.title === 'object') {
                    return p.title[lang] === name || 
                           p.title['ro'] === name || 
                           p.title['en'] === name;
                }
                return p.title === name || p.name === name;
            });
        },

        getRandomProducts(count) {
            const products = this.loadAllProducts();
            if (products.length === 0) return [];
            
            const shuffled = [...products].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, Math.min(count, products.length));
        },

        debug() {
            const products = this.loadAllProducts();
            console.log('=== PRODUCT MANAGER DEBUG ===');
            console.log('Total products:', products.length);
            products.forEach(p => {
                console.log(`ID: ${p.id}, Title: ${this.getProductDisplayName(p)}, Image: ${p.image}`);
            });
            console.log('=============================');
            return products;
        }
    };

    window.debugProducts = () => ProductManager.debug();


    class OrdersManager {
        constructor() {
            this.orders = [];
            this.currentUser = null;
            this.currentPage = 1;
            this.isLoading = false;
            this.filters = {
                status: 'all',
                dateFrom: null,
                dateTo: null,
                search: ''
            };
            
            this.dom = {
                loading: null,
                empty: null,
                list: null,
                container: null,
                pagination: null
            };

            this.waitForDependencies().then(() => {
                this.init();
            });
        }

        async waitForDependencies() {
            let attempts = 0;
            while (attempts < 100) {
                const hasData = window.PRODUCTS_DATA || window.POOLS_PRODUCTS || window.ALL_PRODUCTS;
                
                if (hasData) {
                    await new Promise(r => setTimeout(r, 200));
                    return;
                }
                
                await new Promise(r => setTimeout(r, 100));
                attempts++;
            }
            console.warn('[OrdersManager] Timeout waiting for data');
        }

        async init() {
            try {
                this.cacheDOMElements();

                this.checkAuth();

                ProductManager.loadAllProducts();

                this.setupEventListeners();

                await this.loadOrders();

                if (!this.orders || this.orders.length === 0) {
                    this.renderEmptyState();
                }

                window.addEventListener('languageChanged', () => {
                    this.renderOrders();
                });

            } catch (error) {
                console.error('[OrdersManager] Initialization error:', error);
            }
        }

        cacheDOMElements() {
            this.dom.loading = document.getElementById('orders-loading');
                this.dom.empty = document.getElementById('orders-empty');
                this.dom.list = document.getElementById('orders-list');
                this.dom.container = document.getElementById('orders-container') || document.querySelector('.orders-container');
            this.dom.pagination = document.getElementById('orders-pagination');
        }

        checkAuth() {
            if (window.authManager && window.authManager.getCurrentUser) {
                this.currentUser = window.authManager.getCurrentUser();
            }

            if (!this.currentUser) {
                try {
                    const authData = localStorage.getItem('intex_auth');
                    if (authData) {
                        this.currentUser = JSON.parse(authData);
                    }
                } catch (e) {
                    console.warn('[OrdersManager] Error parsing auth data');
                }
            }

            if (!this.currentUser) {
                this.handleNotAuthenticated();
                return false;
            }

            return true;
        }

        handleNotAuthenticated() {
            const t = (key, params) => TranslationManager.translate(key, params);
            
            if (this.dom.empty) {
                this.dom.empty.innerHTML = `
                    <div class="orders-empty-state" style="text-align: center; padding: 3rem;">
                        <i class="fas fa-lock" style="font-size: 3rem; color: #38bdf8; margin-bottom: 1rem;"></i>
                        <h3 style="color: #fff; margin-bottom: 0.5rem;">${t('auth_required')}</h3>
                        <p style="color: #94a3b8; margin-bottom: 1.5rem;">${t('login_to_view_orders')}</p>
                        <button class="btn-main" onclick="window.openLoginModal()" style="background: #38bdf8; color: #0f172a; padding: 0.75rem 1.5rem; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">
                            <i class="fas fa-sign-in-alt"></i> ${t('login_btn')}
                        </button>
                    </div>
                `;
                this.dom.empty.style.display = 'block';
            }

            if (this.dom.loading) {
                this.dom.loading.style.display = 'none';
            }

            sessionStorage.setItem('redirectAfterLogin', window.location.href);
        }

        async loadOrders() {
            if (this.isLoading) return;
            
            this.isLoading = true;
            this.showLoading(true);

            try {
                await this.simulateDelay(600);

                const storedOrders = this.getStoredOrders();
                if (storedOrders && storedOrders.length > 0) {
                    if (!CONFIG.DEMO_MODE) {
                        const filtered = storedOrders.filter(o => !this.isDemoOrder(o));
                        if (filtered.length !== storedOrders.length) {
                            this.orders = filtered;
                            try {
                                localStorage.setItem('intex_orders', JSON.stringify(filtered));
                            } catch (e) {}
                        } else {
                            this.orders = storedOrders;
                        }
                    } else {
                        this.orders = storedOrders;
                    }
                } else if (CONFIG.DEMO_MODE) {
                    this.orders = this.generateDemoOrders();
                    this.saveOrders();
                } else {
                    this.orders = this.getIntegratedSampleOrders();
                }

                try {
                    const integrated = this.getIntegratedSampleOrders() || [];
                    integrated.forEach(sample => {
                        if (!this.orders.some(o => String(o.id || '').toUpperCase() === String(sample.id || '').toUpperCase())) {
                            this.orders.unshift(sample);
                        }
                    });
                } catch (e) {}

                this.renderOrders();
                
            } catch (error) {
                console.error('[OrdersManager] Error loading orders:', error);
            } finally {
                this.isLoading = false;
                this.showLoading(false);
            }
        }

        isDemoOrder(order) {
            if (!order) return false;
            try {
                if (Array.isArray(order.items) && order.items.some(it => {
                    const id = String(it.id || '').toUpperCase();
                    const sku = String(it.sku || '').toUpperCase();
                    const name = String(it.name || '').toLowerCase();
                    if (id.startsWith('FALLBACK')) return true;
                    if (sku.startsWith('FALLBACK')) return true;
                    if (name.includes('piscină') || name.includes('pool') || name.includes('pomp')) {
                        return false; 
                    }
                    return false;
                })) return true;

                if (order.id && /ORD-2024-/.test(String(order.id))) return true;

                return false;
            } catch (e) { return false; }
        }

        getStoredOrders() {
            if (!Utils.storageAvailable()) return null;
            
            try {
                const userKey = CONFIG.USER_PREFIX + (this.currentUser?.email || 'guest');
                const userDataRaw = localStorage.getItem(userKey);
                if (userDataRaw) {
                    try { return JSON.parse(userDataRaw); } catch (e) { return null; }
                }

                const legacyRaw = localStorage.getItem('intex_orders');
                if (legacyRaw) {
                    try {
                        const legacy = JSON.parse(legacyRaw) || [];
                        if (this.currentUser && this.currentUser.email) {
                            try {
                                const existing = JSON.parse(localStorage.getItem(userKey) || '[]');
                                const merged = existing.concat(legacy);
                                localStorage.setItem(userKey, JSON.stringify(merged));
                                return merged;
                            } catch (e) {
                                return legacy;
                            }
                        }
                        return legacy;
                    } catch (e) {
                        return null;
                    }
                }

                return null;
            } catch (e) {
                console.error('[OrdersManager] Storage error:', e);
                return null;
            }
        }

        saveOrders() {
            if (!Utils.storageAvailable() || !this.currentUser) return;

            try {
                const key = CONFIG.USER_PREFIX + this.currentUser.email;
                localStorage.setItem(key, JSON.stringify(this.orders));
            } catch (e) {
                console.error('[OrdersManager] Save error:', e);
            }
        }

        simulateDelay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        generateDemoOrders() {
            const now = Date.now();
            const day = 86400000;

            const allProducts = ProductManager.loadAllProducts();
            console.log('[OrdersManager] Available products for demo:', allProducts.length);
            
            if (allProducts.length === 0) {
                return this.generateFallbackOrders();
            }

            const product1 = allProducts[0];
            const product2 = allProducts[1] || allProducts[0];
            const product3 = allProducts[2] || allProducts[0];
            const product4 = allProducts[3] || allProducts[0];

            const items1 = [
                {
                    id: product1.id,
                    name: TranslationManager.getProductTitle(product1),
                    price: product1.price,
                    image: product1.image,
                    qty: 1,
                    sku: product1.id
                },
                {
                    id: product2.id,
                    name: TranslationManager.getProductTitle(product2),
                    price: product2.price,
                    image: product2.image,
                    qty: 1,
                    sku: product2.id
                }
            ];

            const items2 = [
                {
                    id: product3.id,
                    name: TranslationManager.getProductTitle(product3),
                    price: product3.price,
                    image: product3.image,
                    qty: 1,
                    sku: product3.id
                },
                {
                    id: product4.id,
                    name: TranslationManager.getProductTitle(product4),
                    price: product4.price,
                    image: product4.image,
                    qty: 2,
                    sku: product4.id
                }
            ];

            const total1 = items1.reduce((sum, item) => sum + (item.price * item.qty), 0);
            const total2 = items2.reduce((sum, item) => sum + (item.price * item.qty), 0);

            const orders = [
                {
                    id: 'ORD-2024-001',
                    date: new Date(now - day * 2).toISOString(),
                    status: 'delivered',
                    total: total1 + 50,
                    subtotal: total1,
                    shippingCost: 50,
                    tax: Math.round(total1 * 0.09 * 100) / 100,
                    items: items1,
                    shipping: {
                        name: this.currentUser?.name || 'Client',
                        address: 'Str. Exemplu 123, Chișinău',
                        phone: '069123456',
                        city: 'Chișinău',
                        postalCode: '2000'
                    },
                    payment: 'Cash on delivery',
                    timeline: [
                        { status: 'ordered', date: new Date(now - day * 5).toISOString(), note: 'Comandă plasată' },
                        { status: 'processing', date: new Date(now - day * 4).toISOString(), note: 'Comandă procesată' },
                        { status: 'shipped', date: new Date(now - day * 3).toISOString(), note: 'Expediată' },
                        { status: 'delivered', date: new Date(now - day * 2).toISOString(), note: 'Livrată' }
                    ]
                },
                {
                    id: 'ORD-2024-002',
                    date: new Date(now - day * 5).toISOString(),
                    status: 'processing',
                    total: total2 + 50,
                    subtotal: total2,
                    shippingCost: 50,
                    tax: Math.round(total2 * 0.09 * 100) / 100,
                    items: items2,
                    shipping: {
                        name: this.currentUser?.name || 'Client',
                        address: 'Str. Exemplu 123, Chișinău',
                        phone: '069123456',
                        city: 'Chișinău',
                        postalCode: '2000'
                    },
                    payment: 'Card payment',
                    timeline: [
                        { status: 'ordered', date: new Date(now - day * 5).toISOString(), note: 'Comandă plasată' },
                        { status: 'processing', date: new Date(now - day * 4).toISOString(), note: 'În procesare' }
                    ]
                }
            ];

            return orders;
        }

        generateFallbackOrders() {
            const now = Date.now();
            const day = 86400000;

            return [
                {
                    id: 'ORD-2024-001',
                    date: new Date(now - day * 2).toISOString(),
                    status: 'delivered',
                    total: 1300,
                    subtotal: 1250,
                    shippingCost: 50,
                    tax: 112.50,
                    items: [
                        { 
                            id: 'FALLBACK-001', 
                            name: 'Piscină INTEX 305x76cm', 
                            price: 899, 
                            image: Utils.normalizeImagePath('assets/img/intex.jpg'), 
                            qty: 1, 
                            sku: 'FALLBACK-001' 
                        },
                        { 
                            id: 'FALLBACK-002', 
                            name: 'Pompă filtrare', 
                            price: 351, 
                            image: Utils.normalizeImagePath('assets/img/intex.jpg'), 
                            qty: 1, 
                            sku: 'FALLBACK-002' 
                        }
                    ],
                    shipping: { 
                        name: 'Client', 
                        address: 'Str. Exemplu 123', 
                        phone: '069123456', 
                        city: 'Chișinău', 
                        postalCode: '2000' 
                    },
                    payment: 'Cash on delivery',
                    timeline: [
                        { status: 'ordered', date: new Date(now - day * 5).toISOString(), note: 'Comandă plasată' },
                        { status: 'delivered', date: new Date(now - day * 2).toISOString(), note: 'Livrată' }
                    ]
                }
            ];
        }

        getIntegratedSampleOrders() {
            const now = Date.now();
            const day = 86400000;

            const shipped = {
                id: 'INT-SHIPPED-001',
                date: new Date(now - day * 3).toISOString(),
                status: 'shipped',
                total: 1_173.93,
                subtotal: 1100.00,
                shippingCost: 73.93,
                tax: 0,
                items: [
                    { id: 'P001', name: 'SET BARCĂ GONFLABILĂ EX', price: 399.00, image: Utils.normalizeImagePath('assets/img/intex.jpg'), qty: 1, sku: 'P001' },
                    { id: 'P002', name: 'SET BARCĂ GONFLABILĂ EX', price: 399.00, image: Utils.normalizeImagePath('assets/img/intex.jpg'), qty: 1, sku: 'P002' },
                    { id: 'P003', name: 'Accesorii', price: 375.93, image: Utils.normalizeImagePath('assets/img/intex.jpg'), qty: 1, sku: 'P003' }
                ],
                shipping: { name: 'Client Demo', address: 'sat. mingir', phone: '069000000', city: 'Chișinău', postalCode: '2000' },
                payment: 'Cash on delivery',
                timeline: [
                    { status: 'ordered', date: new Date(now - day * 7).toISOString(), note: 'Comandă plasată' },
                    { status: 'processing', date: new Date(now - day * 5).toISOString(), note: 'În procesare' },
                    { status: 'shipped', date: new Date(now - day * 3).toISOString(), note: 'În curs de livrare' }
                ]
            };

            const delivered = {
                id: 'INT-DELIVERED-001',
                date: new Date(now - day * 12).toISOString(),
                status: 'delivered',
                total: 899.00,
                subtotal: 899.00,
                shippingCost: 0,
                tax: 0,
                items: [
                    { id: 'P010', name: 'Piscină INTEX 305x76cm', price: 899.00, image: Utils.normalizeImagePath('assets/img/intex.jpg'), qty: 1, sku: 'P010' }
                ],
                shipping: { name: 'Client Demo', address: 'Str. Exemplu 10', phone: '069111111', city: 'Chișinău', postalCode: '2000' },
                payment: 'Card',
                timeline: [
                    { status: 'ordered', date: new Date(now - day * 18).toISOString(), note: 'Comandă plasată' },
                    { status: 'processing', date: new Date(now - day * 16).toISOString(), note: 'În procesare' },
                    { status: 'shipped', date: new Date(now - day * 14).toISOString(), note: 'Expediată' },
                    { status: 'delivered', date: new Date(now - day * 12).toISOString(), note: 'Livrată' }
                ]
            };

            const pending = {
                id: 'INT-PENDING-001',
                date: new Date(now - day * 1).toISOString(),
                status: 'pending',
                total: 249.00,
                subtotal: 249.00,
                shippingCost: 0,
                tax: 0,
                items: [
                    { id: 'P020', name: 'Set vâsle', price: 249.00, image: Utils.normalizeImagePath('assets/img/intex.jpg'), qty: 1, sku: 'P020' }
                ],
                shipping: { name: 'Client Demo', address: 'Str. Exemplu 2', phone: '069444444', city: 'Chișinău', postalCode: '2000' },
                payment: 'Card',
                timeline: [
                    { status: 'ordered', date: new Date(now - day * 2).toISOString(), note: 'Comandă plasată' }
                ]
            };

            const cancelled = {
                id: 'INT-CANCELLED-001',
                date: new Date(now - day * 6).toISOString(),
                status: 'cancelled',
                total: 129.00,
                subtotal: 129.00,
                shippingCost: 0,
                tax: 0,
                items: [
                    { id: 'P030', name: 'Accesoriu mic', price: 129.00, image: Utils.normalizeImagePath('assets/img/intex.jpg'), qty: 1, sku: 'P030' }
                ],
                shipping: { name: 'Client Demo', address: 'Str. Exemplu 6', phone: '069555555', city: 'Chișinău', postalCode: '2000' },
                payment: 'Card',
                timeline: [
                    { status: 'ordered', date: new Date(now - day * 12).toISOString(), note: 'Comandă plasată' },
                    { status: 'processing', date: new Date(now - day * 10).toISOString(), note: 'În procesare' },
                    { status: 'cancelled', date: new Date(now - day * 6).toISOString(), note: 'Comandă anulată' }
                ]
            };

            return [pending, shipped, delivered, cancelled];
        }

        showLoading(show) {
            if (this.dom.loading) {
                this.dom.loading.style.display = show ? 'flex' : 'none';
            }
            if (this.dom.empty) {
                this.dom.empty.style.display = 'none';
            }
            if (this.dom.list) {
                this.dom.list.style.display = show ? 'none' : 'grid';
            }
        }

        renderOrders() {
            const filteredOrders = this.getFilteredOrders();
            
            if (filteredOrders.length === 0) {
                this.renderEmptyState();
                return;
            }

            this.renderOrderList(filteredOrders);
            this.renderPagination(filteredOrders.length);
        }

        getFilteredOrders() {
            return this.orders.filter(order => {
                if (this.filters.status !== 'all' && order.status !== this.filters.status) {
                    return false;
                }
                
                if (this.filters.search) {
                    const searchLower = this.filters.search.toLowerCase();
                    const matchId = order.id.toLowerCase().includes(searchLower);
                    const matchItems = order.items.some(item => 
                        (item.name || '').toLowerCase().includes(searchLower)
                    );
                    if (!matchId && !matchItems) return false;
                }

                return true;
            }).sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        renderEmptyState() {
            const t = (key, params) => TranslationManager.translate(key, params);
            
            if (this.dom.empty) {
                this.dom.empty.innerHTML = `
                    <div class="orders-empty-state" style="text-align: center; padding: 3rem;">
                        <i class="fas fa-box-open" style="font-size: 4rem; color: #38bdf8; margin-bottom: 1.5rem;"></i>
                        <h3 style="color: #fff; margin-bottom: 0.5rem;">${t('no_orders_title')}</h3>
                        <p style="color: #94a3b8; margin-bottom: 1.5rem;">${t('no_orders_text')}</p>
                        <a href="/pagini/produse.html" class="btn-main" style="background: #38bdf8; color: #0f172a; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; display: inline-block; font-weight: 600;">
                            <i class="fas fa-shopping-bag"></i> ${t('browse_products')}
                        </a>
                    </div>
                `;
                this.dom.empty.style.display = 'block';
            }
            if (this.dom.list) {
                this.dom.list.style.display = 'none';
            }
            if (this.dom.pagination) {
                this.dom.pagination.style.display = 'none';
            }
        }

        renderOrderList(orders) {
            if (!this.dom.list) return;

            const start = (this.currentPage - 1) * CONFIG.ITEMS_PER_PAGE;
            const end = start + CONFIG.ITEMS_PER_PAGE;
            const pageOrders = orders.slice(start, end);
            if (!pageOrders || pageOrders.length === 0) {
                this.renderEmptyState();
                return;
            }

            const html = pageOrders.map(order => this.createOrderCard(order)).join('');

            this.dom.list.innerHTML = html;
            this.dom.list.style.display = 'grid';
            
            if (this.dom.empty) {
                this.dom.empty.style.display = 'none';
            }

            this.animateEntrance();
            try {
                const thumbs = this.dom.list.querySelectorAll('.order-item-thumb');
                thumbs.forEach(img => {
                    img.dataset.imgAttempts = img.dataset.imgAttempts || 0;
                    img.addEventListener('error', function onErr() {
                        img.removeEventListener('error', onErr);
                        const name = img.dataset.productName || img.alt || img.dataset.productId || '';
                        if (window.Utils && typeof window.Utils.resolveProductImage === 'function') {
                            window.Utils.resolveProductImage(img, name);
                        } else {
                            img.src = Utils.normalizeImagePath('assets/img/intex.jpg');
                        }
                    });
                });
            } catch (e) {}
        }

        createOrderCard(order) {
            const t = (key, params) => TranslationManager.translate(key, params);
            const statusConfig = Object.values(ORDER_STATUS).find(s => s.key === order.status) || ORDER_STATUS.PENDING;
            const date = Utils.formatDate(order.date);
            const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);
            
            const _fallbackImg = Utils.normalizeImagePath('assets/img/intex.jpg');
            const imagesHtml = order.items.slice(0, 3).map((item, index) => {
                let imageUrl = item.image;
                if (!imageUrl || imageUrl === 'undefined' || imageUrl === 'null') {
                    const product = ProductManager.findById(item.id);
                    imageUrl = product?.image || _fallbackImg;
                }
                imageUrl = Utils.normalizeImagePath(imageUrl);

                        return `<img src="${Utils.escapeHtml(imageUrl)}" 
                            alt="${Utils.escapeHtml(item.name || 'Produs')}" 
                            data-product-id="${Utils.escapeHtml(item.id || '')}"
                            data-product-name="${Utils.escapeHtml(item.name || '')}"
                            class="order-item-thumb"
                            style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 8px; border: 2px solid rgba(56, 189, 248, 0.3);"
                            loading="${index === 0 ? 'eager' : 'lazy'}">`;
            }).join('');

            const moreCount = order.items.length - 3;
            const moreHtml = moreCount > 0 ? 
                `<div class="order-item-more" style="width: 60px; height: 60px; background: rgba(56, 189, 248, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #38bdf8; font-weight: 600; border: 2px solid rgba(56, 189, 248, 0.3);">+${moreCount}</div>` : '';

            const productNamesHtml = order.items.slice(0, 2).map(item => 
                `<div style="color: #e2e8f0; font-size: 0.9rem; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">
                    ${Utils.escapeHtml(item.name || 'Produs')}
                 </div>`
            ).join('');
            
            const moreNamesCount = order.items.length - 2;
            const moreNamesHtml = moreNamesCount > 0 ? 
                `<div style="color: #64748b; font-size: 0.85rem;">+${moreNamesCount} ${t('items_count', {count: moreNamesCount}).replace(moreNamesCount, '').trim()}</div>` : '';

            const canCancel = ['pending', 'processing'].includes(order.status);
            const canReorder = ['delivered', 'cancelled', 'shipped', 'pending'].includes(order.status);
            const canTrack = ['shipped'].includes(order.status);

            return `
                <article class="order-card" data-order-id="${Utils.escapeHtml(order.id)}" style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 16px; padding: 1.5rem; margin-bottom: 1rem;">
                    <div class="order-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                        <div class="order-meta">
                            <div class="order-id" style="color: #38bdf8; font-weight: 700; font-size: 1.1rem;">#${Utils.escapeHtml(order.id)}</div>
                            <time class="order-date" style="color: #94a3b8; font-size: 0.9rem;" datetime="${order.date}">${date}</time>
                        </div>
                        <span class="order-status" style="background: ${statusConfig.color}20; color: ${statusConfig.color}; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas ${statusConfig.icon}"></i>
                            ${TranslationManager.getStatusText(order.status)}
                        </span>
                    </div>
                    
                    <div class="order-body" style="margin-bottom: 1rem;">
                        <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                            <div class="order-items-preview" style="display: flex; align-items: center; flex-shrink: 0;">
                                ${imagesHtml}
                                ${moreHtml}
                            </div>
                            <div style="flex: 1; min-width: 0;">
                                ${productNamesHtml}
                                ${moreNamesHtml}
                            </div>
                        </div>
                        
                        <div class="order-summary" style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.75rem; border-top: 1px solid rgba(56, 189, 248, 0.1);">
                            <span style="color: #94a3b8;">${t('items_count', {count: itemCount})}</span>
                            <span class="order-total" style="color: #38bdf8; font-size: 1.25rem; font-weight: 700;">${Utils.formatPrice(order.total)}</span>
                        </div>
                        ${order.shipping ? `
                            <div class="order-shipping-info" style="color: #64748b; font-size: 0.9rem; margin-top: 0.5rem;">
                                <i class="fas fa-map-marker-alt" style="color: #38bdf8; margin-right: 0.5rem;"></i>
                                ${Utils.escapeHtml(order.shipping.city || 'Chișinău')}
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="order-footer" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button class="btn-order-action btn-order-primary" 
                                onclick="IntexOrders.viewDetails('${Utils.escapeHtml(order.id)}')"
                                style="flex: 1; min-width: 100px; background: #38bdf8; color: #0f172a; border: none; padding: 0.75rem; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                            <i class="fas fa-eye"></i> ${t('order_details')}
                        </button>
                        
                        ${canTrack ? `
                            <button class="btn-order-action btn-order-secondary" 
                                    onclick="IntexOrders.trackOrder('${Utils.escapeHtml(order.id)}')"
                                    style="flex: 1; min-width: 100px; background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 0.75rem; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                                <i class="fas fa-truck"></i> ${t('track_order')}
                            </button>
                        ` : ''}
                        
                        ${canReorder ? `
                            <button class="btn-order-action btn-order-secondary" 
                                    onclick="IntexOrders.reorder('${Utils.escapeHtml(order.id)}')"
                                    style="flex: 1; min-width: 100px; background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3); padding: 0.75rem; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                                <i class="fas fa-redo"></i> ${t('reorder')}
                            </button>
                        ` : ''}
                        
                        ${canCancel ? `
                            <button class="btn-order-action btn-order-danger" 
                                    onclick="IntexOrders.cancelOrder('${Utils.escapeHtml(order.id)}')"
                                    style="flex: 1; min-width: 100px; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 0.75rem; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                                <i class="fas fa-times"></i> ${t('cancel_order')}
                            </button>
                        ` : ''}
                    </div>
                </article>
            `;
        }

        renderPagination(totalItems) {
            if (!this.dom.pagination) return;

            const totalPages = Math.ceil(totalItems / CONFIG.ITEMS_PER_PAGE);
            
            if (totalPages <= 1) {
                this.dom.pagination.style.display = 'none';
                return;
            }

            let html = `
                <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
                        onclick="IntexOrders.goToPage(${this.currentPage - 1})"
                        style="background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">
                    <i class="fas fa-chevron-left"></i>
                </button>
            `;

            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                    html += `
                        <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                                onclick="IntexOrders.goToPage(${i})"
                                style="${i === this.currentPage ? 'background: #38bdf8; color: #0f172a;' : 'background: rgba(56, 189, 248, 0.1); color: #38bdf8;'} border: 1px solid rgba(56, 189, 248, 0.3); padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; margin: 0 0.25rem;">
                            ${i}
                        </button>
                    `;
                } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                    html += `<span class="pagination-ellipsis" style="color: #64748b; padding: 0.5rem;">...</span>`;
                }
            }

            html += `
                <button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} 
                        onclick="IntexOrders.goToPage(${this.currentPage + 1})"
                        style="background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;

            this.dom.pagination.innerHTML = html;
            this.dom.pagination.style.display = 'flex';
            this.dom.pagination.style.justifyContent = 'center';
            this.dom.pagination.style.gap = '0.5rem';
            this.dom.pagination.style.marginTop = '2rem';
        }

        animateEntrance() {
            const cards = this.dom.list?.querySelectorAll('.order-card');
            if (!cards) return;

            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }

        viewDetails(orderId) {
            const order = this.orders.find(o => o.id === orderId);
            if (!order) {
                console.error('[OrdersManager] Order not found:', orderId);
                return;
            }
            this.showOrderDetailsModal(order);
        }

        showOrderDetailsModal(order) {
            const t = (key, params) => TranslationManager.translate(key, params);
            const existing = document.querySelector('.order-details-modal');
            if (existing) {
                existing.classList.remove('active');
                setTimeout(() => existing.remove(), 300);
            }

            const statusConfig = Object.values(ORDER_STATUS).find(s => s.key === order.status) || ORDER_STATUS.PENDING;
            const date = Utils.formatDate(order.date, true);
            
            const timelineHtml = order.timeline ? this.renderTimeline(order.timeline) : '';
            
            const _fallbackImgDetail = Utils.normalizeImagePath('assets/img/intex.jpg');
            const itemsHtml = order.items.map(item => {
                let imageUrl = item.image;
                if (!imageUrl || imageUrl === 'undefined' || imageUrl === 'null') {
                    const product = ProductManager.findById(item.id);
                    imageUrl = product?.image || _fallbackImgDetail;
                }
                imageUrl = Utils.normalizeImagePath(imageUrl);

                return `
                    <div class="order-item-detail" style="display: flex; gap: 1rem; padding: 1rem; background: rgba(15, 23, 42, 0.5); border-radius: 12px; margin-bottom: 0.75rem; border: 1px solid rgba(56, 189, 248, 0.1);">
                        <img src="${Utils.escapeHtml(imageUrl)}" 
                             alt="${Utils.escapeHtml(item.name || 'Produs')}" 
                             data-product-id="${Utils.escapeHtml(item.id || '')}"
                             style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid rgba(56, 189, 248, 0.2);"
                             onerror="this.onerror=null; Utils.resolveProductImage(this, '${Utils.escapeHtml(item.name || item.id || '')}');">
                        <div class="order-item-info" style="flex: 1;">
                            <div class="order-item-name" style="color: #fff; font-weight: 600; margin-bottom: 0.25rem; font-size: 1rem;">${Utils.escapeHtml(item.name || 'Produs')}</div>
                            <div class="order-item-meta" style="color: #94a3b8; font-size: 0.9rem;">
                                ${item.sku || item.id ? `<span style="display: block; margin-bottom: 0.25rem; color: #64748b;">SKU: ${Utils.escapeHtml(item.sku || item.id)}</span>` : ''}
                                <span style="display: block; margin-bottom: 0.25rem;">${t('quantity')}: ${item.qty}</span>
                                <span style="color: #38bdf8; font-weight: 600;">${Utils.formatPrice(item.price)}</span>
                            </div>
                        </div>
                        <div class="order-item-total" style="text-align: right; display: flex; flex-direction: column; justify-content: center;">
                            <span style="color: #fff; font-weight: 700; font-size: 1.1rem;">${Utils.formatPrice(item.price * item.qty)}</span>
                        </div>
                    </div>
                `;
            }).join('');

            const canCancel = ['pending', 'processing'].includes(order.status);
            const canReorder = ['delivered', 'cancelled'].includes(order.status);

            const modalHtml = `
                <div class="order-details-modal active" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1rem;">
                    <div class="order-details-content" style="background: #0f172a; border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 16px; max-width: 800px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative;">
                        <button onclick="this.closest('.order-details-modal').remove()" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; z-index: 10;">
                            <i class="fas fa-times"></i>
                        </button>
                        
                        <div class="order-details-header" style="padding: 1.5rem; border-bottom: 1px solid rgba(56, 189, 248, 0.2);">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                                <div>
                                    <h2 style="color: #fff; margin: 0 0 0.5rem 0; font-size: 1.5rem;">${t('order_details')} #${Utils.escapeHtml(order.id)}</h2>
                                    <time style="color: #94a3b8;">${date}</time>
                                </div>
                                <span style="background: ${statusConfig.color}20; color: ${statusConfig.color}; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
                                    <i class="fas ${statusConfig.icon}"></i>
                                    ${TranslationManager.getStatusText(order.status)}
                                </span>
                            </div>
                        </div>

                        <div class="order-details-body" style="padding: 1.5rem;">
                            ${timelineHtml ? `
                                <div class="order-timeline-section" style="margin-bottom: 2rem;">
                                    <h3 style="color: #38bdf8; margin-bottom: 1rem; font-size: 1.1rem;"><i class="fas fa-history"></i> ${t('order_timeline')}</h3>
                                    <div class="timeline" style="border-left: 2px solid rgba(56, 189, 248, 0.3); padding-left: 1rem;">
                                        ${timelineHtml}
                                    </div>
                                </div>
                            ` : ''}

                            <div class="order-items-section" style="margin-bottom: 2rem;">
                                <h3 style="color: #38bdf8; margin-bottom: 1rem; font-size: 1.1rem;"><i class="fas fa-box"></i> ${t('product')}</h3>
                                ${itemsHtml}
                            </div>

                            <div class="order-summary-section" style="background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: 12px; margin-bottom: 2rem;">
                                <h3 style="color: #38bdf8; margin-bottom: 1rem; font-size: 1.1rem;"><i class="fas fa-receipt"></i> ${t('order_total')}</h3>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #94a3b8;">
                                    <span>${t('subtotal')}</span>
                                    <span>${Utils.formatPrice(order.subtotal)}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #94a3b8;">
                                    <span>${t('shipping')}</span>
                                    <span>${Utils.formatPrice(order.shippingCost || 0)}</span>
                                </div>
                                ${order.tax ? `
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #94a3b8;">
                                        <span>${t('tax')}</span>
                                        <span>${Utils.formatPrice(order.tax)}</span>
                                    </div>
                                ` : ''}
                                <div style="display: flex; justify-content: space-between; padding-top: 0.5rem; border-top: 1px solid rgba(56, 189, 248, 0.2); color: #fff; font-weight: 700; font-size: 1.1rem;">
                                    <span>${t('order_total')}</span>
                                    <span style="color: #38bdf8;">${Utils.formatPrice(order.total)}</span>
                                </div>
                            </div>

                            ${order.shipping ? `
                                <div class="order-shipping-section" style="margin-bottom: 2rem;">
                                    <h3 style="color: #38bdf8; margin-bottom: 1rem; font-size: 1.1rem;"><i class="fas fa-truck"></i> ${t('delivery_to')}</h3>
                                    <div style="background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: 12px; color: #e2e8f0;">
                                        <div style="font-weight: 600; margin-bottom: 0.5rem;">${Utils.escapeHtml(order.shipping.name)}</div>
                                        <div style="color: #94a3b8; margin-bottom: 0.25rem;">${Utils.escapeHtml(order.shipping.address)}</div>
                                        <div style="color: #94a3b8; margin-bottom: 0.25rem;">${Utils.escapeHtml(order.shipping.city)}, ${Utils.escapeHtml(order.shipping.postalCode || '')}</div>
                                        <div style="color: #64748b;"><i class="fas fa-phone" style="margin-right: 0.5rem;"></i>${Utils.escapeHtml(order.shipping.phone)}</div>
                                    </div>
                                </div>
                            ` : ''}

                            ${order.payment ? `
                                <div class="order-payment-section" style="margin-bottom: 2rem;">
                                    <h3 style="color: #38bdf8; margin-bottom: 1rem; font-size: 1.1rem;"><i class="fas fa-credit-card"></i> ${t('payment_method')}</h3>
                                    <div style="background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: 12px; color: #e2e8f0;">
                                        ${Utils.escapeHtml(order.payment)}
                                    </div>
                                </div>
                            ` : ''}
                        </div>

                        <div class="order-details-footer" style="padding: 1.5rem; border-top: 1px solid rgba(56, 189, 248, 0.2); display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            ${canReorder ? `
                                <button onclick="IntexOrders.reorder('${Utils.escapeHtml(order.id)}'); this.closest('.order-details-modal').remove();" 
                                        style="flex: 1; min-width: 120px; background: #22c55e; color: #fff; border: none; padding: 0.75rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
                                    <i class="fas fa-redo"></i> ${t('reorder')}
                                </button>
                            ` : ''}
                            
                            ${canCancel ? `
                                <button onclick="IntexOrders.cancelOrder('${Utils.escapeHtml(order.id)}'); this.closest('.order-details-modal').remove();" 
                                        style="flex: 1; min-width: 120px; background: #ef4444; color: #fff; border: none; padding: 0.75rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
                                    <i class="fas fa-times"></i> ${t('cancel_order')}
                                </button>
                            ` : ''}

                            <button onclick="window.print()" 
                                    style="flex: 1; min-width: 120px; background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 0.75rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
                                <i class="fas fa-print"></i> ${t('print_order')}
                            </button>

                            <button onclick="this.closest('.order-details-modal').remove()" 
                                    style="flex: 1; min-width: 120px; background: rgba(100, 116, 139, 0.2); color: #94a3b8; border: 1px solid rgba(100, 116, 139, 0.3); padding: 0.75rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
                                <i class="fas fa-times"></i> ${t('close')}
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHtml);
            
            const modal = document.querySelector('.order-details-modal:last-child');
            const content = modal.querySelector('.order-details-content');
            content.style.opacity = '0';
            content.style.transform = 'scale(0.9)';
            
            requestAnimationFrame(() => {
                content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                content.style.opacity = '1';
                content.style.transform = 'scale(1)';
            });
        }

        renderTimeline(timeline) {
            if (!timeline || !Array.isArray(timeline)) return '';
            
            return timeline.map((event, index) => {
                const isLast = index === timeline.length - 1;
                const date = Utils.formatDate(event.date, true);
                
                return `
                    <div class="timeline-item" style="position: relative; padding-bottom: ${isLast ? '0' : '1.5rem'};">
                        <div class="timeline-dot" style="position: absolute; left: -1.35rem; top: 0.25rem; width: 12px; height: 12px; background: ${isLast ? '#38bdf8' : '#64748b'}; border-radius: 50%; border: 2px solid #0f172a;"></div>
                        <div class="timeline-content">
                            <div class="timeline-status" style="color: #fff; font-weight: 600; margin-bottom: 0.25rem;">${Utils.escapeHtml(event.note || event.status)}</div>
                            <time class="timeline-date" style="color: #64748b; font-size: 0.85rem;">${date}</time>
                        </div>
                    </div>
                `;
            }).join('');
        }


        async reorder(orderId) {
            const t = (key, params) => TranslationManager.translate(key, params);
            const order = this.orders.find(o => o.id === orderId);
            
            if (!order) {
                console.error('[OrdersManager] Order not found for reorder:', orderId);
                return;
            }
            try {
                const existing = document.querySelector('.order-reorder-modal');
                if (existing) existing.remove();

                const modalHtml = `
                    <div class="order-reorder-modal" style="position: fixed; inset: 0; background: rgba(2,6,23,0.75); display:flex; align-items:center; justify-content:center; z-index:10000;">
                        <div style="background: #0f172a; color: #e6eef6; width: 100%; max-width: 520px; border-radius: 12px; padding: 1.25rem; box-shadow: 0 10px 30px rgba(2,6,23,0.6); position: relative;">
                            <button class="close-reorder-modal" style="position:absolute; right:12px; top:12px; background:none; border:none; color:#94a3b8; font-size:1.25rem; cursor:pointer;">&times;</button>
                            <h3 style="margin:0 0 0.5rem 0; color:#fff;">${t('confirm_reorder')}</h3>
                            <p style="color:#94a3b8; margin-bottom:1rem;">${t('confirm_reorder')}</p>
                            <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
                                <button class="btn-reorder-close" style="background: transparent; border:1px solid rgba(148,163,184,0.12); color:#94a3b8; padding:0.6rem 0.9rem; border-radius:8px; cursor:pointer;">${t('close')}</button>
                                <button class="btn-reorder-confirm" style="background:#16a34a; color:#fff; border:none; padding:0.6rem 0.9rem; border-radius:8px; cursor:pointer; font-weight:700;">${t('place_order')}</button>
                            </div>
                        </div>
                    </div>
                `;

                document.body.insertAdjacentHTML('beforeend', modalHtml);
                const modal = document.querySelector('.order-reorder-modal:last-child');
                if (!modal) return;

                const removeModal = () => { try { modal.remove(); } catch (e) {} };
                modal.querySelector('.close-reorder-modal')?.addEventListener('click', removeModal);
                modal.querySelector('.btn-reorder-close')?.addEventListener('click', removeModal);

                modal.querySelector('.btn-reorder-confirm')?.addEventListener('click', async () => {
                    try {
                        const newOrder = await this.createNewOrderFromExisting(order);
                        if (newOrder) {
                            this.orders.unshift(newOrder);
                            this.saveOrders();
                            this.renderOrders();
                            this.showToast(t('order_placed_success'), 'success');

                            setTimeout(() => {
                                const newOrderCard = document.querySelector(`[data-order-id="${newOrder.id}"]`);
                                if (newOrderCard) {
                                    newOrderCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    newOrderCard.style.animation = 'pulse 2s';
                                }
                            }, 300);
                        }
                    } catch (error) {
                        console.error('[OrdersManager] Reorder error:', error);
                        this.showToast('Eroare la plasarea comenzii', 'error');
                    }
                    removeModal();
                });

            } catch (e) {
                console.error('[OrdersManager] reorder modal error', e);
                if (!confirm(t('confirm_reorder'))) return;
                try {
                    const newOrder = await this.createNewOrderFromExisting(order);
                    if (newOrder) {
                        this.orders.unshift(newOrder);
                        this.saveOrders();
                        this.renderOrders();
                        this.showToast(t('order_placed_success'), 'success');
                    }
                } catch (error) {
                    console.error('[OrdersManager] Reorder error:', error);
                    this.showToast('Eroare la plasarea comenzii', 'error');
                }
            }
        }

        async createNewOrderFromExisting(originalOrder) {
            const now = new Date();
            
            const subtotal = originalOrder.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
            const shippingCost = originalOrder.shippingCost || 50;
            const tax = Math.round(subtotal * 0.09 * 100) / 100;
            const total = subtotal + shippingCost + tax;

            const newOrder = {
                id: 'ORD-' + now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
                date: now.toISOString(),
                status: 'pending',
                total: total,
                subtotal: subtotal,
                shippingCost: shippingCost,
                tax: tax,
                items: originalOrder.items.map(item => ({
                    ...item,
                    name: item.name,
                    price: item.price,
                    image: item.image
                })),
                shipping: { ...originalOrder.shipping },
                payment: originalOrder.payment || 'Cash on delivery',
                timeline: [
                    { 
                        status: 'ordered', 
                        date: now.toISOString(), 
                        note: TranslationManager.translate('order_from_reorder')
                    }
                ],
                parentOrderId: originalOrder.id 
            };

            await this.simulateDelay(800);

            console.log('[OrdersManager] Created new order from reorder:', newOrder);
            return newOrder;
        }

        async cancelOrder(orderId) {
            const t = (key, params) => TranslationManager.translate(key, params);

            const orderIndex = this.orders.findIndex(o => o.id === orderId);
            if (orderIndex === -1) return;

            const order = this.orders[orderIndex];
            if (!['pending', 'processing'].includes(order.status)) {
                this.showToast('Această comandă nu poate fi anulată', 'error');
                return;
            }

            try {
                const existing = document.querySelector('.order-cancel-modal');
                if (existing) existing.remove();

                const modalHtml = `
                    <div class="order-cancel-modal" style="position: fixed; inset: 0; background: rgba(2,6,23,0.75); display:flex; align-items:center; justify-content:center; z-index:10000;">
                        <div style="background: #0f172a; color: #e6eef6; width: 100%; max-width: 520px; border-radius: 12px; padding: 1.25rem; box-shadow: 0 10px 30px rgba(2,6,23,0.6); position: relative;">
                            <button class="close-cancel-modal" style="position:absolute; right:12px; top:12px; background:none; border:none; color:#94a3b8; font-size:1.25rem; cursor:pointer;">&times;</button>
                            <h3 style="margin:0 0 0.5rem 0; color:#fff;">${t('confirm_cancel')}</h3>
                            <p style="color:#94a3b8; margin-bottom:1rem;">${t('confirm_cancel')}</p>
                            <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
                                <button class="btn-cancel-close" style="background: transparent; border:1px solid rgba(148,163,184,0.12); color:#94a3b8; padding:0.6rem 0.9rem; border-radius:8px; cursor:pointer;">${t('close')}</button>
                                <button class="btn-cancel-confirm" style="background:#ef4444; color:#fff; border:none; padding:0.6rem 0.9rem; border-radius:8px; cursor:pointer; font-weight:700;">${t('cancel_order')}</button>
                            </div>
                        </div>
                    </div>
                `;

                document.body.insertAdjacentHTML('beforeend', modalHtml);
                const modal = document.querySelector('.order-cancel-modal:last-child');
                if (!modal) return;

                const removeModal = () => { try { modal.remove(); } catch (e) {} };
                modal.querySelector('.close-cancel-modal')?.addEventListener('click', removeModal);
                modal.querySelector('.btn-cancel-close')?.addEventListener('click', removeModal);

                modal.querySelector('.btn-cancel-confirm')?.addEventListener('click', () => {
                    try {
                        order.status = 'cancelled';
                        order.timeline.push({ status: 'cancelled', date: new Date().toISOString(), note: 'Comandă anulată de client' });
                        this.saveOrders();
                        this.renderOrders();
                        this.showToast(t('order_cancelled'), 'success');
                    } catch (e) {
                        console.error(e);
                        this.showToast('Eroare la anulare', 'error');
                    }
                    removeModal();
                });

            } catch (e) {
                console.error('[OrdersManager] cancel modal error', e);
                if (confirm(t('confirm_cancel'))) {
                    order.status = 'cancelled';
                    order.timeline.push({ status: 'cancelled', date: new Date().toISOString(), note: 'Comandă anulată de client' });
                    this.saveOrders();
                    this.renderOrders();
                    this.showToast(t('order_cancelled'), 'success');
                }
            }
        }

        trackOrder(orderId) {
            const order = this.orders.find(o => o.id === orderId);
            if (!order) return;

            this.viewDetails(orderId);
            
            console.log('[OrdersManager] Tracking order:', orderId);
        }

        goToPage(page) {
            this.currentPage = page;
            this.renderOrders();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        showToast(message, type = 'success') {
            if (window.showToast) {
                window.showToast(message, type);
                return;
            }

            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: ${type === 'success' ? '#22c55e' : '#ef4444'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 99999;
                font-weight: 600;
                animation: slideIn 0.3s ease;
            `;
            toast.textContent = message;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        setupEventListeners() {
            const searchInput = document.getElementById('orders-search');
            if (searchInput) {
                searchInput.addEventListener('input', Utils.debounce((e) => {
                    this.filters.search = e.target.value;
                    this.currentPage = 1;
                    this.renderOrders();
                }, CONFIG.DEBOUNCE_DELAY));
            }

            const statusFilter = document.getElementById('orders-status-filter');
            if (statusFilter) {
                statusFilter.addEventListener('change', (e) => {
                    this.filters.status = e.target.value;
                    this.currentPage = 1;
                    this.renderOrders();
                });
            }

            const dateFrom = document.getElementById('orders-date-from');
            const dateTo = document.getElementById('orders-date-to');
            
            if (dateFrom) {
                dateFrom.addEventListener('change', (e) => {
                    this.filters.dateFrom = e.target.value;
                    this.renderOrders();
                });
            }
            
            if (dateTo) {
                dateTo.addEventListener('change', (e) => {
                    this.filters.dateTo = e.target.value;
                    this.renderOrders();
                });
            }
        }
    }


    let ordersManagerInstance = null;

    function initOrdersManager() {
        if (!ordersManagerInstance) {
            ordersManagerInstance = new OrdersManager();
        }
        return ordersManagerInstance;
    }

    window.IntexOrders = {
        init: initOrdersManager,
        viewDetails: (orderId) => ordersManagerInstance?.viewDetails(orderId),
        trackOrder: (orderId) => ordersManagerInstance?.trackOrder(orderId),
        reorder: (orderId) => ordersManagerInstance?.reorder(orderId),
        cancelOrder: (orderId) => ordersManagerInstance?.cancelOrder(orderId),
        goToPage: (page) => ordersManagerInstance?.goToPage(page),
        refresh: () => ordersManagerInstance?.loadOrders()
    };

    

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOrdersManager);
    } else {
        initOrdersManager();
    }

})();