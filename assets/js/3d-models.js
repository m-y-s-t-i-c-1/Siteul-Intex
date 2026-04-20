/**
 * Gestionează modelele 3D și le mapează la produsele corespunzătoare
 */

// Mapping produse cu modele 3D
const PRODUCT_3D_MODELS = {
    // Terenuri de Joacă
    'j1': { name: 'playground+slide+3d+model.glb', title: 'Tobogan 3D Model', description: 'Model 3D al toboganului Intex', subcategory: null },
    'j2': { name: 'leagan+intex+cuib+3d.glb', title: 'Leagăn Cuib 3D Model', description: 'Model 3D al leagănului cuib', subcategory: null },
    'j3': { name: 'leagan+cu+scaun+schimbabil.glb', title: 'Leagăn cu Scaun Schimbabil 3D', description: 'Model 3D al leagănului cu scaun schimbabil', subcategory: null },
    'j4': { name: 'leagan cu scaun si balansatoar.glb', title: 'Leagăn cu Scaun și Balansoar 3D', description: 'Model 3D al leagănului cu scaun și balansoar', subcategory: null },
    'j5': { name: 'topogan simplu.glb', title: 'Tobogan Simplu 3D', description: 'Model 3D al toboganului simplu', subcategory: null },

    // Bazine Copii - Bazine Gonflabile
    'kp1': { name: 'BAZIN GONFLABIL COPII 168Х46СМ «CURCUBEU».glb', title: 'Bazin Curcubeu 168x46 3D', description: 'Model 3D al bazinului Curcubeu', subcategory: 'bazine gonflabile' },
    'kp2': { name: 'BAZIN COPII 152x25cm «Snorkeling».glb', title: 'Bazin Snorkeling 3D', description: 'Model 3D al bazinului pentru snorkeling', subcategory: 'bazine gonflabile' },
    'kp3': { name: 'BAZIN COPII 183Х38СМ «SNAPSET».glb', title: 'Bazin SNAPSET 3D', description: 'Model 3D al bazinului SNAPSET', subcategory: 'bazine gonflabile' },
    'kp4': { name: 'BAZIN GONFLABIL COPII 229Х229Х66СМ «FAMILIAL».glb', title: 'Bazin Familial 229x229 3D', description: 'Model 3D al bazinului familial', subcategory: 'bazine gonflabile' },
    'kp5': { name: 'BAZIN GONFLABIL COPII 262Х175Х56СМ «CADA».glb', title: 'Bazin CADA 262x175 3D', description: 'Model 3D al bazinului CADA', subcategory: 'bazine gonflabile' },
    'kp6': { name: 'BAZIN GONFLABIL COPII 191Х178Х61СМ «AKVARIUM».glb', title: 'Bazin Akvarium 3D', description: 'Model 3D al bazinului Akvarium', subcategory: 'bazine gonflabile' },
    'kp7': { name: 'Inel Gonflabil Intex «Micuța Stea».glb', title: 'Inel Micuța Stea 3D', description: 'Model 3D al inelului gonflabil', subcategory: 'bazine gonflabile' },
    'kp8': { name: 'BAZIN GONFLABIL COPII 85Х85Х23СМ.glb', title: 'Bazin 85x85 3D', description: 'Model 3D al bazinului mic pentru copii', subcategory: 'bazine gonflabile' },
    'kp9': { name: 'BAZIN GONFLABIL COPII 168Х46СМ «CURCUBEU».glb', title: 'Bazin Curcubeu 168x46 3D', description: 'Model 3D al bazinului Curcubeu', subcategory: 'bazine gonflabile' },
    'kp10': { name: 'BAZIN GONFLABIL COPII 102Х89СМ «CIUPERCA MUSCARIA».glb', title: 'Bazin Ciuperca 102x89 3D', description: 'Model 3D al bazinului ciupercă', subcategory: 'bazine gonflabile' },
    'kp11': { name: 'BAZIN GONFLABIL COPII «FAMILIAL» INTEX, 203X152X48 CM.glb', title: 'Bazin Familial 203x152 3D', description: 'Model 3D al bazinului familial', subcategory: 'bazine gonflabile' },
    'kp12': { name: 'BAZIN GONFLABIL COPII 229Х147Х46СМ.glb', title: 'Bazin Familial 229x147 3D', description: 'Model 3D al bazinului familial', subcategory: 'bazine gonflabile' },

    // Bazine Intex - Bazine Gonflabile (cu modele 3D din Easy Set - pe server în folderul bazine cadru)
    'kip1': { name: 'Bazin Easy Set 305x76cm - Piscină Mare pentru Familie; Bazin Easy Set 244x61cm - Piscină Familială; Bazin Easy Set 183x51cm - Piscină Compactă pentru Copii.glb', title: 'Bazin Intex Easy Set 305x76 3D', description: 'Model 3D Easy Set', subcategory: 'bazine intex - bazine gonflabile' },
    'kip2': { name: 'Bazin Easy Set 305x76cm - Piscină Mare pentru Familie; Bazin Easy Set 244x61cm - Piscină Familială; Bazin Easy Set 183x51cm - Piscină Compactă pentru Copii.glb', title: 'Bazin Intex Easy Set 244x61 3D', description: 'Model 3D Easy Set', subcategory: 'bazine intex - bazine gonflabile' },
    'kip3': { name: 'Bazin Easy Set 305x76cm - Piscină Mare pentru Familie; Bazin Easy Set 244x61cm - Piscină Familială; Bazin Easy Set 183x51cm - Piscină Compactă pentru Copii.glb', title: 'Bazin Intex Easy Set 183x51 3D', description: 'Model 3D Easy Set', subcategory: 'bazine intex - bazine gonflabile' },
    'kc1': { name: '26726NP BAZIN CADRU ROTUND INTEX PRISM FRAME 457X122.glb', title: 'Bazin Prism Frame 457x122 3D', description: 'Model 3D Prism Frame Rotund', subcategory: 'bazine cadru' },
    'kc2': { name: '26364 BAZIN CADRU ULTRA XTR PREMIUM 732X362X132.glb', title: 'Bazin Ultra XTR 732x366 3D', description: 'Model 3D Ultra XTR Premium', subcategory: 'bazine cadru' },
    'kc3': { name: '26374 BAZIN CADRU ULTRA XTR PREMIUM 975X488X132.glb', title: 'Bazin Ultra XTR 975x488 3D', description: 'Model 3D Ultra XTR Premium', subcategory: 'bazine cadru' },
    'kc4': { name: '26712 Bazin cadru Prism Frame 366x76.glb', title: 'Bazin Prism Frame 366x76 3D', description: 'Model 3D Prism Frame', subcategory: 'bazine cadru' },
    'kc5': { name: '26710 Bazin cadru Intex Prism Frame 305x76.glb', title: 'Bazin Prism Frame 305x76 3D', description: 'Model 3D Prism Frame', subcategory: 'bazine cadru' },
    'kc6': { name: '26356 BAZIN CADRU ULTRA XTR PREMIUM 549X274X132.glb', title: 'Bazin Ultra XTR 549x274 3D', description: 'Model 3D Ultra XTR Premium', subcategory: 'bazine cadru' },
    'kc7': { name: 'Bazin Cadru Ultra Frame 488x122.glb', title: 'Bazin Ultra Frame 488x122 3D', description: 'Model 3D Ultra Frame', subcategory: 'bazine cadru' },
    'kc8': { name: 'Bazin Cadru Ultra Frame 549x132.glb', title: 'Bazin Ultra Frame 549x132 3D', description: 'Model 3D Ultra Frame', subcategory: 'bazine cadru' },
    'kc9': { name: 'Bazin Cadru Ultra XTR Frame 732x132.glb', title: 'Bazin Ultra XTR 732x132 3D', description: 'Model 3D Ultra Frame XTR', subcategory: 'bazine cadru' },
    'kc10': { name: 'Bazin Cadru Prism Frame 427x107.glb', title: 'Bazin Prism Frame 427x107 3D', description: 'Model 3D Prism Frame', subcategory: 'bazine cadru' },
    'kc11': { name: 'Bazin Cadru Prism Frame Rectangular 400x200.glb', title: 'Bazin Prism Rectangular 3D', description: 'Model 3D Prism Frame Dreptunghiular', subcategory: 'bazine cadru' },
    'kc12': { name: 'Bazin Cadru Prism Frame Rectangular 488x244.glb', title: 'Bazin Prism Rectangular 488x244 3D', description: 'Model 3D Prism Frame Dreptunghiular', subcategory: 'bazine cadru' },

    // Transport
    't1': { name: 'tricicleta+pentru+copii.glb', title: 'Tricileta pentru copii 3D', description: 'Model 3D al tricicletei', subcategory: null },
    't2': { name: 'Trotinetă copii Model 188.glb', title: 'Trotinetă Model 188 3D', description: 'Model 3D al trotinetei', subcategory: null },
    't3': { name: 'skateboard copii 2026.glb', title: 'Skateboard 2026 3D', description: 'Model 3D al skateboardului', subcategory: null },
    't4': { name: 'Skateboard copii 2308.glb', title: 'Skateboard 2308 3D', description: 'Model 3D al skateboardului 2308', subcategory: null },
    't5': { name: 'skateboard copii 2406.glb', title: 'Skateboard 2406 3D', description: 'Model 3D al skateboardului 2406', subcategory: null },
    't6': { name: 'Trotinetă copii 2489.glb', title: 'Trotinetă 2489 3D', description: 'Model 3D al trotinetei 2489', subcategory: null },
    't7': { name: 'Skateboard copii 28p.glb', title: 'Skateboard copii 28p 3D', description: 'Model 3D cu roți luminoase', subcategory: null },
    't8': { name: 'Trotinetă copii 306.glb', title: 'Trotinetă 306 3D', description: 'Model 3D al trotinetei 306', subcategory: null },
    't9': { name: 'Trotinetă copii 307.glb', title: 'Trotinetă 307 3D', description: 'Model 3D al trotinetei 307', subcategory: null },
    't10': { name: 'Skateboard cu mâner 3108.glb', title: 'Skateboard 3108 3D', description: 'Model 3D al skateboardului 3108', subcategory: null },
    't11': { name: 'Skateboard cu roți luminoase 3108.glb', title: 'Skateboard 3108 3D', description: 'Model 3D al skateboardului 3108', subcategory: null },
    't12': { name: 'Skateboard copii 3108GD.glb', title: 'Skateboard 3108GD 3D', description: 'Model 3D al skateboardului 3108GD', subcategory: null },
};

function getCorrectModelPath(filename) {
    // Detectează dacă suntem într-un subfolder (ex: /pagini/)
    const currentPath = window.location.pathname;
    const isInSubfolder = currentPath.includes('/pagini/') || currentPath.includes('/assets/');
    
    // Dacă suntem în subfolder, adăugăm ../ pentru a ajunge la root
    const basePath = isInSubfolder ? '../' : './';
    
    // Construiește calea completă către folderul modele_3d
    const fullPath = basePath + 'modele_3d/' + filename;
    
    console.log('[3D] getCorrectModelPath:', {
        currentPath,
        isInSubfolder,
        basePath,
        filename,
        fullPath
    });
    
    return fullPath;
}

// Funcții utilitare obligatorii
function hasModel3D(productId, productTitle) {
    const inDirect = productId in PRODUCT_3D_MODELS;
    if (inDirect) {
        console.log('[3D] hasModel3D: YES - direct product in PRODUCT_3D_MODELS:', productId);
        return true;
    }
    
    const isPool = productId && productId.startsWith('pool_');
    if (isPool) {
        const modelFile = mapPoolToModelFile(productId, productTitle);
        const hasPoolModel = !!modelFile;
        console.log('[3D] hasModel3D pool check:', {productId, modelFile, hasPoolModel});
        return hasPoolModel;
    }
    
    console.log('[3D] hasModel3D: NO - product not found:', productId);
    return false;
}

function getModel3DInfo(productId, productTitle) {
    if (productId in PRODUCT_3D_MODELS) return PRODUCT_3D_MODELS[productId];
    if (productId && productId.startsWith('pool_')) {
        const modelFile = mapPoolToModelFile(productId, productTitle);
        if (modelFile) {
            return { name: modelFile, title: productTitle, description: 'Model 3D pool frame cadru', subcategory: 'bazine cadru' };
        }
    }
    return null;
}

function getModel3DStats() {
    const stats = { terenuri: 0, bazine_copii: 0, transport: 0, total: 0 };
    for (const id in PRODUCT_3D_MODELS) {
        if (id.startsWith('j')) stats.terenuri++;
        else if (id.startsWith('kp') || id.startsWith('kip') || id.startsWith('kc')) stats.bazine_copii++;
        else if (id.startsWith('t')) stats.transport++;
    }
    stats.total = stats.terenuri + stats.bazine_copii + stats.transport;
    return stats;
}

function getAllProducts3D() {
    return Object.keys(PRODUCT_3D_MODELS);
}

function getProductsBySubcategory(subcategory) {
    return Object.keys(PRODUCT_3D_MODELS).filter(productId => {
        const model = PRODUCT_3D_MODELS[productId];
        return model && model.subcategory === subcategory;
    });
}

function get3DModelPath(productId, productTitle) {
    let model = PRODUCT_3D_MODELS[productId];
    
    // Handle pool products - return direct file path
    if (!model && productId && productId.startsWith('pool_')) {
        const modelFile = mapPoolToModelFile(productId, productTitle);
        if (modelFile) {
            const fullPath = getCorrectModelPath(encodeURIComponent('bazine intex - bazine cadru') + '/' + encodeURIComponent(modelFile));
            console.log('[3D] get3DModelPath - pool product found:', {productId, modelFile, fullPath});
            return fullPath;
        }
        console.log('[3D] get3DModelPath - pool product but NO MODEL FILE found for:', productId);
        return null;
    }
    
    if (!model) {
        console.log('[3D] get3DModelPath - productId not found in PRODUCT_3D_MODELS:', productId);
        return null;
    }
    
    let category = '';
    if (productId.startsWith('j')) category = 'Terenuri de Joaca';
    else if (productId.startsWith('kp')) category = 'bazine copii';
    else if (productId.startsWith('kip')) category = 'bazine intex - bazine cadru';  // Easy Set models
    else if (productId.startsWith('kc')) category = 'bazine intex - bazine cadru';
    else if (productId.startsWith('t')) category = 'transport';
    
    const fullPath = getCorrectModelPath(encodeURIComponent(category) + '/' + encodeURIComponent(model.name));
    console.log('[3D] get3DModelPath - direct product found:', {productId, category, name: model.name, fullPath});
    return fullPath;
}

/**
 * Maps pool products directly to 3 available .glb files on server (Easy Set excluded from frame_pools)
 * Pool products reutilize the same model files for different sizes
 * 
 * Files on server (3 total):
 * 1. Bazin Cadru Ultra Frame 488x122cm... (Ultra Frame variants)
 * 2. BAZIN+CADRU+INTEX+ULTRA+XTR+PREMIUM... (Premium & large variants)
 * 3. 26726NP BAZIN CADRU ROTUND... (Prism Frame & small variants)
 */

function mapPoolToModelFile(productId, productTitle) {
    if (!productId || !productId.startsWith('pool_')) return null;
    if (!productTitle) {
        console.log('[3D] mapPoolToModelFile: No title, using fallback Ultra Frame');
        return 'Bazin Cadru Ultra Frame 488x122cm, 549x132cm, Ultra XTR Frame 732x132cm.glb'; 
    }
    
    const title = productTitle.toLowerCase();
    console.log('[3D] mapPoolToModelFile: productId=', productId, 'title=', productTitle);

    // EASY SET products (183x51, 244x61, 305x76) - use Easy Set model
    if (title.includes('easy set')) {
        console.log('[3D] DETECTED: Easy Set product - using Easy Set model');
        return 'Bazin Easy Set 305x76cm - Piscină Mare pentru Familie; Bazin Easy Set 244x61cm - Piscină Familială; Bazin Easy Set 183x51cm - Piscină Compactă pentru Copii.glb';
    }

    // 1. Ultra Frame variants (488, 549, 732 dimensions) - NOT XTR
    if (title.includes('ultra frame') || 
        (title.includes('ultra') && title.includes('frame') && !title.includes('xtr')) ||
        title.includes('488x122') || title.includes('549x132') || 
        (title.includes('732x132') && !title.includes('premium'))) {
        console.log('[3D] DETECTED: Ultra Frame product');
        return 'Bazin Cadru Ultra Frame 488x122cm, 549x132cm, Ultra XTR Frame 732x132cm.glb';
    }

    // 2. Ultra XTR Premium variants (549x274, 732x366, 975x488) + large/premium products
    if (title.includes('ultra xtr premium') || title.includes('premium') ||
        title.includes('549x274') || title.includes('26356') ||
        title.includes('732x366') || title.includes('26364') ||
        title.includes('975x488') || title.includes('26374')) {
        console.log('[3D] DETECTED: Ultra XTR Premium product');
        return 'BAZIN+CADRU+INTEX+ULTRA+XTR+PREMIUM+POOL+LINE,+26364+BAZIN+CADRU+INTEX+ULTRA+XTR+PREMIUM+POOL+LINE+732X366X132CM,+26374+BAZIN+CADRU+INTEX+ULTRA+XTR+PREMIUM+POOL+LINE+975X488X132CM.glb';
    }

    // 3. Prism Frame variants - DEFAULT fallback (covers 305x76, 244x61, 183x51, 366x76, 427x107, 457x122, 26710, 26712, 26720, 26726, etc.)
    // Small pools and Prism Frame models use this instead of Easy Set for frame_pools category
    console.log('[3D] DETECTED: Prism Frame / Default product - using Prism Frame model');
    return '26726NP BAZIN CADRU ROTUND INTE0X PRISM FRAME POOL 4,57X1,2226720 BAZIN CADRU PRISM FRAME 427X107CM; 26712 Bazin cadru Prism Frame 366x76cm, 6503l, filtru-pompă 2006l_h; 26710 Bazin cadru Intex Prism Frame 36.glb';
}

console.log('3D Manager Activ:', getModel3DStats());
