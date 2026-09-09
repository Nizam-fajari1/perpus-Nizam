// Array penampung riwayat pinjam sementara
let riwayatPinjam = [];

// Fungsi ganti tab
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

// Fitur Pencarian Buku
const inputCari = document.getElementById('cariBuku');
if (inputCari) {
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
}

// Event handler klik di grid buku
const listBuku = document.getElementById('listBuku');
if (listBuku) {
  listBuku.addEventListener('click', function (e) {
    // Tombol Pinjam diklik
    if (e.target.classList.contains('btn-pinjam')) {
      e.stopPropagation();
      const btn = e.target;
      const card = btn.closest('.item-buku');
      const id = card.getAttribute('data-id');
      const judul = card.getAttribute('data-judul');
      const badge = card.querySelector('.badge');

      // Ambil tanggal hari ini
      const today = new Date();
      const tglStr = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();

      // Simpan ke array
      riwayatPinjam.push({
        id: id,
        judul: judul,
        tanggal: tglStr,
        status: 'Dipinjam'
      });

      // Update UI kartu
      badge.textContent = 'Dipinjam';
      badge.className = 'badge badge-pinjam';
      btn.textContent = 'Dipinjam';
      btn.disabled = true;

      updateTableRiwayat();
      alert('Buku "' + judul + '" berhasil dipinjam.');
      return;
    }

    // Klik area kartu buku untuk lihat detail
    const card = e.target.closest('.item-buku');
    if (card) {
      document.getElementById('mdJudul').textContent = card.getAttribute('data-judul');
      document.getElementById('mdPenulis').textContent = 'Penulis: ' + card.getAttribute('data-penulis');
      document.getElementById('mdDeskripsi').textContent = card.getAttribute('data-deskripsi');
      document.getElementById('modalDetail').classList.remove('hidden');
    }
  });
}

// Function update tabel riwayat
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
      <td><b>${row.judul}</b></td>
      <td>${row.tanggal}</td>
      <td><span class="badge ${row.status === 'Dipinjam' ? 'badge-pinjam' : 'badge-ada'}">${row.status}</span></td>
      <td>
        ${
          row.status === 'Dipinjam'
            ? `<button class="btn-danger" onclick="kembalikan('${row.id}')">Kembalikan</button>`
            : '-'
        }
      </td>
    `;
    tb.appendChild(tr);
  });
}

// Function kembalikan buku
function kembalikan(id) {
  const item = riwayatPinjam.find((r) => r.id === id && r.status === 'Dipinjam');
  if (item) {
    item.status = 'Dikembalikan';

    // Reset status di kartu
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

// Modal Tutup
function closeModal() {
  document.getElementById('modalDetail').classList.add('hidden');
}

window.onclick = function (e) {
  const modal = document.getElementById('modalDetail');
  if (e.target === modal) {
    closeModal();
  }
};