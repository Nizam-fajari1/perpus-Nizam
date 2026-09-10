let riwayatPinjam = [];

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

// Handler Klik Buku / Pinjam
const listBuku = document.getElementById('listBuku');
if (listBuku) {
  listBuku.addEventListener('click', function (e) {
    // Jika tombol Pinjam diklik -> Buka Modal Form Biodata
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

    // Klik kartu untuk detail
    const card = e.target.closest('.item-buku');
    if (card) {
      document.getElementById('mdJudul').textContent = card.getAttribute('data-judul');
      document.getElementById('mdPenulis').textContent = 'Penulis: ' + card.getAttribute('data-penulis');
      document.getElementById('mdDeskripsi').textContent = card.getAttribute('data-deskripsi');
      document.getElementById('modalDetail').classList.remove('hidden');
    }
  });
}

// Submit Form Biodata Pinjam
const formPinjamBuku = document.getElementById('formPinjamBuku');
if (formPinjamBuku) {
  formPinjamBuku.addEventListener('submit', function (e) {
    e.preventDefault();

    const id = document.getElementById('pBukuId').value;
    const judul = document.getElementById('pBukuJudul').value;
    const nama = document.getElementById('pNama').value.trim();
    const kelas = document.getElementById('pKelas').value.trim();
    const nohp = document.getElementById('pNoHp').value.trim();

    const today = new Date();
    const tglStr = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();

    // Masukkan ke array riwayat
    riwayatPinjam.push({
      id: id,
      judul: judul,
      nama: nama,
      kelas: kelas,
      nohp: nohp,
      tanggal: tglStr,
      status: 'Dipinjam'
    });

    // Ubah status kartu buku di UI
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
    
    // Reset form
    formPinjamBuku.reset();
    alert('Buku "' + judul + '" berhasil dipinjam atas nama ' + nama + '.');
  });
}

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