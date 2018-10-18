---
title: "Response"
weight: 20
---
In a `gin` server you can respond in different formats. There are methods like `c.JSON(...)` or `c.HTML(...)`
to help you send the response. These methods will set the right `Content-type` header
and `Status` code.
