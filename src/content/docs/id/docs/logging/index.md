---
title: "Logging"
sidebar:
  order: 7
---

Gin menyertakan middleware logger bawaan yang mencatat detail tentang setiap permintaan HTTP, termasuk kode status, metode HTTP, path, dan latensi.

Ketika Anda membuat router dengan `gin.Default()`, middleware logger secara otomatis terpasang bersama middleware recovery:

```go
// Logger and Recovery middleware are already attached
router := gin.Default()
```

Jika Anda memerlukan kontrol penuh atas middleware mana yang digunakan, buat router dengan `gin.New()` dan tambahkan logger secara manual:

```go
// No middleware attached
router := gin.New()

// Attach the logger middleware
router.Use(gin.Logger())
```

Logger default menulis ke `os.Stdout` dan menghasilkan output seperti ini untuk setiap permintaan:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     512.345µs |       127.0.0.1 | GET      "/ping"
```

Setiap entri mencakup timestamp, kode status HTTP, latensi permintaan, IP klien, metode HTTP, dan path yang diminta.

## Dalam bagian ini

- [**Menulis log ke file**](./write-log/) -- Mengarahkan output log ke file, ke konsol, atau keduanya secara bersamaan.
- [**Format log kustom**](./custom-log-format/) -- Mendefinisikan format log Anda sendiri menggunakan `LoggerWithFormatter`.
- [**Melewati logging**](./skip-logging/) -- Melewati logging untuk path atau kondisi tertentu.
- [**Mengontrol pewarnaan output log**](./controlling-log-output-coloring/) -- Mengaktifkan atau menonaktifkan output log berwarna.
- [**Menghindari logging query string**](./avoid-logging-query-strings/) -- Menghapus parameter query dari output log untuk keamanan dan privasi.
- [**Mendefinisikan format untuk log rute**](./define-format-for-the-log-of-routes/) -- Menyesuaikan cara rute yang terdaftar dicetak saat startup.
