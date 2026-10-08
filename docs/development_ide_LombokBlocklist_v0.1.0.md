# Pengembangan LombokBlocklist

## 1. Roadmap

- 0.1.1: CI, coverage, fuzz, publish npm/PyPI
- 0.2.0: port Rust (no_std+alloc), Go, PHP; benchmark jutaan aturan
- 0.3.0: konversi IDN ke punycode opsional; format aturan tambahan

## 2. Deferred scope

Regex, pola URL penuh, opsi adblock ($...), IDN-ke-punycode, dan pembaruan daftar lewat jaringan bukan bagian library ini.

## 3. Prinsip desain untuk kontributor

- Kontrak dulu: ubah SPEC dan vector sebelum kode; perbedaan antar-port adalah bug.
- Tanpa dependensi runtime; tanpa jam, tanpa jaringan, tanpa acak tersembunyi.
- Setiap fitur README memiliki kasus vector atau test.
- Tidak ada nama klien atau aplikasi pemilik di berkas publik.
- Tanpa emoji di `*.md`.

## 4. Cara berkontribusi

Fork, cabang `feat/...`, jalankan kedua runner vector, perbarui `API_` dan `SPEC_` bila perilaku berubah, buka PR. Bangkitkan ulang vector dengan `node scripts/gen_vectors.ts` hanya bila kontrak berubah, dan tinjau diff vector.

## 5. Pertanyaan terbuka

- Apakah format adblock perlu diperluas ke opsi $ yang aman?
- Struktur node: Map atau array terurut untuk jejak memori terkecil?
