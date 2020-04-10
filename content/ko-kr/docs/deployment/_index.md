---
title: "배포"
draft: false
weight: 6
---

Gin 프로젝트는 모든 클라우드 제공 업체에 쉽게 배포 할 수 있습니다.

## [Render](https://render.com)

Render은 Go를 기본 지원하는 최신 클라우드 플랫폼으로, SSL관리, 데이터베이스, 무중단 배포, HTTP/2, websocket을 지원합니다.

Render의 [Gin프로젝트 배포 가이드](https://render.com/docs/deploy-go-gin)를 참조하세요.

## [Google App Engine](https://cloud.google.com/appengine/)

GAE에는 Go어플리케이션을 배포하는 두 가지 방법이 있습니다. 표준환경은 간단히 사용할 수 있으나, 사용자 정의가 어려우며 보안상의 이유로 [syscalls](https://github.com/gin-gonic/gin/issues/1639)를 사용할 수 없습니다. 가변형 환경은 모든 프레임워크와 라이브러리를 사용할 수 있습니다.

[Google App Engine의 Go](https://cloud.google.com/appengine/docs/go/)에서 자세히 알아보고 자신에게 알맞은 환경을 선택하세요.
