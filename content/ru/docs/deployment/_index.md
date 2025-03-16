---
title: "Deployment"
draft: false
weight: 6
---

Проекты Gin могут быть легко развернуты на любом облачном провайдере.

## [Koyeb](https://www.koyeb.com)

Koyeb - это удобная для разработчиков бессерверная платформа для глобального развертывания приложений с развертыванием на основе git, шифрованием TLS, встроенным автомасштабированием, глобальной пограничной сетью и встроенным сервисом mesh & discovery.

Следуйте руководству Koyeb [Guide to deploy your Gin projects](https://www.koyeb.com/tutorials/deploy-go-gin-on-koyeb).

## [Qovery](https://www.qovery.com)

Qovery предоставляет бесплатный облачный хостинг с базами данных, SSL, глобальной CDN и автоматическим развертыванием с помощью Git.

Следуйте руководству Qovery, чтобы [развернуть свой проект Gin](https://docs.qovery.com/guides/tutorial/deploy-gin-with-postgresql/).

## [Render](https://render.com)

Render - это современная облачная платформа, которая предлагает встроенную поддержку Go, полностью управляемый SSL, базы данных, деплой с нулевым временем простоя, HTTP/2 и поддержку websocket.

Следуйте рекомендациям Render [руководство по развертыванию проектов Gin](https://render.com/docs/deploy-go-gin).

## [Google App Engine](https://cloud.google.com/appengine/)

В GAE есть два способа развертывания Go-приложений. Стандартная среда проще в использовании, но менее настраиваема и не допускает [syscalls](https://github.com/gin-gonic/gin/issues/1639) по соображениям безопасности. В гибком окружении можно запускать любые фреймворки и библиотеки.

Узнать больше и выбрать предпочтительную среду можно на сайте [Go on Google App Engine](https://cloud.google.com/appengine/docs/go/).
