// =========================================
// PERPUS NIZAM - script.js
// Isinya cuma 2 fitur utama:
// 1. Filter pencarian buku
// 2. Tombol pinjam buku
// =========================================

// ambil elemen-elemen yang dibutuhin
const searchInput = document.getElementById("searchInput");
const btnCari = document.getElementById("btnCari");
const bukuCards = document.querySelectorAll(".buku-card");
const notFoundMsg = document.getElementById("notFoundMsg");

// -----------------------------------------
// FITUR 1: FILTER PENCARIAN BUKU
// -----------------------------------------
function filterBuku() {
  // ambil kata kunci, lowercase biar ga case-sensitive
  const keyword = searchInput.value.toLowerCase().trim();
  let adaHasil = false;

  bukuCards.forEach((card) => {
    const judul = card.getAttribute("data-judul");

    if (judul.includes(keyword)) {
      card.style.display = "flex";
      adaHasil = true;
    } else {
      card.style.display = "none";
    }
  });

  // kalau ga ada buku yang cocok, tampilin pesan
  if (!adaHasil) {
    notFoundMsg.style.display = "block";
  } else {
    notFoundMsg.style.display = "none";
  }
}

// jalanin filter pas tombol "Cari" diklik
btnCari.addEventListener("click", filterBuku);

// biar bisa juga langsung ketik terus filter otomatis jalan
searchInput.addEventListener("input", filterBuku);

// enter di keyboard juga bisa trigger cari
searchInput.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    filterBuku();
  }
});

// -----------------------------------------
// FITUR 2: TOMBOL PINJAM BUKU
// -----------------------------------------
const tombolPinjam = document.querySelectorAll(".btn-pinjam");

tombolPinjam.forEach((tombol) => {
  tombol.addEventListener("click", function () {
    // cari card induknya biar tau judul buku apa yang dipinjam
    const card = tombol.closest(".buku-card");
    const judulBuku = card.querySelector(".judul-buku").textContent;
    const statusEl = card.querySelector(".status");

    // kasih tau user pake alert simpel
    alert("Buku \"" + judulBuku + "\" berhasil dipinjam!");

    // ubah tampilan status jadi "Dipinjam"
    statusEl.textContent = "Dipinjam";
    statusEl.classList.remove("status-tersedia");
    statusEl.classList.add("status-dipinjam");

    // tombolnya dimatiin biar ga bisa dipinjam dobel
    tombol.textContent = "Sedang Dipinjam";
    tombol.disabled = true;
  });
});