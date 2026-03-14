---
title: "Subir archivos"
sidebar:
  label: "Subir archivos"
  order: 7
---

Gin facilita el manejo de subidas de archivos multipart. El framework proporciona métodos integrados en `gin.Context` para recibir archivos subidos:

- **`c.FormFile(name)`** -- Obtiene un solo archivo de la solicitud por el nombre del campo del formulario.
- **`c.MultipartForm()`** -- Analiza el formulario multipart completo, dando acceso a todos los archivos subidos y valores de campos.
- **`c.SaveUploadedFile(file, dst)`** -- Un método de conveniencia que guarda un archivo recibido en una ruta de destino en disco.

### Límite de memoria

Gin establece un límite de memoria predeterminado de **32 MiB** para el análisis de formularios multipart mediante `router.MaxMultipartMemory`. Los archivos dentro de este límite se almacenan en memoria; cualquier cosa que lo supere se escribe en archivos temporales en disco. Puedes ajustar este valor según las necesidades de tu aplicación:

```go
router := gin.Default()
// Lower the limit to 8 MiB
router.MaxMultipartMemory = 8 << 20 // 8 MiB
```

### Nota de seguridad

El nombre de archivo reportado por el cliente (`file.Filename`) **no debe** ser confiable. Siempre sanitiza o reemplázalo antes de usarlo en operaciones del sistema de archivos. Consulta la [documentación de Content-Disposition en MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives) para más detalles.

### Subpáginas

- [**Archivo individual**](./single-file/) -- Subir y guardar un solo archivo por solicitud.
- [**Múltiples archivos**](./multiple-file/) -- Subir y guardar múltiples archivos en una solicitud.
- [**Limitar tamaño de subida**](./limit-bytes/) -- Restringir el tamaño de subida usando `http.MaxBytesReader`.
