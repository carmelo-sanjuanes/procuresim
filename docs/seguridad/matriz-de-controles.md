# Matriz de controles de seguridad y privacidad: ProcureSim

Fecha: 06/11/2026 · Rama: `seguridad/hardening` · Preparada con apoyo de IA (Claude Code).

## Lectura honesta de esta matriz

SOC 2 es un informe de auditoría sobre una **organización** (lo emite un contador público independiente). ISO/IEC 27001 e ISO/IEC 27701 certifican el **sistema de gestión** de una organización (lo audita un organismo acreditado). CISSP es una certificación de **personas**. Ningún software queda «certificado» por su código.

Lo que sí se puede hacer, y es lo que hace esta matriz, es tomar los controles técnicos de esos marcos que aplican a una aplicación y demostrar cuáles ya cumple el producto, con evidencia en el repositorio. Los controles organizacionales (políticas, roles, auditorías, contratos, capacitación) quedan marcados como **pendientes de la organización**.

Estados: **Implementado** (con evidencia) · **Parcial** · **No aplica** (con motivo) · **Pendiente (organización)** · **Pendiente (técnico)**.

## 1. ISO/IEC 27001:2022, Anexo A (controles tecnológicos y relacionados)

| Control | Qué pide | Estado | Evidencia o motivo |
|---|---|---|---|
| 5.1 Políticas de seguridad | Política aprobada por la Dirección | Pendiente (organización) | `SECURITY.md` es una política del producto, no del SGSI |
| 5.7 Inteligencia de amenazas | Seguir vulnerabilidades nuevas | Parcial | Dependabot, `npm audit` y CodeQL semanal; falta responsable designado |
| 5.23 Seguridad en servicios en la nube | Evaluar proveedores (GitHub) | Pendiente (organización) | Registrar GitHub como proveedor y revisar sus términos |
| 5.34 Privacidad y PII | Proteger datos personales | Parcial | Datos solo en el navegador, aviso «Tus datos», borrado total; falta política de tratamiento (Ley 1581) |
| 8.3 Restricción de acceso a la información | Solo lo necesario | Implementado | Sin servidor ni cuentas; la app no puede leer datos de otros usuarios |
| 8.4 Acceso al código fuente | Controlar quién cambia el código | Parcial | Repo público de lectura; escritura solo del dueño; falta protección de rama (ver prompt 05) |
| 8.7 Protección contra malware | Evitar código malicioso | Implementado | CSP sin scripts de terceros ni `eval`; `npm ci --ignore-scripts` en CI |
| 8.8 Gestión de vulnerabilidades técnicas | Detectar y corregir | Implementado | `npm audit --audit-level=high` bloquea el CI; Dependabot; CodeQL `security-extended`; 2 vulnerabilidades de postcss corregidas el 06/11/2026 |
| 8.9 Gestión de la configuración | Configuración segura y versionada | Implementado | `vite.config.ts` (servidor solo en localhost, sin sourcemaps), CSP versionada en `config/` |
| 8.10 Eliminación de información | Borrar cuando corresponde | Implementado | `borrarDatosDeEsteEquipo()` y botón «Borrar mis datos de este equipo»; probado en navegador |
| 8.11 Enmascaramiento de datos | Ocultar datos sensibles | No aplica | La app no muestra datos de terceros reales más allá de la información pública del SECOP |
| 8.12 Prevención de fuga de datos | Evitar salida no autorizada | Implementado | CSP `connect-src` solo a `datos.gov.co`; fuentes locales; `no-referrer`; probado: conexiones a otros dominios bloqueadas |
| 8.13 Copias de respaldo | Respaldo de información | Parcial | La persona exporta su escenario o expedientes en JSON; no hay respaldo automático (por diseño: no hay servidor) |
| 8.15 Registros (logs) | Registrar eventos | Parcial | Bitácora OCDS local de acciones; no hay registro central (no hay servidor) |
| 8.16 Monitoreo | Detectar anomalías | Pendiente (técnico) | Sin servidor no hay qué monitorear del lado de la empresa; aplica si se migra a SaaS |
| 8.20 / 8.21 Seguridad de redes y servicios | Canales protegidos | Implementado | HTTPS de GitHub Pages; `upgrade-insecure-requests`; enlaces externos solo `https` |
| 8.23 Filtrado web | Limitar destinos | Implementado | `connect-src`, `frame-src 'none'`, `object-src 'none'`, `form-action 'none'` |
| 8.24 Uso de criptografía | Cifrar lo sensible | Parcial | Tránsito cifrado (HTTPS); `localStorage` sin cifrar (limitación documentada; ver prompt 07) |
| 8.25 Ciclo de desarrollo seguro | Seguridad en todo el ciclo | Implementado | Rama, pruebas, CI que bloquea, auditoría antes de publicar, matriz de controles |
| 8.26 Requisitos de seguridad de la aplicación | Definirlos | Implementado | `SECURITY.md` y este documento |
| 8.27 Arquitectura segura | Principios de diseño | Implementado | Local primero, sin servidor, mínimo privilegio en CI, defensa en profundidad (CSP + validación) |
| 8.28 Codificación segura | Prácticas de código seguro | Implementado | `src/core/seguridad/entradaSegura.ts`: escape SoQL, lista blanca de enlaces, saneado de JSON; 23 pruebas |
| 8.29 Pruebas de seguridad | Probar los controles | Parcial | Pruebas unitarias de los controles y prueba manual de la CSP; falta prueba de penetración externa |
| 8.30 Desarrollo externalizado | Controlar aportes de terceros | Parcial | Dependencias con lockfile y auditoría; aportes con IA declarados en commits |
| 8.31 Separación de entornos | Desarrollo, pruebas, producción | Implementado | Desarrollo local (`localhost`), PR verificado sin publicar, publicación solo desde `master` |
| 8.32 Gestión de cambios | Cambios controlados | Parcial | Conventional Commits y CI; falta exigir PR con revisión (protección de rama) |
| 8.33 Información de pruebas | No usar datos reales en pruebas | Implementado | Datos de demostración ficticios en `src/mock-data/` |

## 2. ISO/IEC 27701:2019 (privacidad)

| Control | Qué pide | Estado | Evidencia o motivo |
|---|---|---|---|
| 7.2.1 Propósito del tratamiento | Para qué se usan los datos | Implementado | Aviso «Tus datos»: los datos sirven solo para que la persona use el simulador en su equipo |
| 7.3.2 / 7.3.3 Información al titular | Avisar de forma clara | Implementado | Ventana «Tus datos se quedan en este equipo» en la cabecera |
| 7.3.6 Acceso, corrección y supresión | Derechos del titular | Implementado | La persona ve y edita sus datos en la app, exporta en JSON y borra todo con un botón |
| 7.4.1 Minimización | Recoger lo mínimo | Implementado | Sin cuentas, sin analítica, sin cookies, sin fuentes de terceros |
| 7.4.5 Desidentificación y borrado al final | Borrar cuando ya no se necesita | Implementado | Borrado total en un paso; no hay copias en servidores de la empresa |
| 7.5.1 Transferencia a terceros | Controlar envíos | Implementado | Solo el término de búsqueda va a `datos.gov.co`, y la app lo advierte |
| 7.2.2 / 7.2.8 Base legal y registros del tratamiento | Política de tratamiento (Ley 1581 de 2012) | Pendiente (organización) | La empresa debe adoptar su política de tratamiento y, si aplica, registrar bases en la SIC |
| 6.x Sistema de gestión de privacidad | Roles, responsable, evaluación de impacto | Pendiente (organización) | Designar responsable de protección de datos |

## 3. SOC 2 (Criterios de Servicios de Confianza, AICPA)

| Criterio | Estado | Evidencia o motivo |
|---|---|---|
| CC1 / CC2 Entorno de control y comunicación | Pendiente (organización) | Roles, código de conducta, capacitación |
| CC3 Evaluación de riesgos | Parcial | Este documento y `SECURITY.md` (limitaciones conocidas) |
| CC6.1 Acceso lógico | Implementado | No hay cuentas ni datos centralizados; la escritura en el repo es solo del dueño |
| CC6.6 Protección del perímetro | Parcial | CSP y HTTPS; sin cabeceras HTTP propias (límite de GitHub Pages) |
| CC6.7 Transmisión de datos | Implementado | HTTPS; `connect-src` restringido; enlaces solo `https` |
| CC6.8 Software no autorizado o malicioso | Implementado | CSP estricta, acciones fijadas por SHA, `npm ci --ignore-scripts`, Gitleaks |
| CC7.1 Detección de vulnerabilidades | Implementado | CodeQL, `npm audit`, Dependabot |
| CC7.2 – CC7.4 Monitoreo y respuesta a incidentes | Parcial | Canal de reporte en `SECURITY.md`; falta procedimiento de incidentes de la empresa |
| CC8.1 Gestión de cambios | Parcial | CI obligatorio; falta revisión obligatoria por PR |
| A1 Disponibilidad | Parcial | Versión portátil sin internet; GitHub Pages sin acuerdo de nivel de servicio |
| C1 Confidencialidad | Parcial | Datos solo en el equipo; sin cifrado en reposo |
| PI1 Integridad del procesamiento | Parcial | Validación de importaciones; la app es un simulador, no un sistema de registro oficial |
| P1 – P8 Privacidad | Parcial | Ver sección ISO/IEC 27701 |

## 4. OWASP ASVS 5.0 (nivel 1, controles que aplican a una SPA sin servidor)

| Área | Estado | Evidencia |
|---|---|---|
| V1 Codificación y saneado (inyección) | Implementado | Escape SoQL, sin `innerHTML`, `dangerouslySetInnerHTML` ni `eval` en `src/` |
| V3 Seguridad del frontend web | Implementado | CSP, `no-referrer`, `rel="noopener noreferrer"` en enlaces externos, lista blanca de dominios |
| V5 Manejo de archivos | Implementado | Límite de tamaño y saneado de JSON importado |
| V14 Protección de datos | Parcial | Datos locales con borrado; sin cifrado en reposo |
| V15 Arquitectura y dependencias | Implementado | Lockfile, auditoría, Dependabot, acciones fijadas |

## 5. Pendientes priorizados

1. **Organización:** política de tratamiento de datos (Ley 1581), responsable de seguridad y de privacidad, procedimiento de incidentes. Sin esto, ninguna auditoría SOC 2 o ISO puede empezar.
2. **Dueño del repositorio:** activar en GitHub los controles del prompt `05-configuracion-github.md` (protección de rama, escaneo de secretos con bloqueo, reporte privado de vulnerabilidades).
3. **Técnico:** cabeceras HTTP reales (Cloudflare delante de Pages o migrar al servidor de la empresa) y cifrado opcional de `localStorage` con frase de la persona (prompt `07-siguiente-ronda.md`).
4. **Prueba externa:** prueba de penetración por un tercero antes de ofrecer ProcureSim con datos reales de entidades.
