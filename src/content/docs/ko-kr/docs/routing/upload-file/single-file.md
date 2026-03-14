---
title: "단일 파일"
sidebar:
  order: 1
---

이슈 [#774](https://github.com/gin-gonic/gin/issues/774)를 참조하며, 자세한 [예제 코드](https://github.com/gin-gonic/examples/tree/master/upload-file/single)를 확인하세요.

`file.Filename`은 **신뢰해서는 안 됩니다**. [`Content-Disposition` MDN 문서](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives)와 [#1693](https://github.com/gin-gonic/gin/issues/1693)을 참조하세요.

> 파일 이름은 항상 선택 사항이며 애플리케이션에서 무분별하게 사용해서는 안 됩니다: 경로 정보를 제거하고 서버 파일 시스템 규칙에 맞게 변환해야 합니다.

```go
func main() {
  router := gin.Default()
  // multipart 폼의 메모리 제한을 낮게 설정 (기본값은 32 MiB)
  router.MaxMultipartMemory = 8 << 20  // 8 MiB
  router.POST("/upload", func(c *gin.Context) {
    // 단일 파일
    file, _ := c.FormFile("file")
    log.Println(file.Filename)

    // 특정 대상에 파일 업로드
    c.SaveUploadedFile(file, "./files/" + file.Filename)

    c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
  })
  router.Run(":8080")
}
```

`curl` 사용 방법:

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
