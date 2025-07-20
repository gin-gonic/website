---
title: "多個檔案"
---

請參閱詳細的[範例程式碼](examples/upload-file/multiple)。

```go
import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	// 為 multipart 表單設定較低的記憶體限制 (預設為 32 MiB)
	router.MaxMultipartMemory = 8 << 20 // 8 MiB
	router.POST("/upload", func(c *gin.Context) {
		// Multipart 表單
		form, _ := c.MultipartForm()
		files := form.File["upload[]"]

		for _, file := range files {
			log.Println(file.Filename)

			// 將檔案上傳到指定目的地。
			c.SaveUploadedFile(file, "./files/"+file.Filename)
		}
		c.String(http.StatusOK, fmt.Sprintf("已上傳 %d 個檔案！", len(files)))
	})
	router.Run(":8080")
}
```

如何使用 `curl`：

```sh
curl -X POST http://localhost:8080/upload \
  -F "upload[]=@/Users/appleboy/test1.zip" \
  -F "upload[]=@/Users/appleboy/test2.zip" \
  -H "Content-Type: multipart/form-data"
```
