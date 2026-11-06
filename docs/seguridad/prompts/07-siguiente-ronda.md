# Prompt 07: Siguiente ronda de endurecimiento (requiere decisiones de la Dirección)

Lo que queda después de la ronda del 06/11/2026 no se puede resolver solo con código en GitHub Pages. Cada punto empieza con la pregunta que la Dirección debe responder.

## A. Cabeceras HTTP reales

**Decisión:** ¿se pone Cloudflare delante de ProcureSim o se publica en el servidor de la empresa (Coolify)?

GitHub Pages no deja enviar cabeceras. Con un dominio propio (por ejemplo `procuresim.sanjuanes…`) en Cloudflare, o con Traefik en Coolify, enviar:

```
Content-Security-Policy: <la de config/politica-de-seguridad.mjs> ; frame-ancestors 'none'
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: no-referrer
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
```

Pasos: leer `config/politica-de-seguridad.mjs`, generar la cabecera desde ahí (no duplicar la política a mano), configurar Cloudflare *Transform Rules → Response headers* o las etiquetas de Traefik, y verificar con `curl -sI https://<dominio>` y con securityheaders.com. Terminado cuando todas las cabeceras aparecen y la app no muestra violaciones en consola.

## B. Cifrado opcional de los datos guardados

**Decisión:** ¿se ofrece a la persona proteger sus datos con una frase?

Diseño honesto (no cifrar con una clave guardada al lado de los datos, eso no protege nada):

1. Opción en «Tus datos»: «Proteger mis datos con una frase». La frase nunca se guarda.
2. Derivar la clave con PBKDF2-SHA-256 (600 000 iteraciones) o Argon2id (WebAssembly) y sal aleatoria de 16 bytes; cifrar con AES-GCM de 256 bits usando `crypto.subtle`, vector aleatorio de 12 bytes por escritura.
3. Implementar como `storage` personalizado del middleware `persist` de Zustand (`createJSONStorage`), con la clave solo en memoria; al cerrar la pestaña, se pide de nuevo.
4. Bloqueo automático tras 15 minutos sin uso.
5. Aviso claro: si olvida la frase, los datos no se pueden recuperar.
6. Pruebas: cifrar/descifrar, frase incorrecta, datos alterados (GCM debe fallar), migración desde datos sin cifrar.

## C. Integridad de la versión portátil

**Decisión:** ¿se publica la versión portátil como descarga oficial?

Si sí: publicarla en *Releases* de GitHub con su huella SHA-256 en la nota (`sha256sum ProcureSim_portatil.html`) y, idealmente, atestación de procedencia (`actions/attest-build-provenance`), para que quien la descargue pueda comprobar que no fue alterada.

## D. Modo SaaS (si algún día ProcureSim guarda datos en un servidor)

Ese día deja de ser una app estática y aplica todo el prompt de Defensor Digital (`../../../../prompts-de-seguridad/legaltech-defensor-digital.md` en la carpeta de Aplicaciones): autenticación, cifrado en reposo, registros, respaldos, retención y política de tratamiento. No conectar ProcureSim a un backend sin pasar antes por ese prompt.
