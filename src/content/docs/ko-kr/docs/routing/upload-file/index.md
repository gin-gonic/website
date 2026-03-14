---
title: "파일 업로드"
sidebar:
  order: 7
---

Gin은 multipart 파일 업로드를 간편하게 처리할 수 있도록 합니다. 프레임워크는 업로드된 파일을 수신하기 위한 `gin.Context`의 내장 메서드를 제공합니다:

- **`c.FormFile(name)`** -- 폼 필드 이름으로 요청에서 단일 파일을 가져옵니다.
- **`c.MultipartForm()`** -- 전체 multipart 폼을 파싱하여 업로드된 모든 파일과 필드 값에 접근할 수 있습니다.
- **`c.SaveUploadedFile(file, dst)`** -- 수신된 파일을 디스크의 대상 경로에 저장하는 편리한 메서드입니다.

### 메모리 제한

Gin은 `router.MaxMultipartMemory`를 통해 multipart 폼 파싱에 대한 기본 메모리 제한을 **32 MiB**로 설정합니다. 이 제한 내의 파일은 메모리에 버퍼링되고, 초과하는 것은 디스크의 임시 파일에 기록됩니다. 애플리케이션 요구 사항에 맞게 이 값을 조정할 수 있습니다:

```go
router := gin.Default()
// 제한을 8 MiB로 낮추기
router.MaxMultipartMemory = 8 << 20 // 8 MiB
```

### 보안 참고 사항

클라이언트가 보고하는 파일 이름(`file.Filename`)은 **신뢰해서는 안 됩니다**. 파일 시스템 작업에 사용하기 전에 항상 새니타이즈하거나 대체하세요. 자세한 내용은 [MDN의 Content-Disposition 문서](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives)를 참조하세요.

### 하위 페이지

- [**단일 파일**](./single-file/) -- 요청당 하나의 파일을 업로드하고 저장합니다.
- [**다중 파일**](./multiple-file/) -- 하나의 요청으로 여러 파일을 업로드하고 저장합니다.
- [**업로드 크기 제한**](./limit-bytes/) -- `http.MaxBytesReader`를 사용하여 업로드 크기를 제한합니다.
