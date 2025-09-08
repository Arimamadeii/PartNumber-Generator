// === Konfigurasi Supabase ===
const { createClient } = supabase;
const supabaseUrl = "https://ojskxzgbmgwspmswyony.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // pakai anon key
const db = createClient(supabaseUrl, supabaseKey);

// === Default Data Structures ===
const defaultSubCategories = {
  '01': [
    { value: '01', text: '01. Pre Filter' },
    { value: '02', text: '02. Medium Filter' },
    { value: '03', text: '03. Hepa Filter' },
    { value: '04', text: '04. Ulpa Filter' },
    { value: '05', text: '05. Cartridge Filter Gasturbine' }
  ],
  '02': [
    { value: '01', text: '01. HVAC Equipment' },
    { value: '02', text: '02. Hospital' },
    { value: '03', text: '03. Accessories' }
  ],
  '03': [
    { value: '01', text: '01. Lokal' },
    { value: '02', text: '02. Impor' }
  ],
  '04': [], '05': [], '06': []
};

const defaultProductNames = {
  '01-01': [
    { value: '01', text: 'NAF CR Pre Filter Washable Pleated Radial' },
    { value: '02', text: 'NAF CR Pre Filter Washable Flat' },
    { value: '03', text: 'Pre Filter NAF 30 (Disposable)' },
    { value: '04', text: 'NAF CR Pre Filter Washable Flange Type' },
    { value: '05', text: 'NAF CR Prefilter IU' },
    { value: '06', text: 'NAF Multi Pocket Filter / Medium Bag Filter' }
  ],
  '01-02': [
    { value: '01', text: 'NAF V-PAC (2V)' },
    { value: '02', text: 'NAF V Bank Carbon Filter Active 3V' },
    { value: '03', text: 'NAF V-PAC Carbon Filter' },
    { value: '04', text: 'NAF V-PAC Medium Filter' },
    { value: '05', text: 'NAF Rigid Flange Type Stainless Steel' },
    { value: '06', text: 'NAF RIGID Medium Filter' },
    { value: '07', text: 'NAF Multi Pocket Filter / Medium Bag Filter' },
    { value: '08', text: 'NAF Multi Pocket Airweb' },
    { value: '09', text: 'NAF ECO PAC Series Cardboard' },
    { value: '10', text: 'NAF ECO PAC Series Metal' },
    { value: '11', text: 'NAF PAC' },
    { value: '12', text: 'NAF PAC Wooden Frame' },
    { value: '13', text: 'Medium Filter Carbon Multi Layer (3 Stage)' }
  ],
  // ... (lanjutkan semua data product sesuai daftar panjang Anda)
};

const mediaOptionsBySubCategory = {
  '01': [
    { code: '01', name: 'G3 White Fabric' },
    { code: '02', name: 'G4 White Fabric' },
    { code: '03', name: 'Air Filter Media Blue' },
    // ... dst.
  ],
  '02': [
    { code: '01', name: 'Air Filter Media; 90ASF804 (AHLSTROM)' },
    { code: '02', name: 'Air Filter Media; 65ASF601 (AHLSTROM)' },
    // ... dst.
  ]
  // tambahkan sub kategori lain sesuai list panjang Anda
};

const sheetMetalMaterials = [
  { code: '01', name: "PLAT MR SS304 #0.6MM 4' X 8'" },
  { code: '02', name: "PLAT MR SS304 #0.8MM 4' X 8'" },
  { code: '03', name: "PLAT MR SS304 #1MM 4' X 8'" },
  // ... dst. sesuai list Anda
];

// === Clock ===
function updateJakartaClock() {
  const now = new Date();
  document.getElementById("jakarta-time").textContent =
    now.toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta" });
  document.getElementById("jakarta-date").textContent =
    now.toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta" });
}
setInterval(updateJakartaClock, 1000);
updateJakartaClock();

// === Login ===
function validateLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (username === "Farrindo" && password === "Farrindo365") {
    document.getElementById("loginModal").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
    loadData();
  } else {
    document.getElementById("loginError").style.display = "block";
  }
  return false;
}

// === Dropdown Logic ===
function updateSubCategories() {
  const category = document.getElementById("category").value;
  const subSelect = document.getElementById("subCategory");
  subSelect.innerHTML = '<option value="">-- Pilih Sub Kategori --</option>';
  if (defaultSubCategories[category]) {
    defaultSubCategories[category].forEach(sc => {
      const opt = document.createElement("option");
      opt.value = sc.value;
      opt.textContent = sc.text;
      subSelect.appendChild(opt);
    });
    subSelect.disabled = false;
  }
}

function updateProductNames() {
  const category = document.getElementById("category").value;
  const subCategory = document.getElementById("subCategory").value;
  const prodSelect = document.getElementById("productName");
  prodSelect.innerHTML = '<option value="">-- Pilih Nama Product --</option>';
  if (defaultProductNames[`${category}-${subCategory}`]) {
    defaultProductNames[`${category}-${subCategory}`].forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.value;
      opt.textContent = p.text;
      prodSelect.appendChild(opt);
    });
    prodSelect.disabled = false;
  }
}

function updateMaterialOptions() {
  const subCategory = document.getElementById("subCategory").value;
  const materialSelect = document.getElementById("material");
  materialSelect.innerHTML = '<option value="">-- Pilih Bahan/Media --</option>';
  if (mediaOptionsBySubCategory[subCategory]) {
    mediaOptionsBySubCategory[subCategory].forEach(m => {
      const opt = document.createElement("option");
      opt.value = m.code;
      opt.textContent = m.name;
      materialSelect.appendChild(opt);
    });
  } else if (subCategory === '01' || subCategory === '02') {
    sheetMetalMaterials.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m.code;
      opt.textContent = m.name;
      materialSelect.appendChild(opt);
    });
  }
  materialSelect.disabled = false;
}

// === Generate Size Code ===
function generateSizeCode() {
  const l = document.getElementById("length").value;
  const w = document.getElementById("width").value;
  const h = document.getElementById("height").value;
  if (l && w && h) {
    document.getElementById("sizeCode").value = `${l}x${w}x${h}`;
  }
}

// === Generate Part Number ===
async function generatePartNumber() {
  const category = document.getElementById("category").value;
  const subCategory = document.getElementById("subCategory").value;
  const product = document.getElementById("productName").value;
  const material = document.getElementById("material").value;
  const size = document.getElementById("sizeCode").value;
  const price = document.getElementById("price").value;

  if (!category || !subCategory || !product || !material || !size) {
    alert("Lengkapi semua data!");
    return;
  }

  const partNumber = `${category}-${subCategory}-${product}-${material}-${size}`;
  document.getElementById("partNumber").value = partNumber;
  document.getElementById("result").style.display = "block";

  // QR Code
  document.getElementById("qr-code").innerHTML = "";
  new QRCode(document.getElementById("qr-code"), partNumber);

  // Simpan ke Supabase
  const { error } = await db.from("part_numbers").insert([{
    part_number: partNumber,
    category,
    sub_category: subCategory,
    product,
    material,
    size,
    price,
    details: {}
  }]);
  if (error) console.error("Insert error:", error);
  else loadData();
}

// === Load Data from Supabase ===
async function loadData() {
  const { data, error } = await db.from("part_numbers").select("*").order("id", { ascending: false });
  if (error) return console.error("Load error:", error);
  const tbody = document.getElementById("dataBody");
  tbody.innerHTML = "";
  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.id}</td>
      <td>${row.part_number}</td>
      <td>${row.category}</td>
      <td>${row.sub_category}</td>
      <td>${row.product}</td>
      <td>${row.material}</td>
      <td>${row.size}</td>
      <td>${row.price || ""}</td>
      <td>${new Date(row.created_at).toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
  });
}

// === Copy & Save QR ===
function copyToClipboard(id) {
  const copyText = document.getElementById(id);
  copyText.select();
  document.execCommand("copy");
  alert("Copied: " + copyText.value);
}
function saveQRCode(type) {
  html2canvas(document.getElementById("qr-code")).then(canvas => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL(`image/${type}`);
    link.download = `qrcode.${type}`;
    link.click();
  });
}
