---
title: "Kuidas luua üks tõhus vahevara?"
linkTitle: "Kuidas luua üks tõhus vahevara?"
date: 2019-02-26
---

## Koostisosad

Vahevaral on kaks osa:

  - esimene osa on see, mida käivitatakse üks kord, kui lähtestate vahevara. Seal seadistate kõik globaalsed objektid, loogika jne. Kõik, mis juhtub ühe korra rakenduse eluea jooksul.

  - teine ​​osa on see, mida täidetakse iga taotluse korral. Näiteks sisestate lihtsalt oma "globaalse" andmebaasi vahevara andmebaasi konteksti. Kui see on kontekstis, saate selle kätte teistest vahevaradest ja oma töötleja funktsioonist.

```go
func funcName(params string) gin.HandlerFunc {
    // <---
    // See on esimene osa
    // --->
    // Järgnev kood on näidis
    if err := check(params); err != nil {
        panic(err)
    }

    return func(c *gin.Context) {
        // <---
        // See on teine osa
        // --->
        // Järgnev kood on näidis
        c.Set("TestVar", params)
        c.Next()    
    }
}
```

## Täitmisprotsess

Esiteks, meil on järgmine näidiskood:

```go
func main() {
	router := gin.Default()

	router.Use(globalMiddleware())

	router.GET("/rest/n/api/*some", mid1(), mid2(), handler)

	router.Run()
}

func globalMiddleware() gin.HandlerFunc {
	fmt.Println("globalMiddleware...1")

	return func(c *gin.Context) {
		fmt.Println("globalMiddleware...2")
		c.Next()
		fmt.Println("globalMiddleware...3")
	}
}

func handler(c *gin.Context) {
	fmt.Println("exec handler.")
}

func mid1() gin.HandlerFunc {
	fmt.Println("mid1...1")

	return func(c *gin.Context) {

		fmt.Println("mid1...2")
		c.Next()
		fmt.Println("mid1...3")
	}
}

func mid2() gin.HandlerFunc {
	fmt.Println("mid2...1")

	return func(c *gin.Context) {
		fmt.Println("mid2...2")
		c.Next()
		fmt.Println("mid2...3")
	}
}
```

Vastavalt [Constituent parts](#Constituent-parts) öeldule, kui me käivitame gin protsessi, **part one** käivitub esmalt ja prindib järgmise teabe:

```go
globalMiddleware...1
mid1...1
mid2...1
```

Ja algne järjekord on:

```go
globalMiddleware...1
    |
    v
mid1...1
    |
    v
mid2...1
```

Kui me curl ühe taotluse `curl -v localhost:8080/rest/n/api/some`, **part two** käivitab nende vahevara ja väljastab järgmise teabe:

```go
globalMiddleware...2
mid1...2
mid2...2
exec handler.
mid2...3
mid1...3
globalMiddleware...3
```

Teisisõnu, käivitumis järjekord on:

```go
globalMiddleware...2
    |
    v
mid1...2
    |
    v
mid2...2
    |
    v
exec handler.
    |
    v
mid2...3
    |
    v
mid1...3
    |
    v
globalMiddleware...3
```


