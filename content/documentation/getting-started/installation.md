---
title: "Installation"
date: 2018-09-25T16:57:20+02:00
weight: 1
---

To install Gin package, you need to install Go and set your Go workspace first.

1. Download and install it:

	```sh
	go get -u github.com/gin-gonic/gin
	```

2. Import it in your code:

	```go
	import "github.com/gin-gonic/gin"
	```

3. (Optional) Import `net/http`. This is required for example if using constants such as `http.StatusOK`.

	```go
	import "net/http"
	```


4. Copy a starting template inside your project

	```sh
	curl https://raw.githubusercontent.com/gin-gonic/gin/master/examples/basic/main.go > main.go
	```

5. Run your project

	```sh
	go run main.go
	```
