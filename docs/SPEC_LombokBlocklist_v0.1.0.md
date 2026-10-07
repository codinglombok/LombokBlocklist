# SPEC LombokBlocklist v0.1.0

This document is the normative cross-language contract. Every language port MUST produce byte-identical output for all specified inputs. Deviations from this specification are bugs.

Kata MUST, SHOULD, dan MAY dibaca sesuai RFC 2119. Tinjauan terakhir: 2026-10-07.

## 0. Standar acuan

Library ini mendefinisikan kontraknya sendiri; tidak ada standar eksternal normatif kecuali yang disebut pada bagian terkait.

## 1. Vector

| Berkas | Kasus | SHA-256 |
|---|---|---|
| `vectors/lombokblocklist-vectors-v1.json` | 135 | `1961ab12e12c83fd7baae37c9963e6593508f7f0b1029d6e417c3bf0466bb794` |

## 2. Kontrak

1. Host dinormalisasi: spasi/tab/CR/LF di tepi dibuang; hanya huruf A-Z dilipat ke a-z; satu titik akhir dibuang; panjang total 1..253; label 1..63 berisi [a-z0-9_-], tidak diawali/diakhiri tanda hubung. Selain itu tidak sah (invalid). Nama IDN harus sudah berbentuk punycode.
2. exact cocok hanya pada domain itu; subtree cocok pada domain dan semua subdomain; wildcard cocok hanya pada subdomain, tidak pada apeks.
3. Pada tiap sisi (allow, block) aturan yang cocok dengan label terbanyak dipilih; pada node yang sama: untuk apeks exact lebih dulu daripada subtree, untuk subdomain wildcard lebih dulu daripada subtree.
4. Bila ada aturan allow yang cocok, verdict allow; bila tidak dan ada block, verdict block; selain itu none. Host tidak sah menghasilkan invalid.
5. Format hosts: baris `IP host...`, komentar # dibuang, entri localhost/broadcasthost/ip6-* dan 0.0.0.0 diabaikan tanpa dihitung, aturan block exact. Format domains: satu domain per baris (subtree) atau `*.domain` (wildcard); komentar # dan !. Format adblock: hanya `||host^` dan `@@||host^` (subtree); baris lain bukan komentar dihitung skipped.
6. skipped menghitung token (hosts) atau baris (domains, adblock) yang tidak menghasilkan aturan dan bukan komentar/ignored.

## 3. Representasi lintas bahasa

Indeks dan panjang string dihitung per code point; angka floating point memakai IEEE 754 double dengan urutan operasi seperti tertulis; bilangan bulat besar tidak boleh kehilangan presisi.

## 4. Non-goals

Regex, pola URL penuh, opsi adblock ($...), IDN-ke-punycode, dan pembaruan daftar lewat jaringan bukan bagian library ini.

## 5. Riwayat perubahan kontrak

- 0.1.0: kontrak awal.
