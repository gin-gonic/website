---
title: "Unggah file"
sidebar:
  label: "Unggah file"
  order: 7
---

Gin membuat penanganan unggahan file multipart menjadi sederhana. Framework ini menyediakan metode bawaan pada `gin.Context` untuk menerima file yang diunggah:

- **`c.FormFile(name)`** -- Mengambil satu file dari permintaan berdasarkan nama field form.
- **`c.MultipartForm()`** -- Melakukan parse seluruh form multipart, memberikan akses ke semua file yang diunggah dan nilai field.
- **`c.SaveUploadedFile(file, dst)`** -- Metode praktis untuk menyimpan file yang diterima ke path tujuan di disk.

### Batas memori

Gin menetapkan batas memori bawaan sebesar **32 MiB** untuk parsing form multipart melalui `router.MaxMultipartMemory`. File dalam batas ini disimpan sementara di memori; yang melebihi batas ditulis ke file sementara di disk. Anda dapat menyesuaikan nilai ini sesuai kebutuhan aplikasi Anda:

```go
router := gin.Default()
// Menurunkan batas menjadi 8 MiB
router.MaxMultipartMemory = 8 << 20 // 8 MiB
```

### Catatan keamanan

Nama file yang dilaporkan oleh klien (`file.Filename`) **tidak boleh** dipercaya begitu saja. Selalu sanitasi atau ganti sebelum menggunakannya dalam operasi sistem file. Lihat [dokumentasi Content-Disposition di MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives) untuk detail.

### Sub-halaman

- [**File tunggal**](./single-file/) -- Unggah dan simpan satu file per permintaan.
- [**Multipel file**](./multiple-file/) -- Unggah dan simpan multipel file dalam satu permintaan.
- [**Batasi ukuran unggahan**](./limit-bytes/) -- Batasi ukuran unggahan menggunakan `http.MaxBytesReader`.
