---
title: "다중 파일"
sidebar:
  order: 2
---

자세한 [예제 코드](https://github.com/gin-gonic/examples/tree/master/upload-file/multiple)를 참조하세요.

```go
func main() {
  router := gin.Default()
  // multipart 폼의 메모리 제한을 낮게 설정 (기본값은 32 MiB)
  router.MaxMultipartMemory = 8 << 20  // 8 MiB
  router.POST("/upload", func(c *gin.Context) {
    // Multipart 폼
    form, _ := c.MultipartForm()
    files := form.File["files"]

    for _, file := range files {
      log.Println(file.Filename)

      // 특정 대상에 파일 업로드
      c.SaveUploadedFile(file, "./files/" + file.Filename)
    }
    c.String(http.StatusOK, fmt.Sprintf("%d files uploaded!", len(files)))
  })
  router.Run(":8080")
}
```

`curl` 사용 방법:

```sh
curl -X POST http://localhost:8080/upload \
  -F "files=@/Users/appleboy/test1.zip" \
  -F "files=@/Users/appleboy/test2.zip" \
  -H "Content-Type: multipart/form-data"
```
