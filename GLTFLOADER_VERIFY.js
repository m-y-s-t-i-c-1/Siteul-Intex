/**
 * GLTFLoader Local Verification
 * Run this in browser console to verify local GLTFLoader works correctly
 */

console.log('%c=== GLTFLoader Verification ===', 'font-size: 14px; font-weight: bold; color: #667eea;');

// Check 1: THREE library
console.log('\n1. THREE library:');
if (typeof THREE !== 'undefined') {
    console.log('✓ THREE loaded');
    console.log('  Version:', THREE.REVISION);
} else {
    console.error('✗ THREE not loaded');
}

// Check 2: GLTFLoader
console.log('\n2. GLTFLoader:');
if (typeof GLTFLoader !== 'undefined') {
    console.log('✓ GLTFLoader loaded');
    const loader = new GLTFLoader();
    console.log('✓ GLTFLoader instance created successfully');
} else {
    console.error('✗ GLTFLoader not available');
}

// Check 3: Model path resolution
console.log('\n3. Model paths:');
if (typeof get3DModelPath === 'function') {
    const path = get3DModelPath('j1');
    console.log('✓ get3DModelPath works');
    console.log('  j1 model path:', path);
    
    // Try to fetch model to verify path works
    fetch(path)
        .then(r => {
            if (r.ok) {
                console.log('✓ Model file accessible (200 OK)');
                console.log('  Content-Type:', r.headers.get('content-type'));
            } else {
                console.error('✗ Model file returned:', r.status, r.statusText);
            }
        })
        .catch(err => console.error('✗ Model fetch error:', err.message));
} else {
    console.log('✗ get3DModelPath not available');
}

// Check 4: Can create viewer
console.log('\n4. Model3DViewer:');
if (typeof Model3DViewer === 'function') {
    console.log('✓ Model3DViewer class available');
} else {
    console.error('✗ Model3DViewer not available');
}

console.log('%c=== End Verification ===', 'font-size: 14px; font-weight: bold; color: #667eea;');
