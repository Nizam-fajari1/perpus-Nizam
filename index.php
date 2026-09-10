<?php
session_start();

$buku_list = [
    [
        "id" => 1,
        "judul" => "Laskar Pelangi",
        "penulis" => "Andrea Hirata",
        "deskripsi" => "Perjuangan sepuluh anak di Belitung yang berusaha mempertahankan sekolah Muhammadiyah di tengah keterbatasan fasilitas.",
        "cover" => "c-1"
    ],
    [
        "id" => 2,
        "judul" => "Bumi Manusia",
        "penulis" => "Pramoedya Ananta Toer",
        "deskripsi" => "Kisah Minke, seorang pemuda pribumi terpelajar di era kolonial yang memperjuangkan hak dan cintanya.",
        "cover" => "c-2"
    ],
    [
        "id" => 3,
        "judul" => "Filosofi Teras",
        "penulis" => "Henry Manampiring",
        "deskripsi" => "Penerapan filsafat stoisisme kuno untuk mengendalikan emosi negatif dan mengelola kecemasan di kehidupan modern.",
        "cover" => "c-3"
    ],
    [
        "id" => 4,
        "judul" => "Negeri 5 Menara",
        "penulis" => "Ahmad Fuadi",
        "deskripsi" => "Petualangan 6 santri di Pondok Madani yang memegang prinsip 'Man Jadda Wajada' dalam meraih impian.",
        "cover" => "c-4"
    ],
    [
        "id" => 5,
        "judul" => "Cantik Itu Luka",
        "penulis" => "Eka Kurniawan",
        "deskripsi" => "Novel realisme magis yang menceritakan sejarah panjang Indonesia melalui kehidupan Dewi Ayu dan keturunannya.",
        "cover" => "c-5"
    ],
    [
        "id" => 6,
        "judul" => "Atomic Habits",
        "penulis" => "James Clear",
        "deskripsi" => "Panduan membangun kebiasaan baik dan menghilangkan kebiasaan buruk melalui perubahan kecil konsisten.",
        "cover" => "c-6"
    ]
];

$error = "";
if (isset($_POST['login'])) {
    $user = trim($_POST['username']);
    $pass = trim($_POST['password']);

    if ($user === 'user' && $pass === '123456') {
        $_SESSION['username'] = $user;
        header("Location: index.php");
        exit();
    } else {
        $error = "Username atau password salah!";
    }
}

if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: index.php");
    exit();
}

$is_login = isset($_SESSION['username']);
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistem Perpustakaan</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <?php if (!$is_login): ?>
  <div class="login-modal">
    <div class="login-box">
      <h3>Login Anggota</h3>
      <p class="sub">Masukkan akun untuk masuk ke katalog</p>

      <?php if ($error != ""): ?>
        <div class="alert-err"><?= $error; ?></div>
      <?php endif; ?>

      <form action="index.php" method="POST">
        <div class="form-group">
          <label>Username</label>
          <input type="text" name="username" placeholder="ketik 'user'" required>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" name="password" placeholder="ketik '123456'" required>
        </div>
        <button type="submit" name="login" class="btn-primary">Masuk</button>
      </form>
    </div>
  </div>

  <?php else: ?>

  <div class="header">
    <div class="container flex-space">
      <div class="logo">Web Perpus</div>
      <div class="user-menu">
        <span>Halo, <b><?= htmlspecialchars($_SESSION['username']); ?></b></span>
        <a href="index.php?logout=true" class="btn-out">Logout</a>
      </div>
    </div>
  </div>

  <div class="container content">
    
    <div class="tabs">
      <button class="tab-item active" onclick="switchTab('katalog')">Katalog Buku</button>
      <button class="tab-item" onclick="switchTab('riwayat')">
        Riwayat Pinjam (<span id="totalPinjam">0</span>)
      </button>
    </div>

    <!-- HALAMAN KATALOG -->
    <div id="pageKatalog" class="page-section">
      <div class="search-box">
        <input type="text" id="cariBuku" placeholder="Cari judul buku atau nama penulis...">
      </div>

      <div class="grid-buku" id="listBuku">
        <?php foreach ($buku_list as $b): ?>
          <div class="item-buku" 
               data-id="<?= $b['id']; ?>"
               data-judul="<?= htmlspecialchars($b['judul']); ?>"
               data-penulis="<?= htmlspecialchars($b['penulis']); ?>"
               data-deskripsi="<?= htmlspecialchars($b['deskripsi']); ?>">
            <div class="thumb <?= $b['cover']; ?>">
              <?= htmlspecialchars($b['judul']); ?>
            </div>
            <div class="info">
              <h4><?= htmlspecialchars($b['judul']); ?></h4>
              <p class="author"><?= htmlspecialchars($b['penulis']); ?></p>
              <div class="action flex-space">
                <span class="badge badge-ada">Tersedia</span>
                <button class="btn-sm btn-pinjam">Pinjam</button>
              </div>
            </div>
          </div>
        <?php endforeach; ?>
      </div>

      <p id="noData" class="empty-msg hidden">Data buku tidak ditemukan.</p>
    </div>

    <!-- HALAMAN RIWAYAT -->
    <div id="pageRiwayat" class="page-section hidden">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th width="40">No</th>
              <th>Peminjam</th>
              <th>Buku</th>
              <th>Tgl Pinjam</th>
              <th>Status</th>
              <th width="80">Opsi</th>
            </tr>
          </thead>
          <tbody id="tbRiwayat">
          </tbody>
        </table>
        <p id="emptyRiwayat" class="empty-msg">Belum ada buku yang dipinjam.</p>
      </div>
    </div>

  </div>

  <!-- MODAL FORM PINJAM (BIODATA) -->
  <div id="modalPinjam" class="modal-bg hidden">
    <div class="modal-content">
      <span class="close-btn" onclick="closeModalPinjam()">&times;</span>
      <h3>Form Peminjaman Buku</h3>
      <p class="text-sub">Isi data diri kamu sebelum meminjam buku ini.</p>
      <hr style="margin-bottom: 12px;">

      <form id="formPinjamBuku">
        <input type="hidden" id="pBukuId">
        
        <div class="form-group">
          <label>Judul Buku</label>
          <input type="text" id="pBukuJudul" readonly style="background: #e9ecef; font-weight: bold;">
        </div>
        <div class="form-group">
          <label>Nama Lengkap</label>
          <input type="text" id="pNama" placeholder="Contoh: Muhammad Nizam" required>
        </div>
        <div class="form-group">
          <label>Kelas / Jurusan</label>
          <input type="text" id="pKelas" placeholder="Contoh: XII RPL 1" required>
        </div>
        <div class="form-group">
          <label>No. HP / WA</label>
          <input type="text" id="pNoHp" placeholder="Contoh: 081234567890" required>
        </div>

        <button type="submit" class="btn-primary" style="margin-top: 5px;">Konfirmasi Pinjam</button>
      </form>
    </div>
  </div>

  <!-- MODAL DETAIL BUKU -->
  <div id="modalDetail" class="modal-bg hidden">
    <div class="modal-content">
      <span class="close-btn" onclick="closeModalDetail()">&times;</span>
      <h3 id="mdJudul">Judul Buku</h3>
      <p class="text-sub" id="mdPenulis">Penulis</p>
      <hr>
      <p class="desc-title"><b>Sinopsis:</b></p>
      <p id="mdDeskripsi" class="desc-text">-</p>
    </div>
  </div>

  <div class="footer">
    <div class="container">
      <p>&copy; 2026 Aplikasi Perpustakaan Sederhana</p>
    </div>
  </div>

  <script src="script.js"></script>
  <?php endif; ?>

</body>
</html>