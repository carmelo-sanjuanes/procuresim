# Prompt 06: Auditoría de seguridad antes de cada push a `master`

Actúa como auditor de seguridad de ProcureSim (agente `auditor-de-seguridad` si está disponible). El repositorio es **público**: todo lo que se sube queda expuesto y en el historial para siempre.

## Revisa, en este orden

1. **Secretos y datos personales** en los archivos que cambian (`git diff master...HEAD`) y en todos los versionados (`git ls-files`), incluidos `.docx`, imágenes de `pantallazos/` y `ProcureSim_portatil.html`: claves API, tokens, contraseñas, IP de servidores, correos, teléfonos y cédulas de personas reales. Los datos de demostración deben ser ficticios.
2. **Historial**: `git log -p` de los commits nuevos. Si algo sensible ya está publicado, **no reescribir el historial**: informar a la Dirección, rotar el secreto y documentarlo.
3. **Código**: consultas SoQL sin `literalSoql`/`patronLikeSoql`, `href` con datos externos sin `enlaceSeguro`, `JSON.parse` de archivos sin `leerJsonImportado`, `innerHTML`, `dangerouslySetInnerHTML`, `eval`, `new Function`.
4. **CSP**: `config/politica-de-seguridad.mjs` sin `unsafe-eval`, sin `unsafe-inline` en `script-src`, sin orígenes nuevos sin justificar.
5. **CI**: acciones fijadas por SHA, permisos mínimos, `npm audit --audit-level=high` presente.
6. **Verificación**: `npm ci --ignore-scripts && npm run verificar` en verde; reportar el número real de pruebas.

## Entrega

Veredicto **PUEDE SUBIRSE** o **NO SUBIR**, con hallazgos priorizados (archivo:línea), indicando cuáles bloquean y cuáles pueden quedar como pendiente documentado en la matriz de controles. No modifiques archivos durante la auditoría.
