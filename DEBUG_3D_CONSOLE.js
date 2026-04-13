/**
 * 3D System Diagnostic Script
 * Copy-paste this entire code into browser console (F12) to run full diagnostic
 */

console.log('%c=== 3D SYSTEM DIAGNOSTIC ===', 'font-size: 14px; font-weight: bold; color: #667eea;');

// Test 1: Check if functions exist
console.log('\n%c1. Function Availability:', 'font-weight: bold;');
console.log('hasModel3D:', typeof hasModel3D === 'function' ? '✓ Function exists' : '✗ NOT FOUND');
console.log('get3DModelPath:', typeof get3DModelPath === 'function' ? '✓ Function exists' : '✗ NOT FOUND');
console.log('Model3DViewer:', typeof Model3DViewer === 'function' ? '✓ Class exists' : '✗ NOT FOUND');
console.log('setupModel3DControls:', typeof setupModel3DControls === 'function' ? '✓ Function exists' : '✗ NOT FOUND');

// Test 2: Check Three.js libraries
console.log('\n%c2. Three.js Libraries:', 'font-weight: bold;');
console.log('THREE:', typeof THREE !== 'undefined' ? '✓ Loaded' : '✗ NOT LOADED');
console.log('GLTFLoader:', typeof GLTFLoader !== 'undefined' ? '✓ Loaded' : '✗ NOT LOADED');

// Test 3: Check DOM elements
console.log('\n%c3. DOM Elements:', 'font-weight: bold;');
const btn = document.getElementById('toggle-2d-3d');
const container = document.getElementById('model3d-container');
const viewer = document.getElementById('model3d-viewer');

console.log('Button (#toggle-2d-3d):', btn ? '✓ Found' : '✗ NOT FOUND');
console.log('  - Display style:', btn ? btn.style.display : 'N/A');
console.log('  - Computed style:', btn ? window.getComputedStyle(btn).display : 'N/A');
console.log('Container (#model3d-container):', container ? '✓ Found' : '✗ NOT FOUND');
console.log('Viewer (#model3d-viewer):', viewer ? '✓ Found' : '✗ NOT FOUND');

// Test 4: Test product mapping
console.log('\n%c4. Product Mapping Test:', 'font-weight: bold;');
const testIds = ['j1', 'kp1', 't2', 'invalid'];
testIds.forEach(id => {
    const has3D = hasModel3D(id);
    const path = has3D ? get3DModelPath(id) : 'N/A';
    console.log(`${id}:`, has3D ? '✓' : '✗', path);
});

// Test 5: Check current state
console.log('\n%c5. Current State:', 'font-weight: bold;');
console.log('Current viewer instance:', typeof current3DViewerInstance !== 'undefined' ? current3DViewerInstance : 'null');
console.log('3D view visible:', typeof is3DModelViewVisible !== 'undefined' ? is3DModelViewVisible : 'undefined');

// Test 6: Manual button test
console.log('\n%c6. Manual Button Test:', 'font-weight: bold;');
if (btn) {
    console.log('Adding test listener...');
    const testListener = () => {
        console.log('%c✓ BUTTON CLICK FIRED!', 'color: green; font-weight: bold; font-size: 12px;');
    };
    btn.addEventListener('click', testListener);
    console.log('Click the button now. Should see "BUTTON CLICK FIRED!" message if working.');
} else {
    console.log('Cannot add test listener - button not found');
}

// Test 7: Test with j1 product
console.log('\n%c7. Test Product j1:', 'font-weight: bold;');
const mockProduct = {
    id: 'j1',
    name: 'Tobogan Test',
    image: 'test.jpg'
};
console.log('Testing initialize3DForProduct with:', mockProduct);
try {
    initialize3DForProduct(mockProduct);
    console.log('✓ Function called without errors');
} catch (err) {
    console.error('✗ Error:', err);
}

console.log('%c=== END DIAGNOSTIC ===', 'font-size: 14px; font-weight: bold; color: #667eea;');

// Quick reference
console.log('\n%cQUICK REFERENCE:', 'font-weight: bold; background: #fffacd; padding: 5px;');
console.log('Check button visibility: document.getElementById("toggle-2d-3d").style.display');
console.log('Force show button: document.getElementById("toggle-2d-3d").style.display = "flex"');
console.log('Check 3D state: is3DModelViewVisible');
console.log('Check current viewer: current3DViewerInstance');
