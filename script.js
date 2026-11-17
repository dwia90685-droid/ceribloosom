
const produkBunga = [
    {
        nama: "Bunga Anyelir",
        harga: 10000,
        gambar: "gambar/bungaanyelir.jfif"
    },
    {
        nama: "Buket Lily",
        harga: 15000,
        gambar: "gambar/bungalily.jfif"
    },
    {
        nama: "Bunga Matahari",
        harga: 12000,
        gambar: "gambar/bungamatahari.jpg"
    },
    {
        nama: "Bunga Mawar",
        harga: 100000,
        gambar: "gambar/bungamawar.webp"
    },
    {
        nama: "Bunga Anggrek",
        harga: 20000,
        gambar: "gambar/bunganggrek.webp"
    },
    {
        nama: "Buket Tulip",
        harga: 150000,
        gambar: "gambar/bungatulip.jfif"
    }
];

let keranjang = [];
let metodeDipilih = "";

// FORMAT RUPIAH
function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}

// TAMPILKAN PRODUK
function tampilkanProduk() {
    const tempat = document.getElementById("daftar-produk");

    tempat.innerHTML = produkBunga.map((produk, index) => `
        <div class="produk-card">
            <img src="${produk.gambar}" alt="${produk.nama}">
            <h3>${produk.nama}</h3>
            <p class="harga">${formatRupiah(produk.harga)}</p>
            <button onclick="tambahKeranjang(${index})">
                + Tambah
            </button>
        </div>
    `).join("");
}

// PINDAH SLIDE
function tampilSlide(nama) {
    document.querySelectorAll(".slide").forEach(slide => {
        slide.classList.remove("aktif");
    });

    document.getElementById(nama).classList.add("aktif");
}

// TAMBAH KERANJANG
function tambahKeranjang(index) {
    const produk = produkBunga[index];
    const ditemukan = keranjang.find(item => item.nama === produk.nama);

    if (ditemukan) {
        ditemukan.jumlah++;
    } else {
        keranjang.push({
            ...produk,
            jumlah: 1
        });
    }

    perbaruiKeranjang();
    alert(produk.nama + " berhasil ditambahkan ke keranjang 🌸");
}

// TOTAL HARGA
function hitungTotal() {
    return keranjang.reduce((total, item) => {
        return total + item.harga * item.jumlah;
    }, 0);
}

// PERBARUI KERANJANG
function perbaruiKeranjang() {
    const tempat = document.getElementById("isi-keranjang");

    if (keranjang.length === 0) {
        tempat.innerHTML = "<p>Keranjang masih kosong 🌷</p>";
    } else {
        tempat.innerHTML = keranjang.map((item, index) => `
            <div class="item-keranjang">
                <div>
                    <b>${item.nama}</b><br>
                    ${item.jumlah} x ${formatRupiah(item.harga)}
                </div>
                <button onclick="hapusKeranjang(${index})">
                    Hapus
                </button>
            </div>
        `).join("");
    }

    document.getElementById("total-keranjang").textContent =
        formatRupiah(hitungTotal());
}

// HAPUS PRODUK
function hapusKeranjang(index) {
    keranjang.splice(index, 1);
    perbaruiKeranjang();
}

// BUKA KERANJANG
function bukaKeranjang() {
    perbaruiKeranjang();
    document.getElementById("popup-keranjang").classList.add("aktif");
}

function tutupKeranjang() {
    document.getElementById("popup-keranjang").classList.remove("aktif");
}

// CHECKOUT
function checkout() {
    if (keranjang.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    tutupKeranjang();
    document.getElementById("popup-pembayaran").classList.add("aktif");
}

// TUTUP PEMBAYARAN
function tutupPembayaran() {
    document.getElementById("popup-pembayaran").classList.remove("aktif");
}

// PILIH METODE
function pilihMetode(metode, tombol) {
    metodeDipilih = metode;

    document.querySelectorAll(".metode").forEach(item => {
        item.classList.remove("terpilih");
    });

    tombol.classList.add("terpilih");

    const detail = document.getElementById("detail-pembayaran");

    const informasi = {
        "QRIS": "QRIS DEMO<br>Ini hanya contoh tampilan pembayaran. Bukan QR asli.",
        "Transfer BCA": "Bank BCA<br>Nomor rekening contoh: 0000000000<br>Atas nama: CeriBlossom (Contoh)",
        "Transfer BRI": "Bank BRI<br>Nomor rekening contoh: 0000000000<br>Atas nama: CeriBlossom (Contoh)",
        "Transfer Mandiri": "Bank Mandiri<br>Nomor rekening contoh: 0000000000<br>Atas nama: CeriBlossom (Contoh)",
        "DANA": "DANA<br>Nomor contoh: 080000000000<br>Atas nama: CeriBlossom (Contoh)",
        "GoPay": "GoPay<br>Nomor contoh: 080000000000<br>Atas nama: CeriBlossom (Contoh)",
        "COD": "Pembayaran dilakukan saat pesanan diterima. (Simulasi)"
    };

    detail.innerHTML = `
        <div class="detail-pembayaran">
            <b>${metode}</b><br>
            ${informasi[metode]}
            <br><br>
            Total Pesanan: <b>${formatRupiah(hitungTotal())}</b>
        </div>
    `;
}

// KONFIRMASI PEMBAYARAN
function konfirmasiPembayaran() {
    const nama = document.getElementById("nama-pembeli").value.trim();
    const alamat = document.getElementById("alamat-pembeli").value.trim();
    const telepon = document.getElementById("telepon-pembeli").value.trim();

    if (!nama || !alamat || !telepon) {
        alert("Lengkapi data pemesanan terlebih dahulu!");
        return;
    }

    if (!metodeDipilih) {
        alert("Silakan pilih metode pembayaran!");
        return;
    }

    const nomor = "CB" + Date.now().toString().slice(-8);

    document.getElementById("pesan-sukses").textContent =
        "Terima kasih " + nama + "! Pesanan kamu berhasil dibuat dengan metode " + metodeDipilih + ".";

    document.getElementById("nomor-pesanan").textContent = nomor;

    tutupPembayaran();

    document.getElementById("popup-sukses").classList.add("aktif");

    keranjang = [];
    metodeDipilih = "";
    perbaruiKeranjang();

    document.getElementById("nama-pembeli").value = "";
    document.getElementById("alamat-pembeli").value = "";
    document.getElementById("telepon-pembeli").value = "";
    document.getElementById("detail-pembayaran").innerHTML = "";

    document.querySelectorAll(".metode").forEach(item => {
        item.classList.remove("terpilih");
    });
}

// SELESAI PESANAN
function selesaiPesanan() {
    document.getElementById("popup-sukses").classList.remove("aktif");
    tampilSlide("beranda");
}

// KONTAK
function bukaKontak() {
    document.getElementById("popup-kontak").classList.add("aktif");
}

function tutupKontak() {
    document.getElementById("popup-kontak").classList.remove("aktif");
}

document.getElementById("form-kontak").addEventListener("submit", function(event) {
    event.preventDefault();

    alert("Terima kasih! Pesan kamu berhasil dikirim (simulasi).");

    this.reset();
    tutupKontak();
});

// TUTUP POPUP KLIK LUAR
document.querySelectorAll(".popup").forEach(popup => {
    popup.addEventListener("click", function(event) {
        if (event.target === popup) {
            popup.classList.remove("aktif");
        }
    });
});

// TOMBOL ESCAPE
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        document.querySelectorAll(".popup").forEach(popup => {
            popup.classList.remove("aktif");
        });
    }
});

// JALANKAN WEBSITE
tampilkanProduk();
perbaruiKeranjang();
