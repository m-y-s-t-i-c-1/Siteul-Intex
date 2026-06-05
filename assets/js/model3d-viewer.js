/**
 * model3d-viewer.js
 * Versiune Cinematic Dark Theater
 * Iluminare dramatică (rim light teal puternic), umbră vizibilă sub model,
 * controale glass în stânga jos, auto‑rotate, hotspot‑uri, confetti, fly‑to‑cart.
 */
class Model3DViewer {
    constructor(containerElement, options = {}) {
        this.container = containerElement;
        this.options = Object.assign({
            width: 400,
            height: 400,
            backgroundColor: 0x030a10,
            autoRotate: true,
            zoomLevel: 1,
            enableControls: true,
            addToCartEnabled: false,
            productId: null,
            productName: '',
            productPrice: 0,
            addToCartCallback: null
        }, options);

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.modelGroup = null;
        this.animationId = null;
        this._initialized = false;
        this.loadingElement = null;
        
        this.hotspots = [];
        this.autoRotateEnabled = this.options.autoRotate;
        this.isUserInteracting = false;
        this.originalCameraPos = null;
        this.originalTarget = null;
        this.currentQuantity = 1;
        
        this.premiumControlsBar = null;
        this.fullscreenBtn = null;
        this.resetViewBtn = null;
        this.autoRotateToggleBtn = null;
        this.addToCartBtn = null;
        this.qtySpan = null;
        
        if (getComputedStyle(this.container).position === 'static') {
            this.container.style.position = 'relative';
        }
        
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
            const check = () => {
                const rect = this.container.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    this.options.width = rect.width;
                    this.options.height = rect.height;
                    resolve();
                } else if (window.ResizeObserver) {
                    const observer = new ResizeObserver(entries => {
                        const entry = entries[0];
                        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
                            this.options.width = entry.contentRect.width;
                            this.options.height = entry.contentRect.height;
                            observer.disconnect();
                            resolve();
                        }
                    });
                    observer.observe(this.container);
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }

    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.options.backgroundColor);
        
        const aspect = this.options.width / this.options.height;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.set(2.5, 1.8, 3.5);
        this.originalCameraPos = this.camera.position.clone();
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.options.width, this.options.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);
        
        if (this.options.enableControls && typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.screenSpacePanning = false;
            this.controls.minDistance = 1.2;
            this.controls.maxDistance = 6;
            this.controls.autoRotate = false;
            this.controls.target.set(0, 0.5, 0);
            this.originalTarget = this.controls.target.clone();
            
            this.controls.addEventListener('start', () => {
                this.isUserInteracting = true;
                if (this.autoRotateEnabled) {
                    this.autoRotateEnabled = false;
                    if (this.autoRotateToggleBtn) {
                        this.autoRotateToggleBtn.classList.remove('active');
                        this.autoRotateToggleBtn.innerHTML = '<i class="fas fa-sync-alt"></i> <span>Auto OFF</span>';
                    }
                }
            });
        }
        
        this.setupLighting();
        this.addGroundShadow();
        this.addPremiumControls();
        
        window.addEventListener('resize', () => this.onWindowResize());
        this.animate();
    }

    setupLighting() {
        // Ambient slab
        const ambient = new THREE.AmbientLight(0x404060, 0.4);
        this.scene.add(ambient);
        
        // Key light (principală, caldă)
        const keyLight = new THREE.DirectionalLight(0xfff5e0, 1.1);
        keyLight.position.set(2.5, 3.2, 1.8);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        this.scene.add(keyLight);
        
        // Rim light teal puternic (contur)
        const rimLight = new THREE.PointLight(0x00f2fe, 1.4);
        rimLight.position.set(1.2, 1.5, -2.2);
        this.scene.add(rimLight);
        
        // Al doilea rim light (stânga‑spate)
        const rimLight2 = new THREE.PointLight(0x44aaff, 0.7);
        rimLight2.position.set(-1.5, 1.2, -2.0);
        this.scene.add(rimLight2);
        
        // Fill light (umplere)
        const fillLight = new THREE.PointLight(0xccaa88, 0.45);
        fillLight.position.set(0.5, -0.8, 1.2);
        this.scene.add(fillLight);
        
        // Back rim (dramatism)
        const backRim = new THREE.PointLight(0xffaa66, 0.6);
        backRim.position.set(0, 1.2, -2.8);
        this.scene.add(backRim);
        
        // Accent lateral
        const accentLight = new THREE.SpotLight(0x88ccff, 0.5);
        accentLight.position.set(1.8, 1.0, 1.0);
        accentLight.angle = 0.4;
        accentLight.penumbra = 0.5;
        this.scene.add(accentLight);
    }

    addGroundShadow() {
        // Umbră principală
        const circleGeo = new THREE.CircleGeometry(1.6, 32);
        const shadowMat = new THREE.MeshStandardMaterial({
            color: 0x000000,
            roughness: 0.3,
            metalness: 0.8,
            transparent: true,
            opacity: 0.55,
            side: THREE.DoubleSide,
            emissive: 0x003333,
            emissiveIntensity: 0.15
        });
        const groundShadow = new THREE.Mesh(circleGeo, shadowMat);
        groundShadow.rotation.x = -Math.PI / 2;
        groundShadow.position.y = -0.85;
        groundShadow.receiveShadow = true;
        this.scene.add(groundShadow);
        
        // Plan de reflexie (efect acvatic)
        const reflectionPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(2.2, 2.2),
            new THREE.MeshStandardMaterial({
                color: 0x0088aa,
                roughness: 0.2,
                metalness: 0.9,
                transparent: true,
                opacity: 0.12,
                side: THREE.DoubleSide
            })
        );
        reflectionPlane.rotation.x = -Math.PI / 2;
        reflectionPlane.position.y = -0.82;
        this.scene.add(reflectionPlane);
    }

    addPremiumControls() {
        let controlsBar = this.container.querySelector('.model3d-premium-controls');
        if (!controlsBar) {
            controlsBar = document.createElement('div');
            controlsBar.className = 'model3d-premium-controls';
            this.container.appendChild(controlsBar);
        }
        this.premiumControlsBar = controlsBar;
        
        // Fullscreen
        this.fullscreenBtn = document.createElement('button');
        this.fullscreenBtn.className = 'model3d-premium-btn';
        this.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> <span>Fullscreen</span>';
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        controlsBar.appendChild(this.fullscreenBtn);
        
        // Reset
        this.resetViewBtn = document.createElement('button');
        this.resetViewBtn.className = 'model3d-premium-btn';
        this.resetViewBtn.innerHTML = '<i class="fas fa-home"></i> <span>Reset</span>';
        this.resetViewBtn.addEventListener('click', () => this.resetCamera());
        controlsBar.appendChild(this.resetViewBtn);
        
        // Auto-rotate
        this.autoRotateToggleBtn = document.createElement('button');
        this.autoRotateToggleBtn.className = 'model3d-premium-btn active';
        this.autoRotateToggleBtn.innerHTML = '<i class="fas fa-sync-alt"></i> <span>Auto ON</span>';
        this.autoRotateToggleBtn.addEventListener('click', () => this.toggleAutoRotate());
        controlsBar.appendChild(this.autoRotateToggleBtn);
        
        this.addQuantitySelector();
        
        if (this.options.addToCartEnabled && this.options.productId) {
            this.addToCartBtn = document.createElement('button');
            this.addToCartBtn.className = 'model3d-premium-btn model3d-add-to-cart';
            this.addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> <span>Adaugă în coș</span>';
            this.addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.triggerAddToCart();
            });
            controlsBar.appendChild(this.addToCartBtn);
        }
    }

    addQuantitySelector() {
        const group = document.createElement('div');
        group.className = 'model3d-quantity-group';
        group.innerHTML = `
            <label data-i18n="quantity_label">Cantitate:</label>
            <div class="model3d-quantity-controls">
                <button class="model3d-qty-btn" data-action="decr">−</button>
                <span class="model3d-qty-value">1</span>
                <button class="model3d-qty-btn" data-action="incr">+</button>
            </div>
        `;
        this.premiumControlsBar.appendChild(group);
        if (typeof TranslationManager !== 'undefined') TranslationManager.applyTranslations();
        
        const decrBtn = group.querySelector('[data-action="decr"]');
        const incrBtn = group.querySelector('[data-action="incr"]');
        this.qtySpan = group.querySelector('.model3d-qty-value');
        
        decrBtn.addEventListener('click', () => {
            if (this.currentQuantity > 1) {
                this.currentQuantity--;
                this.qtySpan.textContent = this.currentQuantity;
            }
        });
        incrBtn.addEventListener('click', () => {
            this.currentQuantity++;
            this.qtySpan.textContent = this.currentQuantity;
        });
    }

    toggleFullscreen() {
        const elem = this.container;
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => console.warn(err));
            this.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> <span>Exit</span>';
        } else {
            document.exitFullscreen();
            this.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> <span>Fullscreen</span>';
        }
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                this.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> <span>Exit</span>';
            } else {
                this.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> <span>Fullscreen</span>';
            }
            setTimeout(() => this.onWindowResize(), 100);
        });
    }

    resetCamera() {
        if (this.controls) {
            this.controls.target.copy(this.originalTarget);
            this.camera.position.copy(this.originalCameraPos);
            this.controls.update();
        }
        if (!this.autoRotateEnabled) {
            this.toggleAutoRotate();
        }
    }

    toggleAutoRotate() {
        this.autoRotateEnabled = !this.autoRotateEnabled;
        if (this.autoRotateEnabled) {
            this.autoRotateToggleBtn.classList.add('active');
            this.autoRotateToggleBtn.innerHTML = '<i class="fas fa-sync-alt"></i> <span>Auto ON</span>';
        } else {
            this.autoRotateToggleBtn.classList.remove('active');
            this.autoRotateToggleBtn.innerHTML = '<i class="fas fa-sync-alt"></i> <span>Auto OFF</span>';
        }
    }

    triggerAddToCart() {
        const callback = this.options.addToCartCallback || window.addToCart;
        if (callback && typeof callback === 'function') {
            callback(this.options.productId, this.options.productName, this.options.productPrice, this.currentQuantity);
        } else {
            console.warn('addToCart callback not set');
        }
        this.fireConfetti();
        this.animateFlyToCart(this.addToCartBtn);
    }

    fireConfetti() {
        if (typeof confetti === 'function') {
            confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ['#00f2fe', '#ffaa44'] });
        } else if (typeof canvasConfetti === 'function') {
            canvasConfetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        } else {
            console.log('🎉 Produs adăugat în coș!');
        }
    }

    animateFlyToCart(btnElement) {
        const cartIcon = document.querySelector('.cart-btn, .cart-icon, .cart-count')?.closest('.cart-btn');
        if (!cartIcon || !btnElement) return;
        const startRect = btnElement.getBoundingClientRect();
        const endRect = cartIcon.getBoundingClientRect();
        const flyer = document.createElement('div');
        flyer.innerHTML = '🛝';
        flyer.style.position = 'fixed';
        flyer.style.left = startRect.left + 'px';
        flyer.style.top = startRect.top + 'px';
        flyer.style.fontSize = '28px';
        flyer.style.transition = 'all 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
        flyer.style.zIndex = 10000;
        flyer.style.pointerEvents = 'none';
        document.body.appendChild(flyer);
        requestAnimationFrame(() => {
            flyer.style.transform = `translate(${endRect.left - startRect.left}px, ${endRect.top - startRect.top}px) scale(0.2)`;
            flyer.style.opacity = '0';
        });
        setTimeout(() => flyer.remove(), 700);
    }

    showLoading(message = 'Se încarcă modelul 3D...') {
        this.hideLoading();
        this.loadingElement = document.createElement('div');
        this.loadingElement.className = 'model3d-loading';
        this.loadingElement.innerHTML = `<div class="model3d-spinner"></div><span>${message}</span>`;
        this.container.appendChild(this.loadingElement);
    }

    hideLoading() {
        if (this.loadingElement && this.loadingElement.parentNode) {
            this.loadingElement.parentNode.removeChild(this.loadingElement);
        }
        this.loadingElement = null;
    }

    loadModel(modelPath, onComplete = null, onError = null) {
        if (!this._initialized) {
            this._ready.then(() => this.loadModel(modelPath, onComplete, onError)).catch(onError);
            return;
        }
        if (this.modelGroup) {
            this.scene.remove(this.modelGroup);
            this.disposeModel(this.modelGroup);
            this.modelGroup = null;
        }
        this.showLoading('Încărcare model...');
        
        let loader;
        if (typeof GLTFLoader !== 'undefined') loader = new GLTFLoader();
        else if (window.THREE && window.THREE.GLTFLoader) loader = new window.THREE.GLTFLoader();
        else {
            console.error('GLTFLoader not available');
            this.hideLoading();
            onError && onError('GLTFLoader missing');
            return;
        }
        
        loader.load(modelPath, (gltf) => {
            this.hideLoading();
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = maxDim > 0 ? 1.8 / maxDim : 1;
            model.scale.set(scale, scale, scale);
            model.position.sub(center.multiplyScalar(scale));
            model.position.y += 0.2;
            
            this.modelGroup = model;
            this.scene.add(this.modelGroup);
            
            // Fade-in
            model.traverse(child => {
                if (child.isMesh && child.material) {
                    const mats = Array.isArray(child.material) ? child.material : [child.material];
                    mats.forEach(mat => {
                        mat.transparent = true;
                        mat.opacity = 0;
                        let op = 0;
                        const step = () => {
                            op += 0.05;
                            if (op >= 1) { mat.opacity = 1; return; }
                            mat.opacity = op;
                            requestAnimationFrame(step);
                        };
                        requestAnimationFrame(step);
                    });
                }
            });
            
            this.addHotspotsToModel();
            if (onComplete) onComplete(this.modelGroup);
        }, (progress) => {
            if (this.loadingElement) {
                const percent = Math.round(progress.loaded / progress.total * 100);
                const span = this.loadingElement.querySelector('span');
                if (span) span.innerText = `Încărcare ${percent}%`;
            }
        }, (error) => {
            console.error('Load error:', error);
            this.hideLoading();
            if (onError) onError(error);
        });
    }

    addHotspotsToModel() {
        this.hotspots.forEach(h => h.element && h.element.remove());
        this.hotspots = [];
        
        const defaultHotspots = [
            { worldPos: { x: 0.7, y: 0.3, z: 0.4 }, title: 'Platformă sigură', desc: 'Antiderapantă, certificată EN71' },
            { worldPos: { x: 0.2, y: 0.9, z: 0.2 }, title: 'Rampă de lansare', desc: 'Unghi optim pentru viteză controlată' },
            { worldPos: { x: -0.5, y: 0.5, z: 0.6 }, title: 'Scară ergonomică', desc: 'Trepte largi, rezistente la UV' }
        ];
        
        defaultHotspots.forEach(def => {
            const dot = document.createElement('div');
            dot.className = 'model3d-hotspot';
            dot.innerHTML = `<div class="hotspot-dot"></div><div class="hotspot-tooltip"><strong>${def.title}</strong><br><span>${def.desc}</span></div>`;
            this.container.appendChild(dot);
            this.hotspots.push({
                element: dot,
                worldPosition: new THREE.Vector3(def.worldPos.x, def.worldPos.y, def.worldPos.z)
            });
        });
    }

    updateHotspotsPosition() {
        if (!this.camera || !this.modelGroup) return;
        this.hotspots.forEach(hotspot => {
            const worldPos = hotspot.worldPosition.clone();
            worldPos.applyQuaternion(this.modelGroup.quaternion);
            worldPos.multiply(this.modelGroup.scale);
            worldPos.add(this.modelGroup.position);
            const screenPos = worldPos.project(this.camera);
            const x = (screenPos.x * 0.5 + 0.5) * this.options.width;
            const y = (-screenPos.y * 0.5 + 0.5) * this.options.height;
            if (screenPos.z < 1 && x > 0 && x < this.options.width && y > 0 && y < this.options.height) {
                hotspot.element.style.display = 'block';
                hotspot.element.style.left = `${x}px`;
                hotspot.element.style.top = `${y}px`;
            } else {
                hotspot.element.style.display = 'none';
            }
        });
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        if (this.autoRotateEnabled && !this.isUserInteracting && this.modelGroup) {
            this.modelGroup.rotation.y += 0.005;
        }
        if (this.controls) this.controls.update();
        this.updateHotspotsPosition();
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        if (width === 0 || height === 0) return;
        this.options.width = width;
        this.options.height = height;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        if (this.controls) this.controls.update();
    }

    disposeModel(object) {
        if (!object) return;
        object.traverse(child => {
            if (child.isMesh) {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    const mats = Array.isArray(child.material) ? child.material : [child.material];
                    mats.forEach(mat => {
                        Object.keys(mat).forEach(key => {
                            if (mat[key] && mat[key].isTexture) mat[key].dispose();
                        });
                        mat.dispose();
                    });
                }
            }
        });
    }

    dispose() {
        this.hideLoading();
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.controls) this.controls.dispose();
        if (this.modelGroup) {
            this.disposeModel(this.modelGroup);
            this.scene.remove(this.modelGroup);
        }
        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode)
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
        if (this.scene) this.scene.clear();
        this.camera = null;
        this._initialized = false;
        this.hotspots.forEach(h => h.element && h.element.remove());
        if (this.premiumControlsBar) this.premiumControlsBar.remove();
    }
}

window.Model3DViewer = Model3DViewer;