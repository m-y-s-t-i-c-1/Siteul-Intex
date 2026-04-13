/**
 * Gestionează modelele 3D și le mapează la produsele corespunzătoare
 */

// Mapping produse cu modele 3D
const PRODUCT_3D_MODELS = {
    // Terenuri de Joacă
    'j1': {
        name: 'playground+slide+3d+model.glb',
        title: 'Tobogan 3D Model',
        description: 'Model 3D al toboganului Intex'
    },
    'j2': {
        name: 'leagan+intex+cuib+3d.glb',
        title: 'Leagăn Cuib 3D Model',
        description: 'Model 3D al leagănului cuib'
    },
    'j3': {
        name: 'leagan+cu+scaun+schimbabil.glb',
        title: 'Leagăn cu Scaun Schimbabil 3D',
        description: 'Model 3D al leagănului cu scaun schimbabil'
    },
    'j4': {
        name: 'leagan cu scaun si balansatoar.glb',
        title: 'Leagăn cu Scaun și Balansoar 3D',
        description: 'Model 3D al leagănului cu scaun și balansoar'
    },
    'j5': {
        name: 'topogan simplu.glb',
        title: 'Tobogan Simplu 3D',
        description: 'Model 3D al toboganului simplu'
    },
    // Bazine Copii
    'kp1': {
        name: 'BAZIN GONFLABIL COPII 168Х46СМ «CURCUBEU».glb',
        title: 'Bazin Curcubeu 168x46 3D',
        description: 'Model 3D al bazinului Curcubeu'
    },
    'kp2': {
        name: 'BAZIN COPII 183Х38СМ «SNAPSET»; Bazin Copii 152x25cm «Snorkeling».glb',
        title: 'Bazin Snorkeling 3D',
        description: 'Model 3D al bazinului pentru snorkeling'
    },
    'kp3': {
        name: 'BAZIN COPII 183Х38СМ «SNAPSET»; Bazin Copii 152x25cm «Snorkeling».glb',
        title: 'Bazin SNAPSET 3D',
        description: 'Model 3D al bazinului SNAPSET'
    },
    'kp4': {
        name: 'BAZIN GONFLABIL COPII 229Х229Х66СМ «FAMILIAL».glb',
        title: 'Bazin Familial 229x229 3D',
        description: 'Model 3D al bazinului familial'
    },
    'kp5': {
        name: 'BAZIN GONFLABIL COPII 262Х175Х56СМ «CADA».glb',
        title: 'Bazin CADA 262x175 3D',
        description: 'Model 3D al bazinului CADA'
    },
    'kp6': {
        name: 'BAZIN GONFLABIL COPII 191Х178Х61СМ «AKVARIUM».glb',
        title: 'Bazin Akvarium 3D',
        description: 'Model 3D al bazinului Akvarium'
    },
    'kp7': {
        name: 'Inel Gonflabil Intex «Micuța Stea».glb',
        title: 'Inel Micuța Stea 3D',
        description: 'Model 3D al inelului gonflabil'
    },
    'kp8': {
        name: 'BAZIN GONFLABIL COPII 85Х85Х23СМ, 57Л, ОТ 1 ДО 3 ЛЕТ.glb',
        title: 'Bazin 85x85 3D',
        description: 'Model 3D al bazinului mic pentru copii'
    },
    'kp11': {
        name: 'BAZIN GONFLABIL COPII «FAMILIAL» INTEX, 203X152X48 CM; BAZIN GONFLABIL COPII 229Х147Х46СМ ОТ 6 ЛЕТ.glb',
        title: 'Bazin Familial 203x152 3D',
        description: 'Model 3D al bazinului familial'
    },
    
    // Transport
    't1': {
        name:'tricicleta+pentru+copii.glb',
        title: 'Tricileta pentru copii 3D',
        description: 'Model 3D al tricicletei pentru copii'
    },
    't2': {
        name: 'Trotinetă copii Model 188.glb',
        title: 'Trotinetă Model 188 3D',
        description: 'Model 3D al trotinetei pentru copii'
    },
    't3': {
        name: 'skateboard copii 2026.glb',
        title: 'Skateboard 2026 3D',
        description: 'Model 3D al skateboardului'
    },
    't4': {
        name: 'Skateboard copii 2308.glb',
        title: 'Skateboard 2308 3D',
        description: 'Model 3D al skateboardului 2308'
    },
    't5': {
        name: 'skateboard copii 2406.glb',
        title: 'Skateboard 2406 3D',
        description: 'Model 3D al skateboardului 2406'
    },
    't6': {
        name: 'Trotinetă copii 2489.glb',
        title: 'Trotinetă 2489 3D',
        description: 'Model 3D al trotinetei 2489'
    },
    't7': {
        name: 'Skateboard copii 28p.glb',
        title: 'Skateboard copii 28p 3D',
        description: 'Model 3D al skateboardului cu roți luminoase'
    },
    't8': {
        name: 'Trotinetă copii 306.glb',
        title: 'Trotinetă 306 3D',
        description: 'Model 3D al trotinetei 306'
    },
    't9': {
        name: 'Trotinetă copii 307.glb',
        title: 'Trotinetă 307 3D',
        description: 'Model 3D al trotinetei 307'
    },
    't10': {
        name: 'Skateboard cu mâner 3108.glb',
        title: 'Skateboard 3108 3D',
        description: 'Model 3D al skateboardului 3108'
    },
    't11': {
        name: 'Skateboard cu roți luminoase 3108.glb',
        title: 'Skateboard 3108 3D',
        description: 'Model 3D al skateboardului 3108'
    },
    't12': {
        name: 'Skateboard copii 3108GD.glb',
        title: 'Skateboard 3108GD 3D',
        description: 'Model 3D al skateboardului 3108GD'
    }
};

/**
 * Obține calea completă către modelul 3D
 * @param {string} productId - ID-ul produsului
 * @returns {string|null} - Calea completă către modelul sau null
 */
function get3DModelPath(productId) {
    const model = PRODUCT_3D_MODELS[productId];
    if (!model) return null;
    
    let category = '';
    if (productId.startsWith('j')) {
        category = 'Terenuri de Joaca';
    } else if (productId.startsWith('kp')) {
        category = 'bazine copii';
    } else if (productId.startsWith('t')) {
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
 * @returns {boolean}
 */
function hasModel3D(productId) {
    return productId in PRODUCT_3D_MODELS;
}

/**
 * Obține informațiile modelului 3D
 * @param {string} productId - ID-ul produsului
 * @returns {object|null}
 */
function getModel3DInfo(productId) {
    return PRODUCT_3D_MODELS[productId] || null;
}

/**
 * Returnează lista tuturor produselor cu modele 3D
 * @returns {array}
 */
function getAllProducts3D() {
    return Object.keys(PRODUCT_3D_MODELS);
}

/**
 * Returnează numărarea modelelor 3D per categorie
 * @returns {object}
 */
function getModel3DStats() {
    const stats = {
        terenuri: 0,
        bazine_copii: 0,
        transport: 0,
        total: 0
    };
    
    for (const productId in PRODUCT_3D_MODELS) {
        if (productId.startsWith('j')) {
            stats.terenuri++;
        } else if (productId.startsWith('kp')) {
            stats.bazine_copii++;
        } else if (productId.startsWith('t')) {
            stats.transport++;
        }
    }
    
    stats.total = stats.terenuri + stats.bazine_copii + stats.transport;
    return stats;
}

// Inițializare și export pentru utilizare
console.log('3D Models Manager loaded. Available 3D models:', getModel3DStats());
