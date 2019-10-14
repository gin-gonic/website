---
title: "배포"
draft: false
weight: 6
---

Gin 프로젝트는 모든 클라우드 제공 업체에 쉽게 배포 할 수 있습니다.

* **[Render](https://render.com)**
<p>
Render is a modern cloud platform that offers native support for Go, fully managed SSL, databases, zero-downtime deploys, HTTP/2, and websocket support.
</p>
<p>
Follow the Render [guide to deploying Gin projects](https://render.com/docs/deploy-go-gin).
</p>

* **[Google App Engine](https://cloud.google.com/appengine/)**
<p>
GAE has two ways to deploy Go applications. The standard environment is easier to use but less customizable and prevents [syscalls](https://github.com/gin-gonic/gin/issues/1639) for security reasons. The flexible environment can run any framework or library.
</p>
<p>
Learn more and pick your preferred environment at [Go on Google App Engine](https://cloud.google.com/appengine/docs/go/).
</p>
