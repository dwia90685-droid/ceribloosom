
let slideAktif = 0;

const slides = document.querySelectorAll(".slide");

function tampilkanSlide(index) {
    slides.forEach(slide => slide.classList.remove("aktif"));

    slideAktif = (index + slides.length) % slides.length;

    slides[slideAktif].classList.add("aktif");

    document.getElementById("nomor").textContent =
        (slideAktif + 1) + " / " + slides.length;
}

function pindahSlide(index) {
    tampilkanSlide(index);
}

function slideBerikutnya() {
    tampilkanSlide(slideAktif + 1);
}

function slideSebelumnya() {
    tampilkanSlide(slideAktif - 1);
}
