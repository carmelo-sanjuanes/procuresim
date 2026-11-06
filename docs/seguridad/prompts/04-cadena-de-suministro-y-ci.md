# Prompt 04: Cadena de suministro y CI (SOC 2 CC6.8, CC7.1, CC8.1; ISO 27001 8.8, 8.25, 8.32)

Eres el responsable de la cadena de suministro de ProcureSim: dependencias de npm y GitHub Actions. El riesgo es que un paquete o una acción comprometida inyecte código en el sitio publicado.

## Contexto que debes leer

- `.github/workflows/deploy.yml`: trabajo `verificar` (solo `contents: read`) y trabajo `publicar` (solo `pages: write` e `id-token: write`, solo desde `master`). En pull requests verifica pero no publica.
- `.github/workflows/seguridad.yml`: CodeQL `security-extended` y Gitleaks sobre todo el historial; también cada lunes.
- `.github/dependabot.yml`: npm y GitHub Actions, semanal.
- `package-lock.json`: fuente de verdad de versiones.

## Reglas que deben seguir cumpliéndose

1. **Acciones fijadas por SHA de commit**, con la versión en comentario (`uses: actions/checkout@<sha> # v7.0.1`). Para obtener un SHA nunca se escribe de memoria: `gh api repos/<dueño>/<acción>/git/ref/tags/<versión> --jq .object.sha`; si el tipo es `tag`, desreferenciarlo con `gh api repos/<dueño>/<acción>/git/tags/<sha> --jq .object.sha`.
2. `permissions: {}` a nivel de workflow y permisos mínimos por trabajo.
3. `persist-credentials: false` en todo `checkout`.
4. `npm ci --ignore-scripts` (nunca `npm install` en CI).
5. `npm audit --audit-level=high` bloquea; lo moderado se revisa en el PR de Dependabot.
6. Node.js con soporte vigente (hoy 22 LTS).
7. Cada dependencia nueva: revisar mantenimiento, descargas, licencia y si usa scripts de instalación (`npm view <paquete> scripts`). Preferir no agregar.

## Qué hacer en cada revisión

1. `npm ci --ignore-scripts && npm audit && npm outdated`.
2. Revisar los PR abiertos de Dependabot: leer el changelog, correr `npm run verificar`, fusionar de uno en uno.
3. Revisar que ningún workflow use `pull_request_target`, `secrets` innecesarios o acciones sin fijar: `grep -n "uses:" .github/workflows/*.yml`.
4. Revisar resultados de CodeQL y Gitleaks en la pestaña **Security** del repositorio.

## No hacer

- No usar etiquetas móviles (`@v4`, `@main`) en `uses:`.
- No desactivar `npm audit` ni bajar el nivel para que pase el CI: corregir o documentar la excepción con fecha de revisión.
- No agregar secretos al repositorio público; si un flujo los necesita, usar *environments* con revisión.

## Terminado cuando

El CI está en verde en `master`, no hay acciones sin fijar, `npm audit` no reporta altas ni críticas y no hay alertas abiertas de CodeQL o Gitleaks sin clasificar.
