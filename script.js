// Elemen Login & Aplikasi
const loginModal = document.getElementById('loginModal');
const mainWrapper = document.getElementById('mainWrapper');
const formLogin = document.getElementById('formLogin');
const loginErr = document.getElementById('loginErr');
const btnLogout = document.getElementById('btnLogout');
const userLabel = document.getElementById('userLabel');

// Elemen Katalog
const inputCari = document.getElementById('inputCari');
const gridBuku = document.getElementById('gridBuku');
const listBuku = document.querySelectorAll('.card-buku');
const pesanKosong = document.getElementById('pesanKosong');

// 1. Dapatkan Sesi Login Sederhana
formLogin.addEventListener('submit', function (e) {
  e.preventDefault();

  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();

  // Kredensial demo
  if (user === 'user' && pass === '123456') {
    loginErr.classList.add('hidden');
    userLabel.textContent = user;

    // Sembunyikan Modal, Tampilkan Halaman Utama
    loginModal.classList.add('hidden');
    mainWrapper.classList.remove('hidden');
  } else {
    loginErr.classList.remove('hidden');
  }
});

// 2. Fitur Logout
btnLogout.addEventListener('click', function () {
  mainWrapper.classList.add('hidden');
  loginModal.classList.remove('hidden');
  document.getElementById('password').value = '';
});

// 3. Pencarian Buku
inputCari.addEventListener('keyup', function () {
  const keyword = inputCari.value.toLowerCase().trim();
  let ketemu = 0;

  listBuku.forEach(function (card) {
    const judul = card.getAttribute('data-judul');
    const penulis = card.getAttribute('data-penulis');

    if (judul.includes(keyword) || penulis.includes(keyword)) {
      card.style.display = 'flex';
      ketemu++;
    } else {
      card.style.display = 'none';
    }
  });

  if (ketemu === 0) {
    pesanKosong.classList.remove('hidden');
  } else {
    pesanKosong.classList.add('hidden');
  }
});

// 4. Pinjam Buku
gridBuku.addEventListener('click', function (e) {
  if (e.target.classList.contains('btn-pinjam') && !e.target.disabled) {
    const btn = e.target;
    const card = btn.closest('.card-buku');
    const judul = card.querySelector('.judul').textContent;
    const status = card.querySelector('.status');

    alert('Berhasil meminjam buku "' + judul + '"!');

    // Ubah tampilan status & tombol
    status.textContent = 'Dipinjam';
    status.className = 'status status-pinjam';

    btn.textContent = 'Sedang Dipinjam';
    btn.disabled = true;
  }
});