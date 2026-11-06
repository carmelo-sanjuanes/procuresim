# Prompt 02: Validación de entradas, enlaces externos e importaciones

Eres el revisor de codificación segura de ProcureSim. Toda entrada se trata como no confiable: lo que escribe la persona, lo que devuelve la API de Datos Abiertos (`datos.gov.co`) y los archivos JSON que se importan.

## Contexto que debes leer

`src/core/seguridad/entradaSegura.ts` y sus pruebas en `tests/seguridad.test.ts`. Las funciones son:

- `literalSoql(valor)` y `patronLikeSoql(valor)`: convierten un valor en literal SoQL con comillas duplicadas. **Todo** valor que entre en un `$where` pasa por aquí.
- `urlConsultaSocrata(recurso, parametros)`: codifica cada parámetro de la URL.
- `limpiarTermino(valor)`: quita caracteres de control y recorta a 120 caracteres.
- `enlaceSeguro(url)`: deja pasar solo `https` a `secop.gov.co`, `colombiacompra.gov.co`, `contratos.gov.co` y `datos.gov.co` (y sus subdominios).
- `leerJsonImportado(texto)`, `sanearJson(valor)`, `listaDeRegistros(valor)`: límite de 5 MB, sin claves `__proto__`/`constructor`/`prototype`, profundidad máxima 40, solo registros con `id` de texto.

## Qué hacer

1. Buscar consultas armadas a mano: `grep -rn "\$where\|\$q=\|\$select\|datos.gov.co" src`. Cada una debe usar `urlConsultaSocrata` (o `URLSearchParams`) y `literalSoql`/`patronLikeSoql` para los valores. Corregir las que no.
2. Buscar enlaces con datos externos: `grep -rn "href={" src`. Si el valor viene de la API, de un archivo importado o de lo que escribe la persona, envolverlo en `enlaceSeguro()`. Los enlaces fijos escritos en el código no lo necesitan.
3. Buscar importadores: `grep -rn "JSON.parse" src`. Los que leen archivos de la persona deben usar `leerJsonImportado` y validar la forma de cada entidad antes de guardarla en el estado.
4. Confirmar que no hay `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `document.write`, `eval` ni `new Function` en `src/`.
5. Si agregas un dominio a la lista blanca de enlaces, que sea oficial y con una prueba nueva.

## Pruebas que debes agregar por cada cambio

En `tests/seguridad.test.ts` (Vitest), con casos válidos e inválidos:
- Consultas: un valor con `'`, `%`, `&`, `#` y saltos de línea no cambia la estructura de la consulta.
- Enlaces: `javascript:`, `data:`, `http:`, `https://secop.gov.co.atacante.com`, credenciales en la URL → rechazados.
- Importación: archivo de más de 5 MB, JSON roto, `__proto__`, anidación de 100 niveles → rechazados sin romper la página.

## No hacer

- No escapar con `encodeURIComponent` dentro del literal SoQL: no escapa la comilla simple.
- No confiar en que React bloquea `javascript:` en `href` (solo avisa en desarrollo).
- No mostrar al usuario mensajes técnicos del error; usar textos desde su perspectiva (skill `textos-para-el-cliente`).

## Terminado cuando

Los cuatro `grep` del paso 1 a 4 no dejan casos sin cubrir, las pruebas nuevas pasan y `npm run verificar` está en verde.
