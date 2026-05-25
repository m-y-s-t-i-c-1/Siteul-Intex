let current3DViewerInstance = null;
let is3DModelViewVisible = false;

function initialize3DForProduct(product) {
    if (!product || !product.id) return;
    const productTitle = product.title ? (product.title.ro || product.title.en || product.title) : '';
    if (!hasModel3D(product.id, productTitle)) {
        const toggleBtn = document.getElementById('toggle-2d-3d');
        if (toggleBtn) toggleBtn.style.display = 'none';
        return;
    }
    const container = document.getElementById('model3d-container');
    const viewerDiv = document.getElementById('model3d-viewer');
    const toggle3DBtn = document.getElementById('toggle-2d-3d');
    const imgElement = document.getElementById('modal-product-image');
    if (!container || !viewerDiv || !toggle3DBtn) return;
    
    dispose3DViewer();
    toggle3DBtn.style.display = '';
    toggle3DBtn.classList.add('visible');
    
    // Elimină handler vechi
    if (toggle3DBtn._3dClickHandler) {
        toggle3DBtn.removeEventListener('click', toggle3DBtn._3dClickHandler);
    }
    
    toggle3DBtn._3dClickHandler = function(e) {
        e.preventDefault();
        const is3DVisible = container.classList.contains('visible-3d');
        const modalBody = document.querySelector('.product-modal-body');
        if (is3DVisible) {
            container.classList.remove('visible-3d');
            container.classList.add('hidden');
            imgElement.style.display = 'block';
            toggle3DBtn.innerHTML = '<i class="fas fa-cube"></i> <span data-i18n="view_3d">Vezi în 3D</span>';
            toggle3DBtn.classList.remove('is-3d-active');
            if (modalBody) modalBody.classList.remove('mode-3d');
            // Elimină orice stil inline care ar fi putut rămâne
            container.style.height = '';
            container.style.minHeight = '';
            is3DModelViewVisible = false;
        } else {
            container.classList.add('visible-3d');
            container.classList.remove('hidden');
            imgElement.style.display = 'none';
            toggle3DBtn.innerHTML = '<i class="fas fa-image"></i> <span data-i18n="view_2d">Vezi în 2D</span>';
            toggle3DBtn.classList.add('is-3d-active');
            if (modalBody) modalBody.classList.add('mode-3d');
            // Asigură că nu există constrângeri de înălțime fixă
            container.style.height = '';
            container.style.minHeight = '';
            is3DModelViewVisible = true;
            setTimeout(() => {
                if (current3DViewerInstance && current3DViewerInstance.onWindowResize) {
                    current3DViewerInstance.onWindowResize();
                }
                window.dispatchEvent(new Event('resize'));
            }, 50);
        }
    };
    toggle3DBtn.addEventListener('click', toggle3DBtn._3dClickHandler);
    
    // Inițializare viewer (FĂRĂ a seta înălțimea fixă pe container)
    setTimeout(() => {
        // NU mai seta style.height sau style.minHeight pe container
        container.classList.remove('hidden');
        container.classList.remove('visible-3d');
        
        try {
            const productPrice = product.price || 0;
            const productId = product.id;
            const productName = product.title?.ro || product.title?.en || product.title || 'Produs';
            
            // Obține dimensiunile containerului părinte (fără a le forța)
            const parentRect = container.parentElement?.getBoundingClientRect();
            const width = parentRect?.width || 400;
            const height = parentRect?.height || 400;
            
            current3DViewerInstance = new Model3DViewer(viewerDiv, {
                backgroundColor: 0x030a10,
                autoRotate: true,
                zoomLevel: 1,
                width: width,
                height: height,
                addToCartEnabled: true,
                productId: productId,
                productName: productName,
                productPrice: productPrice,
                addToCartCallback: window.addToCart || function(id, name, price, qty) {
                    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    const existing = cart.find(item => item.id === id);
                    if (existing) existing.quantity += qty;
                    else cart.push({ id, name, price, quantity: qty });
                    localStorage.setItem('cart', JSON.stringify(cart));
                    if (window.updateCartUI) window.updateCartUI();
                    console.log(`[3D] Added ${qty} x ${name} to cart`);
                }
            });
            
            const modelPath = get3DModelPath(product.id, productTitle);
            if (modelPath) {
                current3DViewerInstance.loadModel(modelPath,
                    () => console.log('[3D] Model loaded'),
                    (error) => console.error('[3D] Load error:', error)
                );
            }
        } catch (err) {
            console.error('[3D] Init error:', err);
        }
    }, 300);
}

function dispose3DViewer() {
    if (current3DViewerInstance) {
        try { current3DViewerInstance.dispose(); } catch(e) {}
        current3DViewerInstance = null;
    }
    is3DModelViewVisible = false;
}

function cleanup3DOnModalClose() {
    dispose3DViewer();
    const container = document.getElementById('model3d-container');
    const img = document.getElementById('modal-product-image');
    const toggle3DBtn = document.getElementById('toggle-2d-3d');
    const modalBody = document.querySelector('.product-modal-body');
    if (container) {
        container.classList.remove('visible-3d');
        container.classList.add('hidden');
        container.style.height = '';
        container.style.minHeight = '';
    }
    if (img) img.style.display = 'block';
    if (toggle3DBtn) {
        toggle3DBtn.style.display = 'none';
        toggle3DBtn.classList.remove('is-3d-active');
    }
    if (modalBody) modalBody.classList.remove('mode-3d');
}

function overrideCloseProductModal() {
    const originalClose = window.closeProductModal;
    if (typeof originalClose === 'function') {
        window.closeProductModal = function() {
            cleanup3DOnModalClose();
            originalClose.call(this);
        };
    } else {
        setTimeout(overrideCloseProductModal, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    overrideCloseProductModal();
    console.log('[3D] Integration loaded (full-height fix)');
});
window.addEventListener('beforeunload', () => dispose3DViewer());