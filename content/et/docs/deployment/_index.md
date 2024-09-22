---
title: "Kasutuselevõtt"
draft: false
weight: 6
---

Gin projekte saab hõlpsasti kasutusele võtta mis tahes pilveteenuse pakkujaga.

## [Koyeb](https://www.koyeb.com)

Koyeb on arendajasõbralik serverita platvorm rakenduste ülemaailmseks kasutusele võtuks koos git-põhise arenduse, TLS-krüptimise, kohaliku automaatse skaleerimise, sisseehitatud teenindusvõrgu ja avastamisega.

Jälgi Koyeb [guide to deploy your Gin projects](https://www.koyeb.com/tutorials/deploy-go-gin-on-koyeb).

## [Qovery](https://www.qovery.com)

Qovery pakub tasuta pilvemajutust koos andmebaaside, SSL-i, globaalse CDN-i ja automaatset kasutusele võttu Gitiga.

Jälgi Qovery juhendit [deploy your Gin project](https://docs.qovery.com/guides/tutorial/deploy-gin-with-postgresql/).

## [Render](https://render.com)

Render on kaasaegne pilveplatvorm, mis pakub Go loomulikku tuge, täielikult hallatud SSL-i, andmebaase, seisakuta kasutusele võtte, HTTP/2 ja websocket tuge.

Jälgi Render [guide to deploying Gin projects](https://render.com/docs/deploy-go-gin).

## [Google App Engine](https://cloud.google.com/appengine/)

GAE on kaks võimalust kuidas Go rakendusi kasutusele võtta. Standard keskkonda on lihtsam kasutada, kuid see on vähem kohandatav ja takistab [syscalls](https://github.com/gin-gonic/gin/issues/1639) turvalisuse kaalutlustel. Paindlik keskkond võib käivitada mis tahes raamistikku või teeki.

Vaadake lisateavet ja valige oma eelistatud keskkond aadressil [Go on Google App Engine](https://cloud.google.com/appengine/docs/go/).
