---
title: "Развёртывание"
sidebar:
  order: 10
---

Проекты на Gin легко развернуть на любом облачном провайдере.

## [Railway](https://www.railway.com)

Railway — это современная облачная платформа для развёртывания, управления и масштабирования приложений и сервисов. Она упрощает вашу инфраструктуру — от серверов до мониторинга — с помощью единой, масштабируемой и удобной платформы.

Следуйте [руководству Railway по развёртыванию проектов Gin](https://docs.railway.com/guides/gin).

## [Seenode](https://seenode.com)

Seenode — это современная облачная платформа, разработанная специально для разработчиков, которые хотят быстро и эффективно развёртывать приложения. Она предлагает развёртывание на основе Git, автоматические SSL-сертификаты, встроенные базы данных и удобный интерфейс, который позволяет запустить ваши приложения Gin за считанные минуты.

Следуйте [руководству Seenode по развёртыванию проектов Gin](https://seenode.com/docs/frameworks/go/gin).

## [Koyeb](https://www.koyeb.com)

Koyeb — это удобная для разработчиков бессерверная платформа для глобального развёртывания приложений с развёртыванием на основе Git, TLS-шифрованием, нативным автомасштабированием, глобальной пограничной сетью и встроенным service mesh и обнаружением сервисов.

Следуйте [руководству Koyeb по развёртыванию проектов Gin](https://www.koyeb.com/tutorials/deploy-go-gin-on-koyeb).

## [Qovery](https://www.qovery.com)

Qovery предоставляет бесплатный облачный хостинг с базами данных, SSL, глобальным CDN и автоматическим развёртыванием из Git.

Подробнее см. [Qovery](https://hub.qovery.com/guides/getting-started/deploy-your-first-application/).

## [Render](https://render.com)

Render — это современная облачная платформа с нативной поддержкой Go, полностью управляемым SSL, базами данных, развёртыванием без простоев, HTTP/2 и поддержкой WebSocket.

Следуйте [руководству Render по развёртыванию проектов Gin](https://render.com/docs/deploy-go-gin).

## [Google App Engine](https://cloud.google.com/appengine/)

GAE предлагает два способа развёртывания приложений Go. Стандартное окружение проще в использовании, но менее настраиваемо и запрещает [системные вызовы](https://github.com/gin-gonic/gin/issues/1639) по соображениям безопасности. Гибкое окружение может запускать любой фреймворк или библиотеку.

Узнайте больше и выберите предпочтительное окружение на странице [Go на Google App Engine](https://cloud.google.com/appengine/docs/go/).

## Самостоятельное размещение

Проекты на Gin также можно развернуть самостоятельно. Архитектура развёртывания и вопросы безопасности зависят от целевого окружения. В следующем разделе представлен лишь общий обзор параметров конфигурации, которые следует учитывать при планировании развёртывания.

## Параметры конфигурации

Развёртывание проектов Gin можно настроить с помощью переменных окружения или непосредственно в коде.

Для настройки Gin доступны следующие переменные окружения:

| Переменная окружения | Описание                                                                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT                 | TCP-порт для прослушивания при запуске сервера Gin с помощью `router.Run()` (т.е. без аргументов).                                                                                                      |
| GIN_MODE             | Установите значение `debug`, `release` или `test`. Управляет режимами Gin, например, когда выводить отладочные сообщения. Также можно установить в коде с помощью `gin.SetMode(gin.ReleaseMode)` или `gin.SetMode(gin.TestMode)` |

Следующий код можно использовать для настройки Gin.

```go
// Don't specify the bind address or port for Gin. Defaults to binding on all interfaces on port 8080.
// Can use the `PORT` environment variable to change the listen port when using `Run()` without any arguments.
router := gin.Default()
router.Run()

// Specify the bind address and port for Gin.
router := gin.Default()
router.Run("192.168.1.100:8080")

// Specify only the listen port. Will bind on all interfaces.
router := gin.Default()
router.Run(":8080")

// Set which IP addresses or CIDRs, are considered to be trusted for setting headers to document real client IP addresses.
// See the documentation for additional details.
router := gin.Default()
router.SetTrustedProxies([]string{"192.168.1.2"})
```

Информацию о настройке доверенных прокси см. в разделе [Доверенные прокси](/ru/docs/server-config/trusted-proxies/).
