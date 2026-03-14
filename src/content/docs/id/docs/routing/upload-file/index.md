---
title: "Upload file"
sidebar:
  label: "Upload file"
  order: 7
---

Gin memudahkan penanganan upload file multipart. Framework ini menyediakan metode bawaan pada `gin.Context` untuk menerima file yang diupload:

- **`c.FormFile(name)`** -- Mengambil satu file dari permintaan berdasarkan nama field form.
- **`c.MultipartForm()`** -- Mem-parse seluruh form multipart, memberikan akses ke semua file yang diupload dan nilai field.
- **`c.SaveUploadedFile(file, dst)`** -- Metode praktis yang menyimpan file yang diterima ke path tujuan di disk.

### Batas memori

Gin menetapkan batas memori default sebesar **32 MiB** untuk parsing form multipart melalui `router.MaxMultipartMemory`. File dalam batas ini di-buffer di memori; yang melebihi batas ditulis ke file sementara di disk. Anda dapat menyesuaikan nilai ini sesuai kebutuhan aplikasi Anda:

```go
router := gin.Default()
// Lower the limit to 8 MiB
router.MaxMultipartMemory = 8 << 20 // 8 MiB
```

### Catatan keamanan

Nama file yang dilaporkan oleh klien (`file.Filename`) **tidak boleh** dipercaya begitu saja. Selalu sanitasi atau ganti sebelum menggunakannya dalam operasi sistem file. Lihat [dokumentasi Content-Disposition di MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives) untuk detail.

### Sub-halaman

- [**File tunggal**](./single-file/) -- Upload dan simpan satu file per permintaan.
- [**Banyak file**](./multiple-file/) -- Upload dan simpan banyak file dalam satu permintaan.
- [**Batasi ukuran upload**](./limit-bytes/) -- Batasi ukuran upload menggunakan `http.MaxBytesReader`.
