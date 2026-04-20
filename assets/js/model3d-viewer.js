/**
 * 3D Model Viewer
 * Utilizează Three.js pentru a afișa modele 3D în format GLB
 */

// Inițializare și Management al scenei 3D
class Model3DViewer {
    constructor(containerElement, options = {}) {
        this.container = containerElement;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.modelMesh = null;
        this.animationId = null;
        
        // Opțiuni configurabile
        this.width = options.width || 400;
        this.height = options.height || 400;
        this.backgroundColor = options.backgroundColor || 0xf5f5f5;
        this.autoRotate = options.autoRotate !== false; // true by default
        this.zoomLevel = options.zoomLevel || 1;
        this.enableControls = options.enableControls !== false; // true by default
        
        // Handle invisible containers - wait for valid dimensions
        this.waitForContainerReady().then(() => {
            this.init();
        });
    }
    
    async waitForContainerReady() {
        return new Promise((resolve) => {
            const checkDimensions = () => {
                const rect = this.container.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    this.width = rect.width;
                    this.height = rect.height;
                    resolve();
                } else {
                    // Use ResizeObserver if available, fallback to timeout
                    if (window.ResizeObserver) {
                        const observer = new ResizeObserver((entries) => {
                            const entry = entries[0];
                            if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
                                this.width = entry.contentRect.width;
                                this.height = entry.contentRect.height;
                                observer.disconnect();
                                resolve();
                            }
                        });
                        observer.observe(this.container);
                    } else {
                        // Fallback for older browsers
                        setTimeout(() => {
                            const rect = this.container.getBoundingClientRect();
                            if (rect.width > 0 && rect.height > 0) {
                                this.width = rect.width;
                                this.height = rect.height;
                                resolve();
                            } else {
                                // Force minimum dimensions if still 0
                                this.width = 400;
                                this.height = 400;
                                resolve();
                            }
                        }, 100);
                    }
                }
            };
            checkDimensions();
        });
    }
    
    init() {
        // Creează scena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.backgroundColor);
        
        // Creează camera
        const aspect = this.width / this.height;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.z = 3 * this.zoomLevel;
        
        // Creează renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        
        // Inițializează OrbitControls pentru interactivitate
        if (this.enableControls && typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.screenSpacePanning = false;
            this.controls.minDistance = 1;
            this.controls.maxDistance = 10;
            this.controls.autoRotate = this.autoRotate;
            this.controls.autoRotateSpeed = 2;
            
            // Oprește rotația automată la interacțiune
            this.controls.addEventListener('start', () => {
                this.autoRotate = false;
                this.controls.autoRotate = false;
                console.log('[3D] Auto-rotate disabled - user interacting');
            });
            
            console.log('[3D] OrbitControls initialized');
        } else if (!this.enableControls) {
            console.log('[3D] Controls disabled');
        } else {
            console.warn('[3D] OrbitControls not available');
        }
        
        // Adaugă iluminare
        this.setupLighting();
        
        // Handlerul pentru redimensionare
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Pornește animația
        this.animate();
    }
    
    setupLighting() {
        // Lumină ambientală
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Lumină direcțională
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        // Lumină suplimentară din spate
        const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
        backLight.position.set(-10, -10, -10);
        this.scene.add(backLight);
    }
    
    loadModel(modelPath, onComplete = null, onError = null) {
        // Ascunde modelul anterior dacă există
        if (this.modelMesh) {
            this.scene.remove(this.modelMesh);
            this.disposeModel(this.modelMesh);
            this.modelMesh = null;
        }
        
        // Loaderul pentru fișiere GLB/GLTF
        // GLTFLoader ar trebui să fie disponibil global din CDN
        let loader;
        if (typeof GLTFLoader !== 'undefined') {
            loader = new GLTFLoader();
        } else if (window.THREE && window.THREE.GLTFLoader) {
            loader = new window.THREE.GLTFLoader();
        } else {
            console.error('GLTFLoader not available');
            if (onError) onError('GLTFLoader not loaded');
            return;
        }
        
        loader.load(
            modelPath,
            (gltf) => {
                const model = gltf.scene;
                
                // Creează un wrapper pentru model
                const wrapper = new THREE.Group();
                wrapper.add(model);
                
                // Calculează bounding box-ul pentru centrare și scalare automată
                const bbox = new THREE.Box3().setFromObject(model);
                const size = bbox.getSize(new THREE.Vector3());
                const center = bbox.getCenter(new THREE.Vector3());
                
                // Calculează dimensiunea maximă
                const maxDim = Math.max(size.x, size.y, size.z);
                
                // Scale pentru a încadra în viewport (2 unități vizibile)
                const scale = maxDim > 0 ? 2 / maxDim : 1;
                wrapper.scale.multiplyScalar(scale);
                
                // Centrează modelul în origine
                model.position.sub(center.clone().multiplyScalar(scale));
                
                // Adaugă wrapper la scena
                this.scene.add(wrapper);
                this.modelMesh = wrapper;
                
                console.log('Model 3D încărcat cu succes:', modelPath, {
                    originalSize: size,
                    scale: scale.toFixed(3),
                    center: center
                });
                
                if (onComplete) onComplete(wrapper);
            },
            (progress) => {
                // Callback pentru progresul încărcării
                const loaded = (progress.loaded / progress.total * 100).toFixed(0);
                console.log(`Progres încărcare: ${loaded}%`);
            },
            (error) => {
                console.error('Eroare la încărcarea modelului:', error);
                if (onError) onError(error);
            }
        );
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Actualizează controalele pentru dampingul (inerția) la rotire
        if (this.controls) {
            this.controls.update();
        }
        
        // Rotație automată
        if (this.autoRotate && this.modelMesh) {
            this.modelMesh.rotation.y += 0.005;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        if (this.container.clientWidth === 0 || this.container.clientHeight === 0) {
            return; // Container nu este vizibil
        }
        
        const newWidth = this.container.clientWidth;
        const newHeight = this.container.clientHeight;
        
        this.width = newWidth;
        this.height = newHeight;
        
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(this.width, this.height);
        
        // Actualizează controalele dacă există
        if (this.controls) {
            this.controls.handleResize();
        }
    }
    
    dispose() {
        // Oprește animația
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Curățare controale
        if (this.controls) {
            this.controls.dispose();
            this.controls = null;
        }
        
        // Curățare model și resurse
        if (this.modelMesh) {
            this.disposeModel(this.modelMesh);
            this.scene.remove(this.modelMesh);
            this.modelMesh = null;
        }
        
        // Curățare renderer
        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
            this.renderer = null;
        }
        
        // Curățare scenă
        if (this.scene) {
            this.scene.clear();
            this.scene = null;
        }
        
        // Curățare cameră
        this.camera = null;
    }
    
    disposeModel(object) {
        if (!object) return;
        
        object.traverse((child) => {
            if (child.isMesh) {
                // Eliberează geometria
                if (child.geometry) {
                    child.geometry.dispose();
                }
                
                // Eliberează materialele
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => {
                            this.disposeMaterial(material);
                        });
                    } else {
                        this.disposeMaterial(child.material);
                    }
                }
            }
        });
    }
    
    disposeMaterial(material) {
        if (!material) return;
        
        // Eliberează texturile
        Object.keys(material).forEach(prop => {
            if (!material[prop]) return;
            if (material[prop].isTexture) {
                material[prop].dispose();
            }
        });
        
        // Eliberează materialul însuși
        material.dispose();
    }
    
    // Metode de control
    rotateModel(x, y, z) {
        if (this.modelMesh) {
            this.modelMesh.rotation.x += x;
            this.modelMesh.rotation.y += y;
            this.modelMesh.rotation.z += z;
        }
    }
    
    setAutoRotate(enabled) {
        this.autoRotate = enabled;
    }
    
    zoom(factor) {
        this.camera.position.z *= factor;
    }
}

/**
 * Integrare cu pagina de produse
 * Adaugă vizualizator de model 3D în descrierea produsului
 */
function initializeProductModel3D(productId) {
    // Verifică dacă produsul are model 3D
    if (!hasModel3D(productId)) {
        return false;
    }
    
    // Caută containerul pentru model 3D
    const container = document.getElementById(`model3d-${productId}`);
    if (!container) {
        console.warn(`Container pentru model 3D nu găsit: model3d-${productId}`);
        return false;
    }
    
    // Obține calea modelului
    const modelPath = get3DModelPath(productId);
    if (!modelPath) {
        console.error(`Cale model 3D nu găsită pentru produsul: ${productId}`);
        return false;
    }
    
    // Creează vizualizatorul
    const viewer = new Model3DViewer(container, {
        backgroundColor: 0xffffff,
        autoRotate: true,
        zoomLevel: 1,
        width: container.clientWidth,
        height: container.clientHeight
    });
    
    // Încarcă modelul
    viewer.loadModel(modelPath);
    
    // Stochează referința pentru a putea fi destrusă mai târziu
    window.model3dViewers = window.model3dViewers || {};
    window.model3dViewers[productId] = viewer;
    
    return true;
}

/**
 * Inițializează vizualizatoare 3D pentru toți produsele cu modele
 */
function initializeAllProducts3D() {
    const products = getAllProducts3D();
    let initialized = 0;
    
    products.forEach(productId => {
        if (initializeProductModel3D(productId)) {
            initialized++;
        }
    });
    
    console.log(`Vizualizatoare 3D inițializate: ${initialized}/${products.length}`);
    return initialized;
}

/**
 * Curatare resurse
 */
function disposeAllModels3D() {
    if (window.model3dViewers) {
        Object.values(window.model3dViewers).forEach(viewer => {
            viewer.dispose();
        });
        window.model3dViewers = {};
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('Model3D Viewer module încărcat');
});

document.addEventListener('beforeunload', () => {
    disposeAllModels3D();
});
