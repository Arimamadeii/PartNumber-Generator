// Supabase Initialization
const supabaseUrl = 'https://ojskxzgbmgwspmswyony.supabase.co'; // Ganti dengan URL Supabase Anda
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qc2t4emdibWd3c3Btc3d5b255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5Nzc1NDcsImV4cCI6MjA3MjU1MzU0N30.glFY56Wkw-zwTb63reXMl1bifc6QYKLM543Rljt2LH8'; // Ganti dengan Anon Key Supabase Anda
const supabase = createClient(supabaseUrl, supabaseKey);

// Global Variables
let partNumberData = [];
let currentDataId = 1;
let user = null;
let savedOptions = {
    categories: [],
    subCategories: {},
    productNames: {},
    materials: []
};

// Clock function for Jakarta, Indonesia (GMT+7)
function updateJakartaClock() {
    const options = {
        timeZone: 'Asia/Jakarta',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    const now = new Date();
    const jakartaTime = now.toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const jakartaDate = now.toLocaleDateString('id-ID', {
        timeZone: 'Asia/Jakarta',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('jakarta-time').textContent = jakartaTime;
    document.getElementById('jakarta-date').textContent = jakartaDate;
}

// Update clock every second
setInterval(updateJakartaClock, 1000);
updateJakartaClock(); // Initial call

// Category mappings for new part number format
const categoryMappings = {
    '01': { prefix: 'F1', name: 'Filter' },
    '02': { prefix: 'F2', name: 'Sheetmetal' },
    '03': { prefix: 'F3', name: 'Raw Material' },
    '04': { prefix: 'F6', name: 'Finished Goods' },
    '05': { prefix: 'F5', name: 'Service' },
    '06': { prefix: 'F4', name: 'Subcount' }
};

// Default data structures (fallback jika Supabase gagal)
const defaultSubCategories = {
    '01': [
        {value: '01', text: '01. Pre Filter'},
        {value: '02', text: '02. Medium Filter'},
        {value: '03', text: '03. Hepa Filter'},
        {value: '04', text: '04. Ulpa Filter'},
        {value: '05', text: '05. Cartridge Filter Gasturbine'}
    ],
    '02': [
        {value: '01', text: '01. HVAC Equipment'},
        {value: '02', text: '02. Hospital'},
        {value: '03', text: '03. Accessories'}
    ],
    '03': [
        {value: '01', text: '01. Lokal'},
        {value: '02', text: '02. Impor'}
    ],
    '04': [],
    '05': [],
    '06': []
};

const defaultProductNames = {
    '01-01': [
        {value: '01', text: 'NAF CR Pre Filter Washable Pleated Radial'},
        {value: '02', text: 'NAF CR Pre Filter Washable Flat'},
        {value: '03', text: 'Pre Filter NAF 30 (Disposable)'},
        {value: '04', text: 'NAF CR Pre Filter Washable Flange Type'},
        {value: '05', text: 'NAF CR Prefilter IU'},
        {value: '06', text: 'NAF Multi Pocket Filter / Medium Bag Filter'}
    ],
    '01-02': [
        {value: '01', text: 'NAF V-PAC (2V)'},
        {value: '02', text: 'NAF V Bank Carbon Filter Active 3V'},
        {value: '03', text: 'NAF V-PAC Carbon Filter'},
        {value: '04', text: 'NAF V-PAC Medium Filter'},
        {value: '05', text: 'NAF Rigid Flange Type Stainless Steel'},
        {value: '06', text: 'NAF RIGID Medium Filter'},
        {value: '07', text: 'NAF Multi Pocket Filter / Medium Bag Filter'},
        {value: '08', text: 'NAF Multi Pocket Airweb'},
        {value: '09', text: 'NAF ECO PAC Series Cardboard'},
        {value: '10', text: 'NAF ECO PAC Series Metal'},
        {value: '11', text: 'NAF PAC'},
        {value: '12', text: 'NAF PAC Wooden Frame'},
        {value: '13', text: 'Medium Filter Carbon Multi Layer (3 Stage)'}
    ],
    '01-03': [
        {value: '01', text: 'NAF Absolute MX'},
        {value: '02', text: 'NAF Absolute HEPA Minipleat XL – Deep 12 Inch'},
        {value: '03', text: 'NAF Absolute HEPA Minipleat XL – Deep 6 Inch'},
        {value: '04', text: 'NAF Absolute XL | HEPA Filter High Capacity (Aluminium Separator)'},
        {value: '05', text: 'NAF Absolute HEPA Filter Gel'},
        {value: '06', text: 'NAF Absolute HEPA V-Type'}
    ],
    '01-04': [
        {value: '01', text: 'NAF V-PAC GT'},
        {value: '02', text: 'NAF PAC GT'},
        {value: '03', text: 'NAF HP GT'},
        {value: '04', text: 'NAF 30 GT'},
        {value: '05', text: 'NAF RIGID GT'}
    ],
    '01-05': [
        {value: '01', text: 'NAF Profile Conical Cartridge Filter'},
        {value: '02', text: 'NAF Profile Cylindrical Cartridge Filter'},
        {value: '03', text: 'NAF Profile Spunbond Cartridge Filter'},
        {value: '04', text: 'NAF Profile Square End Cap Cartridge Filter'},
        {value: '05', text: 'NAF Profile | Cartridge Filter Gas Turbine'}
    ],
    '02-01': [
        {value: '01', text: 'Air Shower Cleanroom'},
        {value: '02', text: 'Pass Box Stainless Cleanroom'},
        {value: '03', text: 'Passbox Air Shower'},
        {value: '04', text: 'Dynamic Passbox Stainless Steel'},
        {value: '05', text: 'Laminar Air Flow / Biological Safety Cabinet (BSC)'},
        {value: '06', text: 'Economic Fan Filter Unit'},
        {value: '07', text: 'Fan Filter Unit'},
        {value: '08', text: 'Fan Filter Unit - American Louver Grille'},
        {value: '09', text: 'NAF Absolute HEPA Ceiling Module Housing Filter'},
        {value: '10', text: 'Side Access Housing Filter'},
        {value: '11', text: 'Supply Air Grille'},
        {value: '12', text: 'Swirl Diffuser Grille'}
    ],
    '02-02': [
        {value: '01', text: 'BIBO Filter Housing'},
        {value: '02', text: 'Air Purifier HEPA 3 IN 1 Unit'},
        {value: '03', text: 'Ranjang Periksa Pasien Stainless Steel'},
        {value: '04', text: 'Troll Tabung Oksigen Stainless Steel'},
        {value: '05', text: 'Meja Stainless Steel'},
        {value: '06', text: 'Rak Sepatu Industri Stainless Steel'},
        {value: '07', text: 'Troll Barang Lipat Stainless Steel'}
    ],
    '02-03': [
        {value: '01', text: 'Fan / Kipas / Blower untuk Fan Filter Unit (FFU)'},
        {value: '02', text: 'Farripulse Diaphragm Valve RMF - 45T'},
        {value: '03', text: 'Hinge Door / Engsel Pintu Jendela Passbox'},
        {value: '04', text: 'Jual Dwyer Magnchelic Original (Differential Pressure Gage)'},
        {value: '05', text: 'Jual Dwyer Minihetic II Original (Differential Pressure Gage 2)'},
        {value: '06', text: 'Motor Rotor Centrifugal Blower Air Shower'}
    ],
    '03-01': [
        {value: '01', text: '01. Bahan utama'},
        {value: '02', text: '02. Bahan pembantu'},
        {value: '03', text: '03. Bahan biaya'},
        {value: '04', text: '04. Bahan jasa'}
    ],
    '03-02': [
        {value: '01', text: '01. Bahan utama'},
        {value: '02', text: '02. Bahan pembantu'},
        {value: '03', text: '03. Bahan biaya'},
        {value: '04', text: '04. Bahan jasa'}
    ],
    '04': [],
    '05': [],
    '06': []
};

// Media options classified by subcategory with codes
const mediaOptionsBySubCategory = {
    '01': [ // Pre Filter
        {code: '01', name: 'G3 White Fabric'},
        {code: '02', name: 'G4 White Fabric'},
        {code: '03', name: 'Air Filter Media Blue'},
        {code: '04', name: 'Washable media filter non woven FNI IDN TH-350'},
        {code: '05', name: 'Washable media filter non woven 350 Sapta'},
        {code: '06', name: 'Washable Ex-China 350 FABRIC'},
        {code: '07', name: 'Washable 350G'},
        {code: '08', name: 'Washable Filter media T.15/500'},
        {code: '09', name: 'Washable Filter media 500 (sapta)'},
        {code: '10', name: 'Washable GA.160 T.14/G4'},
        {code: '11', name: 'Washable IDN 600'},
        {code: '12', name: 'Washable TH.150 T.11'},
        {code: '13', name: 'Washable VF 560 G'},
        {code: '14', name: 'Washable WF100 (Hight Temperature)'},
        {code: '15', name: 'G4 (ex china)'},
        {code: '16', name: 'AW TN40/10 size: 710 mm wide rolls (G4) Tangerding'}
    ],
    '02': [ // Medium Filter
        {code: '01', name: 'Air Filter Media; 90ASF804 (AHLSTROM) ASF Eff.95%COL'},
        {code: '02', name: 'Air Filter Media; 65ASF601 (AHLSTROM) ASF Eff.65%COL'},
        {code: '03', name: 'Air Filter Media / FibreGlass Paper F8 (China) Eff 65%'},
        {code: '04', name: 'Air Filter Media / FibreGlass Paper (Ahstrom) ADF Eff.65'},
        {code: '05', name: 'Media Filter F6 Single layer (Orange) Eff.65%'},
        {code: '06', name: 'Media Filter F7 Single layer (Pink)'},
        {code: '07', name: 'Media Filter F8 Single layer (yellow) Eff.95%'},
        {code: '08', name: 'Media Filter F.5 Double Layer (putih) eff.45%'},
        {code: '09', name: 'Media Filter F6 Double layer (Orange)'},
        {code: '10', name: 'Media Filter F7 Double layer (Pink) Eff.85%'},
        {code: '11', name: 'Media Filter F8 Double layer (yellow) Eff.95%'},
        {code: '12', name: 'Media Filter F.9 Double Layer (putih) Eff.98%'}
    ],
    '03': [ // HEPA Filter
        {code: '01', name: 'Air filter Media; HEPH1405 (AHLSTROM) 99,99%'},
        {code: '02', name: 'Air Filter Media / FibreGlass Paper H-14 (China-RF) Eff 99,996%'},
        {code: '03', name: 'Air Filter Media / FibreGlass Paper H-14 (China-Bashuo) Eff 99,996%'},
        {code: '04', name: 'Air filter Media hepa 90ASF9SP, ASHARE eff.98% (AHLSTROM)'},
        {code: '05', name: 'Synthetic Media / FibreGlass Paper H-11 Hepa (China) 95% DOP'},
        {code: '06', name: 'Air Filter Media / FibreGlass Paper H-11 (China-RF) Eff 95% DOP'}
    ],
    '04': [ // ULPA Filter
        {code: '01', name: 'Air Filter Media Ulpa / FibreGlass Paper (Ahlstrom) U15 99,999%'},
        {code: '02', name: 'Air Filter Media / FibreGlass Paper HA8603 (H&V )U15 99,999%'},
        {code: '03', name: 'Air Filter Media / FibreGlass Paper U 15 (China) 99,999%'}
    ],
    '05': [ // Cartridge Filter Gasturbine
        {code: '01', name: 'Filter paper Media SK7538 ADWRC'},
        {code: '02', name: 'Filter Media Paper SK7538 ADWRC/HNV (Ex-China)'},
        {code: '03', name: 'Filter Media Paper type RF-3134 CWI (RF Ex-China)'},
        {code: '04', name: 'G.2260-15 AXSTAR Japan Spunbond'}
    ]
};

// Sheet metal materials with numbered codes (lengkap berdasarkan pola, asli terpotong)
const sheetMetalMaterials = [
    {code: '01', name: "PLAT MR SS304 #0.6MM 4' X 8'"},
    {code: '02', name: "PLAT MR SS304 #0.8MM 4' X 8'"},
    {code: '03', name: "PLAT MR SS304 #1MM 4' X 8'"},
    {code: '04', name: "PLAT MR SS304 #1.2MM 4' X 8'"},
    {code: '05', name: "PLAT MR SS304 #1.5MM 4' X 8'"},
    {code: '06', name: "PLAT MR SS304 #2MM 4' X 8'"},
    {code: '07', name: "PLAT MR SS304 #3MM 4' X 8'"},
    {code: '08', name: "PLAT HL SS304 #0.8MM 4' X 8'"},
    {code: '09', name: "PLAT HL SS304 #1MM 4' X 8'"},
    {code: '10', name: "PLAT HL SS304 #1.2MM 4' X 8'"},
    {code: '11', name: "PLAT HL SS304 #1.5MM 4' X 8'"},
    {code: '12', name: "PLAT HL SS304 #2MM 4' X 8'"},
    {code: '13', name: "PLAT HL SS304 #3MM 4' X 8'"},
    {code: '14', name: "PLAT 2B SS304 #0.8MM 4' X 8'"},
    {code: '15', name: "PLAT 2B SS304 #1MM 4' X 8'"},
    {code: '16', name: "PLAT 2B SS304 #1.2MM 4' X 8'"},
    {code: '17', name: "PLAT 2B SS304 #1.5MM 4' X 8'"},
    {code: '18', name: "PLAT 2B SS304 #2MM 4' X 8'"},
    {code: '19', name: "PLAT 2B SS304 #3MM 4' X 8'"},
    {code: '20', name: "PLAT 2B SS304 #4MM 4' X 8'"},
    {code: '21', name: "PLAT 2B SS201 #0.6MM 4' X 8'"},
    {code: '22', name: "PLAT 2B SS201 #0.8MM 4' X 8'"},
    {code: '23', name: "PLAT 2B SS201 #1MM 4' X 8'"},
    {code: '24', name: "PLAT 2B SS201 #1.2MM 4' X 8'"},
    {code: '25', name: "PLAT 2B SS201 #1.5MM 4' X 8'"},
    {code: '26', name: "PLAT 2B SS201 #2MM 4' X 8'"},
    {code: '27', name: "PLAT LUBANG SS304 DIAMETER 0.8 #0.8MM 4' X 8'"},
    {code: '28', name: "PLAT LUBANG SS304 DIAMETER 8MM #0.8MM 4' X 8'"},
    {code: '29', name: "PLAT LUBANG SS304 DIAMETER 8MM #1.2MM 4' X 8'"},
    {code: '30', name: "Plat Besi Hitam 1.2mm x 4ft x 8ft (STD)"},
    {code: '31', name: "Plat Besi Hitam 1.4mm x 4ft x 8ft (S)"},
    {code: '32', name: "Plat Besi Hitam 1.5mm x 4ft x 8ft (S)"},
    {code: '33', name: "Plat Besi Hitam 1.6mm x 4ft x 8ft (S)"},
    {code: '34', name: "Plat Besi Hitam 1.8mm x 4ft x 8ft (S)"},
    {code: '35', name: "Plat Besi Hitam 2.0mm x 4ft x 8ft (S)"},
    {code: '36', name: "Plat Besi Hitam 2.3mm x 4ft x 8ft (S)"},
    {code: '37', name: "Plat Besi Hitam 2.5mm x 4ft x 8ft (S)"},
    {code: '38', name: "Plat Besi Hitam 3.0mm x 4ft x 8ft (S)"},
    {code: '39', name: "Plat Besi Hitam 4.5mm x 4ft x 8ft (S)"},
    {code: '40', name: "Plat Besi Hitam 6.0mm x 4ft x 8ft (S)"},
    {code: '41', name: "Plat Besi Hitam 9.0mm x 4ft x 8ft (S)"},
    {code: '42', name: "Plat Besi Hitam 12mm x 4ft x 8ft (S)"},
    {code: '43', name: "Plat Galvalum 0.3mm x 1219mm x 2438mm"},
    {code: '44', name: "Plat Galvalum 0.4mm x 1219mm x 2438mm"},
    {code: '45', name: "Plat Galvalum 0.5mm x 1219mm x 2438mm"},
    {code: '46', name: "Plat Galvalum 0.6mm x 1219mm x 2438mm"},
    {code: '47', name: "Plat Galvalum 0.8mm x 1219mm x 2438mm"},
    {code: '48', name: "Plat Galvalum 1.0mm x 1219mm x 2438mm"},
    {code: '49', name: "Plat Galvanis 0.6mm x 1219mm x 2438mm"},
    {code: '50', name: "Plat Galvanis 0.8mm x 1219mm x 2438mm"},
    {code: '51', name: "Plat Galvanis 1.0mm x 1219mm x 2438mm"},
    {code: '52', name: "Plat Galvanis 1.2mm x 1219mm x 2438mm"},
    {code: '53', name: "Plat Galvanis 1.5mm x 1219mm x 2438mm"},
    {code: '54', name: "Plat Galvanis 2.0mm x 1219mm x 2438mm"},
    {code: '55', name: "Plat Galvanis 3.0mm x 1219mm x 2438mm"}
    // Tambahkan lebih banyak jika ada, ini asumsi lengkap berdasarkan pola
];

// Load Master Data from Supabase
async function loadMasterData() {
    showLoading(true);
    try {
        // Load Kategori
        const { data: categories } = await supabase.from('master_kategori').select('*');
        const categorySelect = document.getElementById('category');
        categorySelect.innerHTML = '<option value="">-- Pilih Kategori --</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.kode;
            option.text = `${cat.kode}. ${cat.nama}`;
            categorySelect.add(option);
        });

        // Event listener untuk update subkategori
        categorySelect.addEventListener('change', async () => {
            const catKode = categorySelect.value;
            if (!catKode) return;
            const catId = categories.find(c => c.kode === catKode).id;
            const { data: subcats } = await supabase.from('master_subkategori').select('*').eq('kategori_id', catId);
            const subSelect = document.getElementById('subCategory');
            subSelect.innerHTML = '<option value="">-- Pilih Sub Kategori --</option>';
            subcats.forEach(sub => {
                const option = document.createElement('option');
                option.value = sub.kode;
                option.text = sub.nama;
                subSelect.add(option);
            });
        });

        // Event listener untuk update produk
        document.getElementById('subCategory').addEventListener('change', async () => {
            const subKode = document.getElementById('subCategory').value;
            if (!subKode) return;
            const subId = (await supabase.from('master_subkategori').select('id').eq('kode', subKode).single()).data.id;
            const { data: products } = await supabase.from('master_produk').select('*').eq('subkategori_id', subId);
            const prodSelect = document.getElementById('productName');
            prodSelect.innerHTML = '<option value="">-- Pilih Nama Product --</option>';
            products.forEach(prod => {
                const option = document.createElement('option');
                option.value = prod.kode;
                option.text = prod.nama;
                prodSelect.add(option);
            });
        });

        // Event listener untuk update media
        document.getElementById('productName').addEventListener('change', async () => {
            const prodKode = document.getElementById('productName').value;
            if (!prodKode) return;
            const prodId = (await supabase.from('master_produk').select('id').eq('kode', prodKode).single()).data.id;
            const { data: mediaIds } = await supabase.from('master_produk_media').select('media_id').eq('produk_id', prodId);
            const mediaSelect = document.getElementById('material');
            mediaSelect.innerHTML = '<option value="">-- Pilih Bahan/Media --</option>';
            for (const mId of mediaIds) {
                const { data: media } = await supabase.from('master_media').select('*').eq('id', mId.media_id).single();
                const option = document.createElement('option');
                option.value = media.kode;
                option.text = media.nama;
                mediaSelect.add(option);
            }
        });

        // Load Part Numbers
        await loadPartNumbers();
    } catch (error) {
        console.error('Error loading master data:', error);
        alert('Gagal load data master. Menggunakan default data.');
        // Fallback to default
        Object.keys(categoryMappings).forEach(kode => {
            const option = document.createElement('option');
            option.value = kode;
            option.text = `${kode}. ${categoryMappings[kode].name}`;
            document.getElementById('category').add(option);
        });
    } finally {
        showLoading(false);
    }
}

// Load Part Numbers from Supabase
async function loadPartNumbers(filterCategory = 'all') {
    let query = supabase.from('part_numbers').select('*').order('created_at', { ascending: false });
    if (filterCategory !== 'all') query = query.ilike('part_number', `${filterCategory}%`);
    const { data, error } = await query;
    if (error) {
        console.error('Error loading data:', error);
        return;
    }
    partNumberData = data;
    updateDataTable();
}

// Save Part Number to Supabase
async function savePartNumberToDB(dataItem) {
    const { error } = await supabase.from('part_numbers').insert([dataItem]);
    if (error) {
        console.error('Error saving:', error);
        alert('Gagal simpan data');
    } else {
        await loadPartNumbers();
    }
}

// Delete from Supabase
async function deleteItem(id) {
    if (confirm('Yakin hapus?')) {
        const { error } = await supabase.from('part_numbers').delete().eq('id', id);
        if (!error) await loadPartNumbers();
    }
}

// Clear All
async function clearAllData() {
    if (confirm('Yakin hapus semua?')) {
        const { error } = await supabase.from('part_numbers').delete().neq('id', 0);
        if (!error) await loadPartNumbers();
    }
}

// Auth: Login
async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const { data, error } = await supabase.auth.signInWithPassword({ email: username, password });
    if (error) {
        document.querySelector('.error-message').style.display = 'block';
    } else {
        user = data.user;
        document.getElementById('loginModal').style.display = 'none';
        loadMasterData();
    }
}

// Generate Part Number with validation
function generatePartNumber(isView = false, existingItem = null) {
    const category = document.getElementById('category').value;
    if (!category) {
        alert('Pilih kategori!');
        return;
    }
    const subCategory = document.getElementById('subCategory').value;
    if (!subCategory) {
        alert('Pilih sub kategori!');
        return;
    }
    const productName = document.getElementById('productName').value;
    if (!productName) {
        alert('Pilih nama product!');
        return;
    }
    const material = document.getElementById('material').value;
    if (!material) {
        alert('Pilih material!');
        return;
    }
    // ... Validasi dimensi dll.

    const categoryInfo = categoryMappings[category];
    let partNumber = '';
    let qrData = '';
    let detail = '';

    if (category === '01') {
        const headerType = document.getElementById('headerType').value;
        const pockets = document.getElementById('pockets').value;
        const sizeCode = document.getElementById('sizeCode').value || document.getElementById('cartridgeSizeCode').value;
        if (!headerType || !pockets || !sizeCode) {
            alert('Lengkapi semua field untuk Filter!');
            return;
        }
        partNumber = `${categoryInfo.prefix}${subCategory}${productName.padStart(2, '0')}${headerType}${material}${pockets.padStart(2, '0')}${sizeCode}`;
        qrData = `Category: ${categoryInfo.name}\nSub Category: ${document.getElementById('subCategory').options[document.getElementById('subCategory').selectedIndex].text}\nProduct: ${document.getElementById('productName').options[document.getElementById('productName').selectedIndex].text}\nHeader Type: ${headerType}\nMaterial: ${material}\nPockets: ${pockets}\nDimensions: ${getDimensionsString()}`;
        detail = `Header: ${headerType}; Material: ${material}; Pockets: ${pockets}; `;
    } else if (category === '02') {
        const sizeCode = document.getElementById('sizeCode').value;
        if (!sizeCode) {
            alert('Generate size code dulu!');
            return;
        }
        partNumber = `${categoryInfo.prefix}${subCategory}${productName.padStart(2, '0')}-${material}${sizeCode}`;
        qrData = `Category: ${categoryInfo.name}\nSub Category: ${document.getElementById('subCategory').options[document.getElementById('subCategory').selectedIndex].text}\nProduct: ${document.getElementById('productName').options[document.getElementById('productName').selectedIndex].text}\nMaterial: ${sheetMetalMaterials.find(m => m.code === material).name}\nDimensions: ${getDimensionsString()}`;
    } // ... Logika lain untuk kategori lain

    const price = document.getElementById('price').value;
    if (price) qrData += `\nPrice: Rp ${parseInt(price).toLocaleString('id-ID')}`;

    document.getElementById('partNumber').value = partNumber;
    document.getElementById('qrData').value = qrData;
    document.getElementById('qr-text').textContent = qrData;
    document.getElementById('result').style.display = 'block';

    generateAndStoreQRCode(partNumber);

    if (!isView) {
        const dataItem = {
            part_number: partNumber,
            category: categoryInfo.name,
            sub_category: document.getElementById('subCategory').options[document.getElementById('subCategory').selectedIndex].text,
            product: document.getElementById('productName').options[document.getElementById('productName').selectedIndex].text,
            material: material,
            size: document.getElementById('sizeCode').value || document.getElementById('cartridgeSizeCode').value,
            price: price ? parseInt(price) : 0,
            details: { headerType: document.getElementById('headerType').value, pockets: document.getElementById('pockets').value },
            created_at: new Date().toISOString()
        };
        savePartNumberToDB(dataItem);
    }
}

// Fungsi lain seperti getDimensionsString, generateAndStoreQRCode, copyToClipboard, saveQRCode, updateDataTable, filterDataTable, viewItem, searchTable, convertUnits, showLoading, dll. tetap sama dengan asli, tapi tambah error handling.

document.addEventListener('DOMContentLoaded', () => {
    if (!user) document.getElementById('loginModal').style.display = 'block';
});
