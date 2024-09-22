---
title: "Proovige keha siduda erinevateks struktuurideks"
draft: false
---

Tavalised meetodid päringu keha sidumiseks kulutavad `c.Request.Body` ja neid
ei saa mitu korda kutsuda.

```go
type formA struct {
  Foo string `json:"foo" xml:"foo" binding:"required"`
}

type formB struct {
  Bar string `json:"bar" xml:"bar" binding:"required"`
}

func SomeHandler(c *gin.Context) {
  objA := formA{}
  objB := formB{}
  // See c.ShouldBind kasutab c.Request.Body ja seda ei saa taaskasutada.
  if errA := c.ShouldBind(&objA); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // Alati ilmeb viga, sest c.Request.Body on nüüd EOF.
  } else if errB := c.ShouldBind(&objB); errB == nil {
    c.String(http.StatusOK, `the body should be formB`)
  } else {
    ...
  }
}
```

Selleks võid kasutada `c.ShouldBindBodyWith`.

```go
func SomeHandler(c *gin.Context) {
  objA := formA{}
  objB := formB{}
  // See loeb c.Request.Body ja säilitab tulemuse konteksti.
  if errA := c.ShouldBindBodyWith(&objA, binding.JSON); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // Praegu kasutab see konteksti talletatud keha uuesti.
  } else if errB := c.ShouldBindBodyWith(&objB, binding.JSON); errB == nil {
    c.String(http.StatusOK, `the body should be formB JSON`)
  // Ja see saab aktsepteerida teisi formaate
  } else if errB2 := c.ShouldBindBodyWith(&objB, binding.XML); errB2 == nil {
    c.String(http.StatusOK, `the body should be formB XML`)
  } else {
    ...
  }
}
```

* `c.ShouldBindBodyWith` salvestab keha enne sidumist konteksti. Sellel on
väike mõju jõudlusele, seega ei tohiks te seda meetodit kasutada
piisavalt, et korraga siduda.
* Seda funktsiooni on vaja ainult mõne vormingu puhul -- `JSON`, `XML`, `MsgPack`,
`ProtoBuf`. Teiste formaatide jaoks, `Query`, `Form`, `FormPost`, `FormMultipart`,
saab kutsuda `c.ShouldBind()` mitmeid kordi ilma jõudluse 
kaotuseta (Vaata [#1341](https://github.com/gin-gonic/gin/pull/1341)).

