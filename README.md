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

## ✨ Pembaruan Besar v2.0 (The Complete 3-Night Edition)

- 🌙 **Alur Cerita 3 Malam Berkelanjutan:** Kisah tidak lagi terjadi dalam satu malam datar—setiap tetangga mendapat fokus malamnya sendiri dengan cuaca badai, kecepatan patroli, dan ketegangan yang meningkat dari **Malam 1 → Malam 2 → Malam 3**.
- 🛠️ **3 Mini-Game Reparasi Unik di Meja Kerja:**
  - *Malam 1 (Radio Bu Ratna):* **Kalibrasi Frekuensi 88.4 MHz** dengan osiloskop live & audio statik-ke-keroncong real-time.
  - *Malam 2 (Senter Mas Damar):* **Sambung Sirkuit PCB & Baut Pengait Baja** (cocokkan terminal kutub + ground + driver LED).
  - *Malam 3 (Lentera Sora):* **Rakit Terarium Sensor Hujan 3 Langkah** (susun lapisan batu/arang/lumut → jaga kelembapan `65%–80%` → pasang sensor getar piezoelektrik).
- 🙈 **Mode Mengendap & Cover Spot di Lorong:** Tekan `[S]` / `[Shift]` atau tombol **`🙈`** untuk merunduk memperlambat langkah di lorong dan bersembunyi di **Pot Tanaman Sudut** atau **Ceruk Bayangan Tangga** saat tetangga melintas.
- 💌 **Sistem "Balasan Sunyi" & Tirai Kamar 304:** Setiap selesai membantu tetangga, sepucuk surat dan bingkisan kecil muncul di depan pintu 304. Mengambilnya menambahkan benda kenangan ke kamar dan menyibak tirai jendela sedikit demi sedikit.
- 🌅 **Cutscene Visual & Epilog Fajar (True Ending):** Ketiga ending memiliki animasi cutscene canvas tersendiri. Pada **Ending Sejati**, saksikan badai mereda menjadi langit keemasan pagi bersama Sora, lalu lanjutkan menjelajahi **Kamar 304 di suasana fajar**.
- 🎧 **Audio Spasial 3D & Keroncong Proximity:** Langkah kaki NPC lorong menggunakan panning stereo kanan/kiri sesuai posisi relatifmu; setelah radio 301 diperbaiki, melodi keroncong lembut terdengar saat mendekati pintu Bu Ratna.
- 💾 **Auto-Save & Galeri Akhir:** Progres malam dan koleksi ending (`0/3` → `3/3`) otomatis tersimpan di `localStorage` perangkat.

---

## 📖 Sinopsis & Jadwal 3 Malam

Kamu adalah **Raka**, penghuni **Kamar 304 di Rusunawa Asoka**. Melalui celah ventilasi kamar, Raka mendengar suara kesulitan para tetangga, memperbaiki barang rusak mereka secara diam-diam, lalu meletakkannya di depan pintu masing-masing sebelum fajar:

| Malam | Karakter & Kamar | Mini-Game Reparasi | Balasan Sunyi (Hadiah di Pintu 304) |
|---|---|---|---|
| **Malam 1** *(22:15 WIB)* | **Bu Ratna** — Kamar 301 | 📻 Kalibrasi Gelombang Radio `88.4 MHz` | 🍡 Sepiring Kue Putu Hangat & Surat |
| **Malam 2** *(23:40 WIB)* | **Mas Damar** — Kamar 302 | 🔦 Sambung Jalur PCB Senter & Baut Pengait | ☕ Termos Kecil Kopi Jahe & Memo |
| **Malam 3** *(01:15 WIB)* | **Sora** — Kamar 305 | 🫙 Rakit Terarium Lentera Sensor Hujan | 🎨 Sketsa Payung Cat Air & Teh Chamomile |

---

## 🌧️ Babak Penentuan di Atap & 3 Akhir (*Endings*)

Di puncak badai Malam Ketiga, pintu **Tangga Atap** terbuka. Sora—yang kehilangan pendengarannya akibat saraf sehingga tak dapat mendengar seruan maupun langkah kaki di tengah badai—berdiri terisolasi di tepi atap sambil memeluk lentera sensor hujan. Hanya cahaya dan kehadiran nyata yang bisa menjangkaunya:

1. **Akhir A — Penjaga di Balik Bayangan *(Avoidant Ending)*:**
   Memberi sinyal cahaya ke lantai bawah agar Mas Damar naik menjemput Sora, lalu mundur ke balik bayangan. Semua selamat, namun tirai Kamar 304 tetap tertutup.
2. **Akhir B — Jembatan Cahaya Lumut *(Silent Empathy Ending • Syarat: Mental ≥ 30)*:**
   Menyusun barisan toples lentera berpendar hijau di atas beton basah untuk menuntun perhatian visual Sora menjauh dari tepian atap.
3. **Akhir Sejati — Kaca yang Sedikit Terbuka *(Bittersweet Dawn • True Ending)*:**
   Melangkah mendekati Sora di tengah rasa cemas terbesarmu, membuka payung, dan duduk menemaninya dalam diam hingga fajar keemasan menyingsing. Membuka mode bebas **Epilog Pagi Kamar 304**.

---

## 🎮 Mekanika & Kontrol

### Mekanika Bertahan
- **💚 Ketahanan Mental:** Pulihkan dengan **Masak Sup Hangat** (maksimal **2× per malam**, aduk 3× untuk `+30 Mental` & pulihkan batas maksimum mental) dan **Rawat Terarium Lumut** (`+20 Mental`, *cooldown* 22 detik).
- **⚡ Cemas Sosial & Mengendap:** Meningkat di lorong rusun. Gunakan **Spot Sembunyi** sambil menekan mode mengendap untuk menahan lonjakan cemas saat tetangga lewat, atau gunakan **🌬️ Tarik Napas (`[SPASI]`)** untuk meredakan `-35% Cemas` dengan imbalan `-20 Mental`.
- **🔄 Sensory Overload Safety Net:** Jika cemas menyentuh `100%`, Raka mundur aman ke Kamar 304 tanpa *game over* keras (batas maksimal mental sedikit berkurang hingga dipulihkan sup hangat).

### Kontrol Permainan
- **Desktop / Keyboard:**
  - `[A]` / `[D]` atau `[←]` / `[→]`: Berjalan
  - `[E]` / `[Enter]`: Interaksi hotspot / pintu
  - `[S]` atau `[Shift]`: Toggle **Mode Mengendap (Sembunyi)**
  - `[Spasi]`: **Tarik Napas Tenang**
  - **Klik Kiri Mouse:** *Click-to-move* atau interaksi langsung objek
- **Smartphone (Portrait & Landscape):**
  - Layar otomatis menyesuaikan HUD ringkas dan **Smart Mobile Camera** mengikuti posisi Raka di layar HP.
  - Gunakan tombol virtual **`◀`**, **`🙈`** *(saat di lorong)*, **`🌬️`**, **`AKSI`**, **`▶`** atau sentuh langsung area tujuan di layar.

---

## 📲 Cara Install ke Android (APK & PWA Offline)

### Opsi 1: Download & Install Langsung File `.APK` Android
1. Unduh **`Terarium-di-Ujung-Lorong.apk`** langsung dari [**GitHub Releases (Latest)**](https://github.com/Ryn-debugging/terarium-di-ujung-sana/releases/download/latest/Terarium-di-Ujung-Lorong.apk) *(atau tab **Actions** → workflow `Build Android APK`)*.
2. Buka file `.apk` di HP Android kamu dan izinkan *Install from unknown sources / Sumber tidak dikenal* jika diminta.
3. Game langsung terpasang dengan ikon terarium di laci aplikasi dan berjalan **100% offline**.

### Opsi 2: Install Langsung via Browser HP (PWA Full-Screen Offline)
1. Buka **[https://ryn-debugging.github.io/terarium-di-ujung-sana/](https://ryn-debugging.github.io/terarium-di-ujung-sana/)** di Chrome (Android) atau Safari (iOS).
2. Ketuk **`📲 Install / APK`** di layar judul, atau pilih **"Tambahkan ke Layar Utama / Install App"** pada menu browser.
3. Service Worker otomatis meng-cache seluruh aset agar bisa dimainkan kapan saja tanpa internet.

---

## 🛠️ Struktur Proyek & Build Lokal

Sumber kode dikembangkan secara modular di `src/` dan dikompilasi oleh [`scripts/build.mjs`](scripts/build.mjs) menjadi dua file tunggal portabel (`index.html` untuk web/PWA & `terarium_di_ujung_lorong.html` untuk dibuka offline `file://`) sekaligus menyalin aset ke `www/` untuk Capacitor Android:

```text
├── src/
│   ├── template.html      # Struktur DOM & UI HUD desktop/mobile
│   ├── styles.css         # Desain gelap atmosferik & responsif (0 CDN)
│   ├── story.js           # Data 3 Malam, Hotspot, Cover Spot, & 3 Ending
│   ├── audio.js           # Web Audio Engine (hujan, piano, keroncong, stereo panning)
│   ├── minigames.js       # Radio 88.4 MHz, Sirkuit Senter PCB, Lentera Sensor Hujan
│   ├── renderer.js        # Canvas 2D renderer, animasi jalan, tirai dinamis, cutscenes
│   └── main.js            # Loop delta-time, auto-save, stealth, progres malam
├── scripts/
│   ├── build.mjs          # Bundler sumber modular -> HTML tunggal & www/
│   └── prepare-android-icons.py
├── icons/                 # Ikon SVG, PNG 192/512, dan Maskable icon PWA
├── .github/workflows/
│   └── build-android-apk.yml  # CI otomatis build Android APK via Capacitor 6 & Gradle
├── manifest.webmanifest
├── sw.js                  # Service Worker (Network-first HTML, Cache-first aset)
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
