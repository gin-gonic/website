---
title: "단일 파일"
draft: false
---

이슈 [#774](https://github.com/gin-gonic/gin/issues/774) 혹은 자세한 [예제 코드](https://github.com/gin-gonic/examples/tree/master/upload-file/single)를 확인하세요.

`file.Filename`은 **신뢰할 수 없습니다.**. MDN의 [`Content-Disposition`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives)과 이슈 [#1693](https://github.com/gin-gonic/gin/issues/1693)를 참조하세요.

> 파일 이름은 항상 선택 사항이며 응용 프로그램에서 맹목적으로 사용해서는 안됩니다. 경로 정보를 제거하고 서버 파일 시스템 규칙으로 변환해야합니다.

```go
func main() {
	router := gin.Default()
	// 멀티파트 폼에 대한 최저 메모리 설정 (기본값 32 MiB)
	router.MaxMultipartMemory = 8 << 20  // 8 MiB
	router.POST("/upload", func(c *gin.Context) {
		// 단일 파일
		file, _ := c.FormFile("file")
		log.Println(file.Filename)

		// 특정 경로(dst)에 파일을 업로드 합니다.
		c.SaveUploadedFile(file, dst)

		c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
	})
	router.Run(":8080")
}
```

`curl` 사용방법:

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
