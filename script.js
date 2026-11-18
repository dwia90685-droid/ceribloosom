
// ==================================
// DATA PRODUK CERIBLOSSOM
// ==================================

const produk = [
    {
        id: 1,
        nama: "Buket Mawar Pink",
        harga: 85000,
        kategori: "buket",
        gambar: "gambar/mawar.jpg"
    },
    {
        id: 2,
        nama: "Buket Tulip Cantik",
        harga: 120000,
        kategori: "buket",
        gambar: "gambar/tulip.jpg"
    },
    {
        id: 3,
        nama: "Buket Bunga Campuran",
        harga: 150000,
        kategori: "buket",
        gambar: "gambar/bouquet.jpg"
    },
    {
        id: 4,
        nama: "Bunga Anggrek",
        harga: 95000,
        kategori: "bunga",
        gambar: "gambar/anggrek.jpg"
    },
    {
        id: 5,
        nama: "Bunga Matahari",
        harga: 75000,
        kategori: "bunga",
        gambar: "gambar/matahari.jpg"
    },
    {
        id: 6,
        nama: "Bunga Lily",
        harga: 110000,
        kategori: "bunga",
        gambar: "gambar/lily.jpg"
    }
];

let keranjang = [];

// ==================================
// FORMAT RUPIAH
// ==================================

function rupiah(angka) {
    return "Rp" + angka.toLocaleString("id-ID");
}

// ==================================
// TAMPILKAN PRODUK
// ==================================

function tampilkanProduk(data = produk) {
    const tempat = document.getElementById("daftar-produk");

    tempat.innerHTML = data.map(item => `
        <div class="produk">
            <img
                src="${item.gambar}"
                alt="${item.nama}"
                onerror="this.onerror=null;this.src='https://placehold.co/600x400/fbe4ed/a74373?text=Foto+Bunga';"
            >

            <div class="produk-info">
                <h3>${item.nama}</h3>
                <p>${rupiah(item.harga)}</p>

                <button onclick="tambahKeranjang(${item.id})">
                    🛒 Tambah Keranjang
                </button>
            </div>
        </div>
    `).join("");
}

tampilkanProduk();

// ==================================
// FILTER PRODUK
// ==================================

function filterProduk(kategori, tombol) {
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    tombol.classList.add("active");

    if (kategori === "semua") {
        tampilkanProduk(produk);
    } else {
        const hasil = produk.filter(item => item.kategori === kategori);
        tampilkanProduk(hasil);
    }
}

// ==================================
// TAMBAH KE KERANJANG
// ==================================

function tambahKeranjang(id) {
    const item = produk.find(p => p.id === id);

    const sudahAda = keranjang.find(p => p.id === id);

    if (sudahAda) {
        sudahAda.jumlah++;
    } else {
        keranjang.push({
            ...item,
            jumlah: 1
        });
    }

    perbaruiKeranjang();
    tampilToast(item.nama + " ditambahkan ke keranjang 💗");
}

// ==================================
// PERBARUI KERANJANG
// ==================================

function perbaruiKeranjang() {
    const jumlah = keranjang.reduce(
        (total, item) => total + item.jumlah, 0
    );

    document.getElementById("jumlah-keranjang").textContent = jumlah;

    const tempat = document.getElementById("isi-keranjang");

    if (keranjang.length === 0) {
        tempat.innerHTML = "<p>Keranjang masih kosong 🌷</p>";
    } else {
        tempat.innerHTML = keranjang.map(item => `
            <div class="item-keranjang">
                <div>
                    <strong>${item.nama}</strong>
                    <p>${rupiah(item.harga)} x ${item.jumlah}</p>
                </div>

                <div>
                    <button onclick="ubahJumlah(${item.id}, -1)">−</button>
                    <button onclick="ubahJumlah(${item.id}, 1)">+</button>
                    <button onclick="hapusProduk(${item.id})">Hapus</button>
                </div>
            </div>
        `).join("");
    }

    const total = keranjang.reduce(
        (jumlah, item) => jumlah + item.harga * item.jumlah, 0
    );

    document.getElementById("total-harga").textContent =
        "Total: " + rupiah(total);
}

// ==================================
// UBAH JUMLAH PRODUK
// ==================================

function ubahJumlah(id, perubahan) {
    const item = keranjang.find(p => p.id === id);

    if (!item) return;

    item.jumlah += perubahan;

    if (item.jumlah <= 0) {
        keranjang = keranjang.filter(p => p.id !== id);
    }

    perbaruiKeranjang();
}

// ==================================
// HAPUS PRODUK
// ==================================

function hapusProduk(id) {
    keranjang = keranjang.filter(item => item.id !== id);
    perbaruiKeranjang();
}

// ==================================
// POPUP KERANJANG
// ==================================

function bukaKeranjang() {
    perbaruiKeranjang();
    document.getElementById("modal-keranjang").classList.add("show");
}

function bukaCheckout() {
    if (keranjang.length === 0) {
        tampilToast("Keranjang kamu masih kosong 🌸");
        return;
    }

    tutupPopup("modal-keranjang");
    document.getElementById("modal-checkout").classList.add("show");
}

// ==================================
// TUTUP POPUP
// ==================================

function tutupPopup(id) {
    document.getElementById(id).classList.remove("show");
}

// Tutup popup jika klik area luar
document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.classList.remove("show");
        }
    });
});

// ==================================
// PEMESANAN
// ==================================

document.getElementById("form-pesanan").addEventListener("submit", function(event) {
    event.preventDefault();

    if (keranjang.length === 0) {
        tampilToast("Keranjang masih kosong!");
        tutupPopup("modal-checkout");
        return;
    }

    const nama = document.getElementById("nama").value;
    const telepon = document.getElementById("telepon").value;
    const alamat = document.getElementById("alamat").value;
    const pembayaran = document.getElementById("pembayaran").value;

    const total = keranjang.reduce(
        (jumlah, item) => jumlah + item.harga * item.jumlah, 0
    );

    const daftarPesanan = keranjang.map(item =>
        `${item.nama} (${item.jumlah} x ${rupiah(item.harga)})`
    ).join("\n");

    const pesan =
`Halo CeriBlossom! Saya ingin memesan bunga.

Nama: ${nama}
WhatsApp: ${telepon}
Alamat: ${alamat}

Pesanan:
${daftarPesanan}

Total: ${rupiah(total)}
Pembayaran: ${pembayaran}`;

    // Simulasi pemesanan
    tampilToast("Pesanan berhasil dibuat! 🌷");

    // Membuka WhatsApp jika nomor toko sudah diganti
    const nomorToko = "628xxxxxxxxxx";

    if (!nomorToko.includes("x")) {
        window.open(
            "https://wa.me/" + nomorToko + "?text=" + encodeURIComponent(pesan),
            "_blank"
        );
    } else {
        alert(pesan + "\n\nIni masih simulasi. Ganti nomor WhatsApp toko di script.js untuk mengaktifkan pemesanan WhatsApp.");
    }

    keranjang = [];
    perbaruiKeranjang();
    this.reset();

    tutupPopup("modal-checkout");
});

// ==================================
// NOTIFIKASI
// ==================================

let timerToast;

function tampilToast(pesan) {
    const toast = document.getElementById("toast");

    toast.textContent = pesan;
    toast.classList.add("show");

    clearTimeout(timerToast);

    timerToast = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// ==================================
// ANIMASI PEMBUKA
// ==================================

window.addEventListener("load", function() {
    setTimeout(() => {
        document.getElementById("intro").classList.add("hide");
    }, 2500);
});

// ==================================
// TUTUP POPUP DENGAN ESC
// ==================================

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        document.querySelectorAll(".modal").forEach(modal => {
            modal.classList.remove("show");
        });
    }
});
