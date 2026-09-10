// Master Data Buku
const bukuList = [
  {
    id: 1,
    judul: "Laskar Pelangi",
    penulis: "Andrea Hirata",
    deskripsi: "Perjuangan sepuluh anak di Belitung yang berusaha mempertahankan sekolah Muhammadiyah di tengah keterbatasan fasilitas.",
    cover: "c-1"
  },
  {
    id: 2,
    judul: "Bumi Manusia",
    penulis: "Pramoedya Ananta Toer",
    deskripsi: "Kisah Minke, seorang pemuda pribumi terpelajar di era kolonial yang memperjuangkan hak dan cintanya.",
    cover: "c-2"
  },
  {
    id: 3,
    judul: "Filosofi Teras",
    penulis: "Henry Manampiring",
    deskripsi: "Penerapan filsafat stoisisme kuno untuk mengendalikan emosi negatif dan mengelola kecemasan di kehidupan modern.",
    cover: "c-3"
  },
  {
    id: 4,
    judul: "Negeri 5 Menara",
    penulis: "Ahmad Fuadi",
    deskripsi: "Petualangan 6 santri di Pondok Madani yang memegang prinsip 'Man Jadda Wajada' dalam meraih impian.",
    cover: "c-4"
  },
  {
    id: 5,
    judul: "Cantik Itu Luka",
    penulis: "Eka Kurniawan",
    deskripsi: "Novel realisme magis yang menceritakan sejarah panjang Indonesia melalui kehidupan Dewi Ayu dan keturunannya.",
    cover: "c-5"
  },
  {
    id: 6,
    judul: "Atomic Habits",
    penulis: "James Clear",
    deskripsi: "Panduan membangun kebiasaan baik dan menghilangkan kebiasaan buruk melalui perubahan kecil konsisten.",
    cover: "c-6"
  }
];

let riwayatPinjam = [];

// DOM Element
const loginSection = document.getElementById('loginSection');
const appSection = document.getElementById('appSection');
const formLogin = document.getElementById('formLogin');
const loginError = document.getElementById('loginError');
const btnLogout = document.getElementById('btnLogout');
const listBuku = document.getElementById('listBuku');

// Initial Load
document.addEventListener('DOMContentLoaded', function () {
  renderKatalog();
});

// Render Katalog ke HTML
function renderKatalog() {
  listBuku.innerHTML = '';
  bukuList.forEach(function (b) {
    const div = document.createElement('div');
    div.className = 'item-buku';
    div.setAttribute('data-id', b.id);
    div.setAttribute('data-judul', b.judul);
    div.setAttribute('data-penulis', b.penulis);
    div.setAttribute('data-deskripsi', b.deskripsi);

    div.innerHTML = `
      <div class="thumb ${b.cover}">${b.judul}</div>
      <div class="info">
        <h4>${b.judul}</h4>
        <p class="author">${b.penulis}</p>
        <div class="action flex-space">
          <span class="badge badge-ada">Tersedia</span>
          <button type="button" class="btn-sm btn-pinjam">Pinjam</button>
        </div>
      </div>
    `;
    listBuku.appendChild(div);
  });
}

// Logic Login
formLogin.addEventListener('submit', function (e) {
  e.preventDefault();
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value.trim();

  if (u === 'user' && p === '123456') {
    loginError.classList.add('hidden');
    loginSection.classList.add('hidden');
    appSection.classList.remove('hidden');
    document.getElementById('userGreeting').textContent = u;
  } else {
    loginError.classList.remove('hidden');
  }
});

// Logic Logout
btnLogout.addEventListener('click', function () {
  appSection.classList.add('hidden');
  loginSection.classList.remove('hidden');
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
});

// Navigasi Tab
function switchTab(tabName) {
  const pageKatalog = document.getElementById('pageKatalog');
  const pageRiwayat = document.getElementById('pageRiwayat');
  const tabs = document.querySelectorAll('.tab-item');

  tabs[0].classList.remove('active');
  tabs[1].classList.remove('active');

  if (tabName === 'katalog') {
    tabs[0].classList.add('active');
    pageKatalog.classList.remove('hidden');
    pageRiwayat.classList.add('hidden');
  } else {
    tabs[1].classList.add('active');
    pageRiwayat.classList.remove('hidden');
    pageKatalog.classList.add('hidden');
  }
}

// Pencarian
const inputCari = document.getElementById('cariBuku');
inputCari.addEventListener('keyup', function () {
  const filter = this.value.toLowerCase().trim();
  const items = document.querySelectorAll('.item-buku');
  let ada = 0;

  items.forEach(function (item) {
    const judul = item.getAttribute('data-judul').toLowerCase();
    const penulis = item.getAttribute('data-penulis').toLowerCase();

    if (judul.includes(filter) || penulis.includes(filter)) {
      item.style.display = 'block';
      ada++;
    } else {
      item.style.display = 'none';
    }
  });

  const noData = document.getElementById('noData');
  if (ada === 0) {
    noData.classList.remove('hidden');
  } else {
    noData.classList.add('hidden');
  }
});

// Event Klik Buku & Modal Pinjam
listBuku.addEventListener('click', function (e) {
  if (e.target.classList.contains('btn-pinjam')) {
    e.stopPropagation();
    const btn = e.target;
    const card = btn.closest('.item-buku');
    const id = card.getAttribute('data-id');
    const judul = card.getAttribute('data-judul');

    document.getElementById('pBukuId').value = id;
    document.getElementById('pBukuJudul').value = judul;
    document.getElementById('modalPinjam').classList.remove('hidden');
    return;
  }

  const card = e.target.closest('.item-buku');
  if (card) {
    document.getElementById('mdJudul').textContent = card.getAttribute('data-judul');
    document.getElementById('mdPenulis').textContent = 'Penulis: ' + card.getAttribute('data-penulis');
    document.getElementById('mdDeskripsi').textContent = card.getAttribute('data-deskripsi');
    document.getElementById('modalDetail').classList.remove('hidden');
  }
});

// Form Submit Biodata
const formPinjamBuku = document.getElementById('formPinjamBuku');
formPinjamBuku.addEventListener('submit', function (e) {
  e.preventDefault();

  const id = document.getElementById('pBukuId').value;
  const judul = document.getElementById('pBukuJudul').value;
  const nama = document.getElementById('pNama').value.trim();
  const kelas = document.getElementById('pKelas').value.trim();
  const nohp = document.getElementById('pNoHp').value.trim();

  const today = new Date();
  const tglStr = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();

  riwayatPinjam.push({
    id: id,
    judul: judul,
    nama: nama,
    kelas: kelas,
    nohp: nohp,
    tanggal: tglStr,
    status: 'Dipinjam'
  });

  const card = document.querySelector(`.item-buku[data-id="${id}"]`);
  if (card) {
    const badge = card.querySelector('.badge');
    const btn = card.querySelector('.btn-pinjam');

    badge.textContent = 'Dipinjam';
    badge.className = 'badge badge-pinjam';
    btn.textContent = 'Dipinjam';
    btn.disabled = true;
  }

  updateTableRiwayat();
  closeModalPinjam();
  formPinjamBuku.reset();
  alert('Buku "' + judul + '" berhasil dipinjam atas nama ' + nama + '.');
});

// Table Riwayat
function updateTableRiwayat() {
  const tb = document.getElementById('tbRiwayat');
  const empty = document.getElementById('emptyRiwayat');
  const totalPinjam = document.getElementById('totalPinjam');

  tb.innerHTML = '';
  totalPinjam.textContent = riwayatPinjam.length;

  if (riwayatPinjam.length === 0) {
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  riwayatPinjam.forEach(function (row, idx) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td><b>${row.nama}</b><br><small style="color:#666;">${row.kelas} (${row.nohp})</small></td>
      <td>${row.judul}</td>
      <td>${row.tanggal}</td>
      <td><span class="badge ${row.status === 'Dipinjam' ? 'badge-pinjam' : 'badge-ada'}">${row.status}</span></td>
      <td>
        ${
          row.status === 'Dipinjam'
            ? `<button class="btn-danger" onclick="kembalikan('${row.id}')">Kembali</button>`
            : '-'
        }
      </td>
    `;
    tb.appendChild(tr);
  });
}

// Kembalikan Buku
function kembalikan(id) {
  const item = riwayatPinjam.find((r) => r.id === id && r.status === 'Dipinjam');
  if (item) {
    item.status = 'Dikembalikan';

    const card = document.querySelector(`.item-buku[data-id="${id}"]`);
    if (card) {
      const badge = card.querySelector('.badge');
      const btn = card.querySelector('.btn-pinjam');

      badge.textContent = 'Tersedia';
      badge.className = 'badge badge-ada';
      btn.textContent = 'Pinjam';
      btn.disabled = false;
    }

    updateTableRiwayat();
    alert('Buku berhasil dikembalikan.');
  }
}

// Modal Helper
function closeModalDetail() {
  document.getElementById('modalDetail').classList.add('hidden');
}

function closeModalPinjam() {
  document.getElementById('modalPinjam').classList.add('hidden');
}

window.onclick = function (e) {
  const mDetail = document.getElementById('modalDetail');
  const mPinjam = document.getElementById('modalPinjam');

  if (e.target === mDetail) closeModalDetail();
  if (e.target === mPinjam) closeModalPinjam();
};