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
    
    // Extract title for pool products mapping
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
            console.log('[3D] Hid button (no model)');
        }
        return;
    }
    
    const container = document.getElementById('model3d-container');
    const viewerDiv = document.getElementById('model3d-viewer');
    const toggle3DBtn = document.getElementById('toggle-2d-3d');
    const imgElement = document.getElementById('modal-product-image');
    
    console.log('[3D] DOM Check:');
    console.log('  - container:', container !== null);
    console.log('  - viewerDiv:', viewerDiv !== null);
    console.log('  - toggle3DBtn:', toggle3DBtn !== null);
    console.log('  - imgElement:', imgElement !== null);
    
    if (!container || !viewerDiv || !toggle3DBtn) {
        console.error('[3D] CRITICAL: Required DOM elements not found!');
        return;
    }
    
    dispose3DViewer();
    
    // Show button since product has 3D model
    toggle3DBtn.style.display = '';  // Clear inline style
    toggle3DBtn.classList.add('visible');
    console.log('[3D] Showed button');
    
    // Wait for image to load and get dimensions
    setTimeout(() => {
        const imgHeight = imgElement && imgElement.offsetHeight > 0 ? imgElement.offsetHeight : 400;
        const imgWidth = imgElement && imgElement.offsetWidth > 0 ? imgElement.offsetWidth : 400;
        
        console.log('[3D] Image dimensions:', imgWidth + 'x' + imgHeight);
        
        // Set container size to match image
        container.style.minHeight = imgHeight + 'px';
        container.style.height = imgHeight + 'px';
        container.classList.remove('hidden');
        container.classList.remove('visible-3d');
        
        console.log('[3D] Container prepared');
        
        try {
            console.log('[3D] Creating Model3DViewer instance...');
            current3DViewerInstance = new Model3DViewer(viewerDiv, {
                backgroundColor: 0xf5f5f5,
                autoRotate: true,
                zoomLevel: 1,
                width: imgWidth,
                height: imgHeight
            });
            console.log('[3D] Model3DViewer created ✓');
            
            const modelPath = get3DModelPath(product.id, productTitle);
            console.log('[3D] Model path:', modelPath);
            
            if (modelPath) {
                current3DViewerInstance.loadModel(
                    modelPath,
                    (model) => {
                        console.log('[3D] Model loaded successfully ✓');
                        setupModel3DControls(product.id);
                    },
                    (error) => {
                        console.error('[3D] Load error:', error);
                    }
                );
            }
        } catch (err) {
            console.error('[3D] Init error:', err);
        }
    }, 200);
}

function setupModel3DControls(productId) {
    console.log('[3D] setupModel3DControls called for product:', productId);
    
    // Get DOM elements
    const toggle3DBtn = document.getElementById('toggle-2d-3d');
    const container = document.getElementById('model3d-container');
    const img = document.getElementById('modal-product-image');
    const controls = document.querySelector('.model3d-controls');
    
    if (!toggle3DBtn || !container || !controls) {
        console.error('[3D] Required elements not found');
        return;
    }
    
    // Remove old button and create fresh one
    toggle3DBtn.remove();
    
    const freshBtn = document.createElement('button');
    freshBtn.id = 'toggle-2d-3d';
    freshBtn.className = 'model3d-btn visible';
    freshBtn.title = 'Comută între imagine 2D și model 3D';
    freshBtn.innerHTML = '<i class="fas fa-cube"></i> <span data-i18n="view_3d">Vezi în 3D</span>';
    
    controls.appendChild(freshBtn);
    console.log('[3D] Fresh button created and attached');
    
    // Add fresh listener
    freshBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('[3D] Button clicked');
        
        const btn = document.getElementById('toggle-2d-3d');
        const cont = document.getElementById('model3d-container');
        const image = document.getElementById('modal-product-image');
        
        if (!btn || !cont) {
            console.error('[3D] Missing DOM elements on click');
            return;
        }
        
        const is3DVisible = cont.classList.contains('visible-3d');
        
        if (is3DVisible) {
            // Switch to 2D
            console.log('[3D] → Switching to 2D');
            cont.classList.remove('visible-3d');
            cont.classList.add('hidden');
            if (image) image.style.display = 'block';
            btn.innerHTML = '<i class="fas fa-cube"></i> <span data-i18n="view_3d">Vezi în 3D</span>';
            is3DModelViewVisible = false;
        } else {
            // Switch to 3D
            console.log('[3D] → Switching to 3D');
            cont.classList.add('visible-3d');
            cont.classList.remove('hidden');
            if (image) image.style.display = 'none';
            btn.innerHTML = '<i class="fas fa-image"></i> <span data-i18n="view_2d">Vezi în 2D</span>';
            is3DModelViewVisible = true;
            
            // Resize viewer
            setTimeout(() => {
                if (current3DViewerInstance && current3DViewerInstance.onWindowResize) {
                    current3DViewerInstance.onWindowResize();
                }
                window.dispatchEvent(new Event('resize'));
            }, 50);
        }
    });
    
    console.log('[3D] Button ready for clicking');
}

function dispose3DViewer() {
    if (current3DViewerInstance) {
        try {
            current3DViewerInstance.dispose();
        } catch (err) {
            console.warn('[3D] Dispose error:', err);
        }
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

// Extend openProductModal
const originalOpen = window.openProductModal;
if (originalOpen) {
    window.openProductModal = function(product) {
        originalOpen.call(this, product);
        setTimeout(() => initialize3DForProduct(product), 150);
    };
}

// Extend closeProductModal
const originalClose = window.closeProductModal;
if (originalClose) {
    window.closeProductModal = function() {
        cleanup3DOnModalClose();
        originalClose.call(this);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('[3D] Integration loaded');
});

window.addEventListener('beforeunload', () => dispose3DViewer());
