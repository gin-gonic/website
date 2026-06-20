---
title: "Menghindari logging query string"
sidebar:
  order: 5
---

Query string sering berisi informasi sensitif seperti token API, password, ID session, atau informasi identitas pribadi (PII). Mencatat nilai-nilai ini dapat menimbulkan risiko keamanan dan mungkin melanggar regulasi privasi seperti GDPR atau HIPAA. Dengan menghapus query string dari log Anda, Anda mengurangi peluang kebocoran data sensitif melalui file log, sistem pemantauan, atau alat pelaporan error.

Gunakan opsi `SkipQueryString` di `LoggerConfig` untuk mencegah query string muncul di log. Ketika diaktifkan, permintaan ke `/path?token=secret&user=alice` akan dicatat hanya sebagai `/path`.

```go
func main() {
  router := gin.New()

  // SkipQueryString indicates that the logger should not log the query string.
  // For example, /path?q=1 will be logged as /path
  loggerConfig := gin.LoggerConfig{SkipQueryString: true}

  router.Use(gin.LoggerWithConfig(loggerConfig))
  router.Use(gin.Recovery())

  router.GET("/search", func(c *gin.Context) {
    q := c.Query("q")
    c.String(200, "searching for: "+q)
  })

  router.Run(":8080")
}
```

Anda dapat menguji perbedaannya dengan `curl`:

```bash
curl "http://localhost:8080/search?q=gin&token=secret123"
```

Tanpa `SkipQueryString`, entri log mencakup query string lengkap:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search?q=gin&token=secret123"
```

Dengan `SkipQueryString: true`, query string dihapus:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search"
```

Ini sangat berguna dalam lingkungan yang sensitif terhadap kepatuhan di mana output log diteruskan ke layanan pihak ketiga atau disimpan jangka panjang. Aplikasi Anda masih memiliki akses penuh ke parameter query melalui `c.Query()` -- hanya output log yang terpengaruh.
