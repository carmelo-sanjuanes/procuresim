# Prompt 05: Configuración de seguridad del repositorio en GitHub (la hace el dueño)

Estos cambios son de configuración de la cuenta y del repositorio, no de código. Los ejecuta el dueño (`carmelo-sanjuanes`) o un agente con su autorización expresa en la conversación. Un agente **no** debe activarlos por su cuenta.

## 1. Funciones de seguridad gratuitas en repos públicos

```bash
# Reporte privado de vulnerabilidades (para que SECURITY.md funcione)
gh api -X PUT repos/carmelo-sanjuanes/procuresim/private-vulnerability-reporting

# Alertas y correcciones automáticas de Dependabot
gh api -X PUT repos/carmelo-sanjuanes/procuresim/vulnerability-alerts
gh api -X PUT repos/carmelo-sanjuanes/procuresim/automated-security-fixes

# Escaneo de secretos con bloqueo al hacer push
gh api -X PATCH repos/carmelo-sanjuanes/procuresim \
  -f "security_and_analysis[secret_scanning][status]=enabled" \
  -f "security_and_analysis[secret_scanning_push_protection][status]=enabled"
```

## 2. Protección de la rama `master`

Activar **después** de que el CI nuevo haya corrido al menos una vez en verde (para que los nombres de los chequeos existan):

```bash
gh api -X PUT repos/carmelo-sanjuanes/procuresim/branches/master/protection --input - <<'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Lint, pruebas, auditoría de dependencias y compilación", "CodeQL (JavaScript y TypeScript)", "Gitleaks (secretos en el historial)"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": { "required_approving_review_count": 0 },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_linear_history": true
}
EOF
```

Con esto, todo cambio entra por pull request con el CI en verde y nadie puede reescribir el historial de `master`. Cuando haya un segundo revisor humano, subir `required_approving_review_count` a 1 (flujo `qa-antes-de-main`).

## 3. Entorno `github-pages`

En **Settings → Environments → github-pages**: limitar *Deployment branches* a `master`.

## 4. Cuenta

- Autenticación en dos pasos con llave de seguridad o app (no SMS).
- Revisar tokens personales y aplicaciones OAuth autorizadas; revocar los que no se usen.
- Firmar commits (SSH o GPG) y activar *Vigilant mode*.

## 5. Decisión pendiente de la Dirección: visibilidad

La regla de la empresa es repositorio privado. Hoy es **público** porque GitHub Pages en un repositorio privado requiere un plan de pago. Opciones:

1. Mantenerlo público (el código no contiene secretos; queda documentado como excepción).
2. Pasar a GitHub Pro/Team y hacerlo privado (Pages sigue funcionando).
3. Hacerlo privado y publicar el sitio en el servidor de la empresa o en Cloudflare Pages (ver prompt 07).

No cambiar la visibilidad sin decisión expresa: hacerlo privado en el plan gratuito apaga el sitio publicado.
