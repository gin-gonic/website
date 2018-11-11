---
title: "Vendoring"
weight: 10
---

1. `go get` govendor

	```sh
	go get github.com/kardianos/govendor
	```
2. Create your project folder and `cd` inside

	```sh
	mkdir -p $GOPATH/src/github.com/myusername/project && cd "$_"
	```

3. Vendor init your project and add gin

	```sh
	govendor init
	```
	```sh
	govendor fetch github.com/gin-gonic/gin@v1.3
	```

4. Copy a starting template inside your project

	```sh
	curl https://raw.githubusercontent.com/gin-gonic/gin/master/examples/basic/main.go > main.go
	```

5. Run your project

	```sh
	go run main.go
	```
