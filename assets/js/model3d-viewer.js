/**
 * 3D Model Viewer
 * Utilizează Three.js pentru a afișa modele 3D în format GLB
 */

class Model3DViewer {
    constructor(containerElement, options = {}) {
        this.container = containerElement;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.modelMesh = null;
        this.animationId = null;
        this._initialized = false;  // flag pentru a preveni dubla inițializare

        this.width = options.width || 400;
        this.height = options.height || 400;
        this.backgroundColor = options.backgroundColor || 0xf5f5f5;
        this.autoRotate = options.autoRotate !== false;
        this.zoomLevel = options.zoomLevel || 1;
        this.enableControls = options.enableControls !== false;

        this._ready = this.waitForContainerReady().then(() => {
            if (!this._initialized) {
                this.init();
                this._initialized = true;
            }
            return this;
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
                        setTimeout(() => {
                            const rect = this.container.getBoundingClientRect();
                            if (rect.width > 0 && rect.height > 0) {
                                this.width = rect.width;
                                this.height = rect.height;
                            } else {
                                this.width = 400;
                                this.height = 400;
                            }
                            resolve();
                        }, 100);
                    }
                }
            };
            checkDimensions();
        });
    }

    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.backgroundColor);

        const aspect = this.width / this.height;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.z = 3 * this.zoomLevel;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        if (this.enableControls && typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.screenSpacePanning = false;
            this.controls.minDistance = 1;
            this.controls.maxDistance = 10;
            this.controls.autoRotate = this.autoRotate;
            this.controls.autoRotateSpeed = 2;
            this.controls.addEventListener('start', () => {
                this.autoRotate = false;
                this.controls.autoRotate = false;
                console.log('[3D] Auto-rotate disabled - user interacting');
            });
        }

        this.setupLighting();
        window.addEventListener('resize', () => this.onWindowResize());
        this.animate();
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
        backLight.position.set(-10, -10, -10);
        this.scene.add(backLight);
    }

    loadModel(modelPath, onComplete = null, onError = null) {
        // Asigură inițializarea înainte de a continua
        if (!this._initialized) {
            this._ready.then(() => {
                this.loadModel(modelPath, onComplete, onError);
            }).catch(err => {
                console.error('[3D] Error during initialization:', err);
                if (onError) onError(err);
            });
            return;
        }

        // Elimină modelul anterior
        if (this.modelMesh) {
            this.scene.remove(this.modelMesh);
            this.disposeModel(this.modelMesh);
            this.modelMesh = null;
        }

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
                try {
                    const model = gltf.scene;
                    if (!model) throw new Error('GLTF scene is null');

                    // Creează un grup wrapper pentru a aplica scalare și centrare fără a afecta transformările interne
                    const wrapper = new THREE.Group();
                    wrapper.add(model);

                    // Calculează bounding box-ul modelului în spațiul mondial (ține cont de transformările interne)
                    const bbox = new THREE.Box3().setFromObject(model);
                    const size = bbox.getSize(new THREE.Vector3());
                    const center = bbox.getCenter(new THREE.Vector3());

                    const maxDim = Math.max(size.x, size.y, size.z);
                    const scale = maxDim > 0 ? 2 / maxDim : 1;
                    wrapper.scale.multiplyScalar(scale);

                    // Repoziționează wrapper-ul astfel încât centrul modelului să fie la originea scenei
                    // După scalare, centrul original se deplasează, deci trebuie să aplicăm translația inversă pe wrapper
                    // Deoarece modelul este copil al wrapper-ului, mutăm wrapper-ul astfel încât centrul modelului să ajungă în (0,0,0)
                    const scaledCenter = center.clone().multiplyScalar(scale);
                    wrapper.position.sub(scaledCenter);

                    this.scene.add(wrapper);
                    this.modelMesh = wrapper;

                    console.log('Model 3D încărcat cu succes:', modelPath, { originalSize: size, scale, center });
                    if (onComplete) onComplete(wrapper);
                } catch (err) {
                    console.error('[3D] Error processing GLTF:', err);
                    if (onError) onError(err);
                }
            },
            (progress) => {
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
        if (this.controls) this.controls.update();
        if (this.autoRotate && this.modelMesh) {
            this.modelMesh.rotation.y += 0.005;
        }
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    onWindowResize() {
        if (!this.container || this.container.clientWidth === 0 || this.container.clientHeight === 0) return;
        const newWidth = this.container.clientWidth;
        const newHeight = this.container.clientHeight;
        this.width = newWidth;
        this.height = newHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
        if (this.controls && typeof this.controls.update === 'function') this.controls.update();
    }

    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.controls) {
            this.controls.dispose();
            this.controls = null;
        }
        if (this.modelMesh) {
            this.disposeModel(this.modelMesh);
            this.scene.remove(this.modelMesh);
            this.modelMesh = null;
        }
        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
            this.renderer = null;
        }
        if (this.scene) {
            this.scene.clear();
            this.scene = null;
        }
        this.camera = null;
        this._initialized = false;
    }

    disposeModel(object) {
        if (!object) return;
        object.traverse((child) => {
            if (child.isMesh) {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => this.disposeMaterial(m));
                    } else {
                        this.disposeMaterial(child.material);
                    }
                }
            }
        });
    }

    disposeMaterial(material) {
        if (!material) return;
        Object.keys(material).forEach(prop => {
            if (material[prop] && material[prop].isTexture) material[prop].dispose();
        });
        material.dispose();
    }

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

// Funcții globale rămân neschimbate, dar nu sunt folosite direct – păstrăm pentru compatibilitate
function initializeProductModel3D(productId) { /* ... */ }
function initializeAllProducts3D() { /* ... */ }
function disposeAllModels3D() { /* ... */ }

document.addEventListener('DOMContentLoaded', () => {
    console.log('Model3D Viewer module încărcat (corectat)');
});
document.addEventListener('beforeunload', () => {
    if (window.model3dViewers) {
        Object.values(window.model3dViewers).forEach(v => v.dispose());
    }
});