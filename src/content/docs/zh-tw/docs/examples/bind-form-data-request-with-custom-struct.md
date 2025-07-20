---
title: "使用自訂結構綁定 form-data 請求"
---

以下範例使用自訂結構：

```go
type StructA struct {
  FieldA string `form:"field_a"`
}

type StructB struct {
  NestedStruct StructA
  FieldB       string `form:"field_b"`
}

type StructC struct {
  NestedStructPointer *StructA
  FieldC              string `form:"field_c"`
}

type StructD struct {
  NestedAnonyStruct struct {
    FieldX string `form:"field_x"`
  }
  FieldD string `form:"field_d"`
}

func GetDataB(c *gin.Context) {
  var b StructB
  c.Bind(&b)
  c.JSON(200, gin.H{
    "a": b.NestedStruct,
    "b": b.FieldB,
  })
}

func GetDataC(c *gin.Context) {
  var cStruct StructC
  c.Bind(&cStruct)
  c.JSON(200, gin.H{
    "a": cStruct.NestedStructPointer,
    "c": cStruct.FieldC,
  })
}

func GetDataD(c *gin.Context) {
  var d StructD
  c.Bind(&d)
  c.JSON(200, gin.H{
    "x": d.NestedAnonyStruct,
    "d": d.FieldD,
  })
}

func main() {
  router := gin.Default()
  router.GET("/getb", GetDataB)
  router.GET("/getc", GetDataC)
  router.GET("/getd", GetDataD)

  router.Run()
}
```

使用 `curl` 命令的結果：

```bash
$ curl "http://localhost:8080/getb?field_a=hello&field_b=world"
{"a":{"FieldA":"hello"},"b":"world"}
$ curl "http://localhost:8080/getc?field_a=hello&field_c=world"
{"a":{"FieldA":"hello"},"c":"world"}
$ curl "http://localhost:8080/getd?field_x=hello&field_d=world"
{"d":"world","x":{"FieldX":"hello"}}
```

**注意**：不支援以下樣式的結構：

```go
type StructX struct {
  X struct{} `form:"name_x"` // 這裡有 form 標籤
}

type StructY struct {
  Y StructX `form:"name_y"` // 這裡有 form 標籤
}

type StructZ struct {
  Z *StructZ `form:"name_z"` // 這裡有 form 標籤
}
```

總之，目前僅支援沒有 `form` 標籤的巢狀自訂結構。
