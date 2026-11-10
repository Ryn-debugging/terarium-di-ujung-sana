# 🌿 Terarium di Ujung Lorong

[![Play Online](https://img.shields.io/badge/▶_Mainkan_Online-GitHub_Pages-10b981?style=for-the-badge)](https://ryn-debugging.github.io/terarium-di-ujung-sana/)
[![License: CC-BY-NC](https://img.shields.io/badge/License-CC_BY--NC-amber?style=for-the-badge)](#-lisensi)

> *"Bantu tetanggamu dari balik kamar secara diam-diam tanpa harus bertatap muka."*

🎮 **Mainkan Langsung di Browser:** [https://ryn-debugging.github.io/terarium-di-ujung-sana/](https://ryn-debugging.github.io/terarium-di-ujung-sana/)

Sebuah **game drama psikologis indie (interactive narrative & 2D side-scrolling)** yang menceritakan tentang empati sunyi (*silent empathy*), isolasi diri, dan keberanian kecil untuk peduli di tengah dinginnya malam hujan.

Game ini sepenuhnya **self-contained dalam satu file HTML**, dibangun menggunakan **HTML5 Canvas 2D, Tailwind CSS, dan Procedural Web Audio API** tanpa dependensi backend atau asset audio eksternal.

---

## 📖 Sinopsis Cerita

Kamu bermain sebagai **Raka**, penghuni **Kamar 304 di Rusunawa Asoka (Lantai 3)**. Raka mengidap kecemasan sosial akut dan agorafobia, membuatnya sulit untuk berinteraksi langsung atau melangkahkan kaki keluar kamar.

Kamarnya adalah suaka kecilnya—tempat ia merawat terarium lumut dalam botol kaca dan memperbaiki barang-barang elektronik bekas. Di luar, suara hujan rintik-rintik dan desah angin malam menyelimuti lorong rusun yang redup. 

Melalui celah ventilasi dan jendela kamarnya, Raka kerap mendengar gema kesedihan dan kesulitan yang dialami para tetangga di lantainya:
- Seorang nenek yang kesepian dan kehilangan arah.
- Seorang kurir malam yang kelelahan menembus badai.
- Seorang siswi muda yang tertekan dan menangis dalam sunyi.

Meski tak sanggup menyapa langsung, Raka memilih untuk hadir bagi mereka melalui cara yang ia bisa: **memperbaiki barang-barang rusak mereka secara diam-diam dan mengantarkannya ke depan pintu mereka di keheningan malam.**

---

## 👥 Karakter & Tetangga Rusunawa Asoka

| Kamar | Karakter | Latar Kisah | Barang Kebutuhan | Hasil Reparasi |
|---|---|---|---|---|
| **304** | **Raka** *(Protagonis)* | Pemuda penyendiri perawat terarium yang berjuang melawan kecemasan sosial. | Sup hangat & Terarium | Suaka diri & tempat observasi |
| **301** | **Bu Ratna** | Nenek lansia yang kerap lupa kunci dan rindu mendalam mendengar lantunan lagu keroncong kenangan mendiang suaminya. | Komponen radio rusak | **Radio Keroncong Tua** |
| **302** | **Mas Damar** | Kurir paket malam yang bekerja lembur menembus hujan lebat dengan senter & motor tua yang kerap mati di jalan. | Senter rongsokan | **Senter Kurir Modifikasi** |
| **305** | **Sora** | Gadis muda yang memendam luka, hobi menggambar di balik jendela kamar namun merasa terasing dari dunia. | Pecahan kaca & sketsa | **Terarium Lentera Kecil** |

---

## 🎮 Mekanika Utama Permainan

### 1. 💚 Ketahanan Mental (*Mental Resilience*)
- Nilai awal: **85/100**.
- Berkurang saat kamu berada di luar kamar dan mengalami stres.
- **Cara Memulihkan:**
  - 🍲 **Masak Sup Hangat di Dapur:** Mengembalikan **+25 Mental** dan mengembalikan batas maksimal mental ke 100.
  - 🌿 **Rawat Terarium Lumut:** Mengembalikan **+20 Mental** dan mengurangi kecemasan.

### 2. ⚡ Cemas Sosial (*Sensory Load*)
- Meningkat saat melangkah keluar ke lorong lantai 3 atau berdekatan dengan NPC tetangga yang lewat.
- Jika cemas sosial tinggi, pandangan akan mengalami efek *vignette* kabur, layar bergetar, dan terdengar detak jantung (*heartbeat*) yang mencekam.
- 🧘 **Tarik Napas Tenang (Grounding 4-7-8):** Tekan **`[SPASI]`** atau tombol **Napas Tenang** untuk menstabilkan diri, meredakan cemas sosial, dan mengaktifkan aura pelindung mental sementara.

### 3. 🔍 Siklus Empati Sunyi (*Silent Empathy Loop*)
1. **Observasi Ventilasi (Kamar 304):** Dengarkan keluhan tetangga untuk membuka petunjuk kebutuhan mereka.
2. **Scavenge Rongsokan (Lorong Rusun):** Cari barang rusak di tempat sampah lorong lantai 3 saat kondisi sepi.
3. **Meja Kerja / Workbench (Kamar 304):** Rakit dan perbaiki komponen menjadi barang yang bermakna bagi tetangga.
4. **Antar Sunyi (Pintu 301, 302, 305):** Letakkan barang di depan pintu mereka tanpa interaksi tatap muka langsung.

---

## 🌧️ Babak Penentuan & 3 Cabang Akhir (*Endings*)

Setelah membantu ketiga tetangga (Bu Ratna, Damar, dan Sora), pintu tangga menuju atap rusunawa akan terbuka. Di bawah guyuran hujan lebat, kamu menemukan Sora berdiri terisak di dekat pembatas atap gedung. Keputusanmu menentukan akhir kisah:

```
                          [ ATAP RUSUNAWA ]
                                 │
     ┌───────────────────────────┼───────────────────────────┐
     │                           │                           │
[ PILIHAN A ]               [ PILIHAN B ]               [ PILIHAN C ]
Ketuk Pipa dari Kamar       Susun Jalur Lentera         Duduk Menemani dalam Diam
(Jarak Aman)                (Syarat: Mental ≥ 30)       (Ending Sejati)
     │                           │                           │
     ▼                           ▼                           ▼
Akhir A:                    Akhir B:                    Akhir Sejati:
"Penjaga di Balik           "Jembatan Cahaya Lumut"     "Kaca yang Sedikit Terbuka"
Bayangan"                   (Empati Tanpa Suara)        (Bittersweet Dawn)
```

1. **Akhir A — Penjaga di Balik Bayangan *(Avoidant Ending)*:**
   > Kamu memilih memanggil Damar dan mengetuk pipa dari kejauhan tanpa memperlihatkan diri. Sora berhasil diselamatkan dengan aman, namun tirai Kamar 304 tetap tertutup rapat bagi dunia luar.
2. **Akhir B — Jembatan Cahaya Lumut *(Silent Empathy Ending)*:**
   > Membutuhkan minimal **30 Mental**. Kamu menyusun lentera lumut yang berpendar hangat dari tangga menuju atap. Sora tersentuh melihat kehangatan itu dan melangkah mundur dari tepian. Ia tahu ada jiwa baik yang peduli padanya.
3. **Akhir Sejati — Kaca yang Sedikit Terbuka *(Bittersweet Dawn • True Ending)*:**
   > Melawan ketakutan terbesarmu, kamu melangkah mendekatinya dan duduk menemani Sora di bawah satu payung dalam diam hingga fajar menyingsing. Sejak hari itu, tirai Kamar 304 mulai terbuka separuh, dan tetangga-tetanggamu mulai meninggalkan secangkir teh hangat serta bingkisan di depan pintumu.

---

## ⌨️ Kontrol Permainan

### 🖥️ Komputer / Desktop
- **Gerak ke Kiri / Kanan:** Tombol `[A]` / `[D]` atau Panah `[←]` / `[→]`
- **Tarik Napas Tenang / Grounding:** Tombol `[SPASI]` *(Spacebar)*
- **Interaksi Objek / Pintu:** Tombol `[E]` atau `[ENTER]`
- **Navigasi Cepat:** Klik kiri mouse pada area lorong/kamar (*Click-to-Move*)

### 📱 Layar Sentuh / Smartphone
- Gunakan tombol virtual di bagian bawah layar:
  - Tombol **`◀ Kiri`** dan **`Kanan ▶`**
  - Tombol **`🌿 Napas Tenang`**
  - Tombol **`✨ Interaksi`**
- Atau sentuh langsung pada canvas untuk berpindah tempat secara otomatis.

---

## 🎧 Procedural Web Audio Engine

Game ini dilengkapi sistem audio generatif tanpa memerlukan file rekaman eksternal (`.mp3` / `.wav`):
- **Ambient Rain Soundscape:** Sintesis *white noise* yang diproses melalui *Biquad Lowpass Filter* real-time yang berubah akustik saat berada di dalam kamar, lorong tertutup, maupun atap terbuka.
- **Lo-Fi Generative Felt Piano:** Algoritma nada piano ambient pentatonik yang berbunyi secara prosedural menenangkan pikiran selama beban cemas rendah.
- **Procedural Heartbeat Oscillator:** Frekuensi rendah (*sine wave sub-bass*) yang otomatis berdegup ketika *Sensory Load* melonjak di atas batas aman.
- **Dynamic Sound Effects:** Efek interaksi air, pintu geser, reparasi logam, denting lonceng kaca, dan helaan napas.

---

## 🛠️ Arsitektur & Teknologi

- **HTML5 Canvas 2D:** Render grafis 2D real-time dengan efek lighting hangat, rintik hujan dinamis, kabut partikel uap lumut, dan kedipan lampu neon lorong.
- **Tailwind CSS (CDN):** Antarmuka HUD minimalis, dialog modal bersih, dan responsivitas layar untuk desktop maupun mobile.
- **Web Audio API:** Mesin suara prosedural murni tanpa latensi dan tanpa download aset eksternal.
- **Zero Build / Zero Setup:** Cukup buka file HTML di browser apa pun.

---

## 🚀 Cara Menjalankan

### Cara 1: Langsung di Browser
1. Clone repositori ini:
   ```bash
   git clone https://github.com/Ryn-debugging/terarium-di-ujung-sana.git
   ```
2. Buka file `index.html` (atau `terarium_di_ujung_lorong.html`) langsung di peramban favorit Anda (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).

### Cara 2: GitHub Pages
Aktifkan fitur **GitHub Pages** pada repositori ini (*Settings > Pages > Deploy from a branch > main / root*), dan game dapat langsung dimainkan secara online via URL GitHub Pages!

---

## 📄 Lisensi

Proyek ini dibuat untuk tujuan artistik, edukasi mengenai kesehatan mental (*mental health awareness*), dan eksplorasi narasi interaktif berbasis web. Bebas dipelajari, dimainkan, dan dibagikan.
