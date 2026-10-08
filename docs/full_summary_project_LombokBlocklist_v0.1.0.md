# Ringkasan Proyek LombokBlocklist

## Apa ini

Universal domain-name rule matcher: exact, subtree and wildcard rules, allow-over-block precedence, and parsers for hosts, domain-list and adblock-style lists. Part of the Lombok Ecosystem.

## Mengapa dibuat

Siapa pun yang perlu mencocokkan nama host terhadap kumpulan aturan membutuhkan hal yang sama: normalisasi yang ketat, struktur pencarian yang cepat, dan aturan pengecualian yang pasti. Library ini menyediakannya tanpa dependensi, dengan hasil identik di setiap bahasa.

## Fitur utama

- Normalisasi nama host (ASCII, huruf kecil, batas panjang label dan total)
- Tiga jenis aturan: exact, subtree (domain dan seluruh subdomain), wildcard (hanya subdomain)
- Allow selalu mengalahkan block; aturan paling spesifik dikembalikan
- Parser format hosts, domain per baris, dan subset adblock (||domain^ dan @@||domain^)
- Pencarian O(jumlah label) pada trie label terbalik

## Status saat ini

Versi 0.1.0, belum dirilis. TypeScript dan Python lulus 135 kasus vector. Port lain belum ada.

## Contoh pemakai

- Penyaring domain pada resolver, gateway, atau firewall DNS
- Penyaring URL/host pada klien HTTP atau crawler (daftar izin dan daftar tolak)
- Penyaring pengirim/domain email dan moderasi tautan pada formulir atau forum
- Firmware router atau perangkat IoT yang membatasi tujuan koneksi (jejak memori kecil, tanpa regex)

## Batasan yang Diketahui

- Tidak ada regex (disengaja: waktu pencocokan terbatas).
- IDN tidak dikonversi; masukan harus punycode.
- Subset adblock sangat kecil.
- Port Rust, Go, PHP BELUM; hanya TypeScript dan Python.
- Struktur trie memakai Map per node; belum dioptimalkan untuk jutaan aturan (belum ada benchmark).

## Info lanjut

SPEC: `SPEC_LombokBlocklist_v0.1.0.md`; API: `API_LombokBlocklist_v0.1.0.md`; panduan: `guide_how_to_use_LombokBlocklist_v0.1.0.md`.

## Gap vs pembanding

Pembanding: pustaka daftar-blokir DNS bawaan produk penyaring populer, tldts/psl, aho-corasick. Gap jujur: library ini tidak menandingi kecepatan automata terkompresi; keunggulannya adalah kontrak lintas bahasa yang identik dan semantik allow/block yang terdokumentasi.
