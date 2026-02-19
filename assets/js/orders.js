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
        ANIMATION_DURATION: 300,
        MAX_RETRIES: 3,
        RETRY_DELAY: 1000
    };

    const ORDER_STATUS = {
        PENDING: { key: 'pending', color: '#92400e', icon: 'fa-clock' },
        PROCESSING: { key: 'processing', color: '#1e40af', icon: 'fa-cog fa-spin' },
        SHIPPED: { key: 'shipped', color: '#3730a3', icon: 'fa-truck' },
        DELIVERED: { key: 'delivered', color: '#065f46', icon: 'fa-check-circle' },
        CANCELLED: { key: 'cancelled', color: '#991b1b', icon: 'fa-times-circle' },
        REFUNDED: { key: 'refunded', color: '#6b7280', icon: 'fa-undo' }
    };

    // ============================================
    // SECȚIUNEA 2: UTILITĂȚI ȘI HELPERE
    // ============================================

    const Utils = {
        // Escape HTML pentru securitate
        escapeHtml(str) {
            if (!str) return '';
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },

        // Format preț cu locale
        formatPrice(amount, currency = 'LEI') {
            return new Intl.NumberFormat('ro-RO', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount) + ' ' + currency;
        },

        // Format dată cu locale
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

        // Debounce pentru performanță
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

        // Throttle pentru scroll events
        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Generare ID unic
        generateId() {
            return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        },

        // Deep clone pentru obiecte
        deepClone(obj) {
            return JSON.parse(JSON.stringify(obj));
        },

        // Verificare suport localStorage
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
    // SECȚIUNEA 3: TRANSLATION HELPERS
    // ============================================

    const I18n = {
        get(key, params = {}) {
            // Folosește sistemul de traduceri din main.js dacă există
            if (window.getTranslation) {
                return window.getTranslation(key, params);
            }
            
            // Fallback pentru chei specifice orders
            const translations = {
                ro: {
                    order_cancelled: 'Comanda a fost anulată cu succes',
                    items_added_to_cart: 'Produsele au fost adăugate în coș',
                    auth_required: 'Trebuie să fiți autentificat pentru a vedea comenzile',
                    login_to_view_orders: 'Conectați-vă pentru a vedea istoricul comenzilor',
                    login_btn: 'Autentificare',
                    loading_orders: 'Se încarcă comenzile...',
                    no_orders_title: 'Nu aveți comenzi încă',
                    no_orders_text: 'Descoperiți produsele noastre și plasați prima comandă!',
                    browse_products: 'Vezi Produse',
                    order_details: 'Detalii Comandă',
                    reorder: 'Recomandă',
                    cancel_order: 'Anulează',
                    print_order: 'Printează',
                    track_order: 'Urmărire',
                    order_status_pending: 'În așteptare',
                    order_status_processing: 'În procesare',
                    order_status_shipped: 'Expediată',
                    order_status_delivered: 'Livrată',
                    order_status_cancelled: 'Anulată',
                    order_status_refunded: 'Rambursată',
                    confirm_cancel: 'Sigur doriți să anulați această comandă?',
                    items_count: '{count} produse',
                    delivery_to: 'Livrare către',
                    payment_method: 'Metodă de plată',
                    order_date: 'Data comenzii',
                    order_total: 'Total comandă',
                    subtotal: 'Subtotal',
                    shipping: 'Transport',
                    tax: 'TVA',
                    discount: 'Discount',
                    order_timeline: 'Istoric comandă',
                    back_to_orders: 'Înapoi la comenzi',
                    order_placed_toast: 'Comanda a fost plasată cu succes!'
                },
                ru: {
                    order_cancelled: 'Заказ успешно отменён',
                    items_added_to_cart: 'Товары добавлены в корзину',
                    auth_required: 'Вы должны быть авторизованы для просмотра заказов',
                    login_to_view_orders: 'Войдите, чтобы просмотреть историю заказов',
                    login_btn: 'Вход',
                    loading_orders: 'Загрузка заказов...',
                    no_orders_title: 'У вас пока нет заказов',
                    no_orders_text: 'Откройте для себя наши продукты и сделайте первый заказ!',
                    browse_products: 'Смотреть товары',
                    order_details: 'Детали заказа',
                    reorder: 'Повторить',
                    cancel_order: 'Отменить',
                    print_order: 'Печать',
                    track_order: 'Отслеживание',
                    order_status_pending: 'В ожидании',
                    order_status_processing: 'В обработке',
                    order_status_shipped: 'Отправлен',
                    order_status_delivered: 'Доставлен',
                    order_status_cancelled: 'Отменён',
                    order_status_refunded: 'Возвращён',
                    confirm_cancel: 'Вы уверены, что хотите отменить этот заказ?',
                    items_count: '{count} товаров',
                    delivery_to: 'Доставка по адресу',
                    payment_method: 'Способ оплаты',
                    order_date: 'Дата заказа',
                    order_total: 'Итого заказ',
                    subtotal: 'Подытог',
                    shipping: 'Доставка',
                    tax: 'НДС',
                    discount: 'Скидка',
                    order_timeline: 'История заказа',
                    back_to_orders: 'Назад к заказам',
                    order_placed_toast: 'Заказ успешно оформлен!'
                },
                en: {
                    order_cancelled: 'Order cancelled successfully',
                    items_added_to_cart: 'Items added to cart',
                    auth_required: 'You must be logged in to view orders',
                    login_to_view_orders: 'Login to view your order history',
                    login_btn: 'Login',
                    loading_orders: 'Loading orders...',
                    no_orders_title: "You don't have any orders yet",
                    no_orders_text: 'Discover our products and place your first order!',
                    browse_products: 'Browse Products',
                    order_details: 'Order Details',
                    reorder: 'Reorder',
                    cancel_order: 'Cancel',
                    print_order: 'Print',
                    track_order: 'Track',
                    order_status_pending: 'Pending',
                    order_status_processing: 'Processing',
                    order_status_shipped: 'Shipped',
                    order_status_delivered: 'Delivered',
                    order_status_cancelled: 'Cancelled',
                    order_status_refunded: 'Refunded',
                    confirm_cancel: 'Are you sure you want to cancel this order?',
                    items_count: '{count} items',
                    delivery_to: 'Delivery to',
                    payment_method: 'Payment method',
                    order_date: 'Order date',
                    order_total: 'Order total',
                    subtotal: 'Subtotal',
                    shipping: 'Shipping',
                    tax: 'VAT',
                    discount: 'Discount',
                    order_timeline: 'Order timeline',
                    back_to_orders: 'Back to orders',
                    order_placed_toast: 'Order placed successfully!'
                }
            };

            const lang = localStorage.getItem('intex_language') || 'ro';
            let text = translations[lang]?.[key] || key;
            
            Object.keys(params).forEach(k => {
                text = text.replace(new RegExp(`{${k}}`, 'g'), params[k]);
            });
            
            return text;
        }
    };

    // ============================================
    // SECȚIUNEA 4: CLASA PRINCIPALĂ
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
            
            // Cache DOM elements
            this.dom = {
                loading: null,
                empty: null,
                list: null,
                container: null,
                pagination: null
            };

            this.init();
        }

        // ============================================
        // INITIALIZARE
        // ============================================

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
                    this.renderOrders();
                });

            } catch (error) {
                console.error('[OrdersManager] Initialization error:', error);
                this.showError('init_error');
            }
        }

        cacheDOMElements() {
            this.dom.loading = document.getElementById('orders-loading');
            this.dom.empty = document.getElementById('orders-empty');
            this.dom.list = document.getElementById('orders-list');
            this.dom.container = document.getElementById('orders-container');
            this.dom.pagination = document.getElementById('orders-pagination');
        }

        // ============================================
        // AUTENTIFICARE
        // ============================================

        checkAuth() {
            // Verificăm authManager din main.js
            if (window.authManager) {
                this.currentUser = window.authManager.getCurrentUser();
            }

            // Fallback: verificăm localStorage direct
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
            // Afișăm mesaj în loc de redirect automat
            if (this.dom.empty) {
                this.dom.empty.innerHTML = `
                    <div class="orders-empty-state">
                        <i class="fas fa-lock" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;"></i>
                        <h3>${I18n.get('auth_required')}</h3>
                        <p>${I18n.get('login_to_view_orders')}</p>
                        <button class="btn-main" onclick="window.openLoginModal()">
                            <i class="fas fa-sign-in-alt"></i> ${I18n.get('login_btn')}
                        </button>
                    </div>
                `;
                this.dom.empty.style.display = 'block';
            }

            if (this.dom.loading) {
                this.dom.loading.style.display = 'none';
            }

            // Salvăm URL pentru redirect după login
            sessionStorage.setItem('redirectAfterLogin', window.location.href);
        }

        // ============================================
        // ÎNCĂRCARE COMENZI
        // ============================================

        async loadOrders() {
            if (this.isLoading) return;
            
            this.isLoading = true;
            this.showLoading(true);

            try {
                // Simulăm delay pentru realism
                await this.simulateDelay(800);

                const storedOrders = this.getStoredOrders();
                
                if (storedOrders && storedOrders.length > 0) {
                    this.orders = storedOrders;
                } else if (CONFIG.DEMO_MODE) {
                    // Generăm comenzi demo doar dacă nu există altele
                    this.orders = this.generateDemoOrders();
                    this.saveOrders();
                } else {
                    this.orders = [];
                }

                this.renderOrders();
                
            } catch (error) {
                console.error('[OrdersManager] Error loading orders:', error);
                this.showError('load_error');
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
                // Fallback: încercăm să salvăm doar ultimele 10 comenzi
                try {
                    const trimmedOrders = this.orders.slice(0, 10);
                    localStorage.setItem(key, JSON.stringify(trimmedOrders));
                } catch (e2) {
                    console.error('[OrdersManager] Critical storage error');
                }
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

            return [
                {
                    id: 'ORD-2024-001',
                    date: new Date(now - day * 2).toISOString(),
                    status: 'delivered',
                    total: 1250.00,
                    subtotal: 1100.00,
                    shippingCost: 50.00,
                    tax: 100.00,
                    items: [
                        { 
                            id: 'PROD-001',
                            name: 'Piscină INTEX 305x76cm', 
                            qty: 1, 
                            price: 899.00, 
                            image: 'assets/img/pool1.jpg',
                            sku: 'INTX-30576'
                        },
                        { 
                            id: 'PROD-002',
                            name: 'Pompă filtrare', 
                            qty: 1, 
                            price: 351.00, 
                            image: 'assets/img/pump1.jpg',
                            sku: 'PUMP-001'
                        }
                    ],
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
                    total: 2450.50,
                    subtotal: 2300.00,
                    shippingCost: 50.00,
                    tax: 100.50,
                    items: [
                        { 
                            id: 'PROD-003',
                            name: 'Piscină cu cadru metalic 457x122cm', 
                            qty: 1, 
                            price: 2299.00, 
                            image: 'assets/img/pool2.jpg',
                            sku: 'INTX-457122'
                        },
                        { 
                            id: 'PROD-004',
                            name: 'Scară piscină', 
                            qty: 1, 
                            price: 151.50, 
                            image: 'assets/img/ladder1.jpg',
                            sku: 'LAD-001'
                        }
                    ],
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

        // ============================================
        // RENDERING ȘI UI
        // ============================================

        showLoading(show) {
            if (this.dom.loading) {
                this.dom.loading.style.display = show ? 'flex' : 'none';
            }
            if (this.dom.empty) {
                this.dom.empty.style.display = 'none';
            }
            if (this.dom.list) {
                this.dom.list.style.display = show ? 'none' : 'flex';
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
                // Filtru status
                if (this.filters.status !== 'all' && order.status !== this.filters.status) {
                    return false;
                }
                
                // Filtru căutare
                if (this.filters.search) {
                    const searchLower = this.filters.search.toLowerCase();
                    const matchId = order.id.toLowerCase().includes(searchLower);
                    const matchItems = order.items.some(item => 
                        item.name.toLowerCase().includes(searchLower)
                    );
                    if (!matchId && !matchItems) return false;
                }

                // Filtru dată
                if (this.filters.dateFrom) {
                    const orderDate = new Date(order.date);
                    const fromDate = new Date(this.filters.dateFrom);
                    if (orderDate < fromDate) return false;
                }
                
                if (this.filters.dateTo) {
                    const orderDate = new Date(order.date);
                    const toDate = new Date(this.filters.dateTo);
                    if (orderDate > toDate) return false;
                }

                return true;
            }).sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        renderEmptyState() {
            if (this.dom.empty) {
                this.dom.empty.innerHTML = `
                    <div class="orders-empty-state">
                        <i class="fas fa-box-open" style="font-size: 4rem; color: var(--primary-light); margin-bottom: 1.5rem;"></i>
                        <h3>${I18n.get('no_orders_title')}</h3>
                        <p>${I18n.get('no_orders_text')}</p>
                        <a href="../index.html#produse" class="btn-main" style="margin-top: 1rem; display: inline-block;">
                            <i class="fas fa-shopping-bag"></i> ${I18n.get('browse_products')}
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

            // Animație de intrare
            this.animateEntrance();
        }

        createOrderCard(order) {
            const statusConfig = ORDER_STATUS[order.status.toUpperCase()] || ORDER_STATUS.PENDING;
            const date = Utils.formatDate(order.date);
            const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);
            
            // Primele 3 imagini cu lazy loading
            const imagesHtml = order.items.slice(0, 3).map((item, index) => 
                `<img src="${Utils.escapeHtml(item.image || 'assets/img/placeholder.jpg')}" 
                      alt="${Utils.escapeHtml(item.name)}" 
                      class="order-item-thumb"
                      loading="${index === 0 ? 'eager' : 'lazy'}">`
            ).join('');

            const moreCount = order.items.length - 3;
            const moreHtml = moreCount > 0 ? 
                `<div class="order-item-more">+${moreCount}</div>` : '';

            const canCancel = ['pending', 'processing'].includes(order.status);
            const canReorder = ['delivered', 'cancelled'].includes(order.status);
            const canTrack = ['shipped', 'delivered'].includes(order.status);

            return `
                <article class="order-card" data-order-id="${Utils.escapeHtml(order.id)}" role="listitem">
                    <div class="order-header">
                        <div class="order-meta">
                            <div class="order-id">#${Utils.escapeHtml(order.id)}</div>
                            <time class="order-date" datetime="${order.date}">${date}</time>
                        </div>
                        <span class="order-status" style="--status-color: ${statusConfig.color}">
                            <i class="fas ${statusConfig.icon}"></i>
                            ${I18n.get('order_status_' + order.status)}
                        </span>
                    </div>
                    
                    <div class="order-body">
                        <div class="order-items-preview" aria-label="${I18n.get('items_count', {count: itemCount})}">
                            ${imagesHtml}
                            ${moreHtml}
                        </div>
                        
                        <div class="order-summary">
                            <div class="order-summary-row">
                                <span>${I18n.get('items_count', {count: itemCount})}</span>
                                <span class="order-total">${Utils.formatPrice(order.total)}</span>
                            </div>
                            ${order.shipping ? `
                                <div class="order-shipping-info">
                                    <i class="fas fa-map-marker-alt"></i>
                                    ${Utils.escapeHtml(order.shipping.city || 'Chișinău')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="order-footer">
                        <button class="btn-order-action btn-order-primary" 
                                onclick="IntexOrders.viewDetails('${Utils.escapeHtml(order.id)}')"
                                aria-label="${I18n.get('order_details')}">
                            <i class="fas fa-eye"></i> ${I18n.get('order_details')}
                        </button>
                        
                        ${canTrack ? `
                            <button class="btn-order-action btn-order-secondary" 
                                    onclick="IntexOrders.trackOrder('${Utils.escapeHtml(order.id)}')"
                                    aria-label="${I18n.get('track_order')}">
                                <i class="fas fa-truck"></i> ${I18n.get('track_order')}
                            </button>
                        ` : ''}
                        
                        ${canReorder ? `
                            <button class="btn-order-action btn-order-secondary" 
                                    onclick="IntexOrders.reorder('${Utils.escapeHtml(order.id)}')"
                                    aria-label="${I18n.get('reorder')}">
                                <i class="fas fa-redo"></i> ${I18n.get('reorder')}
                            </button>
                        ` : ''}
                        
                        ${canCancel ? `
                            <button class="btn-order-action btn-order-danger" 
                                    onclick="IntexOrders.cancelOrder('${Utils.escapeHtml(order.id)}')"
                                    aria-label="${I18n.get('cancel_order')}">
                                <i class="fas fa-times"></i> ${I18n.get('cancel_order')}
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
                        onclick="IntexOrders.goToPage(${this.currentPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </button>
            `;

            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                    html += `
                        <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                                onclick="IntexOrders.goToPage(${i})">${i}</button>
                    `;
                } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                    html += `<span class="pagination-ellipsis">...</span>`;
                }
            }

            html += `
                <button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} 
                        onclick="IntexOrders.goToPage(${this.currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;

            this.dom.pagination.innerHTML = html;
            this.dom.pagination.style.display = 'flex';
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
        // ACȚIUNI COMENZI
        // ============================================

        viewDetails(orderId) {
            const order = this.orders.find(o => o.id === orderId);
            if (!order) {
                console.error('[OrdersManager] Order not found:', orderId);
                return;
            }

            this.showOrderDetailsModal(order);
        }

        showOrderDetailsModal(order) {
            // Remove existing modal
            const existing = document.querySelector('.order-details-modal');
            if (existing) {
                existing.classList.remove('active');
                setTimeout(() => existing.remove(), 300);
            }

            const statusConfig = ORDER_STATUS[order.status.toUpperCase()] || ORDER_STATUS.PENDING;
            const date = Utils.formatDate(order.date, true);
            
            // Timeline
            const timelineHtml = order.timeline ? this.renderTimeline(order.timeline) : '';
            
            // Items
            const itemsHtml = order.items.map(item => `
                <div class="order-item-detail">
                    <img src="${Utils.escapeHtml(item.image || 'assets/img/placeholder.jpg')}" 
                         alt="${Utils.escapeHtml(item.name)}" loading="lazy">
                    <div class="order-item-info">
                        <div class="order-item-name">${Utils.escapeHtml(item.name)}</div>
                        <div class="order-item-meta">
                            ${item.sku ? `<span class="sku">SKU: ${Utils.escapeHtml(item.sku)}</span>` : ''}
                            <span>Qty: ${item.qty} × ${Utils.formatPrice(item.price)}</span>
                        </div>
                    </div>
                    <div class="order-item-price">${Utils.formatPrice(item.price * item.qty)}</div>
                </div>
            `).join('');

            const modal = document.createElement('div');
            modal.className = 'order-details-modal';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-labelledby', 'order-details-title');
            
            modal.innerHTML = `
                <div class="order-details-backdrop"></div>
                <div class="order-details-content" role="document">
                    <div class="order-details-header">
                        <h3 id="order-details-title">
                            <i class="fas fa-file-invoice"></i>
                            ${I18n.get('order_details')} #${Utils.escapeHtml(order.id)}
                        </h3>
                        <div class="order-details-actions">
                            <button class="btn-icon" onclick="IntexOrders.printOrder('${Utils.escapeHtml(order.id)}')" 
                                    title="${I18n.get('print_order')}" aria-label="${I18n.get('print_order')}">
                                <i class="fas fa-print"></i>
                            </button>
                            <button class="btn-icon close-btn" onclick="IntexOrders.closeModal()" 
                                    title="Close" aria-label="Close">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="order-details-body">
                        <div class="order-info-grid">
                            <div class="info-card">
                                <div class="info-label">${I18n.get('order_date')}</div>
                                <div class="info-value">${date}</div>
                            </div>
                            
                            <div class="info-card">
                                <div class="info-label">Status</div>
                                <div class="info-value status-badge" style="--status-color: ${statusConfig.color}">
                                    <i class="fas ${statusConfig.icon}"></i>
                                    ${I18n.get('order_status_' + order.status)}
                                </div>
                            </div>
                            
                            <div class="info-card">
                                <div class="info-label">${I18n.get('payment_method')}</div>
                                <div class="info-value">
                                    <i class="fas fa-credit-card"></i>
                                    ${Utils.escapeHtml(order.payment)}
                                </div>
                            </div>
                        </div>

                        ${timelineHtml ? `
                            <div class="order-timeline-section">
                                <h4><i class="fas fa-history"></i> ${I18n.get('order_timeline')}</h4>
                                ${timelineHtml}
                            </div>
                        ` : ''}

                        <div class="order-shipping-section">
                            <h4><i class="fas fa-shipping-fast"></i> ${I18n.get('delivery_to')}</h4>
                            <div class="shipping-details">
                                <p><strong>${Utils.escapeHtml(order.shipping?.name || '')}</strong></p>
                                <p>${Utils.escapeHtml(order.shipping?.address || '')}</p>
                                <p><i class="fas fa-phone"></i> ${Utils.escapeHtml(order.shipping?.phone || '')}</p>
                            </div>
                        </div>
                        
                        <div class="order-items-section">
                            <h4>${I18n.get('items_count', {count: order.items.length})}</h4>
                            <div class="order-items-list">
                                ${itemsHtml}
                            </div>
                        </div>
                        
                        <div class="order-totals">
                            <div class="total-row">
                                <span>${I18n.get('subtotal')}</span>
                                <span>${Utils.formatPrice(order.subtotal || order.total * 0.9)}</span>
                            </div>
                            <div class="total-row">
                                <span>${I18n.get('shipping')}</span>
                                <span>${Utils.formatPrice(order.shippingCost || 50)}</span>
                            </div>
                            ${order.tax ? `
                                <div class="total-row">
                                    <span>${I18n.get('tax')}</span>
                                    <span>${Utils.formatPrice(order.tax)}</span>
                                </div>
                            ` : ''}
                            <div class="total-row grand-total">
                                <span>${I18n.get('order_total')}</span>
                                <span>${Utils.formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="order-details-footer">
                        <button class="btn-secondary" onclick="IntexOrders.closeModal()">
                            <i class="fas fa-arrow-left"></i> ${I18n.get('back_to_orders')}
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            
            // Trigger animation
            requestAnimationFrame(() => {
                modal.classList.add('active');
            });

            // Event listeners
            const backdrop = modal.querySelector('.order-details-backdrop');
            backdrop?.addEventListener('click', () => this.closeModal());

            // Keyboard navigation
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    this.closeModal();
                    document.removeEventListener('keydown', handleKeyDown);
                }
            };
            document.addEventListener('keydown', handleKeyDown);

            // Focus trap
            this.trapFocus(modal);
        }

        renderTimeline(timeline) {
            return `
                <div class="timeline">
                    ${timeline.map((event, index) => {
                        const statusConfig = ORDER_STATUS[event.status.toUpperCase()] || ORDER_STATUS.PENDING;
                        return `
                            <div class="timeline-item ${index === 0 ? 'active' : ''}">
                                <div class="timeline-marker" style="--status-color: ${statusConfig.color}">
                                    <i class="fas ${statusConfig.icon}"></i>
                                </div>
                                <div class="timeline-content">
                                    <div class="timeline-date">${Utils.formatDate(event.date, true)}</div>
                                    <div class="timeline-status">${Utils.escapeHtml(event.note)}</div>
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
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            }
        }

        trapFocus(element) {
            const focusableElements = element.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            element.addEventListener('keydown', (e) => {
                if (e.key !== 'Tab') return;

                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            });

            firstFocusable?.focus();
        }

        // ============================================
        // ACȚIUNI SPECIFICE
        // ============================================

        async cancelOrder(orderId) {
            if (!confirm(I18n.get('confirm_cancel'))) return;

            const order = this.orders.find(o => o.id === orderId);
            if (!order) return;

            try {
                // Simulăm API call
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
                this.showSuccess('order_cancelled');
                
                // Close modal if open
                this.closeModal();
                
            } catch (error) {
                console.error('[OrdersManager] Cancel error:', error);
                this.showError('cancel_error');
            }
        }

        async reorder(orderId) {
            const order = this.orders.find(o => o.id === orderId);
            if (!order) return;

            try {
                if (window.cartManager) {
                    order.items.forEach(item => {
                        window.cartManager.addItem({
                            id: item.id || Utils.generateId(),
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            quantity: item.qty,
                            sku: item.sku
                        });
                    });
                }

                this.showSuccess('items_added_to_cart');

                // Redirect la coș după 1 secundă
                setTimeout(() => {
                    window.location.href = 'cos.html';
                }, 1000);
                
            } catch (error) {
                console.error('[OrdersManager] Reorder error:', error);
                this.showError('reorder_error');
            }
        }

        trackOrder(orderId) {
            // Simulare tracking
            const order = this.orders.find(o => o.id === orderId);
            if (!order) return;

            // Aici s-ar deschide un modal cu hartă sau redirect la curier
            alert(`Tracking pentru comanda ${orderId}\nStatus: ${I18n.get('order_status_' + order.status)}\nVei fi redirectat la pagina curierului...`);
        }

        printOrder(orderId) {
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
                        <p>Data: ${Utils.formatDate(order.date, true)}</p>
                        <p>Status: ${I18n.get('order_status_' + order.status)}</p>
                    </div>
                    <table class="items">
                        <thead>
                            <tr><th>Produs</th><th>Cantitate</th><th>Preț</th><th>Total</th></tr>
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
                        Total: ${Utils.formatPrice(order.total)}
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
            // Scroll to top of list
            this.dom.list?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // ============================================
        // ADAUGARE COMANDĂ NOUĂ (din checkout)
        // ============================================

        addOrder(orderData) {
            if (!this.currentUser) {
                console.error('[OrdersManager] Cannot add order: no user');
                return null;
            }

            try {
                const newOrder = {
                    id: Utils.generateId(),
                    date: new Date().toISOString(),
                    status: 'pending',
                    timeline: [{
                        status: 'ordered',
                        date: new Date().toISOString(),
                        note: 'Comandă plasată'
                    }],
                    ...orderData
                };

                this.orders.unshift(newOrder);
                this.saveOrders();
                
                // Notificăm despre comanda nouă
                this.showSuccess('order_placed_toast');
                
                return newOrder;
            } catch (error) {
                console.error('[OrdersManager] Add order error:', error);
                return null;
            }
        }

        // ============================================
        // FILTRE ȘI CAUTARE
        // ============================================

        setFilter(type, value) {
            this.filters[type] = value;
            this.currentPage = 1;
            this.renderOrders();
        }

        searchOrders(query) {
            this.filters.search = query;
            this.currentPage = 1;
            this.renderOrders();
        }

        // ============================================
        // NOTIFICĂRI
        // ============================================

        showSuccess(key) {
            if (window.showSuccessI18n) {
                window.showSuccessI18n(key);
            } else if (window.showNotification) {
                window.showNotification('success', I18n.get(key));
            } else {
                console.log('[SUCCESS]', I18n.get(key));
            }
        }

        showError(key) {
            if (window.showErrorI18n) {
                window.showErrorI18n(key);
            } else if (window.showNotification) {
                window.showNotification('error', I18n.get(key));
            } else {
                console.error('[ERROR]', I18n.get(key));
            }
        }

        // ============================================
        // EVENT LISTENERS
        // ============================================

        setupEventListeners() {
            // Listen pentru autentificare
            window.addEventListener('authStateChanged', (e) => {
                if (e.detail?.user) {
                    this.currentUser = e.detail.user;
                    this.loadOrders();
                } else {
                    this.currentUser = null;
                    this.orders = [];
                    this.handleNotAuthenticated();
                }
            });

            // Search input cu debounce
            const searchInput = document.getElementById('orders-search');
            if (searchInput) {
                searchInput.addEventListener('input', 
                    Utils.debounce((e) => this.searchOrders(e.target.value), CONFIG.DEBOUNCE_DELAY)
                );
            }

            // Filter buttons
            document.querySelectorAll('[data-filter-status]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('[data-filter-status]').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.setFilter('status', e.target.dataset.filterStatus);
                });
            });
        }
    }

    // ============================================
    // INITIALIZARE ȘI EXPORT
    // ============================================

    // Creăm instanța
    let ordersManager;

    function initOrdersManager() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                ordersManager = new OrdersManager();
            });
        } else {
            ordersManager = new OrdersManager();
        }
    }

    // Pornim inițializarea
    initOrdersManager();

    // Export global sub namespace protejat
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
        searchOrders: (q) => ordersManager?.searchOrders(q),
        setFilter: (t, v) => ordersManager?.setFilter(t, v),
        refresh: () => ordersManager?.loadOrders()
    };

    // Backward compatibility
    window.ordersManager = ordersManager;

})();