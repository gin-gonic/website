---
title: "여러 파일"
draft: false
---

자세한 내용은 [예제 코드](https://github.com/gin-gonic/examples/tree/master/upload-file/multiple)를 확인하세요.

```go
func main() {
	router := gin.Default()
	// 멀티파트 폼에 대한 최저 메모리 설정 (기본값 32 MiB)
	router.MaxMultipartMemory = 8 << 20  // 8 MiB
	router.POST("/upload", func(c *gin.Context) {
		// 멀티파트 폼
		form, _ := c.MultipartForm()
		files := form.File["upload[]"]

		for _, file := range files {
			log.Println(file.Filename)

			// 특정 경로(dst)에 파일을 업로드 합니다.
			c.SaveUploadedFile(file, dst)
		}
		c.String(http.StatusOK, fmt.Sprintf("%d files uploaded!", len(files)))
	})
	router.Run(":8080")
}
```

`curl` 사용방법:

```sh
curl -X POST http://localhost:8080/upload \
  -F "upload[]=@/Users/appleboy/test1.zip" \
  -F "upload[]=@/Users/appleboy/test2.zip" \
  -H "Content-Type: multipart/form-data"
```
