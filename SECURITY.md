# Seguridad de ProcureSim

## Cómo reportar una vulnerabilidad

No abra un *issue* público. Use **Security → Report a vulnerability** en este repositorio (reporte privado de GitHub) o escriba a la Dirección de Sanjuanes Soluciones S.A.S.

Incluya qué ocurre, cómo reproducirlo y desde cuándo lo sabe. No incluya secretos ni datos personales reales; si encontró uno, indique dónde está sin repetirlo completo.

Tiempos objetivo: acuse de recibo en 3 días hábiles, evaluación en 10 días hábiles y corrección de lo crítico en 30 días.

## Qué es ProcureSim desde el punto de vista de seguridad

- Aplicación **estática**: no tiene servidor propio, base de datos, cuentas de usuario ni cobros.
- Lo que la persona escribe se guarda **solo en su navegador** (`localStorage`). No se envía a Sanjuanes Soluciones.
- Única conexión externa: la API pública de Datos Abiertos de Colombia (`https://www.datos.gov.co`), para los buscadores en vivo. Se envía solo el término de búsqueda.
- Dos formas de uso: la web publicada en GitHub Pages y `ProcureSim_portatil.html`, que se abre sin internet ni instalación (opción recomendada cuando la información es sensible).

## Controles implementados

| Control | Dónde |
|---|---|
| Política de seguridad de contenido (CSP) estricta: sin scripts de terceros, sin `eval`, conexiones solo a `datos.gov.co` | `config/politica-de-seguridad.mjs`, `vite.config.ts` |
| Versión portátil con CSP que autoriza el script solo por su huella SHA-256 | `scripts/generar-portatil.mjs` |
| Fuentes alojadas con la aplicación: abrirla no avisa a Google ni a otros terceros | `src/main.tsx` |
| `Referrer-Policy: no-referrer` | `index.html` |
| Consultas SoQL con literales escapados y parámetros codificados (sin inyección en la consulta) | `src/core/seguridad/entradaSegura.ts` |
| Enlaces externos solo `https` a dominios oficiales (`secop.gov.co`, `colombiacompra.gov.co`, `contratos.gov.co`, `datos.gov.co`) | `enlaceSeguro()` |
| Importación de archivos con límite de 5 MB, sin claves `__proto__`/`constructor` y solo registros con `id` | `leerJsonImportado()`, `listaDeRegistros()` |
| Aviso «Tus datos» y borrado total de los datos de este equipo | `src/components/TusDatosPrivacidad.tsx` |
| Servidor de desarrollo solo en `localhost` | `vite.config.ts` |
| Sin mapas de código fuente en lo publicado | `vite.config.ts` y CI |
| CI con permisos mínimos por trabajo, acciones fijadas por SHA, `npm ci --ignore-scripts`, `npm audit` (alto/crítico bloquea), lint, pruebas | `.github/workflows/deploy.yml` |
| CodeQL (`security-extended`) y Gitleaks en cada cambio y cada semana | `.github/workflows/seguridad.yml` |
| Dependabot para npm y GitHub Actions | `.github/dependabot.yml` |

## Limitaciones conocidas

- GitHub Pages **no permite cabeceras HTTP propias**. Por eso la CSP va en `<meta>`, donde no aplican `frame-ancestors`, HSTS propio ni `X-Frame-Options`: otra página podría mostrar ProcureSim dentro de un marco. Se resuelve poniendo Cloudflare delante o publicando en el servidor de la empresa (ver `docs/seguridad/prompts/07-siguiente-ronda.md`).
- `localStorage` **no está cifrado**. Cualquier persona con acceso al equipo y al navegador puede leerlo. En equipos compartidos: borrar los datos al terminar o usar una ventana privada.
- `style-src` permite estilos en línea (los usa React). No permite ejecutar código.
- El repositorio es **público** (requisito del plan gratuito de GitHub Pages). El código fuente y su historial son visibles.

El estado frente a SOC 2, ISO/IEC 27001 e ISO/IEC 27701 está en [docs/seguridad/matriz-de-controles.md](docs/seguridad/matriz-de-controles.md). **ProcureSim no está certificado**: esas normas certifican organizaciones, no programas.
