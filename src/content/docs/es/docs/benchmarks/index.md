---
title: "Benchmarks"
sidebar:
  order: 12
---

> **Datos históricos:** Estos benchmarks fueron recopilados en mayo de 2020 usando Gin v1.6.3 y Go 1.14.2. El rendimiento de los frameworks puede haber cambiado significativamente desde entonces. Para resultados de benchmarks actualizados, consulta el repositorio [go-http-routing-benchmark](https://github.com/gin-gonic/go-http-routing-benchmark).

## Benchmarks de rendimiento del framework web Gin

Los benchmarks ayudan a los desarrolladores a evaluar la eficiencia y el uso de recursos de las bibliotecas de enrutamiento HTTP en Go. Esta página resume las mediciones de muchos frameworks populares, para que puedas comparar fácilmente su velocidad y consumo de memoria.

**Entorno de prueba:**

- **Plataforma host:** Travis CI (VM Linux virtual)
- **Especificaciones de la máquina:** Ubuntu 16.04.6 LTS x64
- **Fecha de prueba:** 4 de mayo de 2020
- **Versión de Gin:** v1.6.3
- **Versión de Go:** 1.14.2 (linux/amd64)
- **Fuente de benchmarks:** [Go HTTP Router Benchmark](https://github.com/gin-gonic/go-http-routing-benchmark)
- **Resultados detallados:** [Ver el gist](https://gist.github.com/appleboy/b5f2ecfaf50824ae9c64dcfb9165ae5e) o [resultado de Travis](https://travis-ci.org/github/gin-gonic/go-http-routing-benchmark/jobs/682947061)

Gin usa un fork optimizado de [HttpRouter](https://github.com/julienschmidt/httprouter) para enrutamiento de alto rendimiento.

Si deseas ver más casos de prueba, puedes consultar [todos los benchmarks aquí](https://github.com/gin-gonic/gin/blob/master/BENCHMARKS.md).

---

## Cómo leer la tabla

Los benchmarks a continuación muestran varios frameworks de Go ejecutando tareas comunes de enrutamiento HTTP.
**Los números más bajos (tiempo, memoria, asignaciones) son mejores.**
Puedes usar estos resultados para una comparación directa entre Gin y enrutadores alternativos.

| Prueba                              | Repeticiones | Tiempo (ns/op) | Bytes (B/op) | Asignaciones (allocs/op) |
| ---------------------------------- | ----------- | ------------ | ------------ | ----------------------- |
| BenchmarkGin_GithubStatic         | 15629472    | 76.7         | 0            | 0                       |
| BenchmarkAce_GithubStatic         | 15542612    | 75.9         | 0            | 0                       |
| BenchmarkAero_GithubStatic        | 24777151    | 48.5         | 0            | 0                       |
| BenchmarkBear_GithubStatic        | 2788894     | 435          | 120          | 3                       |
| BenchmarkBeego_GithubStatic       | 1000000     | 1064         | 352          | 3                       |
| BenchmarkBone_GithubStatic        | 93507       | 12838        | 2880         | 60                      |
| BenchmarkChi_GithubStatic         | 1387743     | 860          | 432          | 3                       |
| BenchmarkDenco_GithubStatic       | 39384996    | 30.4         | 0            | 0                       |
| BenchmarkEcho_GithubStatic        | 12076382    | 99.1         | 0            | 0                       |
| BenchmarkGin_GithubParam          | 9132032     | 131          | 0            | 0                       |
| BenchmarkGin_GithubAll            | 43550       | 27364        | 0            | 0                       |
| BenchmarkHttpRouter_GithubAll     | 55938       | 21360        | 0            | 0                       |
| BenchmarkEcho_GithubAll           | 31251       | 38479        | 0            | 0                       |
| BenchmarkGorillaMux_GithubAll     | 346         | 3384987      | 251650       | 1994                    |

---

## Notas de la tabla de benchmarks

- **Repeticiones**: Total de repeticiones logradas en tiempo constante. Números más altos significan más confianza en los resultados.
- **Tiempo (ns/op)**: Duración de una operación, medida en nanosegundos. Menor es mejor.
- **Bytes (B/op)**: Memoria heap asignada por operación. Menor significa mejor eficiencia.
- **Asignaciones (allocs/op)**: Número promedio de asignaciones de memoria por operación. Menos asignaciones son mejores para el rendimiento y la recolección de basura.

Para preguntas o contribuciones, consulta nuestro [repositorio en GitHub](https://github.com/gin-gonic/gin).
