/**
 * 3D Model Viewer - Three.js GLTF
 * Cu indicator de încărcare (spinner) - poziționare corectă
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
        this._initialized = false;
        this.loadingElement = null;
        this.width = options.width || 400;
        this.height = options.height || 400;
        this.backgroundColor = options.backgroundColor || 0xf5f5f5;
        this.autoRotate = options.autoRotate !== false;
        this.zoomLevel = options.zoomLevel || 1;
        this.enableControls = options.enableControls !== false;
        
        // Asigură poziționarea relativă pentru a ancora spinner-ul corect
        if (getComputedStyle(this.container).position === 'static') {
            this.container.style.position = 'relative';
        }
        // Asigură dimensiuni minime
        this.container.style.minHeight = this.height + 'px';
        this.container.style.minWidth = this.width + 'px';
        
        this._ready = this.waitForContainerReady().then(() => {
            if (!this._initialized) {
                this.init();
                this._initialized = true;
            }
            return this;
        });
        this.injectSpinnerStyles();
    }

    injectSpinnerStyles() {
        if (document.getElementById('model3d-spinner-styles')) return;
        const style = document.createElement('style');
        style.id = 'model3d-spinner-styles';
        style.textContent = `
            .model3d-loading {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.65);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: white;
                font-family: Arial, sans-serif;
                z-index: 20;
                border-radius: 8px;
                box-sizing: border-box;
            }
            .model3d-spinner {
                width: 48px;
                height: 48px;
                border: 5px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                border-top-color: #fff;
                animation: model3d-spin 1s ease-in-out infinite;
                margin-bottom: 12px;
            }
            @keyframes model3d-spin {
                to { transform: rotate(360deg); }
            }
            .model3d-loading span {
                font-size: 14px;
                background: rgba(0,0,0,0.7);
                padding: 4px 12px;
                border-radius: 20px;
            }
        `;
        document.head.appendChild(style);
    }

    showLoading(message = 'Se încarcă modelul 3D...') {
        this.hideLoading();
        this.loadingElement = document.createElement('div');
        this.loadingElement.className = 'model3d-loading';
        this.loadingElement.innerHTML = `
            <div class="model3d-spinner"></div>
            <span>${message}</span>
        `;
        // Asigură poziționarea relativă (deja setată în constructor, dar dublă verificare)
        if (getComputedStyle(this.container).position === 'static') {
            this.container.style.position = 'relative';
        }
        this.container.appendChild(this.loadingElement);
    }

    hideLoading() {
        if (this.loadingElement && this.loadingElement.parentNode) {
            this.loadingElement.parentNode.removeChild(this.loadingElement);
        }
        this.loadingElement = null;
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
        if (!this._initialized) {
            this._ready.then(() => {
                this.loadModel(modelPath, onComplete, onError);
            }).catch(err => {
                if (onError) onError(err);
            });
            return;
        }
        if (this.modelMesh) {
            this.scene.remove(this.modelMesh);
            this.disposeModel(this.modelMesh);
            this.modelMesh = null;
        }
        this.showLoading('Se încarcă modelul 3D...');

        let loader;
        if (typeof GLTFLoader !== 'undefined') {
            loader = new GLTFLoader();
        } else if (window.THREE && window.THREE.GLTFLoader) {
            loader = new window.THREE.GLTFLoader();
        } else {
            console.error('GLTFLoader not available');
            this.hideLoading();
            if (onError) onError('GLTFLoader not loaded');
            return;
        }

        loader.load(
            modelPath,
            (gltf) => {
                this.hideLoading();
                try {
                    const model = gltf.scene;
                    if (!model) throw new Error('GLTF scene is null');
                    const wrapper = new THREE.Group();
                    wrapper.add(model);
                    const bbox = new THREE.Box3().setFromObject(model);
                    const size = bbox.getSize(new THREE.Vector3());
                    const center = bbox.getCenter(new THREE.Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const scale = maxDim > 0 ? 2 / maxDim : 1;
                    wrapper.scale.multiplyScalar(scale);
                    const scaledCenter = center.clone().multiplyScalar(scale);
                    wrapper.position.sub(scaledCenter);
                    this.scene.add(wrapper);
                    this.modelMesh = wrapper;
                    console.log('Model 3D încărcat:', modelPath);
                    if (onComplete) onComplete(wrapper);
                } catch (err) {
                    console.error('Error processing GLTF:', err);
                    if (onError) onError(err);
                }
            },
            (progress) => {
                const percent = Math.round(progress.loaded / progress.total * 100);
                if (this.loadingElement) {
                    const span = this.loadingElement.querySelector('span');
                    if (span) span.innerText = `Încărcare ${percent}%`;
                }
            },
            (error) => {
                console.error('Load error:', error);
                this.hideLoading();
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
        this.hideLoading();
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

// Funcții globale compatibilitate
function initializeProductModel3D(productId) { return false; }
function initializeAllProducts3D() { return 0; }
function disposeAllModels3D() {
    if (window.model3dViewers) {
        Object.values(window.model3dViewers).forEach(v => v.dispose());
    }
}
document.addEventListener('DOMContentLoaded', () => console.log('Model3D Viewer loaded (spinner corectat)'));
document.addEventListener('beforeunload', () => disposeAllModels3D());