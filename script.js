// Submit Form Biodata
const formPinjamBuku = document.getElementById('formPinjamBuku');
formPinjamBuku.addEventListener('submit', function (e) {
  e.preventDefault();

  const id = document.getElementById('pBukuId').value;
  const judul = document.getElementById('pBukuJudul').value;
  const nama = document.getElementById('pNama').value.trim();
  const kelas = document.getElementById('pKelas').value.trim();
  const nohp = document.getElementById('pNoHp').value.trim();

  const today = new Date();
  const tglPinjam = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
  
  // Tanggal kembali otomatis +7 hari
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  const tglKembali = nextWeek.getDate() + '/' + (nextWeek.getMonth() + 1) + '/' + nextWeek.getFullYear();

  riwayatPinjam.push({
    id: id,
    judul: judul,
    nama: nama,
    kelas: kelas,
    nohp: nohp,
    tglPinjam: tglPinjam,
    tglKembali: tglKembali,
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
  alert('Berhasil! Buku "' + judul + '" dipinjam oleh ' + nama + '. Batas pengembalian: ' + tglKembali);
});

// Update Tabel Riwayat
function updateTableRiwayat() {
  const tb = document.getElementById('tbRiwayat');
  const empty = document.getElementById('emptyRiwayat');
  const totalPinjam = document.getElementById('totalPinjam');

  tb.innerHTML = '';
  totalPinjam.textContent = riwayatPinjam.filter(r => r.status === 'Dipinjam').length;

  if (riwayatPinjam.length === 0) {
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  riwayatPinjam.forEach(function (row, idx) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>
        <strong style="color: #0f172a;">${row.nama}</strong><br>
        <span style="color: #64748b; font-size: 11px;">${row.kelas} • ${row.nohp}</span>
      </td>
      <td><strong>${row.judul}</strong></td>
      <td>
        <span style="font-size: 12px; color: #334155;">Pinjam: ${row.tglPinjam}</span><br>
        <small style="color: #2563eb; font-weight: 500;">Batas: ${row.tglKembali}</small>
      </td>
      <td>
        <span class="badge ${row.status === 'Dipinjam' ? 'badge-pinjam' : 'badge-ada'}">
          ${row.status}
        </span>
      </td>
      <td>
        ${
          row.status === 'Dipinjam'
            ? `<button class="btn-danger" onclick="kembalikan('${row.id}')">Kembalikan</button>`
            : '<span style="color:#94a3b8; font-size:12px;">Selesai</span>'
        }
      </td>
    `;
    tb.appendChild(tr);
  });
}