/**************************************************************************
 * STORY, NIGHT PROGRESSION, HOTSPOTS & ENDINGS DATA
 **************************************************************************/
const NIGHT_DATA = {
    1: {
        number: 1,
        title: 'Malam Pertama: Rintik di Balik Kaca',
        timeLabel: '22:15 WIB',
        rainIntensity: 0.45,
        thunderChance: 0,
        npcSpeed: 54, // pixels per second
        npcFlipChance: 0.08,
        neighborKey: 'ratna',
        roomNum: '301',
        neighborName: 'Bu Ratna',
        inventoryKey: 'brokenRadio',
        craftedKey: 'itemRatna',
        itemTitle: 'Radio Keroncong Tua & Gantungan Lonceng',
        trashTitle: 'Radio Tabung Berkarat & Gantungan Kunci Patah',
        trashDesc: 'Radio lama milik almarhum Pak Hadi yang kabel speakernya putus beserta gantungan lonceng kamar 301.',
        ventQuotes: [
            'Dari celah ventilasi, terdengar bunyi kenop radio diputar berkali-kali... lalu hening.',
            '"Mas Hadi... kok lagunya nggak mau keluar malam ini..." gumam Bu Ratna lirih sambil mencari kunci cadangan yang terselip.'
        ],
        ventSummary: 'Bu Ratna (Kamar 301) merindukan alunan radio keroncong peninggalan mendiang suaminya dan sering lupa tempat menaruh kunci.',
        deliveryReaction: 'Pintu 301 terbuka sesaat setelah kau menjauh. Alunan keroncong samar mulai mengalun hangat dari balik pintu.',
        replyTitle: 'Piring Kue Putu Hangat & Surat Bu Ratna',
        replyIcon: '🍡',
        replyLetter: '"Terima kasih, Nak yang di 304. Malam ini suara keroncongnya kembali hidup. Ibu taruh kue putu hangat di depan pintu, ya. Jangan lupa makan."',
        replyNote: 'Balasan pertama di depan pintu 304. Tirai jendela kamarmu kau sibak sedikit.',
        curtainTarget: 0.25
    },
    2: {
        number: 2,
        title: 'Malam Kedua: Badai dan Lampu Padam',
        timeLabel: '23:40 WIB',
        rainIntensity: 0.85,
        thunderChance: 0.12,
        npcSpeed: 74,
        npcFlipChance: 0.22,
        neighborKey: 'damar',
        roomNum: '302',
        neighborName: 'Mas Damar',
        inventoryKey: 'brokenFlashlight',
        craftedKey: 'itemDamar',
        itemTitle: 'Senter Kurir Modifikasi & Pengait Baja',
        trashTitle: 'Senter Tahan Air Korslet & Pengait Tas Patah',
        trashDesc: 'Senter kerja Damar yang kemasukan air hujan beserta pengait tali tas kurir yang patah dua.',
        ventQuotes: [
            'Terdengar bunyi barang jatuh keras dan helaan napas lelah dari Kamar 302.',
            '"Sial, pengait tasnya patah, senternya juga mati... padahal masih ada paket obat ke ujung kota malam ini," bisik Damar cemas.'
        ],
        ventSummary: 'Mas Damar (Kamar 302), kurir shift malam, kehabisan senter dan pengait tas di tengah hujan deras saat harus mengantar obat.',
        deliveryReaction: 'Damar langsung menyalakan senter modifikasi itu di depan pintu. "Gila, terang banget! Siapa pun di lantai ini, makasih banget ya!" serunya lega.',
        replyTitle: 'Termos Kecil Kopi Jahe & Memo Damar',
        replyIcon: '☕',
        replyLetter: '"Buat lo penghuni 304 — gua nggak tahu lo siapa, tapi kopi jahe ini bikin badan hangat. Semangat terus ya, bro. Lorong ini rasanya nggak sedingin kemarin."',
        replyNote: 'Kopi jahe hangat di keset pintu 304. Kau menarik tirai lebih lebar dari sebelumnya.',
        curtainTarget: 0.55
    },
    3: {
        number: 3,
        title: 'Malam Ketiga: Terarium untuk Langit yang Bisu',
        timeLabel: '01:15 WIB',
        rainIntensity: 1.0,
        thunderChance: 0.35,
        npcSpeed: 90,
        npcFlipChance: 0.32,
        neighborKey: 'sora',
        roomNum: '305',
        neighborName: 'Sora',
        inventoryKey: 'tornSketchGlass',
        craftedKey: 'itemSora',
        itemTitle: 'Terarium Lentera Sensor Hujan',
        trashTitle: 'Toples Kaca Retak & Sketsa Langit Robek',
        trashDesc: 'Kepingan sketsa langit malam yang robek dan botol kaca kecil di tempat sampah—beserta sobekan catatan "Atap gedung...".',
        ventQuotes: [
            'Kamar 305 terlalu sunyi. Tidak ada suara televisi, tidak ada gumaman—hanya suara kertas dirobek pelan.',
            'Kau ingat catatan lama pengurus rusun: Sora, pelukis muda di 305, kehilangan pendengarannya akibat saraf. Di tengah badai sekeras ini, dunianya tetap bisu dan terisolasi.'
        ],
        ventSummary: 'Sora (Kamar 305) perlahan kehilangan pendengaran. Ia merasa terputus dari hujan yang biasa ia lukis—buatkan lentera lumut yang berkedip oleh getaran hujan agar ia bisa melihat ritme hujan.',
        deliveryReaction: 'Sora membuka pintu perlahan, memeluk Terarium Lentera yang berpendar hijau lembut. Tanpa mendengar bunyi sekitarmu, ia berjalan pelan menuju Tangga Atap...',
        replyTitle: 'Sketsa Payung & Teh Chamomile',
        replyIcon: '🎨',
        replyLetter: 'Lukisan kecil cat air di atas kertas tebal: dua siluet duduk tenang di bawah satu payung, diterangi sebotol lumut hijau di antara mereka.',
        replyNote: 'Pagi pertama dengan tirai terbuka separuh.',
        curtainTarget: 0.75
    }
};

const HOTSPOTS = {
    room304: [
        { id: 'kitchen', x: 150, shortTitle: 'Kompor Sup', label: 'Masak Sup Hangat (+30 Mental)' },
        { id: 'terrarium', x: 365, shortTitle: 'Terarium Lumut', label: 'Semprot & Rawat Lumut (+20 Mental)' },
        { id: 'workbench', x: 565, shortTitle: 'Meja Kerja', label: 'Perbaiki Barang di Meja Kerja' },
        { id: 'vent_window', x: 745, shortTitle: 'Ventilasi', label: 'Dengarkan Kabar dari Ventilasi' },
        { id: 'door_gift', x: 835, shortTitle: 'Bingkisan Pintu', label: 'Ambil Balasan Sunyi di Depan Pintu!' },
        { id: 'door_out', x: 915, shortTitle: 'Pintu Lorong', label: 'Keluar ke Lorong Lantai 3' }
    ],
    hallway: [
        { id: 'door_301', x: 120, shortTitle: 'Kamar 301', label: 'Pintu 301 — Bu Ratna' },
        { id: 'door_302', x: 300, shortTitle: 'Kamar 302', label: 'Pintu 302 — Mas Damar' },
        { id: 'trash_bin', x: 460, shortTitle: 'Kotak Rongsokan', label: 'Periksa Barang Rusak di Lorong' },
        { id: 'door_304_in', x: 600, shortTitle: 'Kamar 304', label: 'Masuk Kembali ke Kamar 304' },
        { id: 'door_305', x: 770, shortTitle: 'Kamar 305', label: 'Pintu 305 — Sora' },
        { id: 'stairs_roof', x: 915, shortTitle: 'Tangga Atap', label: 'Naik Tangga ke Atap Gedung' }
    ],
    rooftop: [
        { id: 'roof_door_back', x: 130, shortTitle: 'Pintu Turun', label: 'Turun Kembali ke Lorong' },
        { id: 'sora_climax', x: 740, shortTitle: 'Sora', label: 'Hampiri Sora di Tepi Atap' }
    ]
};

const COVER_SPOTS = [
    { id: 'plant_cover', x: 382, label: 'Pot Tanaman Sudut' },
    { id: 'alcove_cover', x: 688, label: 'Ceruk Bayangan Tangga' }
];

const ENDINGS_DATA = {
    avoidant: {
        id: 'avoidant',
        title: 'Akhir A: Penjaga di Balik Bayangan',
        badge: 'Avoidant Ending',
        summary: 'Kau memberi isyarat cahaya ke lantai bawah agar Mas Damar naik menjemput Sora, lalu mundur sebelum siapa pun melihatmu. Semua tetangga selamat malam ini—namun tirai Kamar 304 kembali tertutup rapat.',
        epilogueHint: 'Coba lagi di atap dengan Mental ≥ 30 atau beranikan diri melangkah untuk membuka akhir lain.'
    },
    lanterns: {
        id: 'lanterns',
        title: 'Akhir B: Jembatan Cahaya Lumut',
        badge: 'Silent Empathy Ending',
        summary: 'Kau menyusun barisan toples lentera lumut membentuk jalur hangat di atas beton basah. Karena Sora peka pada cahaya, ia menoleh melihat pendar hijau itu dan perlahan melangkah mundur menuju pintu. Ia tahu ada jiwa baik yang menjaganya dari balik kaca.',
        epilogueHint: 'Satu langkah keberanian lagi bisa membuka Akhir Sejati.'
    },
    threshold: {
        id: 'threshold',
        title: 'Akhir Sejati: Kaca yang Sedikit Terbuka',
        badge: 'Bittersweet Dawn • True Ending',
        summary: 'Melawan detak cemas di dadamu, kau membuka payung dan duduk tenang di samping Sora hingga badai reda dan fajar keemasan menyingsing. Tanpa satu kata pun terucap, ia mengerti kau hadir. Sejak pagi itu, tirai Kamar 304 terbuka separuh—dan sebuah sketsa kecil serta teh hangat menunggumu di depan pintu.',
        epilogueHint: 'Selamat! Kamu menemukan Akhir Sejati. Jelajahi Kamar 304 dalam suasana fajar pagi!'
    }
};
