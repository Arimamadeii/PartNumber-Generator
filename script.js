// Import Supabase client (pastikan instal @supabase/supabase-js)
import { createClient } from '@supabase/supabase-js';

// === Konfigurasi Supabase ===
const supabaseUrl = "https://ojskxzgbmgwspmswyony.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qc2t4emdibWd3c3Btc3d5b255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5OTk5OTksImV4cCI6MjAwMDAwMDAwMH0.ABCDEF123456"; // GANTI DENGAN ANON KEY LENGKAP ANDA!
const supabase = createClient(supabaseUrl, supabaseKey);

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
    loadData(); // Load data setelah login
    loadMasterData(); // Load data master dari Supabase
  } else {
    document.getElementById("loginError").style.display = "block";
  }
  return false;
}

// === Load Master Data from Supabase ===
async function loadMasterData() {
  try {
    // Load Kategori
    const { data: categories, error: catError } = await supabase.from("master_kategori").select("kode, nama, prefix");
    if (catError) throw catError;
    const categorySelect = document.getElementById("category");
    categorySelect.innerHTML = '<option value="">-- Pilih Kategori --</option>';
    categories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat.kode;
      opt.textContent = `${cat.kode}. ${cat.nama}`;
      opt.dataset.prefix = cat.prefix;
      opt.dataset.nama = cat.nama;
      categorySelect.appendChild(opt);
    });
  } catch (error) {
    console.error("Error loading master data:", error);
    alert("Gagal memuat data master dari Supabase. Periksa koneksi atau table.");
  }
}

// === Dropdown Logic (Update untuk fetch dari Supabase) ===
async function updateSubCategories() {
  const category = document.getElementById("category").value;
  const subSelect = document.getElementById("subCategory");
  subSelect.innerHTML = '<option value="">-- Pilih Sub Kategori --</option>';
  if (category) {
    try {
      const { data: subs, error } = await supabase
        .from("master_subkategori")
        .select("kode, nama")
        .eq("kategori_id", category); // Asumsi kategori_id adalah foreign key (sesuaikan dengan skema Anda)
      if (error) throw error;
      subs.forEach(sc => {
        const opt = document.createElement("option");
        opt.value = sc.kode;
        opt.textContent = `${sc.kode}. ${sc.nama}`;
        opt.dataset.nama = sc.nama;
        subSelect.appendChild(opt);
      });
      subSelect.disabled = false;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  }
}

async function updateProductNames() {
  const subCategory = document.getElementById("subCategory").value;
  const prodSelect = document.getElementById("productName");
  prodSelect.innerHTML = '<option value="">-- Pilih Nama Product --</option>';
  if (subCategory) {
    try {
      const { data: products, error } = await supabase
        .from("master_produk")
        .select("kode, nama")
        .eq("subkategori_id", subCategory); // Asumsi subkategori_id foreign key
      if (error) throw error;
      products.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.kode;
        opt.textContent = `${p.kode}. ${p.nama}`;
        opt.dataset.nama = p.nama;
        prodSelect.appendChild(opt);
      });
      prodSelect.disabled = false;
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
}

async function updateMaterialOptions() {
  const subCategory = document.getElementById("subCategory").value;
  const materialSelect = document.getElementById("material");
  materialSelect.innerHTML = '<option value="">-- Pilih Bahan/Media --</option>';
  if (subCategory) {
    try {
      // Asumsi ada table master_produk_media untuk mapping, atau langsung dari master_media
      // Di sini kita fetch semua media, tapi bisa filter berdasarkan sub/produk jika ada mapping
      const { data: media, error } = await supabase.from("master_media").select("kode, nama");
      if (error) throw error;
      media.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.kode;
        opt.textContent = `${m.kode}. ${m.nama}`;
        opt.dataset.nama = m.nama;
        materialSelect.appendChild(opt);
      });
      materialSelect.disabled = false;
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  }
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

// === Fungsi untuk Mendapatkan Unique Size Code per Product ===
async function getUniqueSizeCode(productKode, sizeStr) {
  try {
    // Check jika size sudah ada untuk product ini
    const { data: existing, error: checkError } = await supabase
      .from("product_sizes") // Asumsi table baru: product_sizes
      .select("code")
      .eq("product_kode", productKode)
      .eq("size", sizeStr)
      .single();
    if (checkError && checkError.code !== 'PGRST116') throw checkError; // Ignore no rows error

    if (existing) {
      return existing.code;
    }

    // Dapatkan max code untuk product ini
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
      maxCodeNum = parseInt(maxCode.substring(1), 10); // Ambil angka setelah 'A'
    }

    const newCodeNum = maxCodeNum + 1;
    const newCode = `A${newCodeNum.toString().padStart(3, '0')}`; // A001, A002, dll.

    // Insert baru
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
  const categorySelect = document.getElementById("category");
  const subCategorySelect = document.getElementById("subCategory");
  const productSelect = document.getElementById("productName");
  const materialSelect = document.getElementById("material");

  const category = categorySelect.value; // kode: '01'
  const subCategory = subCategorySelect.value; // '01'
  const product = productSelect.value; // '01'
  const material = materialSelect.value; // '01'
  const size = document.getElementById("sizeCode").value; // '123x123x123'
  const price = document.getElementById("price").value;

  if (!category || !subCategory || !product || !material || !size) {
    alert("Lengkapi semua data!");
    return;
  }

  // Ambil prefix dan nama dari selected option
  const prefix = categorySelect.options[categorySelect.selectedIndex].dataset.prefix; // 'F1'
  const catNama = categorySelect.options[categorySelect.selectedIndex].dataset.nama; // 'Filter'
  const subNama = subCategorySelect.options[subCategorySelect.selectedIndex].dataset.nama; // 'Pre Filter'
  const prodNama = productSelect.options[productSelect.selectedIndex].dataset.nama; // 'NAF CR Pre Filter Washable Pleated Radial'
  const matNama = materialSelect.options[materialSelect.selectedIndex].dataset.nama; // 'G3 White Fabric'

  // Dapatkan unique size code
  const sizeCode = await getUniqueSizeCode(product, size);
  if (!sizeCode) return;

  // Generate part number: F101-0101-A001
  const partNumber = `${prefix}${category}-${subCategory}${product}-${material}-${sizeCode}`;

  document.getElementById("partNumber").value = partNumber;
  document.getElementById("result").style.display = "block";

  // QR Code content
  const qrContent = `Category: ${catNama}Sub Category: ${subCategory}. ${subNama}Product: ${prodNama}Material: ${matNama}Dimensions: ${size}mmPrice: Rp ${price}`;

  document.getElementById("qr-code").innerHTML = "";
  new QRCode(document.getElementById("qr-code"), qrContent);

  // Simpan ke Supabase (part_numbers)
  try {
    const { error } = await supabase.from("part_numbers").insert([{
      part_number: partNumber,
      category,
      sub_category: subCategory,
      product,
      material,
      size,
      price,
      details: { qr_content: qrContent } // Simpan QR content jika perlu
    }]);
    if (error) throw error;
    loadData(); // Refresh table
  } catch (error) {
    console.error("Insert error:", error);
    alert("Gagal menyimpan ke Supabase: " + error.message);
  }
}

// === Load Data from Supabase ===
async function loadData() {
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
        <td>${new Date(row.created_at).toLocaleString()}</td>
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
