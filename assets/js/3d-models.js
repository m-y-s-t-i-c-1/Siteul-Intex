/**
 * Gestionează modelele 3D și le mapează la produsele corespunzătoare
 */

// Mapping produse cu modele 3D
const PRODUCT_3D_MODELS = {
    // Terenuri de Joacă
    'j1': {
        name: 'playground+slide+3d+model.glb',
        title: 'Tobogan 3D Model',
        description: 'Model 3D al toboganului Intex',
        subcategory: null
    },
    'j2': {
        name: 'leagan+intex+cuib+3d.glb',
        title: 'Leagăn Cuib 3D Model',
        description: 'Model 3D al leagănului cuib',
        subcategory: null
    },
    'j3': {
        name: 'leagan+cu+scaun+schimbabil.glb',
        title: 'Leagăn cu Scaun Schimbabil 3D',
        description: 'Model 3D al leagănului cu scaun schimbabil',
        subcategory: null
    },
    'j4': {
        name: 'leagan cu scaun si balansatoar.glb',
        title: 'Leagăn cu Scaun și Balansoar 3D',
        description: 'Model 3D al leagănului cu scaun și balansoar',
        subcategory: null
    },
    'j5': {
        name: 'topogan simplu.glb',
        title: 'Tobogan Simplu 3D',
        description: 'Model 3D al toboganului simplu',
        subcategory: null
    },
    // Bazine Copii - Bazine Gonflabile
    'kp1': {
        name: 'BAZIN GONFLABIL COPII 168Х46СМ «CURCUBEU».glb',
        title: 'Bazin Curcubeu 168x46 3D',
        description: 'Model 3D al bazinului Curcubeu',
        subcategory: 'bazine gonflabile'
    },
    'kp2': {
        name: 'BAZIN COPII 183Х38СМ «SNAPSET»;  Bazin Copii 152x25cm «Snorkeling».glb',
        title: 'Bazin Snorkeling 3D',
        description: 'Model 3D al bazinului pentru snorkeling',
        subcategory: 'bazine gonflabile'
    },
    'kp3': {
        name: 'BAZIN COPII 183Х38СМ «SNAPSET»;  Bazin Copii 152x25cm «Snorkeling».glb',
        title: 'Bazin SNAPSET 3D',
        description: 'Model 3D al bazinului SNAPSET',
        subcategory: 'bazine gonflabile'
    },
    'kp4': {
        name: 'BAZIN GONFLABIL COPII 229Х229Х66СМ «FAMILIAL».glb',
        title: 'Bazin Familial 229x229 3D',
        description: 'Model 3D al bazinului familial',
        subcategory: 'bazine gonflabile'
    },
    'kp5': {
        name: 'BAZIN GONFLABIL COPII 262Х175Х56СМ «CADA».glb',
        title: 'Bazin CADA 262x175 3D',
        description: 'Model 3D al bazinului CADA',
        subcategory: 'bazine gonflabile'
    },
    'kp6': {
        name: 'BAZIN GONFLABIL COPII 191Х178Х61СМ «AKVARIUM».glb',
        title: 'Bazin Akvarium 3D',
        description: 'Model 3D al bazinului Akvarium',
        subcategory: 'bazine gonflabile'
    },
    'kp7': {
        name: 'Inel Gonflabil Intex «Micuța Stea».glb',
        title: 'Inel Micuța Stea 3D',
        description: 'Model 3D al inelului gonflabil',
        subcategory: 'bazine gonflabile'
    },
    'kp8': {
        name: 'BAZIN GONFLABIL COPII 85Х85Х23СМ, 57Л, ОТ 1 ДО 3 ЛЕТ.glb',
        title: 'Bazin 85x85 3D',
        description: 'Model 3D al bazinului mic pentru copii',
        subcategory: 'bazine gonflabile'
    },
    'kp9': {
        name: 'BAZIN GONFLABIL COPII 168Х46СМ «CURCUBEU».glb',
        title: 'Bazin Curcubeu 168x46 3D',
        description: 'Model 3D al bazinului Curcubeu',
        subcategory: 'bazine gonflabile'
    },
    'kp10': {
        name: 'BAZIN GONFLABIL COPII 102Х89СМ «CIUPERCA MUSCARIA» CU COPERIȘ.glb',
        title: 'Bazin Ciuperca 102x89 3D',
        description: 'Model 3D al bazinului ciupercă',
        subcategory: 'bazine gonflabile'
    },
    'kp11': {
        name: 'BAZIN GONFLABIL COPII «FAMILIAL» INTEX, 203X152X48 CM; BAZIN GONFLABIL COPII 229Х147Х46СМ ОТ 6 ЛЕТ.glb',
        title: 'Bazin Familial 203x152 3D',
        description: 'Model 3D al bazinului familial',
        subcategory: 'bazine gonflabile'
    },
    'kp12': {
        name: 'BAZIN GONFLABIL COPII «FAMILIAL» INTEX, 203X152X48 CM; BAZIN GONFLABIL COPII 229Х147Х46СМ ОТ 6 ЛЕТ.glb',
        title: 'Bazin Familial 203x152 3D',
        description: 'Model 3D al bazinului familial',
        subcategory: 'bazine gonflabile'
    },
    // Bazine Copii - Bazine Cadru
    'kc1': {
        name: '26726NP BAZIN CADRU ROTUND INTE0X PRISM FRAME POOL 4,57X1,2226720 BAZIN CADRU PRISM FRAME 427X107CM; 26712 Bazin cadru Prism Frame 366x76cm, 6503l, filtru-pompă 2006l_h; 26710 Bazin cadru Intex Prism Frame 36.glb',
        title: 'Bazin Cadru Prism Frame 3D',
        description: 'Model 3D al bazinului cadru Prism Frame rotund',
        subcategory: 'bazine cadru'
    },
    'kc2': {
        name: 'BAZIN+CADRU+INTEX+ULTRA+XTR+PREMIUM+POOL+LINE,+26364+BAZIN+CADRU+INTEX+ULTRA+XTR+PREMIUM+POOL+LINE+732X366X132CM,+26374+BAZIN+CADRU+INTEX+ULTRA+XTR+PREMIUM+POOL+LINE+975X488X132CM.glb',
        title: 'Bazin Cadru Ultra XTR Premium 3D',
        description: 'Model 3D al bazinului cadru Ultra XTR Premium line',
        subcategory: 'bazine cadru'
    },
    'kc3': {
        name: 'BAZIN+CADRU+INTEX+ULTRA+XTR+PREMIUM+POOL+LINE,+26364+BAZIN+CADRU+INTEX+ULTRA+XTR+PREMIUM+POOL+LINE+732X366X132CM,+26374+BAZIN+CADRU+INTEX+ULTRA+XTR+PREMIUM+POOL+LINE+975X488X132CM.glb',
        title: 'Bazin Cadru Ultra XTR Premium 3D',
        description: 'Model 3D al bazinului cadru Ultra XTR Premium',
        subcategory: 'bazine cadru'
    },
    'kc4': {
        name: 'BAZIN+CADRU+INTEX+ULTRA+XTR+PREMIUM+POOL+LINE,+26364+BAZIN+CADRU+INTEX+ULTRA+XTR+PREMIUM+POOL+LINE+732X366X132CM,+26374+BAZIN+CADRU+INTEX+ULTRA+XTR+PREMIUM+POOL+LINE+975X488X132CM.glb',
        title: 'Bazin Cadru Ultra XTR Premium 3D',
        description: 'Model 3D al bazinului cadru Ultra XTR Premium',
        subcategory: 'bazine cadru'
    },
    'kc5': {
        name: 'BAZIN+CADRU+INTEX+ULTRA+XTR+PREMIUM+POOL+LINE,+26364+BAZIN+CADRU+INTEX+ULTRA+XTR+PREMIUM+POOL+LINE+732X366X132CM,+26374+BAZIN+CADRU+INTEX+ULTRA+XTR+PREMIUM+POOL+LINE+975X488X132CM.glb',
        description: 'Model 3D al bazinului cadru Ultra Frame premium',
        subcategory: 'bazine cadru'
    },
    'kc6': {
        name: 'BAZIN+CADRU+INTEX+ULTRA+XTR+PREMIUM+POOL+LINE,+26364+BAZIN+CADRU+INTEX+ULTRA+XTR+PREMIUM+POOL+LINE+732X366X132CM,+26374+BAZIN+CADRU+INTEX+ULTRA+XTR+PREMIUM+POOL+LINE+975X488X132CM.glb',
        title: 'Bazin Ultra Frame Premium 3D',
        description: 'Model 3D al bazinului cadru Ultra Frame premium',
        subcategory: 'bazine cadru'
    },
    'kc7': {
        name: 'Bazin Cadru Ultra Frame 488x122cm, 549x132cm, Ultra XTR Frame 732x132cm.glb',
        title: 'Bazin Ultra Frame 3D',
        description: 'Model 3D al bazinului cadru Ultra Frame',
        subcategory: 'bazine cadru'
    }, 
    'kc8': {
        name: 'Bazin Cadru Ultra Frame 488x122cm, 549x132cm, Ultra XTR Frame 732x132cm.glb',
        title: 'Bazin Ultra Frame 3D',
        description: 'Model 3D al bazinului cadru Ultra Frame',
        subcategory: 'bazine cadru'
    },
    'kc9': {
        name: 'Bazin Cadru Ultra Frame 488x122cm, 549x132cm, Ultra XTR Frame 732x132cm.glb',
        title: 'Bazin Ultra Frame 3D',
        description: 'Model 3D al bazinului cadru Ultra Frame',
        subcategory: 'bazine cadru'
    },
    'kc10': {
        name: 'Bazin Cadru Ultra Frame 488x122cm, 549x132cm, Ultra XTR Frame 732x132cm.glb',
        title: 'Bazin Ultra Frame 3D',
        description: 'Model 3D al bazinului cadru Ultra Frame',
        subcategory: 'bazine cadru'
    },  
    'kc11': {
        name: 'Bazin Cadru Ultra Frame 488x122cm, 549x132cm, Ultra XTR Frame 732x132cm.glb',
        title: 'Bazin Ultra Frame 3D',
        description: 'Model 3D al bazinului cadru Ultra Frame',
        subcategory: 'bazine cadru'
    },
    'kc12': {  
        name: 'Bazin Cadru Ultra Frame 488x122cm, 549x132cm, Ultra XTR Frame 732x132cm.glb',
        title: 'Bazin Ultra Frame 3D',
        description: 'Model 3D al bazinului cadru Ultra Frame',
        subcategory: 'bazine cadru'
    },
    
    
    // Transport
    't1': {
        name:'tricicleta+pentru+copii.glb',
        title: 'Tricileta pentru copii 3D',
        description: 'Model 3D al tricicletei pentru copii',
        subcategory: null
    },
    't2': {
        name: 'Trotinetă copii Model 188.glb',
        title: 'Trotinetă Model 188 3D',
        description: 'Model 3D al trotinetei pentru copii',
        subcategory: null
    },
    't3': {
        name: 'skateboard copii 2026.glb',
        title: 'Skateboard 2026 3D',
        description: 'Model 3D al skateboardului',
        subcategory: null
    },
    't4': {
        name: 'Skateboard copii 2308.glb',
        title: 'Skateboard 2308 3D',
        description: 'Model 3D al skateboardului 2308',
        subcategory: null
    },
    't5': {
        name: 'skateboard copii 2406.glb',
        title: 'Skateboard 2406 3D',
        description: 'Model 3D al skateboardului 2406',
        subcategory: null
    },
    't6': {
        name: 'Trotinetă copii 2489.glb',
        title: 'Trotinetă 2489 3D',
        description: 'Model 3D al trotinetei 2489',
        subcategory: null
    },
    't7': {
        name: 'Skateboard copii 28p.glb',
        title: 'Skateboard copii 28p 3D',
        description: 'Model 3D al skateboardului cu roți luminoase',
        subcategory: null
    },
    't8': {
        name: 'Trotinetă copii 306.glb',
        title: 'Trotinetă 306 3D',
        description: 'Model 3D al trotinetei 306',
        subcategory: null
    },
    't9': {
        name: 'Trotinetă copii 307.glb',
        title: 'Trotinetă 307 3D',
        description: 'Model 3D al trotinetei 307',
        subcategory: null
    },
    't10': {
        name: 'Skateboard cu mâner 3108.glb',
        title: 'Skateboard 3108 3D',
        description: 'Model 3D al skateboardului 3108',
        subcategory: null
    },
    't11': {
        name: 'Skateboard cu roți luminoase 3108.glb',
        title: 'Skateboard 3108 3D',
        description: 'Model 3D al skateboardului 3108',
        subcategory: null
    },
    't12': {
        name: 'Skateboard copii 3108GD.glb',
        title: 'Skateboard 3108GD 3D',
        description: 'Model 3D al skateboardului 3108GD',
        subcategory: null
    },
};

/**
 * Detectează subcategoria pe baza ID-ului și numelui modelului
 * @param {string} productId - ID-ul produsului
 * @returns {string} - Subcategoria detectată
 */
function detectSubcategory(productId) {
    const model = PRODUCT_3D_MODELS[productId];
    if (!model || !model.subcategory) return null;
    return model.subcategory;
}

/**
 * Obține calea completă către modelul 3D
 * @param {string} productId - ID-ul produsului
 * @param {string} productTitle - Titlul produsului (optional)
 * @returns {string|null} - Calea completă către modelul sau null
 */
function get3DModelPath(productId, productTitle) {
    let model = PRODUCT_3D_MODELS[productId];
    let checkId = productId; // ID pentru determinarea categoriei
    
    // Pool products mapping - mapează pool_XXXX la kc1-kc4
    if (!model && productId && productId.startsWith('pool_')) {
        const modelId = mapPoolToModelId(productId, productTitle);
        model = modelId ? PRODUCT_3D_MODELS[modelId] : null;
        checkId = modelId; // Verific categoria pe baza modelId (kc1, kc2, etc)
    }
    
    if (!model) return null;
    
    let category = '';
    if (checkId.startsWith('j')) {
        category = 'Terenuri de Joaca';
    } else if (checkId.startsWith('kp')) {
        category = 'bazine copii';
    } else if (checkId.startsWith('kc')) {
        category = 'bazine intex - bazine cadru';
    } else if (checkId.startsWith('t')) {
        category = 'transport';
    }
    
    if (!category) return null;
    
    const basePath = (typeof getBasePath === 'function') ? getBasePath() : './';
    const encodedFilename = encodeURIComponent(model.name);
    const fullPath = basePath + 'modele_3d/' + encodeURIComponent(category) + '/' + encodedFilename;
    console.log('[3D] Loading model:', productId, 'from:', fullPath);
    return fullPath;
}

/**
 * Verifică dacă un produs are model 3D
 * @param {string} productId - ID-ul produsului
 * @param {string} productTitle - Titlul produsului (optional)
 * @returns {boolean}
 */
function hasModel3D(productId, productTitle) {
    // Direct ID mapping
    if (productId in PRODUCT_3D_MODELS) {
        return true;
    }
    
    // Pool products mapping (bazine cadru)
    if (productId && productId.startsWith('pool_')) {
        return !!mapPoolToModelId(productId, productTitle);
    }
    
    return false;
}

/**
 * Obține informațiile modelului 3D
 * @param {string} productId - ID-ul produsului
 * @param {string} productTitle - Titlul produsului (optional)
 * @returns {object|null}
 */
function getModel3DInfo(productId, productTitle) {
    // Direct ID mapping
    if (productId in PRODUCT_3D_MODELS) {
        return PRODUCT_3D_MODELS[productId];
    }
    
    // Pool products mapping
    if (productId && productId.startsWith('pool_')) {
        const modelId = mapPoolToModelId(productId, productTitle);
        return modelId ? PRODUCT_3D_MODELS[modelId] : null;
    }
    
    return null;
}

/**
 * Returnează lista tuturor produselor cu modele 3D
 * @returns {array}
 */
function getAllProducts3D() {
    return Object.keys(PRODUCT_3D_MODELS);
}

/**
 * Returnează numărarea modelelor 3D per categorie și subcategorie
 * @returns {object}
 */
function getModel3DStats() {
    const stats = {
        terenuri: 0,
        bazine_copii: 0,
        bazine_gonflabile: 0,
        bazine_cadru: 0,
        transport: 0,
        total: 0
    };
    
    for (const productId in PRODUCT_3D_MODELS) {
        if (productId.startsWith('j')) {
            stats.terenuri++;
        } else if (productId.startsWith('kp')) {
            stats.bazine_gonflabile++;
            stats.bazine_copii++;
        } else if (productId.startsWith('kc')) {
            stats.bazine_cadru++;
            stats.bazine_copii++;
        } else if (productId.startsWith('t')) {
            stats.transport++;
        }
    }
    
    stats.total = stats.terenuri + stats.bazine_copii + stats.transport;
    return stats;
}

/**
 * Returnează produsele filtrate după subcategorie
 * @param {string} subcategory - Subcategoria (ex: 'bazine gonflabile', 'bazine cadru')
 * @returns {array}
 */
function getProductsBySubcategory(subcategory) {
    return Object.keys(PRODUCT_3D_MODELS).filter(productId => {
        const model = PRODUCT_3D_MODELS[productId];
        return model.subcategory === subcategory;
    });
}

function mapPoolToModelId(productId, productTitle) {
    if (!productId || !productId.startsWith('pool_')) return null;
    
    console.log('[3D] mapPoolToModelId - productId:', productId, 'title:', productTitle);
    
    if (!productTitle) {
        console.log('[3D] No title provided, returning kc2');
        return 'kc2';
    }
    
    const titleLower = String(productTitle).toLowerCase();
    console.log('[3D] titleLower:', titleLower);
    
    // Primii 3: Au "ultra" (frame sau xtr) dar nu "premium" -> kc1 (26726NP Prism Frame)
    if (titleLower.includes('ultra') && !titleLower.includes('premium')) {
        console.log('[3D] MATCH: Has Ultra but no Premium -> kc1');
        return 'kc1';
    }
    
    // Restul (26356, 26364, 26374 cu ULTRA XTR PREMIUM, PRISM FRAME, 305x76, etc) -> kc2
    console.log('[3D] Default -> kc2');
    return 'kc2';
}

/**
 * Wrapper pentru compatibilitate - equivalent cu get3DModelPath
 * @param {string} productId - ID-ul produsului pool_XXXX
 * @param {string} productTitle - Titlul produsului
 * @returns {string|null} - Calea completă sau null
 */
function getPoolModel3DPath(productId, productTitle) {
    return get3DModelPath(productId, productTitle);
}

// Inițializare și export pentru utilizare
console.log('3D Models Manager loaded. Available 3D models:', getModel3DStats());
