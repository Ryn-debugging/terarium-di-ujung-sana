# 🌿 Terarium di Ujung Lorong

[![Play Online](https://img.shields.io/badge/▶_Mainkan_Online-GitHub_Pages-10b981?style=for-the-badge)](https://ryn-debugging.github.io/terarium-di-ujung-sana/)
[![Download Android APK](https://img.shields.io/badge/📲_Download_APK-Android-fbbf24?style=for-the-badge)](https://github.com/Ryn-debugging/terarium-di-ujung-sana/releases/download/latest/Terarium-di-Ujung-Lorong.apk)
[![Build Android APK](https://github.com/Ryn-debugging/terarium-di-ujung-sana/actions/workflows/build-android-apk.yml/badge.svg)](https://github.com/Ryn-debugging/terarium-di-ujung-sana/actions/workflows/build-android-apk.yml)

> *"Bantu tetanggamu dari balik kamar secara diam-diam tanpa harus bertatap muka."*

- 🎮 **Mainkan Langsung (Web & Mobile):** [https://ryn-debugging.github.io/terarium-di-ujung-sana/](https://ryn-debugging.github.io/terarium-di-ujung-sana/)
- 📲 **Download APK Android (Langsung):** [Terarium-di-Ujung-Lorong.apk](https://github.com/Ryn-debugging/terarium-di-ujung-sana/releases/download/latest/Terarium-di-Ujung-Lorong.apk) *(juga dapat di-install offline langsung sebagai PWA dari browser HP)*

Sebuah **game drama psikologis indie (interactive narrative & 2D side-scrolling)** tentang empati sunyi (*silent empathy*), kecemasan sosial, dan keberanian kecil untuk hadir bagi sesama di tengah tiga malam hujan.

Dibangun **100% offline-ready & zero external CDN** menggunakan **HTML5 Canvas 2D**, CSS responsif murni, **Procedural Spatial Web Audio API**, **PWA Service Worker**, dan paket build **Android APK (Capacitor)**.

---

## ✨ Pembaruan Besar v3.0 (Tactical Stealth & Senior Polish Edition)

- 🚪 **Stealth Taktis & Bahaya "Gagang Berderit":**
  - Pintu tetangga kini sesekali berderit bergetar (`1.9` detik peringatan + suara decit kayu) sebelum terbuka mengintip lorong. Segera tekan `[S]` / `🙈` atau sembunyi di **Pot Tanaman / Ceruk Tangga** sebelum sorot lampu menyambar!
  - Berjalan tegak di lorong kini menimbulkan suara langkah yang memperluas radius deteksi tetangga (`155px` vs `72px` saat mengendap).
- 🧭 **Lokasi Pencarian Unik di Tiap Malam & Reaktif Tetangga:**
  - Setiap malam barang terjatuh di titik lorong yang berbeda (*Malam 1:* Kotak Rongsokan Tengah `x: 460`, *Malam 2:* Sudut Tangga Kanan `x: 830`, *Malam 3:* Koridor Barat `x: 210`).
  - Pintu tetangga yang sudah dibantu pada malam sebelumnya bisa dijenguk kembali di malam berikutnya untuk melihat kondisi mereka + bonus `+5 Mental`.
- 🥁 **Mini-Game Lebih Hidup:**
  - *Malam 2 (PCB Senter):* Pin kanan sirkuit diacak (*Fisher-Yates*) setiap kali percobaan agar tidak bisa ditebak hafalan.
  - *Malam 3 (Lentera Sora):* **Kalibrasi Irama Sensor Hujan (Piezo Rhythm)** — ketuk kaca tepat saat cincin tetesan air biru beresonansi di zona hijau (`3×` akurat).
- 🎶 **Melodi Keroncong Terarah & Audio Lifecycle:**
  - Dekat Pintu 301 dan di mini-game radio kini mengalunkan frasa 12-nada keroncong asli yang harmonis, serta audio otomatis di-pause bersih saat tab/aplikasi masuk background (`visibilitychange` & `window.blur`).
- 🌸 **Sudut Kenangan Kamar 304 & Syarat Ending Sejati:**
  - Tersedia hotspot khusus **`Kenangan`** (`x: 635`) di Kamar 304 untuk menginspeksi Kue Putu Bu Ratna, Termos Mas Damar, dan Sketsa Cat Air Sora beserta refleksi fajar.
  - **Ending C (Akhir Sejati)** kini benar-benar menuntut persiapan matang: **Ketahanan Mental ≥ 50** + lengkapnya **Balasan Sunyi Malam 1 & 2**.
- 📱 **Polesan Mobile & Android APK v3.0:**
  - Dukungan penuh area aman layar berponi (*notch / gesture bar* `env(safe-area-inset-*)`), penanganan **tombol Back fisik Android** (`@capacitor/app`), dan *versionCode 3 / 3.0.0*.

---

## ✨ Fondasi Lengkap 3 Malam (v2.0 → v3.0)

- 🌙 **Alur Cerita 3 Malam Berkelanjutan:** Kisah tidak lagi terjadi dalam satu malam datar—setiap tetangga mendapat fokus malamnya sendiri dengan cuaca badai, kecepatan patroli, dan ketegangan yang meningkat dari **Malam 1 → Malam 2 → Malam 3**.
- 🛠️ **3 Mini-Game Reparasi Unik di Meja Kerja:**
  - *Malam 1 (Radio Bu Ratna):* **Kalibrasi Frekuensi 88.4 MHz** dengan osiloskop live & audio statik-ke-keroncong real-time.
  - *Malam 2 (Senter Mas Damar):* **Sambung Sirkuit PCB Acak & Baut Pengait Baja** (cocokkan terminal kutub + ground + driver LED).
  - *Malam 3 (Lentera Sora):* **Rakit Terarium Sensor Hujan 3 Langkah** (susun lapisan batu/tanah/lumut → jaga kelembapan `65%–80%` → kalibrasi irama piezo).
- 💌 **Sistem "Balasan Sunyi" & Tirai Kamar 304:** Setiap selesai membantu tetangga, sepucuk surat dan bingkisan kecil muncul di depan pintu 304. Mengambilnya menambahkan benda kenangan ke **Sudut Kenangan** dan menyibak tirai jendela sedikit demi sedikit.
- 🌅 **Cutscene Visual & Epilog Fajar (True Ending):** Ketiga ending memiliki animasi cutscene canvas tersendiri. Pada **Ending Sejati**, saksikan badai mereda menjadi langit keemasan pagi bersama Sora, lalu lanjutkan menjelajahi **Kamar 304 di suasana fajar**.
- 💾 **Auto-Save & Galeri Akhir:** Progres malam dan koleksi ending (`0/3` → `3/3`) otomatis tersimpan di `localStorage` perangkat (kompatibel penuh dengan save v2.0).

---

## 📖 Sinopsis & Jadwal 3 Malam

Kamu adalah **Raka**, penghuni **Kamar 304 di Rusunawa Asoka**. Melalui celah ventilasi kamar, Raka mendengar suara kesulitan para tetangga, memperbaiki barang rusak mereka secara diam-diam, lalu meletakkannya di depan pintu masing-masing sebelum fajar:

| Malam | Karakter & Kamar | Titik Pencarian & Reparasi | Balasan Sunyi (Hadiah di Pintu 304) |
|---|---|---|---|
| **Malam 1** *(22:15 WIB)* | **Bu Ratna** — Kamar 301 | 📻 Kotak Rongsokan Tengah → Kalibrasi `88.4 MHz` | 🍡 Sepiring Kue Putu Hangat & Surat |
| **Malam 2** *(23:40 WIB)* | **Mas Damar** — Kamar 302 | 🔦 Sudut Tangga Kanan → Sambung PCB Acak & Baut | ☕ Termos Kecil Kopi Jahe & Memo |
| **Malam 3** *(01:15 WIB)* | **Sora** — Kamar 305 | 🫙 Koridor Barat → Rakit Terarium & Irama Piezo | 🎨 Sketsa Payung Cat Air & Teh Chamomile |

---

## 🌧️ Babak Penentuan di Atap & 3 Akhir (*Endings*)

Di puncak badai Malam Ketiga, pintu **Tangga Atap** terbuka. Sora—yang kehilangan pendengarannya akibat saraf sehingga tak dapat mendengar seruan maupun langkah kaki di tengah badai—berdiri terisolasi di tepi atap sambil memeluk lentera sensor hujan. Hanya cahaya dan kehadiran nyata yang bisa menjangkaunya:

1. **Akhir A — Penjaga di Balik Bayangan *(Avoidant Ending)*:**
   Memberi sinyal cahaya ke lantai bawah agar Mas Damar naik menjemput Sora, lalu mundur ke balik bayangan. Semua selamat, namun tirai Kamar 304 tetap tertutup.
2. **Akhir B — Jembatan Cahaya Lumut *(Silent Empathy Ending • Syarat: Mental ≥ 30)*:**
   Menyusun barisan toples lentera berpendar hijau di atas beton basah untuk menuntun perhatian visual Sora menjauh dari tepian atap.
3. **Akhir Sejati — Kaca yang Sedikit Terbuka *(True Ending • Syarat: Mental ≥ 50 & Balasan Malam 1–2)*:**
   Melangkah mendekati Sora di tengah rasa cemas terbesarmu, membuka payung, dan duduk menemaninya dalam diam hingga fajar keemasan menyingsing. Membuka mode bebas **Epilog Pagi Kamar 304**.

---

## 🎮 Mekanika & Kontrol

### Mekanika Bertahan
- **💚 Ketahanan Mental:** Pulihkan dengan **Masak Sup Hangat** (maksimal **2× per malam**, aduk 3× untuk `+30 Mental` & pulihkan batas maksimum mental), **Rawat Terarium Lumut** (`+20 Mental`, *cooldown* 22 detik), atau **menjenguk pintu tetangga** yang sudah terbantu di malam berikutnya (`+5 Mental`).
- **⚡ Cemas Sosial & Mengendap:** Meningkat di lorong rusun (lebih cepat jika berjalan tegak tanpa mengendap!). Gunakan **Spot Sembunyi** dan tombol mengendap (`[S]` / `🙈`) untuk meredam lonjakan cemas saat tetangga lewat maupun saat muncul peringatan **`⚠️ Gagang Berderit`**, atau gunakan **🌬️ Tarik Napas (`[SPASI]`)** untuk menurunkan `-35% Cemas` dengan imbalan `-20 Mental`.
- **🔄 Sensory Overload Safety Net:** Jika cemas menyentuh `100%`, Raka mundur aman ke Kamar 304 tanpa *game over* keras (batas maksimal mental sedikit berkurang hingga dipulihkan sup hangat).

### Kontrol Permainan
- **Desktop / Keyboard:**
  - `[A]` / `[D]` atau `[←]` / `[→]`: Berjalan
  - `[E]` / `[Enter]`: Interaksi hotspot / pintu
  - `[S]` atau `[Shift]`: Toggle **Mode Mengendap (Sembunyi)**
  - `[Spasi]`: **Tarik Napas Tenang**
  - **Klik Kiri Mouse:** *Click-to-move* atau interaksi langsung objek
- **Smartphone (Portrait & Landscape):**
  - Layar otomatis menyesuaikan HUD ringkas, aman dari poni kamera/gesture bar (*safe-area*), serta mendukung **Smart Mobile Camera** mengikuti posisi Raka di layar HP.
  - Gunakan tombol virtual **`◀`**, **`🙈`** *(saat di lorong)*, **`🌬️`**, **`AKSI`**, **`▶`** atau sentuh langsung area tujuan di layar; di Android APK tersedia dukungan penuh tombol **Back** hardware untuk menutup dialog/navigasi aman.

---

## 📲 Cara Install ke Android (APK & PWA Offline)

### Opsi 1: Download & Install Langsung File `.APK` Android
1. Unduh **`Terarium-di-Ujung-Lorong.apk`** langsung dari [**GitHub Releases (Latest)**](https://github.com/Ryn-debugging/terarium-di-ujung-sana/releases/download/latest/Terarium-di-Ujung-Lorong.apk) *(atau tab **Actions** → workflow `Build Android APK`)*.
2. Buka file `.apk` di HP Android kamu dan izinkan *Install from unknown sources / Sumber tidak dikenal* jika diminta.
3. Game langsung terpasang dengan ikon terarium di laci aplikasi dan berjalan **100% offline** *(v3.0 otomatis menimpa instalasi v2.0 tanpa menghapus save data jika berasal dari rilis GitHub Actions yang sama atau setelah izin update)*.

### Opsi 2: Install Langsung via Browser HP (PWA Full-Screen Offline)
1. Buka **[https://ryn-debugging.github.io/terarium-di-ujung-sana/](https://ryn-debugging.github.io/terarium-di-ujung-sana/)** di Chrome (Android) atau Safari (iOS).
2. Ketuk **`📲 Install / APK`** di layar judul, atau pilih **"Tambahkan ke Layar Utama / Install App"** pada menu browser.
3. Service Worker otomatis meng-cache seluruh aset (`v3.0.0`) agar bisa dimainkan kapan saja tanpa internet.

---

## 🛠️ Struktur Proyek & Build Lokal

Sumber kode dikembangkan secara modular di `src/` dan dikompilasi oleh [`scripts/build.mjs`](scripts/build.mjs) menjadi dua file tunggal portabel (`index.html` untuk web/PWA & `terarium_di_ujung_lorong.html` untuk dibuka offline `file://`) sekaligus menyalin aset ke `www/` untuk Capacitor Android:

```text
├── src/
│   ├── template.html      # Struktur DOM & UI HUD desktop/mobile
│   ├── styles.css         # Desain gelap atmosferik, safe-area inset & responsif (0 CDN)
│   ├── story.js           # Data 3 Malam, titik scavenge dinamis, Door Revisit, & Sudut Kenangan
│   ├── audio.js           # Web Audio Engine (keroncong berurutan, langkah, decit pintu, stereo pan)
│   ├── minigames.js       # Radio 88.4 MHz, PCB Acak, Lentera Irama Piezo
│   ├── renderer.js        # Canvas 2D renderer, bahaya pintu mengintip, sudut kenangan, cutscenes
│   └── main.js            # Loop delta-time, stealth taktis, save kompatibel, back-button Android
├── scripts/
│   ├── build.mjs          # Bundler sumber modular -> HTML tunggal & www/
│   └── prepare-android-icons.py
├── icons/                 # Ikon SVG, PNG 192/512, dan Maskable icon PWA
├── .github/workflows/
│   └── build-android-apk.yml  # CI otomatis build Android APK v3.0 via Capacitor 6 & Gradle
├── manifest.webmanifest
├── sw.js                  # Service Worker v3.0.0 (Network-first HTML, Cache-first aset)
├── package.json
├── capacitor.config.json
├── index.html             # Output kompilasi Web/PWA (GitHub Pages)
└── terarium_di_ujung_lorong.html # Output tunggal portabel (offline file://)
```

Menjalankan build secara lokal:
```bash
node scripts/build.mjs
```

---

## 📄 Lisensi

Proyek ini dibuat untuk tujuan artistik, kesadaran kesehatan mental (*mental health awareness*), dan eksplorasi narasi interaktif berbasis web/mobile. Bebas dipelajari, dimainkan, dan dibagikan (CC BY-NC).
