// === Konfigurasi Supabase ===
const supabaseUrl = "https://ojskxzgbmgwspmswyony.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qc2t4emdibWd3c3Btc3d5b255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5Nzc1NDcsImV4cCI6MjA3MjU1MzU0N30.glFY56Wkw-zwTb63reXMl1bifc6QYKLM543Rljt2LH8"; // GANTI DENGAN ANON KEY ANDA!
let supabase;
try {
  supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
  console.log("Supabase client initialized successfully");
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
  alert("Gagal menginisialisasi Supabase. Periksa URL dan anon key.");
}

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

// === Login dengan Supabase Auth ===
async function validateLogin() {
  if (!supabase) {
    console.error("Supabase client not initialized");
    alert("Supabase client belum diinisialisasi. Periksa koneksi.");
    return false;
  }
  console.log("validateLogin dipanggil");
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  console.log("Email yang dimasukkan:", email);
  console.log("Password yang dimasukkan:", password);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Login error:", error);
      document.getElementById("loginError").textContent = "Invalid email or password: " + error.message;
      document.getElementById("loginError").style.display = "block";
      return false;
    }
    console.log("Login berhasil:", data);
    document.getElementById("loginModal").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
    loadData();
    loadMasterData();
  } catch (error) {
    console.error("Unexpected login error:", error);
    document.getElementById("loginError").textContent = "Unexpected error: " + error.message;
    document.getElementById("loginError").style.display = "block";
  }
  return false;
}

// === Sign Up dengan Supabase Auth ===
async function signUp() {
  if (!supabase) {
    console.error("Supabase client not initialized");
    alert("Supabase client belum diinisialisasi. Periksa koneksi.");
    return false;
  }
  const email = document.getElementById("signUpEmail").value.trim();
  const password = document.getElementById("signUpPassword").value.trim();
  console.log("SignUp Email:", email);
  console.log("SignUp Password:", password);

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error("SignUp error:", error);
      document.getElementById("signUpError").textContent = "Sign up failed: " + error.message;
      document.getElementById("signUpError").style.display = "block";
      return false;
    }
    console.log("SignUp berhasil:", data);
    alert("Pendaftaran berhasil! Silakan login.");
    showLogin();
  } catch (error) {
    console.error("Unexpected signup error:", error);
    document.getElementById("signUpError").textContent = "Unexpected error: " + error.message;
    document.getElementById("signUpError").style.display = "block";
  }
  return false;
}

// === Logout ===
async function logout() {
  if (!supabase) {
    console.error("Supabase client not initialized");
    alert("Supabase client belum diinisialisasi. Periksa koneksi.");
    return;
  }
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    document.getElementById("mainContent").style.display = "none";
    document.getElementById("loginModal").style.display = "block";
    document.getElementById("signUpModal").style.display = "none";
    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";
    document.getElementById("loginError").style.display = "none";
  } catch (error) {
    console.error("Logout error:", error);
    alert("Gagal logout: " + error.message);
  }
}

// === Toggle Login/SignUp Modals ===
function showSignUp() {
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("signUpModal").style.display = "block";
  document.getElementById("loginError").style.display = "none";
  document.getElementById("signUpError").style.display = "none";
}

function showLogin() {
  document.getElementById("signUpModal").style.display = "none";
  document.getElementById("loginModal").style.display = "block";
  document.getElementById("loginError").style.display = "none";
  document.getElementById("signUpError").style.display = "none";
}

// === Load Master Data from Supabase ===
async function loadMasterData() {
  if (!supabase) {
    console.error("Supabase client not initialized");
    alert("Supabase client belum diinisialisasi. Periksa koneksi.");
    return;
  }
  try {
    const { data: categories, error: catError } = await supabase.from("master_kategori").select("id, kode, nama, prefix");
    if (catError) throw catError;
    const categorySelect = document.getElementById("category");
    categorySelect.innerHTML = '<option value="">-- Pilih Kategori --</option>';
    categories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat.kode;
      opt.textContent = `${cat.kode}. ${cat.nama}`;
      opt.dataset.prefix = cat.prefix;
      opt.dataset.nama = cat.nama;
      opt.dataset.id = cat.id;
      categorySelect.appendChild(opt);
    });
  } catch (error) {
    console.error("Error loading master data:", error);
    alert("Gagal memuat data master dari Supabase: " + error.message);
  }
}

// === Dropdown Logic ===
async function updateSubCategories() {
  if (!supabase) {
    console.error("Supabase client not initialized");
    alert("Supabase client belum diinisialisasi. Periksa koneksi.");
    return;
  }
  const categorySelect = document.getElementById("category");
  const categoryId = categorySelect.options[categorySelect.selectedIndex]?.dataset.id;
  const subSelect = document.getElementById("subCategory");
  subSelect.innerHTML = '<option value="">-- Pilih Sub Kategori --</option>';
  if (categoryId) {
    try {
      const { data: subs, error } = await supabase
        .from("master_subkategori")
        .select("id, kode, nama")
        .eq("kategori_id", categoryId);
      if (error) throw error;
      subs.forEach(sc => {
        const opt = document.createElement("option");
        opt.value = sc.kode;
        opt.textContent = `${sc.kode}. ${sc.nama}`;
        opt.dataset.nama = sc.nama;
        opt.dataset.id = sc.id;
        subSelect.appendChild(opt);
      });
      subSelect.disabled = false;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  } else {
    subSelect.disabled = true;
  }
}

async function updateProductNames() {
  if (!supabase) {
    console.error("Supabase client not initialized");
    alert("Supabase client belum diinisialisasi. Periksa koneksi.");
    return;
  }
  const subCategorySelect = document.getElementById("subCategory");
  const subCategoryId = subCategorySelect.options[subCategorySelect.selectedIndex]?.dataset.id;
  const prodSelect = document.getElementById("productName");
  prodSelect.innerHTML = '<option value="">-- Pilih Nama Product --</option>';
  if (subCategoryId) {
    try {
      const { data: products, error } = await supabase
        .from("master_produk")
        .select("id, kode, nama")
        .eq("subkategori_id", subCategoryId);
      if (error) throw error;
      products.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.kode;
        opt.textContent = `${p.kode}. ${p.nama}`;
        opt.dataset.nama = p.nama;
        opt.dataset.id = p.id;
        prodSelect.appendChild(opt);
      });
      prodSelect.disabled = false;
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  } else {
    prodSelect.disabled = true;
  }
}

async function updateMaterialOptions() {
  if (!supabase) {
    console.error("Supabase client not initialized");
    alert("Supabase client belum diinisialisasi. Periksa koneksi.");
    return;
  }
  const productSelect = document.getElementById("productName");
  const productId = productSelect.options[productSelect.selectedIndex]?.dataset.id;
  const materialSelect = document.getElementById("material");
  materialSelect.innerHTML = '<option value="">-- Pilih Bahan/Media --</option>';
  if (productId) {
    try {
      const { data: media, error } = await supabase
        .from("master_produk_media")
        .select("master_media:media_id(id, kode, nama)")
        .eq("produk_id", productId);
      if (error) throw error;
      media.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.master_media.kode;
        opt.textContent = `${m.master_media.kode}. ${m.master_media.nama}`;
        opt.dataset.nama = m.master_media.nama;
        opt.dataset.id = m.master_media.id;
        materialSelect.appendChild(opt);
      });
      materialSelect.disabled = media.length === 0;
    } catch (error) {
      console.error("Error fetching materials:", error);
      alert("Gagal memuat media: " + error.message);
    }
  } else {
    materialSelect.disabled = true;
  }
}

// === Generate Size Code ===
function generateSizeCode() {
  const l = document.getElementById("length").value;
  const w = document.getElementById("width").value;
  const h = document.getElementById("height").value;
  if (l && w && h) {
    if (l <= 0 || w <= 0 || h <= 0) {
      alert("Panjang, lebar, dan tinggi harus lebih dari 0!");
      return;
    }
    document.getElementById("sizeCode").value = `${l}x${w}x${h}`;
  } else {
    alert("Lengkapi panjang, lebar, dan tinggi!");
  }
}

// === Fungsi untuk Mendapatkan Unique Size Code per Product ===
async function getUniqueSizeCode(productKode, sizeStr) {
  if (!supabase) {
    console.error("Supabase client not initialized");
    alert("Supabase client belum diinisialisasi. Periksa koneksi.");
    return null;
  }
  try {
    const { data: existing, error: checkError } = await supabase
      .from("product_sizes")
      .select("code")
      .eq("product_kode", productKode)
      .eq("size", sizeStr)
      .single();
    if (checkError && checkError.code !== 'PGRST116') throw checkError;

    if (existing) {
      return existing.code;
    }

    const { data: maxCodeData, error: maxError } = await supabase
      .from("product_sizes")
      .select("code")
      .eq("product_kode", productKode)
      .order("code", { ascending: false })
      .limit(1);
    if (maxError) throw maxError;

    let maxCodeNum = 0;
    if (maxCodeData && maxCodeData.length > 0) {
      const maxCode = maxCodeData[0].code;
      maxCodeNum = parseInt(maxCode.substring(1), 10);
    }

    const newCodeNum = maxCodeNum + 1;
    const newCode = `A${newCodeNum.toString().padStart(3, '0')}`;

    const { error: insertError } = await supabase
      .from("product_sizes")
      .insert([{ product_kode: productKode, size: sizeStr, code: newCode }]);
    if (insertError) throw insertError;

    return newCode;
  } catch (error) {
    console.error("Error handling unique size code:", error);
    alert("Gagal mengelola kode ukuran unik: " + error.message);
    return null;
  }
}

// === Generate Part Number ===
async function generatePartNumber() {
  if (!supabase) {
    console.error("Supabase client not initialized");
    alert("Supabase client belum diinisialisasi. Periksa koneksi.");
    return;
  }
  const categorySelect = document.getElementById("category");
  const subCategorySelect = document.getElementById("subCategory");
  const productSelect = document.getElementById("productName");
  const materialSelect = document.getElementById("material");

  const category = categorySelect.value;
  const subCategory = subCategorySelect.value;
  const product = productSelect.value;
  const material = materialSelect.value;
  const size = document.getElementById("sizeCode").value;
  const price = document.getElementById("price").value;

  if (!category || !subCategory || !product || !material || !size) {
    alert("Lengkapi semua data!");
    return;
  }

  if (!/^\d+(\.\d{3})?$/.test(price)) {
    alert("Harga harus dalam format angka, misal: 123412 atau 123.412");
    return;
  }

  const prefix = categorySelect.options[categorySelect.selectedIndex].dataset.prefix;
  const catNama = categorySelect.options[categorySelect.selectedIndex].dataset.nama;
  const subNama = subCategorySelect.options[subCategorySelect.selectedIndex].dataset.nama;
  const prodNama = productSelect.options[productSelect.selectedIndex].dataset.nama;
  const matNama = materialSelect.options[productSelect.selectedIndex].dataset.nama;

  const sizeCode = await getUniqueSizeCode(product, size);
  if (!sizeCode) return;

  const partNumber = `${prefix}${category}-${subCategory}${product}-${material}-${sizeCode}`;
  document.getElementById("partNumber").value = partNumber;
  document.getElementById("result").style.display = "block";

  const formattedPrice = `Rp ${parseInt(price).toLocaleString('id-ID')}`;
  const qrContent = `Category: ${catNama}\nSub Category: ${subCategory}. ${subNama}\nProduct: ${prodNama}\nMaterial: ${matNama}\nDimensions: ${size}mm\nPrice: ${formattedPrice}`;

  document.getElementById("qr-code").innerHTML = "";
  new QRCode(document.getElementById("qr-code"), {
    text: qrContent,
    width: 200,
    height: 200
  });

  try {
    const { error } = await supabase.from("part_numbers").insert([{
      part_number: partNumber,
      category,
      sub_category: subCategory,
      product,
      material,
      size,
      price: formattedPrice,
      details: { qr_content: qrContent }
    }]);
    if (error) throw error;
    loadData();
  } catch (error) {
    console.error("Insert error:", error);
    alert("Gagal menyimpan ke Supabase: " + error.message);
  }
}

// === Load Data from Supabase ===
async function loadData() {
  if (!supabase) {
    console.error("Supabase client not initialized");
    alert("Supabase client belum diinisialisasi. Periksa koneksi.");
    return;
  }
  try {
    const { data, error } = await supabase.from("part_numbers").select("*").order("id", { ascending: false });
    if (error) throw error;
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
        <td>${new Date(row.created_at).toLocaleString('id-ID')}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Load error:", error);
    alert("Gagal memuat data dari Supabase: " + error.message);
  }
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

// === Event Listeners ===
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("category").addEventListener("change", updateSubCategories);
  document.getElementById("subCategory").addEventListener("change", updateProductNames);
  document.getElementById("productName").addEventListener("change", updateMaterialOptions);
  document.getElementById("generateSizeCode").addEventListener("click", generateSizeCode);
  document.getElementById("generatePartNumber").addEventListener("click", generatePartNumber);
  document.getElementById("copyBtn").addEventListener("click", () => copyToClipboard("partNumber"));
  document.getElementById("savePng").addEventListener("click", () => saveQRCode("png"));
  document.getElementById("saveJpeg").addEventListener("click", () => saveQRCode("jpeg"));
});
