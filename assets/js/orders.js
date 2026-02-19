(function() {
    'use strict';

    // ============================================
    // SECȚIUNEA 1: CONFIG ȘI CONSTANTE
    // ============================================
    
    const CONFIG = {
        STORAGE_KEY: 'intex_orders',
        USER_PREFIX: 'orders_',
        DEMO_MODE: true,
        ITEMS_PER_PAGE: 6,
        DEBOUNCE_DELAY: 300,
        ANIMATION_DURATION: 300
    };

    // Statusuri cu chei de traducere
    const ORDER_STATUS = {
        PENDING: { key: 'pending', color: '#92400e', icon: 'fa-clock', text: { ro: 'În așteptare', ru: 'В ожидании', en: 'Pending' } },
        PROCESSING: { key: 'processing', color: '#1e40af', icon: 'fa-cog fa-spin', text: { ro: 'În procesare', ru: 'В обработке', en: 'Processing' } },
        SHIPPED: { key: 'shipped', color: '#3730a3', icon: 'fa-truck', text: { ro: 'Expediată', ru: 'Отправлен', en: 'Shipped' } },
        DELIVERED: { key: 'delivered', color: '#065f46', icon: 'fa-check-circle', text: { ro: 'Livrată', ru: 'Доставлен', en: 'Delivered' } },
        CANCELLED: { key: 'cancelled', color: '#991b1b', icon: 'fa-times-circle', text: { ro: 'Anulată', ru: 'Отменён', en: 'Cancelled' } },
        REFUNDED: { key: 'refunded', color: '#6b7280', icon: 'fa-undo', text: { ro: 'Rambursată', ru: 'Возвращён', en: 'Refunded' } }
    };

    // ============================================
    // SECȚIUNEA 2: TRANSLATION SYSTEM - FOARTE ROBUST
    // ============================================

    const TranslationManager = {
        // Obține limba curentă
        getCurrentLang() {
            // Încearcă din mai multe surse
            return localStorage.getItem('intex_language') || 
                   localStorage.getItem('lang') || 
                   document.documentElement.lang || 
                   'ro';
        },

        // Traduce o cheie
        translate(key, params = {}) {
            const lang = this.getCurrentLang();
            
            // Încearcă din window.translations (din main.js)
            if (window.translations && window.translations[lang] && window.translations[lang][key]) {
                let text = window.translations[lang][key];
                // Înlocuiește parametrii
                Object.keys(params).forEach(k => {
                    text = text.replace(new RegExp(`{${k}}`, 'g'), params[k]);
                });
                return text;
            }

            // Încearcă din translations inline definite mai jos
            const inlineTranslations = this.getInlineTranslations();
            if (inlineTranslations[lang] && inlineTranslations[lang][key]) {
                let text = inlineTranslations[lang][key];
                Object.keys(params).forEach(k => {
                    text = text.replace(new RegExp(`{${k}}`, 'g'), params[k]);
                });
                return text;
            }

            // Fallback la română sau cheie
            if (inlineTranslations['ro'] && inlineTranslations['ro'][key]) {
                return inlineTranslations['ro'][key];
            }

            return key; // Ultim fallback - returnează cheia
        },

        // Traduceri complete inline (backup dacă main.js nu e încărcat)
        getInlineTranslations() {
            return {
                ro: {
                    // Statusuri
                    order_status_pending: 'În așteptare',
                    order_status_processing: 'În procesare',
                    order_status_shipped: 'Expediată',
                    order_status_delivered: 'Livrată',
                    order_status_cancelled: 'Anulată',
                    order_status_refunded: 'Rambursată',
                    
                    // Butoane și acțiuni
                    order_details: 'Detalii',
                    track_order: 'Urmărire',
                    reorder: 'Recomandă',
                    cancel_order: 'Anulează',
                    print_order: 'Printează',
                    
                    // Informații comandă
                    items_count: '{count} produse',
                    item_count_singular: '{count} produs',
                    order_total: 'Total comandă',
                    subtotal: 'Subtotal',
                    shipping: 'Transport',
                    tax: 'TVA',
                    discount: 'Discount',
                    delivery_to: 'Livrare către',
                    payment_method: 'Metodă de plată',
                    order_date: 'Data comenzii',
                    order_timeline: 'Istoric comandă',
                    back_to_orders: 'Înapoi la comenzi',
                    product: 'Produs',
                    quantity: 'Cantitate',
                    price: 'Preț',
                    
                    // Stări empty/error
                    no_orders_title: 'Nu aveți comenzi încă',
                    no_orders_text: 'Descoperiți produsele noastre și plasați prima comandă!',
                    browse_products: 'Vezi Produse',
                    auth_required: 'Trebuie să fiți autentificat',
                    login_to_view_orders: 'Conectați-vă pentru a vedea istoricul comenzilor',
                    login_btn: 'Autentificare',
                    loading_orders: 'Se încarcă comenzile...',
                    
                    // Confirmări
                    confirm_cancel: 'Sigur doriți să anulați această comandă?',
                    order_cancelled: 'Comanda a fost anulată cu succes',
                    items_added_to_cart: 'Produsele au fost adăugate în coș',
                    order_placed_toast: 'Comanda a fost plasată cu succes!',
                    
                    // Altele
                    close: 'Închide'
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
                    reorder: 'Повторить',
                    cancel_order: 'Отменить',
                    print_order: 'Печать',
                    
                    items_count: '{count} товаров',
                    item_count_singular: '{count} товар',
                    order_total: 'Итого',
                    subtotal: 'Подытог',
                    shipping: 'Доставка',
                    tax: 'НДС',
                    discount: 'Скидка',
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
                    order_cancelled: 'Заказ успешно отменён',
                    items_added_to_cart: 'Товары добавлены в корзину',
                    order_placed_toast: 'Заказ успешно оформлен!',
                    
                    close: 'Закрыть'
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
                    
                    items_count: '{count} items',
                    item_count_singular: '{count} item',
                    order_total: 'Order Total',
                    subtotal: 'Subtotal',
                    shipping: 'Shipping',
                    tax: 'VAT',
                    discount: 'Discount',
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
                    order_cancelled: 'Order cancelled successfully',
                    items_added_to_cart: 'Items added to cart',
                    order_placed_toast: 'Order placed successfully!',
                    
                    close: 'Close'
                }
            };
        },

        // Obține textul statusului
        getStatusText(statusKey) {
            const status = Object.values(ORDER_STATUS).find(s => s.key === statusKey);
            if (!status) return statusKey;
            
            const lang = this.getCurrentLang();
            return status.text[lang] || status.text['ro'] || statusKey;
        },

        // Obține titlul produsului tradus
        getProductTitle(product) {
            if (!product) return 'Produs necunoscut';
            
            const lang = this.getCurrentLang();
            
            // Dacă produsul are title ca obiect cu traduceri
            if (product.title && typeof product.title === 'object') {
                return product.title[lang] || 
                       product.title['ro'] || 
                       product.title['en'] || 
                       product.title[Object.keys(product.title)[0]] || 
                       'Produs';
            }
            
            // Dacă e string direct
            return product.title || product.name || 'Produs';
        }
    };

    // ============================================
    // SECȚIUNEA 3: UTILITĂȚI
    // ============================================

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
        }
    };

    // ============================================
    // SECȚIUNEA 4: PRODUCT DATA MANAGER
    // ============================================

    const ProductManager = {
        products: null,

        loadAllProducts() {
            if (this.products) return this.products;

            const products = [];

            // Din PRODUCTS_DATA
            if (window.PRODUCTS_DATA && Array.isArray(window.PRODUCTS_DATA)) {
                window.PRODUCTS_DATA.forEach(p => {
                    products.push({
                        id: p.id,
                        title: p.title,
                        price: p.price,
                        image: p.image,
                        category: p.category,
                        subcategory: p.subcategory,
                        oldPrice: p.oldPrice
                    });
                });
            }

            // Din POOLS_PRODUCTS
            if (window.POOLS_PRODUCTS && window.POOLS_PRODUCTS.pools) {
                window.POOLS_PRODUCTS.pools.forEach(p => {
                    products.push({
                        id: p.id,
                        title: p.title,
                        price: p.price,
                        image: p.image,
                        category: p.category || 'baseine_intex',
                        subcategory: p.subcategory || p.sub,
                        oldPrice: p.oldPrice
                    });
                });
            }

            this.products = products;
            console.log('[ProductManager] Loaded', products.length, 'products');
            return products;
        },

        findById(id) {
            const products = this.loadAllProducts();
            return products.find(p => p.id === id);
        },

        getRandomProducts(count) {
            const products = this.loadAllProducts();
            if (products.length === 0) return [];
            
            const shuffled = [...products].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, Math.min(count, products.length));
        }
    };

    // ============================================
    // SECȚIUNEA 5: CLASA PRINCIPALĂ
    // ============================================

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

            // Așteaptă ca toate dependințele să fie încărcate
            this.waitForDependencies().then(() => {
                this.init();
            });
        }

        async waitForDependencies() {
            let attempts = 0;
            while (attempts < 100) { // Max 10 secunde
                // Verifică dacă avem ce avem nevoie
                const hasData = window.PRODUCTS_DATA || window.POOLS_PRODUCTS;
                const hasAuth = window.authManager || localStorage.getItem('intex_auth');
                
                if (hasData) {
                    console.log('[OrdersManager] Dependencies loaded');
                    return;
                }
                
                await new Promise(r => setTimeout(r, 100));
                attempts++;
            }
            console.warn('[OrdersManager] Timeout waiting for dependencies, continuing anyway');
        }

        init() {
            try {
                this.cacheDOMElements();
                
                if (!this.checkAuth()) {
                    return;
                }

                this.setupEventListeners();
                this.loadOrders();

                // Listen pentru schimbări de limbă
                window.addEventListener('languageChanged', () => {
                    console.log('[OrdersManager] Language changed, re-rendering');
                    this.renderOrders();
                });

                // Listen pentru storage changes (login/logout în alte tab-uri)
                window.addEventListener('storage', (e) => {
                    if (e.key === 'intex_auth' || e.key === 'intex_language') {
                        location.reload();
                    }
                });

            } catch (error) {
                console.error('[OrdersManager] Initialization error:', error);
            }
        }

        cacheDOMElements() {
            this.dom.loading = document.getElementById('orders-loading');
            this.dom.empty = document.getElementById('orders-empty');
            this.dom.list = document.getElementById('orders-list');
            this.dom.container = document.getElementById('orders-container');
            this.dom.pagination = document.getElementById('orders-pagination');
        }

        checkAuth() {
            // Verifică authManager
            if (window.authManager && window.authManager.getCurrentUser) {
                this.currentUser = window.authManager.getCurrentUser();
            }

            // Fallback la localStorage
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
            const t = TranslationManager.translate.bind(TranslationManager);
            
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
                    this.orders = storedOrders;
                } else if (CONFIG.DEMO_MODE) {
                    this.orders = this.generateDemoOrders();
                    this.saveOrders();
                } else {
                    this.orders = [];
                }

                this.renderOrders();
                
            } catch (error) {
                console.error('[OrdersManager] Error loading orders:', error);
            } finally {
                this.isLoading = false;
                this.showLoading(false);
            }
        }

        getStoredOrders() {
            if (!Utils.storageAvailable()) return null;
            
            try {
                const key = CONFIG.USER_PREFIX + (this.currentUser?.email || 'guest');
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : null;
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

        // ============================================
        // GENERARE COMENZI DEMO
        // ============================================

        generateDemoOrders() {
            const now = Date.now();
            const day = 86400000;
            const t = TranslationManager.translate.bind(TranslationManager);

            // Obține produse reale
            const products = ProductManager.getRandomProducts(4);
            
            if (products.length === 0) {
                console.warn('[OrdersManager] No products found, using fallback');
                return this.generateFallbackOrders();
            }

            const items1 = products.slice(0, 2).map(p => ({
                id: p.id,
                name: TranslationManager.getProductTitle(p),
                price: p.price,
                image: p.image,
                qty: 1,
                sku: p.id
            }));

            const items2 = products.slice(2, 4).map(p => ({
                id: p.id,
                name: TranslationManager.getProductTitle(p),
                price: p.price,
                image: p.image,
                qty: Math.floor(Math.random() * 2) + 1,
                sku: p.id
            }));

            const total1 = items1.reduce((sum, item) => sum + (item.price * item.qty), 0);
            const total2 = items2.reduce((sum, item) => sum + (item.price * item.qty), 0);

            return [
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
        }

        generateFallbackOrders() {
            const t = TranslationManager.translate.bind(TranslationManager);
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
                        { id: 'PROD-001', name: 'Piscină INTEX 305x76cm', price: 899, image: 'assets/img/no-image.jpg', qty: 1, sku: 'PROD-001' },
                        { id: 'PROD-002', name: 'Pompă filtrare', price: 351, image: 'assets/img/no-image.jpg', qty: 1, sku: 'PROD-002' }
                    ],
                    shipping: { name: 'Client', address: 'Str. Exemplu 123', phone: '069123456', city: 'Chișinău', postalCode: '2000' },
                    payment: 'Cash on delivery',
                    timeline: [
                        { status: 'ordered', date: new Date(now - day * 5).toISOString(), note: 'Comandă plasată' },
                        { status: 'delivered', date: new Date(now - day * 2).toISOString(), note: 'Livrată' }
                    ]
                }
            ];
        }

        // ============================================
        // RENDERING
        // ============================================

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
            const t = TranslationManager.translate.bind(TranslationManager);
            
            if (this.dom.empty) {
                this.dom.empty.innerHTML = `
                    <div class="orders-empty-state" style="text-align: center; padding: 3rem;">
                        <i class="fas fa-box-open" style="font-size: 4rem; color: #38bdf8; margin-bottom: 1.5rem;"></i>
                        <h3 style="color: #fff; margin-bottom: 0.5rem;">${t('no_orders_title')}</h3>
                        <p style="color: #94a3b8; margin-bottom: 1.5rem;">${t('no_orders_text')}</p>
                        <a href="../index.html#produse" class="btn-main" style="background: #38bdf8; color: #0f172a; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; display: inline-block; font-weight: 600;">
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

            const html = pageOrders.map(order => this.createOrderCard(order)).join('');
            
            this.dom.list.innerHTML = html;
            this.dom.list.style.display = 'grid';
            
            if (this.dom.empty) {
                this.dom.empty.style.display = 'none';
            }

            this.animateEntrance();
        }

        createOrderCard(order) {
            const t = TranslationManager.translate.bind(TranslationManager);
            const statusConfig = Object.values(ORDER_STATUS).find(s => s.key === order.status) || ORDER_STATUS.PENDING;
            const date = Utils.formatDate(order.date);
            const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);
            
            // Imagini produse
            const imagesHtml = order.items.slice(0, 3).map((item, index) => 
                `<img src="${Utils.escapeHtml(item.image || 'assets/img/no-image.jpg')}" 
                      alt="${Utils.escapeHtml(item.name)}" 
                      class="order-item-thumb"
                      style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 8px;"
                      loading="${index === 0 ? 'eager' : 'lazy'}"
                      onerror="this.src='assets/img/no-image.jpg'">`
            ).join('');

            const moreCount = order.items.length - 3;
            const moreHtml = moreCount > 0 ? 
                `<div class="order-item-more" style="width: 60px; height: 60px; background: rgba(56, 189, 248, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #38bdf8; font-weight: 600;">+${moreCount}</div>` : '';

            const canCancel = ['pending', 'processing'].includes(order.status);
            const canReorder = ['delivered', 'cancelled'].includes(order.status);
            const canTrack = ['shipped', 'delivered'].includes(order.status);

            // Folosește TOTDEAUNA TranslationManager pentru texte
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
                        <div class="order-items-preview" style="display: flex; align-items: center; margin-bottom: 1rem;">
                            ${imagesHtml}
                            ${moreHtml}
                        </div>
                        
                        <div class="order-summary" style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: #94a3b8;">${t('items_count', {count: itemCount})}</span>
                            <span class="order-total" style="color: #38bdf8; font-size: 1.25rem; font-weight: 700;">${Utils.formatPrice(order.total)}</span>
                        </div>
                        ${order.shipping ? `
                            <div class="order-shipping-info" style="color: #64748b; font-size: 0.9rem; margin-top: 0.5rem;">
                                <i class="fas fa-map-marker-alt"></i>
                                ${Utils.escapeHtml(order.shipping.city || 'Chișinău')}
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="order-footer" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button class="btn-order-action btn-order-primary" 
                                onclick="IntexOrders.viewDetails('${Utils.escapeHtml(order.id)}')"
                                style="flex: 1; min-width: 120px; background: #38bdf8; color: #0f172a; border: none; padding: 0.75rem; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                            <i class="fas fa-eye"></i> ${t('order_details')}
                        </button>
                        
                        ${canTrack ? `
                            <button class="btn-order-action btn-order-secondary" 
                                    onclick="IntexOrders.trackOrder('${Utils.escapeHtml(order.id)}')"
                                    style="flex: 1; min-width: 120px; background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 0.75rem; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                                <i class="fas fa-truck"></i> ${t('track_order')}
                            </button>
                        ` : ''}
                        
                        ${canReorder ? `
                            <button class="btn-order-action btn-order-secondary" 
                                    onclick="IntexOrders.reorder('${Utils.escapeHtml(order.id)}')"
                                    style="flex: 1; min-width: 120px; background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 0.75rem; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                                <i class="fas fa-redo"></i> ${t('reorder')}
                            </button>
                        ` : ''}
                        
                        ${canCancel ? `
                            <button class="btn-order-action btn-order-danger" 
                                    onclick="IntexOrders.cancelOrder('${Utils.escapeHtml(order.id)}')"
                                    style="flex: 1; min-width: 120px; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 0.75rem; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
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

        // ============================================
        // MODAL DETALII
        // ============================================

        viewDetails(orderId) {
            const order = this.orders.find(o => o.id === orderId);
            if (!order) return;
            this.showOrderDetailsModal(order);
        }

        showOrderDetailsModal(order) {
            const t = TranslationManager.translate.bind(TranslationManager);
            const existing = document.querySelector('.order-details-modal');
            if (existing) {
                existing.classList.remove('active');
                setTimeout(() => existing.remove(), 300);
            }

            const statusConfig = Object.values(ORDER_STATUS).find(s => s.key === order.status) || ORDER_STATUS.PENDING;
            const date = Utils.formatDate(order.date, true);
            
            const timelineHtml = order.timeline ? this.renderTimeline(order.timeline) : '';
            
            // Items cu date actualizate din ProductManager
            const itemsHtml = order.items.map(item => {
                const product = ProductManager.findById(item.id);
                const productName = product ? TranslationManager.getProductTitle(product) : item.name;
                const productImage = product?.image || item.image || 'assets/img/no-image.jpg';
                
                return `
                    <div class="order-item-detail" style="display: flex; gap: 1rem; padding: 1rem; background: rgba(15, 23, 42, 0.5); border-radius: 12px; margin-bottom: 0.75rem;">
                        <img src="${Utils.escapeHtml(productImage)}" 
                             alt="${Utils.escapeHtml(productName)}" 
                             style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;"
                             onerror="this.src='assets/img/no-image.jpg'">
                        <div class="order-item-info" style="flex: 1;">
                            <div class="order-item-name" style="color: #fff; font-weight: 600; margin-bottom: 0.25rem;">${Utils.escapeHtml(productName)}</div>
                            <div class="order-item-meta" style="color: #94a3b8; font-size: 0.9rem;">
                                ${item.sku || item.id ? `<span style="display: block; margin-bottom: 0.25rem;">SKU: ${Utils.escapeHtml(item.sku || item.id)}</span>` : ''}
                                <span>${t('quantity')}: ${item.qty} × ${Utils.formatPrice(item.price)}</span>
                            </div>
                        </div>
                        <div class="order-item-price" style="color: #38bdf8; font-weight: 700; font-size: 1.1rem; align-self: center;">
                            ${Utils.formatPrice(item.price * item.qty)}
                        </div>
                    </div>
                `;
            }).join('');

            const modal = document.createElement('div');
            modal.className = 'order-details-modal';
            modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem;';
            
            modal.innerHTML = `
                <div class="order-details-backdrop" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px);" onclick="IntexOrders.closeModal()"></div>
                <div class="order-details-content" style="position: relative; background: #1e293b; border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 20px; max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
                    <div class="order-details-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid rgba(56, 189, 248, 0.2);">
                        <h3 style="color: #fff; margin: 0; display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fas fa-file-invoice" style="color: #38bdf8;"></i>
                            ${t('order_details')} #${Utils.escapeHtml(order.id)}
                        </h3>
                        <div style="display: flex; gap: 0.5rem;">
                            <button onclick="IntexOrders.printOrder('${Utils.escapeHtml(order.id)}')" 
                                    style="background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); width: 40px; height: 40px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-print"></i>
                            </button>
                            <button onclick="IntexOrders.closeModal()" 
                                    style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); width: 40px; height: 40px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="order-details-body" style="padding: 1.5rem;">
                        <div class="order-info-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                            <div class="info-card" style="background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: 12px;">
                                <div style="color: #64748b; font-size: 0.85rem; margin-bottom: 0.25rem;">${t('order_date')}</div>
                                <div style="color: #fff; font-weight: 600;">${date}</div>
                            </div>
                            
                            <div class="info-card" style="background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: 12px;">
                                <div style="color: #64748b; font-size: 0.85rem; margin-bottom: 0.25rem;">Status</div>
                                <div style="color: ${statusConfig.color}; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
                                    <i class="fas ${statusConfig.icon}"></i>
                                    ${TranslationManager.getStatusText(order.status)}
                                </div>
                            </div>
                            
                            <div class="info-card" style="background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: 12px;">
                                <div style="color: #64748b; font-size: 0.85rem; margin-bottom: 0.25rem;">${t('payment_method')}</div>
                                <div style="color: #fff; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
                                    <i class="fas fa-credit-card" style="color: #38bdf8;"></i>
                                    ${Utils.escapeHtml(order.payment)}
                                </div>
                            </div>
                        </div>

                        ${timelineHtml ? `
                            <div class="order-timeline-section" style="margin-bottom: 1.5rem;">
                                <h4 style="color: #fff; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <i class="fas fa-history" style="color: #38bdf8;"></i> ${t('order_timeline')}
                                </h4>
                                ${timelineHtml}
                            </div>
                        ` : ''}

                        <div class="order-shipping-section" style="background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem;">
                            <h4 style="color: #fff; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-shipping-fast" style="color: #38bdf8;"></i> ${t('delivery_to')}
                            </h4>
                            <div style="color: #94a3b8;">
                                <p style="margin: 0 0 0.25rem 0;"><strong style="color: #fff;">${Utils.escapeHtml(order.shipping?.name || '')}</strong></p>
                                <p style="margin: 0 0 0.25rem 0;">${Utils.escapeHtml(order.shipping?.address || '')}</p>
                                <p style="margin: 0;"><i class="fas fa-phone" style="color: #38bdf8; margin-right: 0.5rem;"></i> ${Utils.escapeHtml(order.shipping?.phone || '')}</p>
                            </div>
                        </div>
                        
                        <div class="order-items-section" style="margin-bottom: 1.5rem;">
                            <h4 style="color: #fff; margin-bottom: 1rem;">${t('items_count', {count: order.items.length})}</h4>
                            <div class="order-items-list">
                                ${itemsHtml}
                            </div>
                        </div>
                        
                        <div class="order-totals" style="background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: 12px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #94a3b8;">
                                <span>${t('subtotal')}</span>
                                <span>${Utils.formatPrice(order.subtotal || order.total * 0.9)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #94a3b8;">
                                <span>${t('shipping')}</span>
                                <span>${Utils.formatPrice(order.shippingCost || 50)}</span>
                            </div>
                            ${order.tax ? `
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #94a3b8;">
                                    <span>${t('tax')}</span>
                                    <span>${Utils.formatPrice(order.tax)}</span>
                                </div>
                            ` : ''}
                            <div style="display: flex; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid rgba(56, 189, 248, 0.2); color: #fff; font-size: 1.1rem; font-weight: 700;">
                                <span>${t('order_total')}</span>
                                <span style="color: #38bdf8;">${Utils.formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="order-details-footer" style="padding: 1.5rem; border-top: 1px solid rgba(56, 189, 248, 0.2);">
                        <button onclick="IntexOrders.closeModal()" style="background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-arrow-left"></i> ${t('back_to_orders')}
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            
            requestAnimationFrame(() => {
                modal.style.opacity = '0';
                modal.style.transition = 'opacity 0.3s ease';
                requestAnimationFrame(() => {
                    modal.style.opacity = '1';
                });
            });
        }

        renderTimeline(timeline) {
            return `
                <div class="timeline" style="position: relative; padding-left: 2rem;">
                    ${timeline.map((event, index) => {
                        const statusConfig = Object.values(ORDER_STATUS).find(s => s.key === event.status) || ORDER_STATUS.PENDING;
                        const isLast = index === timeline.length - 1;
                        return `
                            <div class="timeline-item" style="position: relative; padding-bottom: ${isLast ? '0' : '1.5rem'};">
                                <div class="timeline-marker" style="position: absolute; left: -2rem; top: 0; width: 12px; height: 12px; background: ${statusConfig.color}; border-radius: 50%; border: 2px solid #1e293b; box-shadow: 0 0 0 2px ${statusConfig.color};">
                                    <i class="fas ${statusConfig.icon}" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.5rem; color: #fff;"></i>
                                </div>
                                ${!isLast ? `<div style="position: absolute; left: -1.55rem; top: 12px; width: 2px; height: calc(100% - 12px); background: rgba(56, 189, 248, 0.3);"></div>` : ''}
                                <div class="timeline-content">
                                    <div style="color: #64748b; font-size: 0.85rem; margin-bottom: 0.25rem;">${Utils.formatDate(event.date, true)}</div>
                                    <div style="color: #fff; font-weight: 500;">${Utils.escapeHtml(event.note)}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }

        closeModal() {
            const modal = document.querySelector('.order-details-modal');
            if (modal) {
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 300);
            }
        }

        // ============================================
        // ACȚIUNI
        // ============================================

        async cancelOrder(orderId) {
            const t = TranslationManager.translate.bind(TranslationManager);
            if (!confirm(t('confirm_cancel'))) return;

            const order = this.orders.find(o => o.id === orderId);
            if (!order) return;

            try {
                await this.simulateDelay(500);
                
                order.status = 'cancelled';
                order.timeline = order.timeline || [];
                order.timeline.unshift({
                    status: 'cancelled',
                    date: new Date().toISOString(),
                    note: 'Comandă anulată de client'
                });

                this.saveOrders();
                this.renderOrders();
                this.showNotification('success', t('order_cancelled'));
                this.closeModal();
                
            } catch (error) {
                console.error('[OrdersManager] Cancel error:', error);
            }
        }

        async reorder(orderId) {
            const t = TranslationManager.translate.bind(TranslationManager);
            const order = this.orders.find(o => o.id === orderId);
            if (!order) return;

            try {
                if (window.cartManager) {
                    order.items.forEach(item => {
                        const product = ProductManager.findById(item.id);
                        
                        window.cartManager.addItem({
                            id: item.id,
                            name: product ? TranslationManager.getProductTitle(product) : item.name,
                            price: product?.price || item.price,
                            image: product?.image || item.image,
                            quantity: item.qty,
                            sku: item.sku || item.id
                        });
                    });
                }

                this.showNotification('success', t('items_added_to_cart'));

                setTimeout(() => {
                    window.location.href = 'cos.html';
                }, 1000);
                
            } catch (error) {
                console.error('[OrdersManager] Reorder error:', error);
            }
        }

        trackOrder(orderId) {
            const t = TranslationManager.translate.bind(TranslationManager);
            const order = this.orders.find(o => o.id === orderId);
            if (!order) return;

            alert(`Tracking: ${order.id}\n${t('order_status_' + order.status)}`);
        }

        printOrder(orderId) {
            const t = TranslationManager.translate.bind(TranslationManager);
            const order = this.orders.find(o => o.id === orderId);
            if (!order) return;

            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>Comanda ${order.id}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
                        .items { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        .items th, .items td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                        .total { text-align: right; font-size: 1.2em; font-weight: bold; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>INTEX Moldova - Comanda #${order.id}</h1>
                        <p>${t('order_date')}: ${Utils.formatDate(order.date, true)}</p>
                        <p>Status: ${TranslationManager.getStatusText(order.status)}</p>
                    </div>
                    <table class="items">
                        <thead>
                            <tr>
                                <th>${t('product')}</th>
                                <th>${t('quantity')}</th>
                                <th>${t('price')}</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.qty}</td>
                                    <td>${Utils.formatPrice(item.price)}</td>
                                    <td>${Utils.formatPrice(item.price * item.qty)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="total">
                        ${t('order_total')}: ${Utils.formatPrice(order.total)}
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }

        goToPage(page) {
            this.currentPage = page;
            this.renderOrders();
            this.dom.list?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // ============================================
        // UTILITĂȚI
        // ============================================

        showNotification(type, message) {
            if (window.showNotification) {
                window.showNotification(type, message);
            } else if (window.showSuccessI18n && type === 'success') {
                window.showSuccessI18n(message);
            } else {
                alert(message);
            }
        }

        setupEventListeners() {
            const searchInput = document.getElementById('orders-search');
            if (searchInput) {
                searchInput.addEventListener('input', 
                    Utils.debounce((e) => {
                        this.filters.search = e.target.value;
                        this.currentPage = 1;
                        this.renderOrders();
                    }, CONFIG.DEBOUNCE_DELAY)
                );
            }

            document.querySelectorAll('[data-filter-status]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('[data-filter-status]').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.filters.status = e.target.dataset.filterStatus;
                    this.currentPage = 1;
                    this.renderOrders();
                });
            });
        }

        addOrder(orderData) {
            const t = TranslationManager.translate.bind(TranslationManager);
            
            if (!this.currentUser) {
                console.error('[OrdersManager] Cannot add order: no user');
                return null;
            }

            try {
                const processedItems = (orderData.items || []).map(item => {
                    const product = ProductManager.findById(item.id);
                    return {
                        id: item.id,
                        name: product ? TranslationManager.getProductTitle(product) : item.name,
                        price: item.price,
                        image: product?.image || item.image,
                        qty: item.quantity || item.qty || 1,
                        sku: item.id
                    };
                });

                const newOrder = {
                    id: Utils.generateId(),
                    date: new Date().toISOString(),
                    status: 'pending',
                    timeline: [{
                        status: 'ordered',
                        date: new Date().toISOString(),
                        note: 'Comandă plasată'
                    }],
                    ...orderData,
                    items: processedItems
                };

                this.orders.unshift(newOrder);
                this.saveOrders();
                
                this.showNotification('success', t('order_placed_toast'));
                
                return newOrder;
            } catch (error) {
                console.error('[OrdersManager] Add order error:', error);
                return null;
            }
        }
    }

    // ============================================
    // EXPORT
    // ============================================

    let ordersManager;

    // Inițializare imediată
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            ordersManager = new OrdersManager();
        });
    } else {
        ordersManager = new OrdersManager();
    }

    window.IntexOrders = {
        get instance() { return ordersManager; },
        viewDetails: (id) => ordersManager?.viewDetails(id),
        cancelOrder: (id) => ordersManager?.cancelOrder(id),
        reorder: (id) => ordersManager?.reorder(id),
        trackOrder: (id) => ordersManager?.trackOrder(id),
        printOrder: (id) => ordersManager?.printOrder(id),
        closeModal: () => ordersManager?.closeModal(),
        goToPage: (p) => ordersManager?.goToPage(p),
        addOrder: (data) => ordersManager?.addOrder(data),
        searchOrders: (q) => {
            if (ordersManager) {
                ordersManager.filters.search = q;
                ordersManager.currentPage = 1;
                ordersManager.renderOrders();
            }
        },
        setFilter: (t, v) => ordersManager?.setFilter(t, v),
        refresh: () => ordersManager?.loadOrders()
    };

})();