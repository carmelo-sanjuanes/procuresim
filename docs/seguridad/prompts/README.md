# Prompts de endurecimiento (hardening) de ProcureSim

Cada archivo es un prompt autocontenido para Claude Code u otro agente. Se pega completo en una conversación nueva abierta en la carpeta del proyecto. Cada uno dice qué hacer, qué no hacer, cómo probarlo y cuándo está terminado.

| # | Prompt | Estado al 06/11/2026 |
|---|---|---|
| 01 | [CSP y cero terceros](01-csp-y-terceros.md) | Hecho en `seguridad/hardening`; usar para revisar o repetir |
| 02 | [Validación de entradas, enlaces e importaciones](02-validacion-de-entradas.md) | Hecho; usar al agregar un buscador o un importador nuevo |
| 03 | [Datos locales y privacidad](03-datos-locales-y-privacidad.md) | Hecho; usar al agregar una clave nueva de `localStorage` |
| 04 | [Cadena de suministro y CI](04-cadena-de-suministro-y-ci.md) | Hecho; usar al cambiar el workflow o las dependencias |
| 05 | [Configuración de GitHub (la hace el dueño)](05-configuracion-github.md) | **Pendiente**: requiere al dueño del repositorio |
| 06 | [Auditoría continua](06-auditoria-continua.md) | Usar antes de cada push a `master` |
| 07 | [Siguiente ronda: cabeceras reales y cifrado opcional](07-siguiente-ronda.md) | **Pendiente**: necesita decisiones de la Dirección |

Reglas comunes a todos:

- Leer primero `SECURITY.md` y `docs/seguridad/matriz-de-controles.md`.
- Trabajar en una rama propia, nunca directo en `master`. Un commit por propósito (Conventional Commits) con `Co-Authored-By` si participa la IA.
- Ningún secreto, IP de servidor ni dato personal en el repositorio: es **público**.
- Antes de decir que algo funciona: `npm run verificar` y probar en el navegador con `npx vite preview`. Dar las cifras reales.
- Nunca escribir «cumple SOC 2/ISO 27001»: se dice «control implementado» con su evidencia.
- Actualizar la matriz de controles cuando cambie el estado de un control.
