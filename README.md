# LombokBlocklist

Universal domain-name rule matcher: exact, subtree and wildcard rules, allow-over-block precedence, and parsers for hosts, domain-list and adblock-style lists. Part of the Lombok Ecosystem.

## Mengapa library ini?

Siapa pun yang perlu mencocokkan nama host terhadap kumpulan aturan membutuhkan hal yang sama: normalisasi yang ketat, struktur pencarian yang cepat, dan aturan pengecualian yang pasti. Library ini menyediakannya tanpa dependensi, dengan hasil identik di setiap bahasa.

## Fitur

- Normalisasi nama host (ASCII, huruf kecil, batas panjang label dan total)
- Tiga jenis aturan: exact, subtree (domain dan seluruh subdomain), wildcard (hanya subdomain)
- Allow selalu mengalahkan block; aturan paling spesifik dikembalikan
- Parser format hosts, domain per baris, dan subset adblock (||domain^ dan @@||domain^)
- Pencarian O(jumlah label) pada trie label terbalik

## Skenario pemakaian

- Penyaring domain pada resolver, gateway, atau firewall DNS
- Penyaring URL/host pada klien HTTP atau crawler (daftar izin dan daftar tolak)
- Penyaring pengirim/domain email dan moderasi tautan pada formulir atau forum
- Firmware router atau perangkat IoT yang membatasi tujuan koneksi (jejak memori kecil, tanpa regex)

## Instalasi

Belum terbit di registry (0.1.0 belum dirilis). Setelah rilis:

```
npm install lombokblocklist
pip install lombokblocklist
```

## API ringkas

- `normalizeHost(input) -> string | null`
- `parseList(text, format) -> { rules, skipped }`
- `new Blocklist(): add(rule) -> added|duplicate|invalid; load(text, format); match(host) -> { verdict, rule }; size`

Rincian: `docs/API_LombokBlocklist_v0.1.0.md`.

## Status port

| Port | Status |
|---|---|
| TypeScript (referensi) | YA, lulus seluruh 135 kasus vector |
| Python | YA, lulus seluruh 135 kasus vector |
| Rust, Go, PHP | BELUM |

## Standar yang diimplementasikan

Kontrak normatif ada di `docs/SPEC_LombokBlocklist_v0.1.0.md`; vector di `vectors/lombokblocklist-vectors-v1.json`.

## Batasan yang diketahui

- Tidak ada regex (disengaja: waktu pencocokan terbatas).
- IDN tidak dikonversi; masukan harus punycode.
- Subset adblock sangat kecil.
- Port Rust, Go, PHP BELUM; hanya TypeScript dan Python.
- Struktur trie memakai Map per node; belum dioptimalkan untuk jutaan aturan (belum ada benchmark).

## Pengembangan

```
node --test typescript/test/          # TypeScript (Node 22+)
python -m pytest python/tests         # Python 3.10+
node scripts/gen_vectors.ts           # membangkitkan ulang vector dari referensi TypeScript
```

## Ekosistem Lombok

Part of the [Lombok Ecosystem](https://github.com/codinglombok).

## Lisensi

Apache-2.0 OR MIT (lihat `LICENSE-APACHE` dan `LICENSE-MIT`).
