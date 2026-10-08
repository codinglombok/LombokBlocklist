# Panduan Pemakaian LombokBlocklist

## 1. Instalasi

Setelah rilis: `npm install lombokblocklist` atau `pip install lombokblocklist`. Sebelum rilis, salin folder `typescript/src` atau `python/src/lombokblocklist` (tanpa dependensi).

## 2. Konsep dasar

Aturan berjenis exact, subtree, atau wildcard dimasukkan ke Blocklist; match(host) menormalkan host lalu menelusuri label dari kanan. Aturan allow selalu mengalahkan block. Daftar teks dibaca lewat parseList atau Blocklist.load dengan format hosts, domains, atau adblock.

## 3. Contoh

Berkas `examples/example.ts` dan `examples/example.py` menghasilkan keluaran berikut (TypeScript; Python sama kecuali format cetak):

```
ads.example.com block
x.tracker.example.net block
ok.tracker.example.net allow
example.org none
```

Kode TypeScript:

```ts
import { Blocklist } from "lombokblocklist";

const bl = new Blocklist();
bl.load("0.0.0.0 ads.example.com\n", "hosts");
bl.load("||tracker.example.net^\n@@||ok.tracker.example.net^\n", "adblock");
for (const h of ["ads.example.com", "x.tracker.example.net", "ok.tracker.example.net", "example.org"]) {
  console.log(h, bl.match(h).verdict);
}
```

## 4. Recipes

- Daftar izin pribadi: muat daftar blokir, lalu tambahkan aturan allow dengan add({action:'allow',kind:'subtree',domain:'...'}).
- Memeriksa mutu daftar: panggil parseList dan lihat skipped untuk mengetahui baris yang tidak didukung.
- Penyaring umum: normalizeHost(input) sebelum membandingkan nama host dengan sumber lain.

## 5. Common pitfalls

- Tidak ada regex (disengaja: waktu pencocokan terbatas).
- IDN tidak dikonversi; masukan harus punycode.
- Subset adblock sangat kecil.
- Port Rust, Go, PHP BELUM; hanya TypeScript dan Python.
- Struktur trie memakai Map per node; belum dioptimalkan untuk jutaan aturan (belum ada benchmark).

## 6. Lihat juga

`SPEC_LombokBlocklist_v0.1.0.md`, `API_LombokBlocklist_v0.1.0.md`, `full_summary_project_LombokBlocklist_v0.1.0.md`.
