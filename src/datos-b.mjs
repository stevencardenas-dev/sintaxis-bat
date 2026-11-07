// Secciones 09 a 13: control de flujo, bucles, redirección y archivos

export const seccionesB = [
  {
    id: '08',
    parte: 'II',
    titulo: 'Etiquetas y saltos — GOTO',
    color: '#be123c',
    resumen:
      'Batch no tiene control de flujo estructurado: tiene etiquetas y saltos. Con eso se construyen los menús, las páginas de ayuda y hasta un while simulado.',
    items: [
      {
        c: ':menu',
        e: 'Crea una etiqueta: es solo un marcador, no ejecuta nada. El nombre no distingue mayúsculas, así que :menu y :MENU son la misma.',
        d: 'CAMILO.bat, JORGE.bat',
        b: 'base'
      },
      {
        c: 'goto menu',
        e: 'Salta a la etiqueta. También se escribe goto :menu con dos puntos y es equivalente. Es el mecanismo de todos los menús: cada opción termina volviendo a :menu para repintarlo.',
        d: 'los 20+ scripts del proyecto',
        b: 'base'
      },
      {
        c: 'goto :EOF',
        e: 'Sintaxis reservada que significa «fin del script o de la subrutina actual». Es el return genérico: detiene la ejecución sin cerrar la ventana.',
        d: 'DANIEL.bat, EDWIN.bat, JAIRO.bat',
        b: 'avanzado'
      },
      {
        c: ':AYUDA ... :FIN   +   goto AYUDA',
        e: 'Patrón de «páginas» del script: cada etiqueta es una pantalla y goto salta entre ellas.',
        d: 'EjemplosBatch.bat (fragmento repite)',
        b: 'avanzado'
      },
      {
        c: ':while1 ... if %x% leq 8 ( ... ) ... goto :while1',
        e: 'WHILE simulado: batch no tiene while, se inventa con una etiqueta, un if y un goto que vuelve a la etiqueta. WinSysToolkit lo usa para el monitoreo continuo (timeout /t 3 + goto LOOP_MON).',
        d: 'EjemplosBatch.bat, WinSysToolkit-ELKIN.bat',
        b: 'avanzado'
      },
      {
        c: ':estudio ... :descanso ... (sin goto final)',
        e: 'Si una sección no termina en goto menu o goto fin, la ejecución SIGUE y cae en la etiqueta siguiente, que se ejecuta sin que el usuario la elija.',
        d: 'angela.bat',
        b: 'trampa',
        w: 'Cierra siempre cada sección con un salto explícito: pause + goto menu, o goto :EOF.'
      }
    ]
  },
  {
    id: '09',
    parte: 'II',
    titulo: 'Subrutinas — CALL',
    color: '#c026d3',
    resumen:
      'call convierte una etiqueta en una función reutilizable con parámetros y valor de retorno. Es la diferencia entre un script copiado y pegado y uno mantenible.',
    items: [
      {
        c: 'call :suma 5 3',
        e: 'Ejecuta la etiqueta :suma del propio archivo pasándole argumentos (dentro son %1 y %2) y regresa a la línea siguiente cuando la subrutina hace goto :EOF o exit /b.',
        d: 'EjemplosBatch.bat (:suma, :resta)',
        b: 'base'
      },
      {
        c: 'call :MoverPorTipo "01_Gestion" "docx doc pdf"',
        e: 'Subrutina con varios parámetros: dentro, %~1 y %~2 los reciben sin comillas. Evita repetir cinco veces el mismo bucle de mover archivos por extensión.',
        d: 'JAIRO.bat',
        b: 'avanzado'
      },
      {
        c: 'call :Confirmar "¿Continuar con el analisis?"',
        e: 'Subrutina reutilizable que pregunta S/N y devuelve el resultado como código: exit /b 0 si acepta y exit /b 1 si no. El llamador hace if errorlevel 1 goto Menu.',
        d: 'JULIAN.bat',
        b: 'avanzado'
      },
      {
        c: 'call :REVISAR_SERVICIO "MapsBroker" "Descripcion" "Manual"',
        e: 'Lo más avanzado: una subrutina recibe servicio, justificación y sugerencia, usa setlocal/endlocal para no ensuciar el entorno y se llama una vez por cada servicio.',
        d: 'EDWIN.bat',
        b: 'avanzado'
      },
      {
        c: 'call "%~dp0counter.bat"',
        e: 'call también lanza OTRO archivo .bat sin cerrar la ventana actual. Sin call, el script externo toma el control y el actual no continúa.',
        d: 'broma.bat',
        b: 'avanzado'
      },
      {
        c: 'call npm install -g pnpm',
        e: 'call envuelve también comandos que en realidad son .bat o .cmd (npm lo es); sin el call, el script actual terminaría ahí.',
        d: 'YORMAN.bat',
        b: 'avanzado'
      },
      {
        c: '@echo off&call:main&goto:EOF',
        e: 'Todo en una línea con & como separador de comandos: apaga el eco, llama a la subrutina principal y termina. Nota: call:main sin espacio también es válido.',
        d: 'EjemplosBatch.bat',
        b: 'avanzado',
        w: 'El goto:EOF final es obligatorio: sin él, al terminar :main la ejecución «cae» dentro de :suma.'
      },
      {
        c: 'comando1 & comando2',
        e: 'El ampersand encadena varias instrucciones en la misma línea; se ejecutan una tras otra sin importar el resultado de la anterior.',
        d: 'EjemplosBatch.bat, IRAIDA.bat',
        b: 'base'
      }
    ]
  },
  {
    id: '10',
    parte: 'III',
    titulo: 'Bucles — FOR',
    color: '#4f46e5',
    resumen:
      'El comando más potente del batch: recorre listas, archivos, carpetas, árboles completos y la salida de otros comandos. Sus opciones /d, /R y /f son las que más se usan en el proyecto.',
    items: [
      {
        c: `for %%x in (1 3 4 6 87) do (
    echo Numero: %%x
)`,
        e: 'Recorre una lista literal metiendo varias instrucciones dentro del bloque. En un .bat la variable del bucle lleva DOS porcentajes: con uno solo se expandiría como variable. La letra es libre (i, f, A, E...).',
        d: 'EjemplosBatch.bat',
        b: 'base'
      },
      {
        c: `for %%f in (*.txt) do (
    echo Procesando %%f
    type "%%f" >> "salida.txt"
)`,
        e: 'La lista puede ser un comodín: aquí todos los .txt de la carpeta, y el bloque procesa cada archivo. Con (*) son todos los archivos de la carpeta actual.',
        d: 'EjemplosBatch.bat, YEISON.bat',
        b: 'base'
      },
      {
        c: `for /l %%i in (1,1,5) do (
    echo Iteracion %%i
)`,
        e: '/l genera la lista sola: inicio, paso y final (1,1,5 produce 1 2 3 4 5). Sustituye a escribir los números a mano y es la forma limpia de contar.',
        d: 'no aparece en los scripts; variante de apoyo',
        b: 'base'
      },
      {
        c: `for /d %%x in ("%temp%\\*") do (
    echo Borrando %%x
    rd /s /q "%%x"
)`,
        e: '/d hace que el bucle recorra solo CARPETAS del comodín, sin entrar en archivos; aquí borra cada carpeta temporal.',
        d: 'CAMILO.bat',
        b: 'avanzado'
      },
      {
        c: `for /r "%~dp0" %%E in (*.log) do (
    echo Encontrado: %%E
)`,
        e: '/R recorre RECURSIVAMENTE la carpeta indicada y todas sus subcarpetas buscando el patrón; si se omite la ruta, empieza en la carpeta actual.',
        d: 'EjemplosBatch.bat',
        b: 'avanzado'
      },
      {
        c: `for /f "tokens=5" %%p in ('netstat -ano ^| find "ESTABLISHED"') do (
    echo PID conectado: %%p
)`,
        e: 'for /f analiza TEXTO línea a línea; lo encerrado en comillas simples es un COMANDO cuya salida se procesa. tokens=5 toma la quinta palabra de cada línea. El ^| es vital: escapa la tubería para que la consuma el comando interno.',
        d: 'JORGE.bat, DANIEL.bat',
        b: 'avanzado'
      },
      {
        c: `for /f "tokens=1,2 delims=," %%a in (datos.csv) do (
    echo Usuario: %%a - Clave: %%b
)`,
        e: 'tokens=1,2 asigna la primera palabra a %%a y la segunda a %%b (y sigue el alfabeto: c, d...). delims=, cambia el separador: coma en lugar de espacio y tabulador.',
        d: 'DANIEL.bat, JULIAN.bat',
        b: 'avanzado'
      },
      {
        c: `for /f "skip=3 tokens=1,2" %%a in ('tasklist') do (
    echo Proceso: %%a con %%b
)`,
        e: 'skip=N descarta las N primeras líneas, típicamente los encabezados de la tabla, y tokens=1,2 se queda con el nombre del proceso y su consumo de memoria.',
        d: 'DANIEL.bat',
        b: 'avanzado'
      },
      {
        c: `for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /i "IPv4"') do (
    echo IP: %%i
)`,
        e: 'Con delims=: cada segmento entre dos puntos es un token, así que el valor queda en el segundo; sirve para limpiar la salida de ipconfig. La variante tokens=2,* dejaría el resto de la línea en %%j.',
        d: 'EjemplosBatch.bat',
        b: 'avanzado'
      },
      {
        c: `for %%E in (txt log) do (
    for %%F in ("*.%%E") do (
        echo Archivo: %%~nxF
    )
)`,
        e: 'FOR ANIDADOS con los paréntesis balanceados. Dentro se usan los modificadores de la variable de bucle: %%~nF (nombre sin extensión), %%~xF (solo extensión), %%~nxF (nombre completo), %%~dF y %%~pF (unidad y ruta).',
        d: 'JAIRO.bat',
        b: 'avanzado'
      },
      {
        c: `set "BAR="
for %%A in (1 2 3 4 5) do (
    set "BAR=!BAR!#"
    cls
    echo !BAR!
)`,
        e: 'Dentro de un bloque de for, toda variable que se MODIFICA debe leerse con !...!, porque %...% se congela al entrar al bloque. Así se arma la barra de carga de EDWIN2.bat.',
        d: 'EDWIN2.bat, JAIRO.bat',
        b: 'avanzado'
      },
      {
        c: `for %%i in (1 2 3) do (
    call :RUN_OPTION %%i
)`,
        e: 'Patrón «ejecutar todo»: el for llama a la subrutina pasándole el número de opción, para la opción A de ejecutar todas las auditorías.',
        d: 'DANIEL.bat',
        b: 'avanzado'
      }
    ]
  },
  {
    id: '11',
    parte: 'III',
    titulo: 'Redirección y tuberías',
    color: '#0284c7',
    resumen:
      'Mover la salida y los errores entre la pantalla, los archivos y otros comandos. Es la base de todos los reportes y logs del proyecto.',
    items: [
      {
        c: 'dir > todos.txt',
        e: '> envía la salida a un archivo SOBRESCRIBIENDO lo que hubiera dentro.',
        d: 'EjemplosBatch.bat',
        b: 'base'
      },
      {
        c: 'ipconfig >> archivo.txt',
        e: '>> AÑADE al final del archivo sin borrar lo anterior. Es el más usado en reportes e historiales.',
        d: 'JHOJAN.bat, EDWIN2.bat, DANIEL.bat',
        b: 'base'
      },
      {
        c: 'systeminfo > "%REPORTS%\\systeminfo.txt" 2>nul',
        e: '2>nul oculta los ERRORES (stderr) mientras la salida normal sí va al archivo. Si el comando falla por permisos, no ensucia la consola.',
        d: 'DANIEL.bat, EDWIN.bat, JULIAN.bat',
        b: 'base'
      },
      {
        c: 'net session >nul 2>&1',
        e: 'El combo para callar un comando por completo: >nul manda la salida normal a la basura y 2>&1 redirige los errores al mismo sitio. No se ve absolutamente nada.',
        d: 'JORGE.bat, JUANDIEGO-AUTO.bat, JULIAN.bat',
        b: 'base'
      },
      {
        c: 'ipconfig /all | findstr /i "IPv4"',
        e: 'La tubería | usa la salida de un comando como ENTRADA del siguiente, que la filtra.',
        d: 'EDWIN2.bat, WinSysToolkit-ELKIN.bat',
        b: 'base'
      },
      {
        c: 'findstr /i /c:"texto" /b /v',
        e: 'Filtro potente: /i sin distinguir mayúsculas, /c busca la frase completa, /b ancla al inicio de línea y /v invierte el resultado (muestra lo que NO coincide).',
        d: 'EDWIN2.bat, JULIAN.bat, DANIEL.bat',
        b: 'avanzado'
      },
      {
        c: '( echo Fecha: %date% & winget list ) > "%reporte%" 2>&1',
        e: 'Los PARÉNTESIS agrupan varias instrucciones como una sola y la redirección se aplica al conjunto: todo el bloque cae al archivo. Es la forma limpia de generar reportes multi-línea.',
        d: 'CRISTIAN.bat, ROYNER.bat, YORMAN.bat',
        b: 'avanzado'
      },
      {
        c: 'echo [%date% %time%] Opcion 1>>historial.log',
        e: 'Patrón de LOG: una línea por acción, con marca de tiempo y acumulada con >>.',
        d: 'IRAIDA.bat, EDWIN2.bat, DANIEL.bat',
        b: 'base',
        w: 'Ojo al espacio antes de >>: «echo algo >> archivo» guarda «algo » con espacio final; si molesta, escribe «echo algo>> archivo».'
      },
      {
        c: 'type historial.log',
        e: 'Imprime el contenido de un archivo en pantalla (el equivalente a cat de Linux).',
        d: 'IRAIDA.bat',
        b: 'base'
      },
      {
        c: 'del /q /f "%TEMP%\\*" >nul 2>&1',
        e: 'del borra archivos: /q no pregunta uno por uno y /f fuerza los de solo lectura; el >nul 2>&1 silencia los que estén en uso.',
        d: 'JORGE.bat, JULIAN.bat, CAMILO.bat',
        b: 'peligro'
      },
      {
        c: 'rd /s /q "C:\\ruta"',
        e: 'rd borra una carpeta CON todo su contenido, sin preguntar (/q) y con subcarpetas (/s).',
        d: 'JORGE.bat, CAMILO.bat',
        b: 'peligro',
        w: 'Es irreversible: no pasa por la papelera. Confirma siempre con una pregunta S/N antes de usarlo.'
      }
    ]
  },
  {
    id: '12',
    parte: 'III',
    titulo: 'Archivos y carpetas',
    color: '#65a30d',
    resumen:
      'Los comandos de manipulación de archivos que aparecen dentro de los scripts: listar, crear, copiar, comparar y dibujar árboles.',
    items: [
      {
        c: 'dir /a-d /b /on   ·   dir /ad /b /on',
        e: 'dir lista un directorio: /a-d solo archivos (sin carpetas), /ad solo carpetas, /b formato limpio sin adornos y /on ordena por nombre.',
        d: 'EjemplosBatch.bat (list.bat)',
        b: 'base'
      },
      {
        c: 'mkdir carpeta   ·   md carpeta',
        e: 'Crean una carpeta (md y mkdir son lo mismo). Si ya existe dan un error inofensivo, por eso se usan junto a if not exist.',
        d: 'DANIEL.bat, YEISON.bat',
        b: 'base'
      },
      {
        c: 'copy /y origen destino   ·   move origen destino',
        e: 'copy copia (con /y no pregunta antes de sobrescribir) y move mueve o renombra.',
        d: 'YEISON.bat, JAIRO.bat',
        b: 'base'
      },
      {
        c: 'xcopy "%origen%" "%destino%" /E /I',
        e: 'Copia árboles completos: /E incluye carpetas vacías y /I asume que el destino es una carpeta aunque esté vacío.',
        d: 'ERIKA.bat',
        b: 'base'
      },
      {
        c: 'del Historial\\*.tmp',
        e: 'Borra por comodín los temporales creados, por ejemplo después de comparar instantáneas.',
        d: 'YEISON.bat',
        b: 'base'
      },
      {
        c: 'attrib "archivo"',
        e: 'Muestra o cambia los atributos de un archivo: oculto, solo lectura, sistema, archivo.',
        d: 'varios',
        b: 'base'
      },
      {
        c: 'fc archivo1 archivo2',
        e: 'File Compare: compara dos archivos y devuelve errorlevel distinto de 0 si difieren. Con /A muestra solo las líneas que cambian, /N añade el número de línea y /B compara en binario.',
        d: 'YEISON.bat',
        b: 'base'
      },
      {
        c: 'tree C:\\ /f /a',
        e: 'Dibuja el árbol de carpetas: /f incluye los archivos y /a usa solo caracteres ASCII, útil para guardarlo en un reporte.',
        d: 'DANIEL.bat',
        b: 'base'
      }
    ]
  }
];
