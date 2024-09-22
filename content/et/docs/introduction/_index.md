---
title: "Sissejuhatus"
draft: false
weight: 1
---

Gin on veebiraamistik, mis on kirjutatud Go (Golang). Sellel on palju parema jõudlusega martinilaadne API, mis on tänu [httprouter](https://github.com/julienschmidt/httprouter) kuni 40 korda kiirem. Kui vajate jõudlust ja produktiivsust, siis teile meeldib Gin.

Selles jaotises käsitleme, mis asi on Gin, milliseid probleeme see lahendab ja kuidas see teie projekti aidata saab.

Või kui olete valmis Gin oma projektis kasutama, külastage [Quickstart](https://gin-gonic.com/docs/quickstart/).

## Omadused

### Kiire

Radixi puupõhine marsruutimine, väike mälujalajälg. Ei mingit peegeldust. Prognoositav API jõudlus. 

### Vahevara tugi

Sissetulevat HTTP-päringut saab käsitleda vahevarade kett ja viimane toiming.
Näiteks: logija, autoriseerimine, GZIP ja lõpuks DB-sse sõnumi postitamine.

### Kokkujooksmise vaba

Gin saab HTTP-päringu ajal tekkinud paanika tabada ja taastada. Nii on teie server alati saadaval. Näiteks – sellest paanikast on võimalik ka Sentryle teada anda!

### JSON kinnitamine 

Gin saab sõeluda ja kinnitada JSON päringut – näiteks kontrollida vajalike väärtuste olemasolu.

### Marsruutide rühmitamine

Organiseerige oma marsruute paremini. Vajalik autoriseerimine vs mittenõutav, erinevad API versioonid... Lisaks saab rühmi piiramatult pesastada ilma jõudlust halvendamata.

### Vigade haldamine

Gin pakub mugavat võimalust koguda kokku kõik HTTP päringu ajal ilmnenud vead. Lõpuks saab vahevara vead logifaili ja andmebaasi kirjutada ning neid saata võrgu kaudu.

### Sisseehitatud renderdamine

Gin pakub hõlpsasti kasutatavat API-d JSON-i, XML-i ja HTML-i renderdamiseks.

### Laiendatav

Uue vahevara loomine on väga lihtne, vaadake lihtsalt näidiskoodi.