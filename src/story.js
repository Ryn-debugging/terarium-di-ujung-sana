/**************************************************************************
 * STORY, NIGHT PROGRESSION, HOTSPOTS & ENDINGS DATA (v3.0)
 **************************************************************************/
const NIGHT_DATA = {
    1: {
        number: 1,
        title: 'Malam Pertama: Rintik di Balik Kaca',
        timeLabel: '22:15 WIB',
        rainIntensity: 0.45,
        thunderChance: 0,
        npcSpeed: 56, // pixels per second
        npcFlipChance: 0.08,
        neighborKey: 'ratna',
        roomNum: '301',
        neighborName: 'Bu Ratna',
        inventoryKey: 'brokenRadio',
        craftedKey: 'itemRatna',
        itemTitle: 'Radio Keroncong Tua & Gantungan Lonceng',
        trashX: 460,
        trashShortTitle: 'Kotak Rongsokan',
        trashLabel: 'Periksa Kotak Rongsokan Tengah Lorong',
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
        thunderChance: 0.14,
        npcSpeed: 78,
        npcFlipChance: 0.24,
        neighborKey: 'damar',
        roomNum: '302',
        neighborName: 'Mas Damar',
        inventoryKey: 'brokenFlashlight',
        craftedKey: 'itemDamar',
        itemTitle: 'Senter Kurir Modifikasi & Pengait Baja',
        trashX: 830,
        trashShortTitle: 'Sudut Tangga',
        trashLabel: 'Ambil Senter Jatuh Dekat Tangga Kanan',
        trashTitle: 'Senter Tahan Air Korslet & Pengait Tas Patah',
        trashDesc: 'Senter kerja Damar yang terjatuh di dekat tangga darurat ujung kanan lorong beserta pengait tas kurir yang patah dua.',
        ventQuotes: [
            'Terdengar bunyi barang jatuh keras dan helaan napas lelah dari Kamar 302.',
            '"Sial, pengait tasnya patah dan senterku jatuh dekat tangga darurat... padahal masih ada paket obat ke ujung kota malam ini," bisik Damar cemas.'
        ],
        ventSummary: 'Mas Damar (Kamar 302), kurir shift malam, menjatuhkan senter dan pengait tasnya di ujung kanan lorong dekat tangga darurat.',
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
        npcSpeed: 94,
        npcFlipChance: 0.34,
        neighborKey: 'sora',
        roomNum: '305',
        neighborName: 'Sora',
        inventoryKey: 'tornSketchGlass',
        craftedKey: 'itemSora',
        itemTitle: 'Terarium Lentera Sensor Hujan',
        trashX: 210,
        trashShortTitle: 'Koridor Barat',
        trashLabel: 'Pungut Kaca & Sketsa di Antara 301–302',
        trashTitle: 'Toples Kaca Retak & Sketsa Langit Robek',
        trashDesc: 'Kepingan sketsa langit malam yang robek dan botol kaca kecil terbawa angin badai ke lorong barat—beserta sobekan catatan "Atap gedung...".',
        ventQuotes: [
            'Kamar 305 terlalu sunyi. Tidak ada suara televisi, tidak ada gumaman—hanya suara kertas dirobek pelan.',
            'Kau ingat catatan lama pengurus rusun: Sora, pelukis muda di 305, kehilangan pendengarannya akibat saraf. Di tengah badai sekeras ini, dunianya tetap bisu dan terisolasi.'
        ],
        ventSummary: 'Sora (Kamar 305) perlahan kehilangan pendengaran. Pungut serpihan botol di lorong barat (antara 301–302), lalu rakit lentera getar hujan agar ia bisa melihat ritme hujan.',
        deliveryReaction: 'Sora membuka pintu perlahan, memeluk Terarium Lentera yang berpendar hijau lembut. Tanpa mendengar bunyi sekitarmu, ia berjalan pelan menuju Tangga Atap...',
        replyTitle: 'Sketsa Payung & Teh Chamomile',
        replyIcon: '🎨',
        replyLetter: 'Lukisan kecil cat air di atas kertas tebal: dua siluet duduk tenang di bawah satu payung, diterangi sebotol lumut hijau di antara mereka.',
        replyNote: 'Pagi pertama dengan tirai terbuka separuh.',
        curtainTarget: 0.75
    }
};

const DOOR_REVISIT_DATA = {
    ratna: {
        2: 'Dari balik pintu 301 terdengar senandung pelan Bu Ratna mengikuti lagu keroncong lama. Lampu kamarnya tampak lebih hangat malam ini.',
        3: 'Bu Ratna tertidur pulas ditemani desis radio 88.4 MHz yang stabil meski badai menghantam kaca lorong.'
    },
    damar: {
        3: 'Tertempel secarik sticky note kecil di pintu 302: "Paket obat malam aman sentosa! Tetap sehat terus, penghuni 304."'
    }
};

const KEEPSAKE_REFLECTIONS = {
    ratna: {
        icon: '🍡',
        title: 'Piring Kue Putu Bu Ratna',
        dawnText: 'Piring keramik kecil itu kini bersih di sudut meja. Aku tak pernah menyangka kue sederhana bisa membuat ruangan sunyi ini terasa lebih hidup.'
    },
    damar: {
        icon: '☕',
        title: 'Termos Kopi Jahe Mas Damar',
        dawnText: 'Masih ada sisa aroma jahe hangat dari termos kecil ini. Kadang keberanian cukup berbentuk pesan singkat: "lorong ini tidak sedingin kemarin."'
    },
    sora: {
        icon: '🎨',
        title: 'Lukisan Payung Cat Air Sora',
        dawnText: 'Sora melukis kita berdua di bawah payung kuning—tanpa wajah yang jelas, cukup dua bahu yang tak lagi merasa sendirian di dunia.'
    }
};

const HOTSPOTS = {
    room304: [
        { id: 'kitchen', x: 150, shortTitle: 'Kompor Sup', label: 'Masak Sup Hangat (+30 Mental)' },
        { id: 'terrarium', x: 365, shortTitle: 'Terarium Lumut', label: 'Semprot & Rawat Lumut (+20 Mental)' },
        { id: 'workbench', x: 545, shortTitle: 'Meja Kerja', label: 'Perbaiki Barang di Meja Kerja' },
        { id: 'keepsakes', x: 635, shortTitle: 'Kenangan', label: 'Lihat Bingkisan Kenangan Tetangga' },
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
        epilogueHint: 'Jaga kesehatan mental (≥ 30 untuk Akhir B, atau ≥ 50 untuk Akhir Sejati) saat naik ke atap.'
    },
    lanterns: {
        id: 'lanterns',
        title: 'Akhir B: Jembatan Cahaya Lumut',
        badge: 'Silent Empathy Ending',
        summary: 'Kau menyusun barisan toples lentera lumut membentuk jalur hangat di atas beton basah. Karena Sora peka pada cahaya, ia menoleh melihat pendar hijau itu dan perlahan melangkah mundur menuju pintu. Ia tahu ada jiwa baik yang menjaganya dari balik kaca.',
        epilogueHint: 'Pertahankan Ketahanan Mental ≥ 50 agar cukup kuat membuka Akhir Sejati.'
    },
    threshold: {
        id: 'threshold',
        title: 'Akhir Sejati: Kaca yang Sedikit Terbuka',
        badge: 'Bittersweet Dawn • True Ending',
        summary: 'Melawan detak cemas di dadamu, kau membuka payung dan duduk tenang di samping Sora hingga badai reda dan fajar keemasan menyingsing. Tanpa satu kata pun terucap, ia mengerti kau hadir. Sejak pagi itu, tirai Kamar 304 terbuka separuh—dan sebuah sketsa kecil serta teh hangat menunggumu di depan pintu.',
        epilogueHint: 'Selamat! Kamu menemukan Akhir Sejati. Jelajahi Kamar 304 & periksa kenangan di pagi fajar!'
    }
};
