/**
 * 3D Models Integration for Products Page
 */
let current3DViewerInstance = null;
let is3DModelViewVisible = false;

function initialize3DForProduct(product) {
    console.log('[3D] initialize3DForProduct called with product:', product);
    if (!product || !product.id) {
        console.log('[3D] No valid product, skipping');
        return;
    }
    const productTitle = product.title ? (product.title.ro || product.title.en || product.title) : '';
    console.log('[3D] Checking if product has 3D model:', product.id);
    const has3D = hasModel3D(product.id, productTitle);
    console.log('[3D] hasModel3D result:', has3D);
    if (!has3D) {
        console.log('[3D] No 3D model for product:', product.id);
        const toggleBtn = document.getElementById('toggle-2d-3d');
        if (toggleBtn) {
            toggleBtn.style.display = 'none';
            toggleBtn.classList.remove('visible');
        }
        return;
    }
    const container = document.getElementById('model3d-container');
    const viewerDiv = document.getElementById('model3d-viewer');
    const toggle3DBtn = document.getElementById('toggle-2d-3d');
    const imgElement = document.getElementById('modal-product-image');
    if (!container || !viewerDiv || !toggle3DBtn) {
        console.error('[3D] CRITICAL: Required DOM elements not found!');
        return;
    }
    dispose3DViewer();
    
    // Arată butonul și atașează handler-ul de click IMEDIAT (nu mai așteaptă modelul)
    toggle3DBtn.style.display = '';
    toggle3DBtn.classList.add('visible');
    console.log('[3D] Button made visible, attaching click handler...');
    
    // Atașează handler-ul de click (o singură dată)
    if (!toggle3DBtn._3dClickHandler) {
        toggle3DBtn._3dClickHandler = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[3D] Button clicked! Toggling 2D/3D...');
            const btn = document.getElementById('toggle-2d-3d');
            const cont = document.getElementById('model3d-container');
            const image = document.getElementById('modal-product-image');
            if (!btn || !cont || !image) {
                console.error('[3D] Missing elements on click');
                return;
            }
            const is3DVisible = cont.classList.contains('visible-3d');
            console.log('[3D] Current 3D visible:', is3DVisible);
            if (is3DVisible) {
                cont.classList.remove('visible-3d');
                cont.classList.add('hidden');
                image.style.display = 'block';
                btn.innerHTML = '<i class="fas fa-cube"></i> <span data-i18n="view_3d">Vezi în 3D</span>';
                is3DModelViewVisible = false;
                console.log('[3D] Switched to 2D');
            } else {
                cont.classList.add('visible-3d');
                cont.classList.remove('hidden');
                image.style.display = 'none';
                btn.innerHTML = '<i class="fas fa-image"></i> <span data-i18n="view_2d">Vezi în 2D</span>';
                is3DModelViewVisible = true;
                console.log('[3D] Switched to 3D');
                setTimeout(() => {
                    if (current3DViewerInstance && current3DViewerInstance.onWindowResize) {
                        current3DViewerInstance.onWindowResize();
                    }
                    window.dispatchEvent(new Event('resize'));
                }, 50);
            }
        };
        toggle3DBtn.addEventListener('click', toggle3DBtn._3dClickHandler);
        console.log('[3D] Click handler attached');
    } else {
        console.log('[3D] Click handler already exists');
    }
    
    // Acum pregătește containerul și încarcă modelul
    setTimeout(() => {
        const imgHeight = imgElement && imgElement.offsetHeight > 0 ? imgElement.offsetHeight : 400;
        const imgWidth = imgElement && imgElement.offsetWidth > 0 ? imgElement.offsetWidth : 400;
        console.log('[3D] Image dimensions:', imgWidth + 'x' + imgHeight);
        container.style.minHeight = imgHeight + 'px';
        container.style.height = imgHeight + 'px';
        container.classList.remove('hidden');
        container.classList.remove('visible-3d');
        try {
            current3DViewerInstance = new Model3DViewer(viewerDiv, {
                backgroundColor: 0xf5f5f5,
                autoRotate: true,
                zoomLevel: 1,
                width: imgWidth,
                height: imgHeight
            });
            const modelPath = get3DModelPath(product.id, productTitle);
            if (modelPath) {
                console.log('[3D] Loading model from:', modelPath);
                current3DViewerInstance.loadModel(
                    modelPath,
                    () => {
                        console.log('[3D] Model loaded successfully');
                        // Dacă utilizatorul a comutat deja în 3D, asigură redimensionarea
                        if (is3DModelViewVisible && current3DViewerInstance.onWindowResize) {
                            setTimeout(() => current3DViewerInstance.onWindowResize(), 100);
                        }
                    },
                    (error) => {
                        console.error('[3D] Model load error:', error);
                    }
                );
            } else {
                console.warn('[3D] No model path found for product:', product.id);
            }
        } catch (err) {
            console.error('[3D] Init error:', err);
        }
    }, 300);
}

function dispose3DViewer() {
    if (current3DViewerInstance) {
        try { current3DViewerInstance.dispose(); } catch (err) { console.warn('[3D] Dispose error:', err); }
        current3DViewerInstance = null;
    }
    is3DModelViewVisible = false;
}

function cleanup3DOnModalClose() {
    dispose3DViewer();
    const container = document.getElementById('model3d-container');
    const img = document.getElementById('modal-product-image');
    const toggle3DBtn = document.getElementById('toggle-2d-3d');
    if (container) {
        container.classList.remove('visible-3d');
        container.classList.add('hidden');
    }
    if (img) img.style.display = 'block';
    if (toggle3DBtn) toggle3DBtn.style.display = 'none';
}

function overrideCloseProductModal() {
    const originalClose = window.closeProductModal;
    if (typeof originalClose === 'function') {
        window.closeProductModal = function() {
            cleanup3DOnModalClose();
            originalClose.call(this);
        };
        console.log('[3D] closeProductModal overridden successfully');
    } else {
        setTimeout(overrideCloseProductModal, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    overrideCloseProductModal();
    console.log('[3D] Integration loaded');
});
window.addEventListener('beforeunload', () => dispose3DViewer());