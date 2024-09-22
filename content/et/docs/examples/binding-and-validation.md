---
title: "Mudeli sidumine ja valideerimine"
draft: false
---

Päringu keha sidumisel tüübiks kasutage mudeli sidumist. Praegu toetame JSON-i, XML-i, YAML-i ja standardvormi väärtuste sidumist (foo=bar&boo=baz).

Gin kasutab [**go-playground/validator/v10**](https://github.com/go-playground/validator) valideerimiseks. Vaata tervet dokumentatsiooni siltide kasutamise kohta [here](https://pkg.go.dev/github.com/go-playground/validator/v10#hdr-Baked_In_Validators_and_Tags).

Pange tähele, et peate määrama vastava sidumissildi kõikidele väljadele, mida soovite siduda. Näiteks JSON-ist sidumisel määrake `json:"fieldname"`.

Samuti pakub Gin sidumiseks kahte komplekti meetodeid:
- **Type** - Peab siduma
  - **Methods** - `Bind`, `BindJSON`, `BindXML`, `BindQuery`, `BindYAML`
  - **Behavior** - Need meetodid kasutavad `MustBindWith` kapoti all. Kui ilmneb sidumisviga, katkestatakse päring `c.AbortWithError(400, err).SetType(ErrorTypeBind)`. See määrab vastuse olekukoodiks 400 ja `Content-Type` päis on seatud `text/plain; charset=utf-8`. Pange tähele, et kui proovite pärast seda vastuse koodi määrata, kuvatakse hoiatus `[GIN-debug] [WARNING] Headers were already written. Wanted to override status code 400 with 422`. Kui soovite käitumise üle suuremat kontrolli omada, kaaluge `ShouldBind` meetodi kasutamist.
- **Type** - Peaks siduma
  - **Methods** - `ShouldBind`, `ShouldBindJSON`, `ShouldBindXML`, `ShouldBindQuery`, `ShouldBindYAML`
  - **Behavior** - Need meetodid kasutavad `ShouldBindWith` kapoti all. Kui esineb sidumisviga, tagastatakse viga ja arendaja vastutab päringu ja vea asjakohase käsitlemise eest.

Bind-method kasutamisel proovib Gin järeldada sideainet olenevalt Content-Type päisest. Kui olete kindel, mida siduda tahate kasutada `MustBindWith` või `ShouldBindWith`.

Samuti saate määrata, et konkreetsed väljad on kohustuslikud. Kui väljal on märgitud `binding:"required"` ja sidumisel on väärtus tühi, tagastatakse viga.

```go
// Binding from JSON
type Login struct {
	User     string `form:"user" json:"user" xml:"user"  binding:"required"`
	Password string `form:"password" json:"password" xml:"password" binding:"required"`
}

func main() {
	router := gin.Default()

	// Example for binding JSON ({"user": "manu", "password": "123"})
	router.POST("/loginJSON", func(c *gin.Context) {
		var json Login
		if err := c.ShouldBindJSON(&json); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		
		if json.User != "manu" || json.Password != "123" {
			c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
			return
		} 
		
		c.JSON(http.StatusOK, gin.H{"status": "you are logged in"})
	})

	// Example for binding XML (
	//	<?xml version="1.0" encoding="UTF-8"?>
	//	<root>
	//		<user>manu</user>
	//		<password>123</password>
	//	</root>)
	router.POST("/loginXML", func(c *gin.Context) {
		var xml Login
		if err := c.ShouldBindXML(&xml); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		
		if xml.User != "manu" || xml.Password != "123" {
			c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
			return
		} 
		
		c.JSON(http.StatusOK, gin.H{"status": "you are logged in"})
	})

	// Example for binding a HTML form (user=manu&password=123)
	router.POST("/loginForm", func(c *gin.Context) {
		var form Login
		// This will infer what binder to use depending on the content-type header.
		if err := c.ShouldBind(&form); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		
		if form.User != "manu" || form.Password != "123" {
			c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
			return
		} 
		
		c.JSON(http.StatusOK, gin.H{"status": "you are logged in"})
	})

	// Listen and serve on 0.0.0.0:8080
	router.Run(":8080")
}
```

### Sample request

```sh
$ curl -v -X POST \
  http://localhost:8080/loginJSON \
  -H 'content-type: application/json' \
  -d '{ "user": "manu" }'
> POST /loginJSON HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.51.0
> Accept: */*
> content-type: application/json
> Content-Length: 18
>
* upload completely sent off: 18 out of 18 bytes
< HTTP/1.1 400 Bad Request
< Content-Type: application/json; charset=utf-8
< Date: Fri, 04 Aug 2017 03:51:31 GMT
< Content-Length: 100
<
{"error":"Key: 'Login.Password' Error:Field validation for 'Password' failed on the 'required' tag"}
```

### Jäta kinnitamine vahele

Kui käivitate ülaltoodud näidet, kasutades `curl` käsku, tagastatakse viga. Sest näidis kasutab `Password` jaoks `binding:"required"`. Kui kasutate `Password` jaoks `binding:"-"`, siis uuesti käivitamisel ei tagastata viga.
