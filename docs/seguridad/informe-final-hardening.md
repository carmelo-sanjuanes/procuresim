# Informe final del endurecimiento de seguridad de ProcureSim

| Dato | Valor |
|---|---|
| Fecha del informe | 06/11/2026 |
| Repositorio | https://github.com/carmelo-sanjuanes/procuresim (rama `master`) |
| Sitio publicado | https://carmelo-sanjuanes.github.io/procuresim/ |
| Versión revisada | commit `9d2246d` |
| Marcos de referencia | ISO/IEC 27001:2022 (Anexo A), ISO/IEC 27701:2019, SOC 2 (Criterios de Servicios de Confianza), OWASP ASVS 4.0 y dominios CISSP |
| Elaborado por | Sanjuanes Soluciones S.A.S., con asistencia de Claude Code (IA) |

## 1. Respuesta corta

**Sí, los cambios están hechos, publicados y probados.** Ocho commits del endurecimiento (`d1f35df` a `9d2246d`) están en `master`. GitHub publicó el sitio con ellos, y todas las pruebas de la sección 4 se repitieron el 06/11/2026 sobre el sitio en vivo.

Este trabajo **no certifica** a ProcureSim ni a la empresa. SOC 2, ISO 27001 e ISO 27701 certifican organizaciones mediante un auditor externo, y CISSP certifica personas. Lo que sí existe es una aplicación con los controles técnicos que esos marcos piden. Cada control tiene su evidencia en [matriz-de-controles.md](matriz-de-controles.md).

## 2. Cómo funciona ProcureSim y por qué eso importa

ProcureSim es una aplicación que corre completa en el navegador y **no tiene servidor propio**:

- Lo que la persona escribe (procesos, expedientes, ofertas, alarmas) se guarda en el almacenamiento del navegador de su equipo.
- La única conexión externa es la API pública de Datos Abiertos de Colombia (`www.datos.gov.co`), y solo cuando se usa un buscador en vivo.
- Para información sensible existe la **versión portátil** (`ProcureSim_portatil.html`). Es un solo archivo que se abre sin internet ni instalación, y responde a la nota del ingeniero: «debe correr en local porque los datos son sensibles».

Por eso los riesgos principales no son los de un servidor: no hay base de datos ni contraseñas que robar. Son estos:

1. Que se ejecute código ajeno en la página.
2. Que los datos salgan del equipo hacia terceros.
3. Que un archivo importado o una respuesta de la API dañen la aplicación.
4. Que alguien manipule el código antes de publicarlo.

## 3. Cambios realizados

### 3.1 Sin código ni conexiones de terceros

| Control | Qué se hizo | Archivo |
|---|---|---|
| Política de seguridad de contenido (CSP) | Solo se ejecuta el código de la propia aplicación. Se prohíben `eval`, los scripts en línea, los objetos incrustados y los marcos, y solo se permite conectarse a `datos.gov.co`. | [config/politica-de-seguridad.mjs](../../config/politica-de-seguridad.mjs), [vite.config.ts](../../vite.config.ts) |
| Fuentes locales | Las fuentes ya no se descargan de Google: van dentro de la aplicación. Abrir ProcureSim no avisa a ningún tercero. | [src/main.tsx](../../src/main.tsx), [index.html](../../index.html) |
| Sin referencia de origen | `no-referrer`: los sitios a los que se enlaza no saben desde dónde se llegó. | [index.html](../../index.html) |
| Sin mapas de código | La compilación publicada no incluye los archivos `.map` que exponen el código fuente. | [vite.config.ts](../../vite.config.ts) |
| Servidor local solo en el equipo | `npm run dev` y `preview` escuchan solo en `localhost`, no en la red. | [vite.config.ts](../../vite.config.ts) |

### 3.2 Validación de todo lo que entra

| Riesgo | Control | Archivo |
|---|---|---|
| Una comilla en el buscador alteraba la consulta a Datos Abiertos (inyección SoQL) | Las comillas se duplican, los caracteres de control se quitan, el término se limita a 120 caracteres y cada parámetro se codifica. | [src/core/seguridad/entradaSegura.ts](../../src/core/seguridad/entradaSegura.ts) |
| Enlaces maliciosos en las respuestas de la API (`javascript:`, dominios falsos) | Solo se abren enlaces `https`, sin usuario ni clave, de SECOP, Colombia Compra, contratos.gov.co o datos.gov.co. | mismo archivo; se aplica en los motores y vistas de SECOP |
| Archivos importados dañinos | Límite de 5 MB y de 40 niveles de anidamiento. Se eliminan las claves `__proto__`, `constructor` y `prototype`, y solo se aceptan registros con identificador válido. | mismo archivo y [src/store/useProcurementStore.ts](../../src/store/useProcurementStore.ts) |

### 3.3 Privacidad y derecho de supresión (ISO 27701, Ley 1581 de 2012)

- Nuevo botón **«Tus datos»** en la barra superior, en la vista sencilla y en la experta. Explica que todo queda en el equipo, advierte que los buscadores consultan un portal público y recomienda borrar al terminar en un equipo compartido.
- La opción **«Borrar mis datos de este equipo»** elimina todo lo que ProcureSim guardó, después de una confirmación, y no toca los datos de otros sitios.
- Archivos: [src/components/TusDatosPrivacidad.tsx](../../src/components/TusDatosPrivacidad.tsx), [src/core/seguridad/datosLocales.ts](../../src/core/seguridad/datosLocales.ts).

### 3.4 Versión portátil para datos sensibles

- Se genera con `npm run portatil`, a partir del mismo código que el sitio publicado: [scripts/generar-portatil.mjs](../../scripts/generar-portatil.mjs).
- Su política de seguridad solo autoriza el script cuya huella SHA-256 calcula el generador. Si alguien modifica el código dentro del archivo, el navegador no lo ejecuta.

### 3.5 Cadena de suministro e integración continua

| Control | Archivo |
|---|---|
| Cada publicación pasa primero lint, pruebas, compilación, auditoría de dependencias (falla con vulnerabilidades altas), verificación de la CSP y ausencia de `.map`. | [.github/workflows/deploy.yml](../../.github/workflows/deploy.yml) |
| Acciones de GitHub fijadas por su huella (SHA), permisos mínimos por trabajo, `npm ci --ignore-scripts` y credenciales que no persisten. | mismo archivo |
| Análisis de código con CodeQL (reglas ampliadas) y búsqueda de secretos con Gitleaks en cada cambio y todos los lunes. | [.github/workflows/seguridad.yml](../../.github/workflows/seguridad.yml) |
| Dependabot revisa cada semana las dependencias y las acciones. Ya abrió sus primeras solicitudes de cambio, con el CI en verde. | [.github/dependabot.yml](../../.github/dependabot.yml) |
| Dos vulnerabilidades corregidas en dependencias (`postcss`); hoy quedan 0. | `package-lock.json` |

### 3.6 Documentación

- [SECURITY.md](../../SECURITY.md): controles, limitaciones y cómo reportar una vulnerabilidad.
- [matriz-de-controles.md](matriz-de-controles.md): cada control de ISO 27001, ISO 27701 y SOC 2 con su estado y evidencia.
- [prompts/](prompts/README.md): siete prompts detallados, uno por pedido, para repetir o continuar el trabajo.
- Fuera del repositorio, por ser público: el prompt de endurecimiento de Defensor Digital (local y SaaS), en `Aplicaciones/prompts-de-seguridad/legaltech-defensor-digital.md`.

## 4. Pruebas realizadas el 06/11/2026

### 4.1 En el equipo (versión `9d2246d`)

| Prueba | Resultado |
|---|---|
| `npm run lint` | Sin errores (exit 0). Quedan advertencias anteriores al trabajo, la mayoría en carpetas `_respaldo_*`; ninguna en el código nuevo. |
| `npm test` (Vitest) | **23 de 23 pruebas pasan**: inyección SoQL, 12 enlaces maliciosos, contaminación de prototipos, archivos grandes o mal formados, borrado selectivo y política CSP. |
| `npm run build` | Compila sin errores. |
| `npm audit` | **0 vulnerabilidades.** |
| Archivos `.map` en la compilación | 0 |
| `eval(` o `new Function(` en el código compilado | No aparecen. |
| `npm run portatil` | Genera `ProcureSim_portatil.html` (2,58 MB, 1 script autorizado por huella). |

### 4.2 En el sitio publicado

| Prueba | Resultado |
|---|---|
| Política de seguridad de contenido presente | Sí, la política completa de la sección 3.1. |
| Recursos cargados desde otros dominios | **Ninguno.** |
| Las tres fuentes cargan desde la propia aplicación | Sí: Outfit, Plus Jakarta Sans y JetBrains Mono. |
| Conexión a un sitio no autorizado (`example.com`) | **Bloqueada por el navegador.** |
| Conexión a Datos Abiertos (`datos.gov.co`) | Permitida (respuesta 200). |
| Ejecutar `eval` desde la página | **Bloqueado.** |
| Botón «Tus datos» | Presente. Al borrar, en una prueba anterior se eliminaron los datos de ProcureSim y se conservaron los de otros sitios. |
| **Descarga Word** (Generador de documentos Ley 80, «Descargar en Word») | **Funciona.** Genera un `.docx` válido de 10,6 KB (contenedor ZIP con `word/document.xml`) y la política no registró ningún bloqueo. |
| Imágenes rotas en la pantalla inicial | Ninguna. |

### 4.3 En GitHub

| Flujo | Resultado en `master` (`9d2246d`) |
|---|---|
| Verificar y publicar en GitHub Pages | Exitoso: verificación y publicación. |
| Análisis de seguridad | Exitoso: CodeQL y Gitleaks sin hallazgos. |
| Revisión previa al push (agente auditor de seguridad) | Veredicto **PUEDE SUBIRSE**: sin secretos ni datos personales reales en el código ni en el historial. |

### 4.4 Cómo repetir las pruebas

```bash
npm ci
npm run verificar
npm audit
npm run portatil
```

`verificar` ejecuta lint, pruebas y compilación. En el navegador, se abre el sitio y en la consola del desarrollador se escribe `fetch('https://example.com')`. Debe aparecer un error de política de seguridad.

## 5. Hallazgos que no son de seguridad

1. **Cuatro buscadores en vivo fallan desde antes de este trabajo.** El portal responde con error 400 porque piden columnas que el conjunto `jbjy-vk9h` ya no tiene. La aplicación muestra en silencio datos de respaldo. Afecta a los motores `DatosAbiertosSocrataEngine`, `DynamicMarketSupplierEngine`, `NationalEntityClassifierEngine` y `Secop2LiveConnectorEngine`. El Buscador de oportunidades sí funciona (150 resultados reales).
2. **Rutas absolutas `/sanjuanes/...`.** Algunas imágenes podrían no cargar en el sitio publicado, que vive en `/procuresim/`. En la pantalla inicial no se vio ninguna rota; falta revisar las demás.

## 6. Limitaciones conocidas

- GitHub Pages no permite enviar cabeceras HTTP. Por eso faltan `frame-ancestors` (protección contra incrustar el sitio en otra página) y HSTS. La solución está en el prompt 07: publicar detrás de Cloudflare o en el servidor propio con Coolify.
- Los datos guardados en el navegador **no están cifrados**. Cualquiera con acceso a la sesión del equipo puede verlos. Para información sensible conviene usar la versión portátil en un equipo personal y borrar al terminar. El cifrado con frase de acceso está diseñado en el prompt 07.
- La política permite estilos en línea (`style-src 'unsafe-inline'`), porque los usan las librerías de la interfaz. El riesgo es bajo, porque los scripts sí están bloqueados.

## 7. Pendientes del propietario y de la Dirección

| # | Pendiente | Quién | Referencia |
|---|---|---|---|
| 1 | Activar la protección de `master`, el escaneo de secretos con bloqueo al subir y el reporte privado de vulnerabilidades. | Propietario de la cuenta de GitHub | [prompts/05-configuracion-github.md](prompts/05-configuracion-github.md) |
| 2 | Decidir la visibilidad del repositorio. La regla de la empresa es privado; hoy es público, y hacerlo privado en el plan gratuito apaga el sitio. | Dirección | prompt 05 |
| 3 | Decidir si se retiran las carpetas `_respaldo_*` y `vista_previa_procuresim_vanilla.html`, que son públicas y no tienen estas protecciones. | Dirección | regla de `reestructurar-proyecto` |
| 4 | Confirmar que el correo y el teléfono de los datos de demostración (`src/mock-data/proveedoresDemo.ts`) son corporativos y pueden ser públicos. | Dirección | — |
| 5 | Adoptar una política de tratamiento de datos personales (Ley 1581 de 2012) y nombrar un responsable de seguridad y privacidad. Ninguna auditoría SOC 2 o ISO puede empezar sin esto. | Dirección | [matriz-de-controles.md](matriz-de-controles.md) |
| 6 | Corregir los cuatro buscadores en vivo de la sección 5. | Desarrollo | sección 5 |

## 8. Registro de cambios en `master`

| Commit | Descripción |
|---|---|
| `d1f35df` | Política CSP en la compilación y fuentes alojadas localmente |
| `5e7a333` | Escape de consultas SoQL, validación de enlaces externos e importaciones JSON |
| `614e051` | Aviso «Tus datos» y borrado total de los datos del equipo |
| `1fc4bb7` | Pruebas de seguridad (23) |
| `4d58946` | Generador reproducible de la versión portátil con CSP por huella |
| `b69f8a4` | CI con permisos mínimos, acciones fijadas, auditoría, CodeQL, Gitleaks y Dependabot |
| `3f09a9f` | SECURITY.md, matriz de controles y prompts |
| `9d2246d` | Ajustes finales del flujo de publicación |
