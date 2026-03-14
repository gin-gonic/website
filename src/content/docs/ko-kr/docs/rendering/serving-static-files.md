---
title: "정적 파일 서빙"
sidebar:
  order: 6
---

Gin은 정적 콘텐츠를 서빙하기 위한 세 가지 메서드를 제공합니다:

- **`router.Static(relativePath, root)`** -- 전체 디렉토리를 서빙합니다. `relativePath`로의 요청이 `root` 아래의 파일에 매핑됩니다. 예를 들어, `router.Static("/assets", "./assets")`는 `./assets/style.css`를 `/assets/style.css`에서 서빙합니다.
- **`router.StaticFS(relativePath, fs)`** -- `Static`과 유사하지만 `http.FileSystem` 인터페이스를 받아 파일 해석 방식을 더 세밀하게 제어할 수 있습니다. 임베드된 파일시스템에서 파일을 서빙하거나 디렉토리 목록 동작을 커스터마이즈하려는 경우 사용하세요.
- **`router.StaticFile(relativePath, filePath)`** -- 단일 파일을 서빙합니다. `/favicon.ico`나 `/robots.txt` 같은 엔드포인트에 유용합니다.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.Static("/assets", "./assets")
  router.StaticFS("/more_static", http.Dir("my_file_system"))
  router.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // 0.0.0.0:8080에서 수신 대기 및 서비스
  router.Run(":8080")
}
```

:::caution[보안: 경로 탐색]
`Static()` 또는 `http.Dir()`에 전달하는 디렉토리는 모든 클라이언트에게 완전히 접근 가능합니다. 설정 파일, `.env` 파일, 개인 키 또는 데이터베이스 파일과 같은 민감한 파일이 포함되어 있지 않은지 확인하세요.

모범 사례:

- 공개적으로 서빙하려는 파일만 포함하는 전용 디렉토리를 사용하세요.
- 전체 프로젝트나 파일시스템을 노출할 수 있는 `"."` 또는 `"/"`와 같은 경로를 전달하지 마세요.
- 더 세밀한 제어가 필요한 경우(예: 디렉토리 목록 비활성화), 커스텀 `http.FileSystem` 구현과 함께 `StaticFS`를 사용하세요. 표준 `http.Dir`은 기본적으로 디렉토리 목록을 활성화합니다.
:::
