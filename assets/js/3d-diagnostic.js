/**
 * Test și Diagnositică pentru Modele 3D
 * Fișier pentru verificarea integrării modelelor 3D
 */

console.log('=== 3D Models Diagnostic ===');

// Verifică dacă librariile sunt încărcate
console.log('THREE.js loaded:', typeof THREE !== 'undefined');
console.log('GLTFLoader loaded:', typeof THREE !== 'undefined' ? 'checking GLTFLoader' : 'no THREE');

// Verifică dacă modulele noastre sunt încărcate
console.log('3D Models module loaded:', typeof PRODUCT_3D_MODELS !== 'undefined');
console.log('Model3DViewer class available:', typeof Model3DViewer !== 'undefined');

// Statistici modele
if (typeof getModel3DStats === 'function') {
    const stats = getModel3DStats();
    console.log('3D Models Statistics:', stats);
    console.table(stats);
}

// Listează toate produsele cu modele 3D
if (typeof getAllProducts3D === 'function') {
    const products = getAllProducts3D();
    console.log(`\nTotal produse cu modele 3D: ${products.length}`);
    console.table(products.map(id => ({
        'Product ID': id,
        '3D Model Info': getModel3DInfo(id) ? getModel3DInfo(id).title : 'N/A',
        'Has Model': hasModel3D(id) ? 'YES' : 'NO'
    })));
}

// Verifică container-ele DOM
console.log('\n=== DOM Elements Check ===');
const model3dContainer = document.getElementById('model3d-container');
const model3dViewer = document.getElementById('model3d-viewer');
const toggle3DBtn = document.getElementById('toggle-2d-3d');

console.log('model3d-container exists:', !!model3dContainer);
console.log('model3d-viewer exists:', !!model3dViewer);
console.log('toggle-2d-3d button exists:', !!toggle3DBtn);

// Test: Încarcă un model 3D
console.log('\n=== Test Model Loading ===');
function testLoadModel() {
    const testProductId = 'j1'; // Tobogan
    
    if (hasModel3D(testProductId)) {
        const modelPath = get3DModelPath(testProductId);
        console.log(`Test loading model for product: ${testProductId}`);
        console.log(`Model path: ${modelPath}`);
        
        if (modelPath) {
            console.log('Model path is valid ✓');
        } else {
            console.warn('Model path resolution failed ✗');
        }
    } else {
        console.warn(`Product ${testProductId} does not have a 3D model`);
    }
}

testLoadModel();

// Funcție helper pentru debugging
window.testModel3D = function(productId = 'j1') {
    console.log(`Testing 3D model for product: ${productId}`);
    
    if (!hasModel3D(productId)) {
        console.error(`Product ${productId} does not have a 3D model`);
        return;
    }
    
    const info = getModel3DInfo(productId);
    const path = get3DModelPath(productId);
    
    console.log('Product Info:', info);
    console.log('Model Path:', path);
    
    return { info, path };
};

console.log('\nUse window.testModel3D(productId) to test a specific product model');
console.log('Example: window.testModel3D(\"kp1\") to test kids pool #1');

console.log('\n=== Diagnostic Complete ===');
