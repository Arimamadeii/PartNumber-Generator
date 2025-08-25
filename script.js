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

        // Data structure for saved options
        let savedOptions = {
            categories: [],
            subCategories: {},
            productNames: {},
            materials: []
        };

        // Default data structures
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
                {value: '05', text: 'NAF RIGID GT'},
                {value: '06', text: 'NAF Profile Square End Cap Cartridge Filter'},
                {value: '07', text: 'NAF Profile Cylindrical Cartridge Filter'},
                {value: '08', text: 'NAF Profile Conical Cartridge Filter'},
                {value: '09', text: 'NAF Profile Spunbond Cartridge Filter'}
            ],
            '01-05': [
                {value: '01', text: 'Filter paper Media SK7538 ADWRC'},
                {value: '02', text: 'Filter Media Paper SK7538 ADWRC/HNV (Ex-China)'},
                {value: '03', text: 'Filter Media Paper type RF-3134 CWI (RF Ex-China)'},
                {value: '04', text: 'G.2260-15 AXSTAR Japan Spunbond'}
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
                {code: '03', name: 'Filter Media Paper type. RF-3134 CWI (RF Ex-China)'},
                {code: '04', name: 'G.2260-15 AXSTAR Japan Spunbond'}
            ]
        };

        // Sheet metal materials with numbered codes
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
            {code: '34', name: "Plat Besi Hitam 1.8mm x 4ft x 8ft (STD)"},
            {code: '35', name: "Plat Besi Hitam 2.0mm x 4ft x 8ft (STD)"}
        ];

        // Size code maps
        const sizeCodeMaps = {};
        let sizeCodeCounters = {};
        
        // Data storage
        let partNumberData = [];
        let currentDataId = 1;
        
        // Apps Script URL - Ganti dengan URL Apps Script Anda yang sebenarnya
        const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxjs9DrsKnhq8r9vZRetKRSnwkaYBZZ6icReM4rko5QGRjDx1GyXRpnTcEDUW4XGWrk5g/exec";
        
        // Function to fetch size counter from Sheets
        async function fetchSizeCounter(type) {
            try {
                const response = await fetch(`${APPS_SCRIPT_URL}?action=getCounter&type=${type}`);
                const data = await response.json();
                return data.counter || 1;
            } catch (err) {
                console.error('Error fetching counter:', err);
                return 1;
            }
        }
        
        // Function to update size counter in Sheets
        async function updateSizeCounter(type, newValue) {
            try {
                await fetch(APPS_SCRIPT_URL, {
                    method: 'POST',
                    body: JSON.stringify({ action: 'updateCounter', type, value: newValue })
                });
            } catch (err) {
                console.error('Error updating counter:', err);
            }
        }

        // Show login modal when page loads
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('loginModal').style.display = 'block';
            loadSavedOptions();
            loadPartNumberData();
        });

        // Login validation
        function validateLogin() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorElement = document.getElementById('loginError');
            
            if (username === 'Farrindo' && password === 'Farrindo365') {
                document.getElementById('loginModal').style.display = 'none';
                document.getElementById('mainContent').style.display = 'block';
                return false;
            } else {
                errorElement.style.display = 'block';
                return false;
            }
        }

        // Load saved options from localStorage
        function loadSavedOptions() {
            const savedData = localStorage.getItem('partNumberOptions');
            if (savedData) {
                savedOptions = JSON.parse(savedData);
                
                // Add saved categories to the dropdown
                savedOptions.categories.forEach(cat => {
                    addOptionToSelect('category', cat.value, cat.text);
                });
                
                // Add saved materials to the dropdown
                savedOptions.materials.forEach(mat => {
                    addOptionToSelect('material', mat, mat);
                });
            }
        }

        // Load part number data from localStorage
        function loadPartNumberData() {
            const savedData = localStorage.getItem('partNumberData');
            if (savedData) {
                partNumberData = JSON.parse(savedData);
                if (partNumberData.length > 0) {
                    currentDataId = Math.max(...partNumberData.map(item => item.id)) + 1;
                }
                updateDataTable();
            }
        }

        // Save options to localStorage
        function saveOptionsToStorage() {
            localStorage.setItem('partNumberOptions', JSON.stringify(savedOptions));
        }

        // Save part number data to localStorage
        function savePartNumberDataToStorage() {
            localStorage.setItem('partNumberData', JSON.stringify(partNumberData));
        }

        // Show add option modal
        let currentAddOptionType = '';
        function showAddOptionModal(type) {
            currentAddOptionType = type;
            const modal = document.getElementById('addOptionModal');
            const title = document.getElementById('addOptionTitle');
            const categorySelection = document.getElementById('categorySelection');
            const subCategorySelection = document.getElementById('subCategorySelection');
            const parentCategory = document.getElementById('parentCategory');
            const parentSubCategory = document.getElementById('parentSubCategory');
            const codeField = document.getElementById('newOptionCode');
            const nameField = document.getElementById('newOptionName');
            const codeFieldGroup = document.getElementById('codeFieldGroup');
            
            // Reset fields
            codeField.value = '';
            nameField.value = '';
            
            switch(type) {
                case 'category':
                    title.textContent = 'Add New Category';
                    categorySelection.style.display = 'none';
                    subCategorySelection.style.display = 'none';
                    codeFieldGroup.style.display = 'block';
                    break;
                    
                case 'subCategory':
                    title.textContent = 'Add New Sub Category';
                    categorySelection.style.display = 'block';
                    subCategorySelection.style.display = 'none';
                    codeFieldGroup.style.display = 'block';
                    
                    parentCategory.innerHTML = '<option value="">-- Select Category --</option>';
                    document.querySelectorAll('#category option').forEach(option => {
                        if (option.value) {
                            const newOption = document.createElement('option');
                            newOption.value = option.value;
                            newOption.textContent = option.text;
                            parentCategory.appendChild(newOption);
                        }
                    });
                    break;
                    
                case 'productName':
                    title.textContent = 'Add New Product Name';
                    categorySelection.style.display = 'block';
                    subCategorySelection.style.display = 'block';
                    codeFieldGroup.style.display = 'block';
                    
                    parentCategory.innerHTML = '<option value="">-- Select Category --</option>';
                    document.querySelectorAll('#category option').forEach(option => {
                        if (option.value) {
                            const newOption = document.createElement('option');
                            newOption.value = option.value;
                            newOption.textContent = option.text;
                            parentCategory.appendChild(newOption);
                        }
                    });
                    
                    parentSubCategory.innerHTML = '<option value="">-- Select Sub Category --</option>';
                    break;
                    
                case 'material':
                    title.textContent = 'Add New Material';
                    categorySelection.style.display = 'none';
                    subCategorySelection.style.display = 'none';
                    codeFieldGroup.style.display = 'none';
                    break;
            }
            
            modal.style.display = 'block';
        }

        // Close add option modal
        function closeAddOptionModal() {
            document.getElementById('addOptionModal').style.display = 'none';
        }

        // Update subcategory dropdown when parent category changes in add modal
        document.getElementById('parentCategory').addEventListener('change', function() {
            if (currentAddOptionType === 'productName') {
                const parentSubCategory = document.getElementById('parentSubCategory');
                const category = this.value;
                
                parentSubCategory.innerHTML = '<option value="">-- Select Sub Category --</option>';
                
                if (category) {
                    const defaultSubs = defaultSubCategories[category] || [];
                    const savedSubs = savedOptions.subCategories[category] || [];
                    const allSubs = [...defaultSubs, ...savedSubs];
                    
                    allSubs.forEach(sub => {
                        const option = document.createElement('option');
                        option.value = sub.value;
                        option.textContent = sub.text;
                        parentSubCategory.appendChild(option);
                    });
                }
            }
        });

        // Save new option
        function saveNewOption() {
            const code = document.getElementById('newOptionCode').value;
            const name = document.getElementById('newOptionName').value;
            
            if (!name) {
                alert('Please fill in the name');
                return false;
            }
            
            if (currentAddOptionType !== 'material' && !code) {
                alert('Please fill in the code');
                return false;
            }
            
            switch(currentAddOptionType) {
                case 'category':
                    const newCategory = {value: code, text: code + '. ' + name};
                    savedOptions.categories.push(newCategory);
                    addOptionToSelect('category', newCategory.value, newCategory.text);
                    break;
                    
                case 'subCategory':
                    const parentCategory = document.getElementById('parentCategory').value;
                    if (!parentCategory) {
                        alert('Please select a category');
                        return false;
                    }
                    
                    const newSubCategory = {value: code, text: code + '. ' + name};
                    
                    if (!savedOptions.subCategories[parentCategory]) {
                        savedOptions.subCategories[parentCategory] = [];
                    }
                    
                    savedOptions.subCategories[parentCategory].push(newSubCategory);
                    
                    if (document.getElementById('category').value === parentCategory) {
                        addOptionToSelect('subCategory', newSubCategory.value, newSubCategory.text);
                    }
                    break;
                    
                case 'productName':
                    const parentCategoryPN = document.getElementById('parentCategory').value;
                    const parentSubCategoryPN = document.getElementById('parentSubCategory').value;
                    
                    if (!parentCategoryPN || !parentSubCategoryPN) {
                        alert('Please select both category and subcategory');
                        return false;
                    }
                    
                    const newProductName = {value: code, text: name};
                    
                    const key = parentCategoryPN + '-' + parentSubCategoryPN;
                    if (!savedOptions.productNames[key]) {
                        savedOptions.productNames[key] = [];
                    }
                    
                    savedOptions.productNames[key].push(newProductName);
                    
                    if (document.getElementById('category').value === parentCategoryPN && 
                        document.getElementById('subCategory').value === parentSubCategoryPN) {
                        addOptionToSelect('productName', newProductName.value, newProductName.text);
                    }
                    break;
                    
                case 'material':
                    const newMaterial = name;
                    savedOptions.materials.push(newMaterial);
                    addOptionToSelect('material', newMaterial, newMaterial);
                    break;
            }
            
            saveOptionsToStorage();
            closeAddOptionModal();
            return false;
        }

        // Add option to select dropdown
        function addOptionToSelect(selectId, value, text) {
            const select = document.getElementById(selectId);
            const option = document.createElement('option');
            option.value = value;
            option.textContent = text;
            select.appendChild(option);
            
            if (select.disabled && selectId !== 'category') {
                select.disabled = false;
            }
        }

        // Update sub categories dropdown
        function updateSubCategories() {
            const categorySelect = document.getElementById('category');
            const subCategorySelect = document.getElementById('subCategory');
            const productNameSelect = document.getElementById('productName');
            const productNameGroup = document.getElementById('productNameGroup');
            const productNameLabel = document.getElementById('productNameLabel');
            const materialSelect = document.getElementById('material');
            const materialGroup = document.getElementById('materialGroup');
            const materialLabel = document.getElementById('materialLabel');
            const materialAddBtn = document.getElementById('materialAddBtn');
            const pocketInputGroup = document.getElementById('pocketInputGroup');
            const headerTypeGroup = document.getElementById('headerTypeGroup');
            const regularDimensions = document.getElementById('regularDimensions');
            const dimensionsTitle = document.getElementById('dimensionsTitle');
            const cartridgeDimensions = document.getElementById('cartridgeDimensions');
            
            subCategorySelect.innerHTML = '<option value="">-- Pilih Sub Kategori --</option>';
            productNameSelect.innerHTML = '<option value="">-- Pilih Nama Product --</option>';
            materialSelect.innerHTML = '<option value="">-- Pilih Bahan/Media --</option>';
            pocketInputGroup.style.display = 'none';
            headerTypeGroup.style.display = 'none';
            regularDimensions.style.display = 'block';
            cartridgeDimensions.style.display = 'none';
            
            const selectedCategory = categorySelect.value;
            
            if (selectedCategory) {
                subCategorySelect.disabled = false;
                
                const defaultSubs = defaultSubCategories[selectedCategory] || [];
                const savedSubs = savedOptions.subCategories[selectedCategory] || [];
                const allSubs = [...defaultSubs, ...savedSubs];
                
                allSubs.forEach(sub => {
                    addOptionToSelect('subCategory', sub.value, sub.text);
                });
                
                if (selectedCategory === '03') {
                    productNameLabel.textContent = 'Jenis Bahan Baku';
                    materialLabel.textContent = 'Nama Bahan';
                    document.getElementById('material').outerHTML = '<input type="text" id="material">';
                    materialAddBtn.style.display = 'none';
                    dimensionsTitle.textContent = 'Nomor Order (PO)';
                    document.getElementById('length').outerHTML = '<input type="text" id="length">';
                    document.getElementById('width').style.display = 'none';
                    document.getElementById('height').style.display = 'none';
                    document.querySelector('.generate-size-btn').style.display = 'none';
                    document.getElementById('sizeCode').outerHTML = '<input type="text" id="sizeCode" readonly style="display:none;">';
                } else {
                    productNameLabel.textContent = 'Nama Product';
                    materialLabel.textContent = 'Bahan/Media Utama';
                    document.getElementById('material').outerHTML = '<select id="material" disabled><option value="">-- Pilih Bahan/Media --</option></select>';
                    materialAddBtn.style.display = 'inline-block';
                    dimensionsTitle.textContent = 'Ukuran (mm)';
                    document.getElementById('length').outerHTML = '<input type="number" id="length" min="0">';
                    document.getElementById('width').style.display = 'block';
                    document.getElementById('height').style.display = 'block';
                    document.querySelector('.generate-size-btn').style.display = 'block';
                    document.getElementById('sizeCode').outerHTML = '<input type="text" id="sizeCode" readonly>';
                }
            } else {
                subCategorySelect.disabled = true;
            }
            
            updateProductNames();
        }

        // Update product names dropdown
        function updateProductNames() {
            const categorySelect = document.getElementById('category');
            const subCategorySelect = document.getElementById('subCategory');
            const productNameSelect = document.getElementById('productName');
            const materialSelect = document.getElementById('material');
            const materialAddBtn = document.getElementById('materialAddBtn');
            const pocketInputGroup = document.getElementById('pocketInputGroup');
            const headerTypeGroup = document.getElementById('headerTypeGroup');
            const regularDimensions = document.getElementById('regularDimensions');
            const cartridgeDimensions = document.getElementById('cartridgeDimensions');
            
            productNameSelect.innerHTML = '<option value="">-- Pilih Nama Product --</option>';
            materialSelect.innerHTML = '<option value="">-- Pilih Bahan/Media --</option>';
            pocketInputGroup.style.display = 'none';
            headerTypeGroup.style.display = 'none';
            regularDimensions.style.display = 'block';
            cartridgeDimensions.style.display = 'none';
            
            const selectedCategory = categorySelect.value;
            const selectedSubCategory = subCategorySelect.value;
            
            if (selectedCategory && selectedSubCategory) {
                productNameSelect.disabled = false;
                
                const key = selectedCategory + '-' + selectedSubCategory;
                const defaultProducts = defaultProductNames[key] || [];
                const savedProducts = savedOptions.productNames[key] || [];
                const allProducts = [...defaultProducts, ...savedProducts];
                
                allProducts.forEach(product => {
                    addOptionToSelect('productName', product.value, product.text);
                });
                
                materialAddBtn.disabled = selectedCategory !== '01';
            } else {
                productNameSelect.disabled = true;
                materialSelect.disabled = true;
                materialAddBtn.disabled = true;
            }
        }

        // Update material options dropdown based on selected product
        function updateMaterialOptions() {
            const productNameSelect = document.getElementById('productName');
            const materialSelect = document.getElementById('material');
            const materialAddBtn = document.getElementById('materialAddBtn');
            const pocketInputGroup = document.getElementById('pocketInputGroup');
            const headerTypeGroup = document.getElementById('headerTypeGroup');
            const regularDimensions = document.getElementById('regularDimensions');
            const cartridgeDimensions = document.getElementById('cartridgeDimensions');
            
            materialSelect.innerHTML = '<option value="">-- Pilih Bahan/Media --</option>';
            pocketInputGroup.style.display = 'none';
            headerTypeGroup.style.display = 'none';
            regularDimensions.style.display = 'block';
            cartridgeDimensions.style.display = 'none';
            
            const selectedProduct = productNameSelect.value;
            const selectedCategory = document.getElementById('category').value;
            const selectedSubCategory = document.getElementById('subCategory').value;
            
            if (selectedProduct) {
                materialSelect.disabled = false;
                
                // Check if this is a cartridge filter product
                const cartridgeProducts = ['06', '07', '08', '09'];
                if (selectedCategory === '01' && selectedSubCategory === '05' && cartridgeProducts.includes(selectedProduct)) {
                    regularDimensions.style.display = 'none';
                    cartridgeDimensions.style.display = 'block';
                }
                
                // Check for header type products
                const headerProducts = {
                    '02-06': true, // NAF RIGID Medium Filter
                    '02-11': true, // NAF PAC
                    '03-04': true, // NAF Absolute XL | HEPA Filter High Capacity
                    '03-02': true, // NAF Absolute HEPA Minipleat XL – Deep 12 Inch
                    '03-03': true, // NAF Absolute HEPA Minipleat XL – Deep 6 Inch
                    '04-02': true, // NAF PAC GT
                    '04-05': true  // NAF RIGID GT
                };
                
                const subKey = selectedSubCategory + '-' + selectedProduct;
                if (headerProducts[subKey] && selectedCategory === '01') {
                    headerTypeGroup.style.display = 'block';
                }
                
                // Handle materials
                if (selectedCategory === '02') {
                    sheetMetalMaterials.forEach(material => {
                        addOptionToSelect('material', material.code, material.name);
                    });
                    materialAddBtn.disabled = true;
                } else if (selectedCategory === '01') {
                    const mediaOptions = mediaOptionsBySubCategory[selectedSubCategory] || [];
                    mediaOptions.forEach(material => {
                        addOptionToSelect('material', material.name, material.name);
                    });
                    savedOptions.materials.forEach(material => {
                        addOptionToSelect('material', material, material);
                    });
                    
                    const productText = productNameSelect.options[productNameSelect.selectedIndex].text;
                    if (productText.includes('Multi Pocket Filter')) {
                        pocketInputGroup.style.display = 'block';
                    }
                    
                    materialAddBtn.disabled = false;
                } else if (selectedCategory === '03') {
                    // For Bahan baku, material is text input, already handled in updateSubCategories
                } else {
                    materialAddBtn.disabled = false;
                }
            } else {
                materialSelect.disabled = true;
                materialAddBtn.disabled = true;
            }
        }

        // Generate size code based on dimensions
        async function generateSizeCode() {
            const category = document.getElementById('category').value;
            const regularDimensions = document.getElementById('regularDimensions');
            const cartridgeDimensions = document.getElementById('cartridgeDimensions');
            const sizeCodeInput = document.getElementById('sizeCode');
            const cartridgeSizeCodeInput = document.getElementById('cartridgeSizeCode');
            
            let type, key;
            
            if (category === '03') {
                sizeCodeInput.value = document.getElementById('length').value || '';
                return;
            }
            
            if (cartridgeDimensions.style.display === 'block') {
                const internalTop = document.getElementById('internalTop').value;
                const internalBottom = document.getElementById('internalBottom').value;
                const externalTop = document.getElementById('externalTop').value;
                const externalBottom = document.getElementById('externalBottom').value;
                const cartridgeLength = document.getElementById('cartridgeLength').value;
                
                if (internalTop && internalBottom && externalTop && externalBottom && cartridgeLength) {
                    key = `${internalTop}x${internalBottom}x${externalTop}x${externalBottom}x${cartridgeLength}`;
                    type = 'cartridge';
                } else {
                    cartridgeSizeCodeInput.value = '';
                    return;
                }
            } else {
                const length = document.getElementById('length').value;
                const width = document.getElementById('width').value;
                const height = document.getElementById('height').value;
                
                if (length && width && height) {
                    key = `${length}x${width}x${height}`;
                    type = category === '01' ? 'filter' : category === '02' ? 'sheetmetal' : category;
                } else {
                    sizeCodeInput.value = '';
                    return;
                }
            }
            
            if (!sizeCodeMaps[type]) {
                sizeCodeMaps[type] = {};
            }
            
            if (!sizeCodeMaps[type][key]) {
                sizeCodeCounters[type] = await fetchSizeCounter(type);
                sizeCodeMaps[type][key] = sizeCodeCounters[type]++;
                await updateSizeCounter(type, sizeCodeCounters[type]);
            }
            
            const code = `A${String(sizeCodeMaps[type][key]).padStart(3, '0')}`;
            
            if (cartridgeDimensions.style.display === 'block') {
                cartridgeSizeCodeInput.value = code;
            } else {
                sizeCodeInput.value = code;
            }
        }

        // Generate the part number
        function generatePartNumber(isView = false, existingItem = null) {
            let category, subCategory, productName, material, sizeCode, cartridgeSizeCode, price, pocketCount, headerType;
            
            if (isView && existingItem) {
                // For view, use existing data to regenerate
                category = Object.keys(categoryMappings).find(key => categoryMappings[key].name === existingItem.category);
                subCategory = existingItem.subCategory.split('.')[0].trim();
                productName = existingItem.product ? existingItem.product.split(' ')[0] : '';
                material = existingItem.material;
                sizeCode = existingItem.size;
                price = existingItem.price;
                headerType = existingItem.headerType || ''; // Assume we stored headerType
                // Parse dimensions back if needed, but since we're regenerating QR, we can use existing qrData
            } else {
                category = document.getElementById('category').value;
                subCategory = document.getElementById('subCategory').value;
                productName = document.getElementById('productName').value;
                material = document.getElementById('material').value;
                sizeCode = document.getElementById('sizeCode').value;
                cartridgeSizeCode = document.getElementById('cartridgeSizeCode').value;
                price = document.getElementById('price').value;
                pocketCount = document.getElementById('pocketCount').value;
                headerType = document.getElementById('headerType').value;
            }
            
            if (!category) {
                if (!isView) alert('Please select a category');
                return;
            }
            
            const categoryInfo = categoryMappings[category];
            if (!categoryInfo) {
                if (!isView) alert('Invalid category selected');
                return;
            }
            
            let partNumber = '';
            let qrData = '';
            
            // Build the part number based on category
            if (category === '01') {
                if (!subCategory || !productName || !material || (!sizeCode && !cartridgeSizeCode)) {
                    if (!isView) alert('Please fill in all required fields for Filter category');
                    return;
                }
                
                const sizeCodeToUse = cartridgeSizeCode || sizeCode;
                
                const mediaOptions = mediaOptionsBySubCategory[subCategory] || [];
                const mediaInfo = mediaOptions.find(m => m.name === material);
                const mediaCode = mediaInfo ? mediaInfo.code : '00';
                
                partNumber = `${categoryInfo.prefix}${subCategory}${productName.padStart(2, '0')}-${mediaCode}${sizeCodeToUse}`;
                
                qrData = `Category: ${categoryInfo.name}\n`;
                qrData += `Sub Category: ${isView ? existingItem.subCategory : document.getElementById('subCategory').options[document.getElementById('subCategory').selectedIndex].text}\n`;
                qrData += `Product: ${isView ? existingItem.product : document.getElementById('productName').options[document.getElementById('productName').selectedIndex].text}\n`;
                qrData += `Material: ${material}\n`;
                
                qrData += `Dimensions: ${isView ? existingItem.dimensions : getDimensionsString()}\n`;
                
                const productNameText = isView ? existingItem.product : document.getElementById('productName').options[document.getElementById('productName').selectedIndex].text;
                if (productNameText.includes('Multi Pocket Filter') && pocketCount) {
                    qrData += `Pockets: ${pocketCount}\n`;
                }
                
                if (headerType) {
                    qrData += `Header Type: ${headerType}\n`;
                }
            } else if (category === '02') {
                if (!subCategory || !productName || !material || !sizeCode) {
                    if (!isView) alert('Please fill in all required fields for Sheetmetal category');
                    return;
                }
                
                partNumber = `${categoryInfo.prefix}${subCategory}${productName.padStart(2, '0')}-${material}${sizeCode}`;
                
                qrData = `Category: ${categoryInfo.name}\n`;
                qrData += `Sub Category: ${isView ? existingItem.subCategory : document.getElementById('subCategory').options[document.getElementById('subCategory').selectedIndex].text}\n`;
                qrData += `Product: ${isView ? existingItem.product : document.getElementById('productName').options[document.getElementById('productName').selectedIndex].text}\n`;
                
                const materialInfo = sheetMetalMaterials.find(m => m.code === material);
                qrData += `Material: ${materialInfo ? materialInfo.name : material}\n`;
                
                qrData += `Dimensions: ${isView ? existingItem.dimensions : getDimensionsString()}\n`;
            } else if (category === '03') {
                if (!subCategory || !productName || !material || !sizeCode) {
                    if (!isView) alert('Please fill in all required fields for Bahan baku');
                    return;
                }
                
                partNumber = `${categoryInfo.prefix}${subCategory}${productName.padStart(2, '0')}-${sizeCode}`;
                
                qrData = `Category: ${categoryInfo.name}\n`;
                qrData += `Sub Category: ${isView ? existingItem.subCategory : document.getElementById('subCategory').options[document.getElementById('subCategory').selectedIndex].text}\n`;
                qrData += `Jenis Bahan Baku: ${isView ? existingItem.product : document.getElementById('productName').options[document.getElementById('productName').selectedIndex].text}\n`;
                qrData += `Nama Bahan: ${material}\n`;
                qrData += `Nomor Order (PO): ${sizeCode}\n`;
            } else {
                partNumber = `${categoryInfo.prefix}${subCategory ? subCategory.padStart(2, '0') : '00'}${productName ? productName.padStart(2, '0') : '00'}-${material ? material.padStart(2, '0') : '00'}${sizeCode}`;
                
                qrData = `Category: ${categoryInfo.name}\n`;
                if (subCategory) qrData += `Sub Category: ${isView ? existingItem.subCategory : document.getElementById('subCategory').options[document.getElementById('subCategory').selectedIndex].text}\n`;
                if (productName) qrData += `Product: ${isView ? existingItem.product : document.getElementById('productName').options[document.getElementById('productName').selectedIndex].text}\n`;
                if (material) qrData += `Material: ${material}\n`;
                qrData += `Dimensions: ${isView ? existingItem.dimensions : getDimensionsString()}\n`;
            }
            
            if (price) {
                qrData += `Price: Rp ${parseInt(price).toLocaleString('id-ID')}`;
            }
            
            document.getElementById('partNumber').value = partNumber;
            document.getElementById('qrData').value = qrData;
            document.getElementById('qr-text').textContent = qrData;
            document.getElementById('result').style.display = 'block';
            
            generateAndStoreQRCode(partNumber);
            
            if (!isView) {
                const dataItem = {
                    id: currentDataId++,
                    partNumber: partNumber,
                    category: categoryInfo.name,
                    subCategory: document.getElementById('subCategory').options[document.getElementById('subCategory').selectedIndex].text,
                    product: category === '03' ? document.getElementById('productName').options[document.getElementById('productName').selectedIndex].text : document.getElementById('productName').options[document.getElementById('productName').selectedIndex].text,
                    material: material,
                    size: sizeCode || cartridgeSizeCode,
                    dimensions: getDimensionsString(),
                    price: price ? parseInt(price) : 0,
                    headerType: headerType || '',
                    qrData: qrData,
                    timestamp: new Date().toISOString()
                };
                
                partNumberData.unshift(dataItem);
                savePartNumberDataToStorage();
                updateDataTable();
                
                fetch(APPS_SCRIPT_URL, {
                    method: "POST",
                    body: JSON.stringify(dataItem)
                }).then(res => res.text())
                  .then(msg => console.log("Google Sheets response:", msg))
                  .catch(err => console.error("Error sending to Sheets:", err));
            }
            
            document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
        }

        function getDimensionsString() {
            const category = document.getElementById('category').value;
            if (category === '03') {
                return document.getElementById('length').value;
            }
            
            const cartridgeDimensions = document.getElementById('cartridgeDimensions');
            if (cartridgeDimensions.style.display === 'block') {
                const internalTop = document.getElementById('internalTop').value;
                const internalBottom = document.getElementById('internalBottom').value;
                const externalTop = document.getElementById('externalTop').value;
                const externalBottom = document.getElementById('externalBottom').value;
                const cartridgeLength = document.getElementById('cartridgeLength').value;
                return `IT${internalTop}×IB${internalBottom}×ET${externalTop}×EB${externalBottom}×L${cartridgeLength}mm`;
            } else {
                const length = document.getElementById('length').value;
                const width = document.getElementById('width').value;
                const height = document.getElementById('height').value;
                return `${length}×${width}×${height}mm`;
            }
        }

        function generateAndStoreQRCode(data) {
            const qrCodeElement = document.getElementById('qr-code');
            qrCodeElement.innerHTML = '';
            new QRCode(qrCodeElement, {
                text: data,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }

        // Copy text to clipboard
        function copyToClipboard(elementId) {
            const element = document.getElementById(elementId);
            element.select();
            document.execCommand('copy');
            
            // Show a temporary tooltip
            const originalText = element.nextElementSibling.textContent;
            element.nextElementSibling.textContent = 'Copied!';
            setTimeout(() => {
                element.nextElementSibling.textContent = originalText;
            }, 2000);
        }

        // Save QR code as image
        function saveQRCode(format) {
            const qrCodeElement = document.getElementById('qr-code');
            
            html2canvas(qrCodeElement).then(canvas => {
                const link = document.createElement('a');
                link.download = `QR_${document.getElementById('partNumber').value}.${format}`;
                link.href = canvas.toDataURL(`image/${format}`);
                link.click();
            });
        }

        // Update the data table
        function updateDataTable(filterCategory = 'all') {
            const tableBody = document.getElementById('tableBody');
            
            if (partNumberData.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="9" class="no-data">Belum ada data</td></tr>';
                return;
            }
            
            tableBody.innerHTML = '';
            
            const filteredData = filterCategory === 'all' 
                ? partNumberData 
                : partNumberData.filter(item => item.partNumber.startsWith(filterCategory));
            
            if (filteredData.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="9" class="no-data">Tidak ada data untuk kategori ini</td></tr>';
                return;
            }
            
            filteredData.forEach((item, index) => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.partNumber}</td>
                    <td>${item.category}</td>
                    <td>${item.subCategory}</td>
                    <td>${item.product}</td>
                    <td>${item.material}</td>
                    <td>${item.dimensions}</td>
                    <td>${item.price ? 'Rp ' + item.price.toLocaleString('id-ID') : '-'}</td>
                    <td class="action-buttons">
                        <button class="action-btn view-btn" onclick="viewItem(${item.id})">View</button>
                        <button class="action-btn delete-btn" onclick="deleteItem(${item.id})">Delete</button>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
        }

        // Filter data table by category
        function filterDataTable(category) {
            document.querySelectorAll('.category-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');
            
            updateDataTable(category);
        }

        // View item details
        function viewItem(id) {
            const item = partNumberData.find(item => item.id === id);
            if (!item) return;
            
            generatePartNumber(true, item);
        }

        // Delete item
        function deleteItem(id) {
            if (confirm('Are you sure you want to delete this item?')) {
                partNumberData = partNumberData.filter(item => item.id !== id);
                savePartNumberDataToStorage();
                updateDataTable();
                
                // Optionally send delete to Sheets if implemented in Apps Script
            }
        }

        // Clear all data
        function clearAllData() {
            if (confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
                partNumberData = [];
                currentDataId = 1;
                savePartNumberDataToStorage();
                updateDataTable();
                
                // Optionally clear in Sheets if implemented
            }
        }

        // Export to Excel
        function exportToExcel() {
            if (partNumberData.length === 0) {
                alert('No data to export');
                return;
            }
            
            const data = partNumberData.map(item => ({
                'Part Number': item.partNumber,
                'Kategori': item.category,
                'Sub Kategori': item.subCategory,
                'Produk': item.product,
                'Material': item.material,
                'Ukuran': item.dimensions,
                'Harga': item.price ? 'Rp ' + item.price.toLocaleString('id-ID') : '-',
                'Header Type': item.headerType || '-',
                'Tanggal': new Date(item.timestamp).toLocaleString('id-ID')
            }));
            
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'PartNumbers');
            XLSX.writeFile(wb, `Farrindo_Part_Numbers_${new Date().toISOString().slice(0, 10)}.xlsx`);
        }

        // Search table
        function searchTable() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const rows = document.querySelectorAll('#tableBody tr');
            
            if (!searchTerm) {
                rows.forEach(row => row.style.display = '');
                return;
            }
            
            rows.forEach(row => {
                const rowText = row.textContent.toLowerCase();
                row.style.display = rowText.includes(searchTerm) ? '' : 'none';
            });
        }

        // Unit converter function
        function convertUnits() {
            const value = parseFloat(document.getElementById('convertValue').value);
            const fromUnit = document.getElementById('fromUnit').value;
            
            if (isNaN(value)) {
                document.getElementById('toMm').value = '';
                document.getElementById('toCm').value = '';
                document.getElementById('toInch').value = '';
                return;
            }
            
            let mmValue;
            switch (fromUnit) {
                case 'mm':
                    mmValue = value;
                    break;
                case 'cm':
                    mmValue = value * 10;
                    break;
                case 'inch':
                    mmValue = value * 25.4;
                    break;
            }
            
            document.getElementById('toMm').value = mmValue.toFixed(2) + ' mm';
            document.getElementById('toCm').value = (mmValue / 10).toFixed(2) + ' cm';
            document.getElementById('toInch').value = (mmValue / 25.4).toFixed(2) + ' inch';
        }

const filterProducts = [
    "NAF Profile Conical Cartridge Filter",
    "NAF Profile Cylindrical Cartridge Filter",
    "NAF Profile Spunbond Cartridge Filter",
    "NAF Profile Square End Cap Cartridge Filter",
    "NAF Profile | Cartridge Filter Gas Turbine"
];

let partNumbers = [];

document.getElementById('toggleUnitConverter').addEventListener('click', () => {
    const converter = document.getElementById('unitConverter');
    converter.classList.toggle('active');
});

document.getElementById('category').addEventListener('change', (e) => {
    const subCategory = document.getElementById('subCategory');
    subCategory.innerHTML = '<option value="">-- Pilih Sub Kategori --</option>';
    const productName = document.getElementById('productName');
    productName.innerHTML = '<option value="">-- Pilih Nama Product --</option>';
    document.getElementById('filterSpecific').classList.toggle('hidden', e.target.value !== '01');
    if (e.target.value === '01') {
        filterProducts.forEach(product => {
            const option = document.createElement('option');
            option.value = product;
            option.textContent = product;
            productName.appendChild(option);
        });
    }
});

document.getElementById('addSubCategory').addEventListener('click', () => {
    const newSubCategory = prompt("Enter new Sub Category:");
    if (newSubCategory) {
        const subCategory = document.getElementById('subCategory');
        const option = document.createElement('option');
        option.value = newSubCategory;
        option.textContent = newSubCategory;
        subCategory.appendChild(option);
        subCategory.value = newSubCategory;
    }
});

document.getElementById('addProduct').addEventListener('click', () => {
    const newProduct = prompt("Enter new Product Name:");
    if (newProduct) {
        const productName = document.getElementById('productName');
        const option = document.createElement('option');
        option.value = newProduct;
        option.textContent = newProduct;
        productName.appendChild(option);
        productName.value = newProduct;
    }
});

document.getElementById('addMaterial').addEventListener('click', () => {
    const newMaterial = prompt("Enter new Material:");
    if (newMaterial) {
        const material = document.getElementById('material');
        const option = document.createElement('option');
        option.value = newMaterial;
        option.textContent = newMaterial;
        material.appendChild(option);
        material.value = newMaterial;
    }
});

document.getElementById('generateSizeCode1').addEventListener('click', async () => {
    const topOuter = document.getElementById('topOuter').value;
    const topInner = document.getElementById('topInner').value;
    const height = document.getElementById('height').value;
    const material = document.getElementById('material').value;
    if ((topOuter || topOuter === '-') && (topInner || topInner === '-') && height && material) {
        const size = `${topOuter}x${topInner}x${height}`;
        const sizeCode = await generateUniqueSizeCode(size, material);
        document.getElementById('sizeCode1').value = sizeCode;
    } else {
        alert('Please fill in all required fields (Top Outer, Top Inner, Height, Material). Use "-" for missing diameters.');
    }
});

document.getElementById('generateSizeCode2').addEventListener('click', async () => {
    const intDimTop = document.getElementById('intDimTop').value;
    const intDimBottom = document.getElementById('intDimBottom').value;
    const extDimTop = document.getElementById('extDimTop').value;
    const extDimBottom = document.getElementById('extDimBottom').value;
    const length = document.getElementById('length').value;
    const material = document.getElementById('material').value;
    if (intDimTop && intDimBottom && extDimTop && extDimBottom && length && material) {
        const size = `${intDimTop}x${intDimBottom}x${extDimTop}x${extDimBottom}x${length}`;
        const sizeCode = await generateUniqueSizeCode(size, material);
        document.getElementById('sizeCode2').value = sizeCode;
    } else {
        alert('Please fill in all required fields for Cartridge Dimensions and Material.');
    }
});

document.getElementById('generatePartNumber').addEventListener('click', async () => {
    const category = document.getElementById('category').value;
    const subCategory = document.getElementById('subCategory').value;
    const productName = document.getElementById('productName').value;
    const material = document.getElementById('material').value;
    const sizeCode = document.getElementById('sizeCode1').value || document.getElementById('sizeCode2').value;
    const price = document.getElementById('price').value;
    const expanded = document.getElementById('expanded')?.value || '';
    const gasket = document.getElementById('gasket')?.value || '';
    const ringPlate = document.getElementById('ringPlate')?.value || '';

    if (category && subCategory && productName && material && sizeCode && price) {
        const partNumber = `${category}-${subCategory}-${sizeCode}`;
        document.getElementById('partNumber').value = partNumber;
        document.getElementById('qrCodeData').value = partNumber;
        generateQRCode(partNumber);

        const details = category === '01' ? `${expanded}, ${gasket}, ${ringPlate}` : '';
        await saveToSheet(productName, sizeCode, material, details, partNumber, price);

        partNumbers.push({ partNumber, category, subCategory, productName, material, size: sizeCode, price, details });
        updateTable();
    } else {
        alert('Please fill in all required fields.');
    }
});

document.getElementById('copyPartNumber').addEventListener('click', () => {
    navigator.clipboard.writeText(document.getElementById('partNumber').value);
    alert('Part Number copied to clipboard!');
});

document.getElementById('copyQrCode').addEventListener('click', () => {
    navigator.clipboard.writeText(document.getElementById('qrCodeData').value);
    alert('QR Code Data copied to clipboard!');
});

document.getElementById('saveQrPng').addEventListener('click', () => {
    const canvas = document.getElementById('qrCode').querySelector('canvas');
    if (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'qrcode.png';
        link.click();
    } else {
        alert('Please generate a QR code first.');
    }
});

document.getElementById('saveQrJpeg').addEventListener('click', () => {
    const canvas = document.getElementById('qrCode').querySelector('canvas');
    if (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg');
        link.download = 'qrcode.jpeg';
        link.click();
    } else {
        alert('Please generate a QR code first.');
    }
});

document.getElementById('clearData').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all data?')) {
        partNumbers = [];
        updateTable();
    }
});

document.getElementById('exportExcel').addEventListener('click', () => {
    const worksheet = XLSX.utils.json_to_sheet(partNumbers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Part Numbers');
    XLSX.writeFile(workbook, 'part_numbers.xlsx');
});

document.getElementById('search').addEventListener('input', updateTable);
document.getElementById('filterCategory').addEventListener('change', updateTable);

async function generateUniqueSizeCode(size, material) {
    try {
        const response = await fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
            method: 'POST',
            body: JSON.stringify({ size, material })
        });
        const data = await response.json();
        return data.sizeCode;
    } catch (error) {
        console.error('Error generating size code:', error);
        alert('Failed to generate size code. Please try again.');
        return '';
    }
}

function generateQRCode(data) {
    const qrCodeDiv = document.getElementById('qrCode');
    qrCodeDiv.innerHTML = '';
    QRCode.toCanvas(data, { errorCorrectionLevel: 'H' }, (err, canvas) => {
        if (err) {
            console.error('Error generating QR code:', err);
            alert('Failed to generate QR code.');
            return;
        }
        qrCodeDiv.appendChild(canvas);
    });
}

async function saveToSheet(productName, sizeCode, material, details, partNumber, price) {
    try {
        await fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
            method: 'POST',
            body: JSON.stringify({ productName, sizeCode, material, details, partNumber, price })
        });
    } catch (error) {
        console.error('Error saving to sheet:', error);
        alert('Failed to save data to spreadsheet. Please try again.');
    }
}

function updateTable() {
    const search = document.getElementById('search').value.toLowerCase();
    const filterCategory = document.getElementById('filterCategory').value;
    const tbody = document.getElementById('partNumberTable');
    tbody.innerHTML = '';

    const filtered = partNumbers.filter(item => 
        (!filterCategory || item.category === filterCategory) &&
        (item.partNumber.toLowerCase().includes(search) || 
         item.productName.toLowerCase().includes(search))
    );

    if (filtered.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="9" class="border p-2 text-center">Belum ada data</td>`;
        tbody.appendChild(row);
        return;
    }

    filtered.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="border p-2">${index + 1}</td>
            <td class="border p-2">${item.partNumber}</td>
            <td class="border p-2">${item.category}</td>
            <td class="border p-2">${item.subCategory}</td>
            <td class="border p-2">${item.productName}</td>
            <td class="border p-2">${item.material}</td>
            <td class="border p-2">${item.size}</td>
            <td class="border p-2">${item.price}</td>
            <td class="border p-2">
                <button onclick="viewPartNumber('${item.partNumber}')" class="bg-blue-500 text-white px-2 py-1 rounded">View</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

window.viewPartNumber = (partNumber) => {
    const item = partNumbers.find(p => p.partNumber === partNumber);
    if (item) {
        document.getElementById('partNumber').value = item.partNumber;
        document.getElementById('qrCodeData').value = item.partNumber;
        generateQRCode(item.partNumber);
    }
};

document.getElementById('valueToConvert').addEventListener('input', convertUnits);
document.getElementById('unitSelect').addEventListener('change', convertUnits);

function convertUnits() {
    const value = parseFloat(document.getElementById('valueToConvert').value);
    const unit = document.getElementById('unitSelect').value;
    const results = document.getElementById('conversionResults');
    if (!isNaN(value) && unit) {
        let mm, cm, inch;
        if (unit === 'mm') {
            mm = value;
            cm = value / 10;
            inch = value / 25.4;
        } else if (unit === 'cm') {
            mm = value * 10;
            cm = value;
            inch = value / 2.54;
        } else if (unit === 'inch') {
            mm = value * 25.4;
            cm = value * 2.54;
            inch = value;
        }
        results.innerHTML = `
            <p>${mm.toFixed(2)} mm</p>
            <p>${cm.toFixed(2)} cm</p>
            <p>${inch.toFixed(2)} inch</p>
        `;
    } else {
        results.innerHTML = '';
    }
}