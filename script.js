
const products = [
    {
        id: 1,
        name: "Pink Rose Bouquet",
        description: "Buket mawar pink yang romantis",
        price: 150000,
        image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=500"
    },
    {
        id: 2,
        name: "White Elegance",
        description: "Bunga putih yang elegan",
        price: 175000,
        image: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=500"
    },
    {
        id: 3,
        name: "Sunflower Happiness",
        description: "Bunga matahari penuh keceriaan",
        price: 125000,
        image: "https://images.unsplash.com/photo-1597848212624-e6c7a8d4e6e2?w=500"
    },
    {
        id: 4,
        name: "Purple Dream",
        description: "Rangkaian bunga bernuansa ungu",
        price: 200000,
        image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=500"
    }
];

let cart = [];
let currentSlide = 0;

function rupiah(number) {
    return "Rp" + number.toLocaleString("id-ID");
}

// MENAMPILKAN PRODUK
function renderProducts() {
    const container = document.getElementById("product-list");

    container.innerHTML = products.map((product, index) => `
        <div class="product-card" style="animation-delay:${index * 0.12}s">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-bottom">
                <span class="product-price">${rupiah(product.price)}</span>
                <button class="add-btn" onclick="addToCart(${product.id})">
                    + Tambah
                </button>
            </div>
        </div>
    `).join("");
}

// NAVIGASI SLIDE
function showSlide(index) {
    const slides = document.querySelectorAll(".slide");
    const navLinks = document.querySelectorAll(".nav-link");
    const dots = document.querySelectorAll(".dot");

    if (index < 0 || index >= slides.length) return;

    currentSlide = index;

    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
    });

    navLinks.forEach((link, i) => {
        link.classList.toggle("active", i === index);
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
    });
}

function nextSlide() {
    showSlide((currentSlide + 1) % 4);
}

function previousSlide() {
    showSlide((currentSlide - 1 + 4) % 4);
}

// NAVIGASI MENU
document.querySelectorAll(".nav-link").forEach(button => {
    button.addEventListener("click", () => {
        showSlide(Number(button.dataset.slide));
    });
});

// TAMBAH KERANJANG
function addToCart(id) {
    const product = products.find(item => item.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();

    alert(product.name + " berhasil ditambahkan ke keranjang! 🌸");
}

// UPDATE KERANJANG
function updateCart() {
    const count = cart.reduce(
        (total, item) => total + item.quantity, 0
    );

    document.getElementById("cart-count").textContent = count;

    const container = document.getElementById("cart-items");

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div style="font-size:45px">🛍️</div>
                <p>Keranjang belanjamu masih kosong.</p>
                <p>Yuk, pilih bunga favoritmu!</p>
            </div>
        `;
    } else {
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <strong>${item.name}</strong>
                    <small>${rupiah(item.price)}</small>
                </div>
                <div class="quantity-controls">
                    <button onclick="changeQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `).join("");
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    document.getElementById("cart-total").textContent = rupiah(total);
}

// UBAH JUMLAH PRODUK
function changeQuantity(id, amount) {
    const item = cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    updateCart();
}

// POPUP
function openCart() {
    updateCart();
    document.getElementById("cart-modal").classList.add("show");
}

function closeModal(id) {
    document.getElementById(id).classList.remove("show");
}

// CHECKOUT
function checkout() {
    if (cart.length === 0) {
        alert("Keranjang masih kosong. Silakan pilih bunga terlebih dahulu! 🌷");
        return;
    }

    closeModal("cart-modal");
    document.getElementById("order-modal").classList.add("show");
}

// PROSES PEMESANAN SIMULASI
document.getElementById("order-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const address = document.getElementById("customer-address").value.trim();
    const payment = document.getElementById("payment-method").value;

    if (!name || !phone || !address || !payment) {
        alert("Mohon lengkapi semua formulir!");
        return;
    }

    if (!/^[0-9+\-\s]{9,16}$/.test(phone)) {
        alert("Masukkan nomor WhatsApp yang valid!");
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const orderDetails = cart.map(item =>
        `${item.name} (${item.quantity} buah)`
    ).join(", ");

    const message = `
        Nama: ${name}
        Nomor: ${phone}
        Alamat: ${address}
        Produk: ${orderDetails}
        Total: ${rupiah(total)}
        Pembayaran: ${payment}
    `;

    console.log("DATA PESANAN SIMULASI:", message);

    document.getElementById("success-message").textContent =
        `Terima kasih ${name}! Pesananmu berhasil dicatat dalam simulasi. Total belanja ${rupiah(total)} dengan metode ${payment}.`;

    closeModal("order-modal");
    document.getElementById("success-modal").classList.add("show");

    cart = [];
    updateCart();

    document.getElementById("order-form").reset();
});

// SELESAI PEMESANAN
function finishOrder() {
    closeModal("success-modal");
    showSlide(0);
}

// TUTUP POPUP JIKA KLIK DI LUAR
document.querySelectorAll(".overlay").forEach(overlay => {
    overlay.addEventListener("click", function(event) {
        if (event.target === this) {
            this.classList.remove("show");
        }
    });
});

// TUTUP POPUP DENGAN TOMBOL ESC
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        document.querySelectorAll(".overlay").forEach(modal => {
            modal.classList.remove("show");
        });
    }

    if (event.key === "ArrowRight") nextSlide();
    if (event.key === "ArrowLeft") previousSlide();
});

// SWIPE SLIDE UNTUK HP
let touchStartX = 0;

document.getElementById("slides").addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

document.getElementById("slides").addEventListener("touchend", event => {
    const touchEndX = event.changedTouches[0].screenX;
    const difference = touchEndX - touchStartX;

    if (Math.abs(difference) > 70) {
        if (difference < 0) nextSlide();
        else previousSlide();
    }
}, { passive: true });

// JALANKAN WEBSITE
renderProducts();
updateCart();

window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("loader").classList.add("hide");
    }, 1000);
});
