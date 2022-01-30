---
title: "Deploy etme"
draft: false
weight: 6
---

Gin projeleri herhangi bir bulut sağlayıcısına kolayca deploy edilebilir.

## [Koyeb](https://www.koyeb.com)

Koyeb, git tabanlı, TLS şifreleme, yerel otomatik ölçeklendirme, küresel uç ağ ve yerleşik hizmet ağı ve keşfi ile uygulamaları küresel olarak dağıtmak/deploy etmek için geliştirici dostu sunucusuz bir platformdur.

Koyeb'i takip edin [guide to deploy your Gin projects](https://www.koyeb.com/tutorials/deploy-go-gin-on-koyeb).

## [Qovery](https://www.qovery.com)

Qovery; veri tabanı, SSL'i, küresel CDN'i olan ve Git ile otomatik deploy için ücretsiz bulut ortamı sağlar.

[Gin projenizi deploy etmek](https://docs.qovery.com/guides/tutorial/deploy-gin-with-postgresql/) için Qovery kılavuzunu izleyin.

## [Render](https://render.com)

Render; Go, tam yönetilebilen SSL, veritabanları, sıfır kesintili deploy, HTTP/2 ve websocket desteği için yerel destek sunan modern bir bulut platformudur.

Render'ı takip edin [Gin projelerini dağıtma kılavuzu.](https://render.com/docs/deploy-go-gin).

## [Google App Engine](https://cloud.google.com/appengine/)

GAE, Go uygulamalarını dağıtmanın iki yönteme sahiptir. Standart ortamın kullanımı daha kolaydır ancak daha az özelleştirilebilir ve güvenlik nedenleriyle [syscalls](https://github.com/gin-gonic/gin/issues/1639) gibi sistem çağrılarını önler.

Daha fazla bilgi edinin ve tercih ettiğiniz ortamı şuradan seçin: [Go on Google App Engine](https://cloud.google.com/appengine/docs/go/).
