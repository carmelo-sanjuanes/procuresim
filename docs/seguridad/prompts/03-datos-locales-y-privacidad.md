# Prompt 03: Datos locales y privacidad (ISO/IEC 27701, Ley 1581 de 2012)

Eres el responsable de privacidad de ProcureSim. El principio de diseño es **local primero**: lo que la persona escribe queda solo en su navegador y ella puede verlo, exportarlo y borrarlo cuando quiera. Si los datos son sensibles, se recomienda la versión portátil (`ProcureSim_portatil.html`), que funciona sin internet.

## Contexto que debes leer

- `src/core/seguridad/datosLocales.ts`: `clavesDeProcureSim()` y `borrarDatosDeEsteEquipo()`. Borran toda clave de `localStorage` y `sessionStorage` que empiece por `procuresim`.
- `src/components/TusDatosPrivacidad.tsx`: botón «Tus datos» en la cabecera (vista simple y experta), aviso de privacidad y borrado con confirmación.
- Claves actuales: `procuresim-storage-v3` (estado principal), `procuresim-alarmas-v1`, `procuresim-oportunidades-v1`, `procuresim_sound_enabled`.

## Qué hacer

1. Listar todas las claves que se guardan: `grep -rn "localStorage\|sessionStorage\|indexedDB\|name: 'procuresim" src`. Toda clave nueva **debe** empezar por `procuresim` para que el borrado la incluya. Si alguna no cumple, renombrarla con migración.
2. Si se agrega IndexedDB, caché de Service Worker o cookies, ampliar `borrarDatosDeEsteEquipo()` para cubrirlos y agregar la prueba.
3. Revisar que el aviso de «Tus datos» siga siendo cierto: qué se guarda, qué sale del equipo (solo el término de búsqueda a `datos.gov.co`) y cómo se borra. Si cambia algo, actualizar el texto (skill `textos-para-el-cliente`: claro, desde la perspectiva de la persona, sin términos internos).
4. Confirmar que no hay analítica, píxeles, cookies ni servicios de terceros que reciban datos de la persona.
5. Minimización: los campos con datos de personas (cédula, correo, celular de representantes en consorcios, expedientes) se quedan solo en el equipo. No agregar envíos a servicios externos sin decisión de la Dirección y sin actualizar la política de tratamiento.

## Cómo probarlo

1. `npx vite preview`, crear un expediente con un texto marcador, recargar y confirmar que está en `localStorage`.
2. «Tus datos» → «Borrar mis datos de este equipo» → «Sí, borrar todo». Tras la recarga, el marcador no debe aparecer en ninguna clave. Una clave ajena (por ejemplo `otra-app`) debe seguir ahí.
3. Prueba unitaria en `tests/seguridad.test.ts` para cada clave nueva.

## Pendiente de la organización (no lo resuelve el código)

- Política de tratamiento de datos personales de Sanjuanes Soluciones (Ley 1581 de 2012 y Decreto 1377 de 2013) y su enlace desde la aplicación.
- Responsable de protección de datos y procedimiento para atender consultas y reclamos.

## Terminado cuando

Toda clave está inventariada y cubierta por el borrado, la prueba en navegador da el resultado esperado y la sección ISO/IEC 27701 de la matriz está al día.
