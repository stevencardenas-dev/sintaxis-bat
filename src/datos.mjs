// Contenido de la guía: todas las sintaxis únicas de .BAT recopiladas de la carpeta BATERIAS
// b = base | avanzado | peligro | trampa

export const meta = {
  titulo: 'Sintaxis única de los archivos .BAT',
  subtitulo: 'Guía completa, categorizada y comentada',
  curso: 'Sistemas Operativos — Segundo corte',
  fecha: 'Noviembre de 2026',
  fuentes: [
    'guia-sintaxis-bat.txt (26 archivos .bat del proyecto)',
    'comandos-de-los-pdf.txt (Taller redes, Taller baterías 1, Diapositivas 3)'
  ]
};

export const partes = [
  {
    n: 'I',
    titulo: 'Fundamentos del script',
    sub: 'Lo que todo .bat necesita para arrancar bien: eco, codificación, variables, expansión y subcadenas.',
    color: '#2563eb'
  },
  {
    n: 'II',
    titulo: 'Argumentos y control de flujo',
    sub: 'Cómo recibe datos el script y cómo decide, salta y reutiliza código.',
    color: '#ea580c'
  },
  {
    n: 'III',
    titulo: 'Bucles, salida y archivos',
    sub: 'Recorrer, filtrar, redirigir y trabajar con archivos y carpetas.',
    color: '#4f46e5'
  },
  {
    n: 'IV',
    titulo: 'Recetas y trampas reales',
    sub: 'Los patrones que se repiten en todos los scripts y los errores que hay que evitar.',
    color: '#b45309'
  },
  {
    n: 'AP',
    titulo: 'Apéndices',
    sub: 'PowerShell desde batch, comandos del sistema y de red, y chuletas de referencia rápida.',
    color: '#0f766e'
  }
];

export const secciones = [
  {
    id: '01',
    parte: 'I',
    titulo: 'Estructura del script',
    color: '#2563eb',
    resumen:
      'Las instrucciones de cabecera y de cierre. Definen qué se ve en pantalla, en qué codificación se interpreta el texto y cómo termina el script sin dejar la ventana colgada.',
    items: [
      {
        c: '@echo off',
        e: 'Apaga el eco: la consola deja de imprimir cada línea del script y solo muestra lo que imprimes con echo. La @ evita que esa misma línea se muestre. Va siempre en la primera línea útil.',
        d: 'los 26 .bat',
        b: 'base'
      },
      {
        c: 'chcp 65001 >nul',
        e: 'Cambia la página de códigos de la consola a UTF-8 para que las tildes y la ñ se vean bien en lugar de «Â¡» o «Ã©». El >nul oculta el mensaje «Código de página activo: 65001».',
        d: 'angela.bat, CRISTIAN.bat, ROYNER.bat',
        b: 'base',
        w: 'No basta con escribirlo: guarda el archivo en UTF-8. Programas.bat muestra «Â¡Escaneo» porque su texto y su codificación no coinciden.'
      },
      {
        c: 'title Centro de Utilidades',
        e: 'Cambia el título de la ventana de consola. Es cosmético, pero ayuda a identificar el script cuando hay varias ventanas abiertas.',
        d: 'CAMILO.bat, JORGE.bat, EDWIN2.bat',
        b: 'base'
      },
      {
        c: 'color 0A',
        e: 'Cambia los colores de la consola: el primer dígito es el fondo y el segundo el texto, en hexadecimal (0 negro, 1 azul, A verde claro, F blanco). 0A = fondo negro con texto verde tipo Matrix; 1F = fondo azul y texto blanco. Sin argumentos, color restablece el esquema por defecto.',
        d: 'CAMILO.bat (0A), DANIEL.bat (1F)',
        b: 'base'
      },
      {
        c: 'cls',
        e: 'Borra la pantalla. Se usa al abrir cada pantalla del menú para que no se acumulen las opciones anteriores.',
        d: 'JAIRO.bat, JORGE.bat',
        b: 'base'
      },
      {
        c: 'pause',
        e: 'Muestra «Presione una tecla para continuar...» y espera a que el usuario pulse algo. Sirve para que la ventana no se cierre antes de que se lea el resultado.',
        d: 'casi todos',
        b: 'base'
      },
      {
        c: 'pause >nul',
        e: 'Igual que pause pero sin el mensaje, porque la salida se manda al dispositivo nul, la «papelera» del sistema.',
        d: 'CRISTIAN.bat, JULIAN.bat',
        b: 'base',
        w: 'El dispositivo correcto es nul, nunca null: pause > null crea un archivo llamado «null» en la carpeta y no silencia nada.'
      },
      {
        c: 'timeout /t 3 >nul',
        e: 'Espera 3 segundos sin cuenta regresiva y sin pedir tecla. Con /nobreak la espera no se puede cancelar pulsando una tecla. Es la pausa correcta, mejor que el truco ping 127.0.0.1 -n 4 >nul.',
        d: 'angela.bat, JORGE.bat, ROYNER.bat',
        b: 'base'
      },
      {
        c: '@pause   ·   @echo off',
        e: 'La @ antepuesta a cualquier comando impide que ese comando se imprima aunque el eco esté activo. Es costumbre de los scripts antiguos.',
        d: 'EjemplosBatch.bat',
        b: 'base'
      },
      {
        c: 'exit',
        e: 'Cierra la ventana de consola y termina el proceso. Es lo adecuado en scripts que se lanzan con doble clic.',
        d: 'varios',
        b: 'base'
      },
      {
        c: 'exit /b',
        e: 'Termina el script o la subrutina pero SIN cerrar la ventana: devuelve el control a quien lo llamó. Es lo correcto en menús y en subrutinas invocadas con call.',
        d: 'CRISTIAN.bat, JAIRO.bat, JULIAN.bat',
        b: 'avanzado'
      },
      {
        c: 'exit /b 0   ·   exit /b 1',
        e: 'Igual que exit /b, pero además devuelve un código de resultado explícito (0 = éxito, 1 = fallo). El llamador lo consulta con if errorlevel.',
        d: 'JULIAN.bat (:Confirmar)',
        b: 'avanzado'
      }
    ]
  },
  {
    id: '02',
    parte: 'I',
    titulo: 'Comentarios',
    color: '#7c3aed',
    resumen:
      'Tres formas de escribir texto que el intérprete ignora. No son intercambiables: una falla dentro de bloques y detrás de tuberías.',
    items: [
      {
        c: 'rem esto es un comentario',
        e: 'REM = REMark: el resto de la línea se ignora por completo. Es el comentario seguro porque funciona en cualquier posición, incluso dentro de bloques ( ) y detrás de tuberías.',
        d: 'DANIEL.bat, JEINER.bat, JULIAN.bat',
        b: 'base'
      },
      {
        c: '@rem comentario',
        e: 'Igual que rem, pero la propia línea del comentario tampoco se muestra si el eco estuviera activo.',
        d: 'EjemplosBatch.bat',
        b: 'base'
      },
      {
        c: ':: comentario',
        e: 'Truco habitual: crea una etiqueta vacía y el segundo «:» la deja inalcanzable, así que el intérprete la ignora. Más rápido de escribir que rem.',
        d: 'EDWIN.bat, JORGE.bat, broma.bat',
        b: 'base',
        w: 'No funciona dentro de bloques ( ... ) ni detrás de un pipe: ahí rompe el script. En esos casos usa rem.'
      }
    ]
  },
  {
    id: '03',
    parte: 'I',
    titulo: 'Salida por pantalla — ECHO',
    color: '#0891b2',
    resumen:
      'echo escribe texto y expande variables. Sus variantes controlan líneas en blanco, porcentajes y caracteres que el intérprete interpretaría como sintaxis.',
    items: [
      {
        c: 'echo Hola usuario %USERNAME%',
        e: 'Imprime el texto tal cual, expandiendo antes las variables entre porcentajes: %USERNAME% se sustituye por el usuario de Windows.',
        d: 'JAIRO.bat, EjemplosBatch.bat',
        b: 'base'
      },
      {
        c: 'echo.',
        e: 'Imprime una línea en blanco; el punto forma parte del comando. Se usa para dar aire entre las secciones de un menú.',
        d: 'JORGE.bat, JULIAN.bat, ROYNER.bat',
        b: 'base',
        w: 'echo sin nada imprime el estado del eco (on/off); echo. siempre imprime una línea vacía.'
      },
      {
        c: 'echo Uso de CPU: !CPUL!%%',
        e: 'El signo de porcentaje literal se escribe %%; un % solo intenta abrir una variable y rompe la línea.',
        d: 'WinSysToolkit-ELKIN.bat',
        b: 'base'
      },
      {
        c: 'echo IP_LOCAL        ^| IP_REMOTA',
        e: 'El circunflejo ^ escapa el carácter siguiente: aquí una barra vertical que NO debe funcionar como tubería. Lo mismo aplica a ^( y ^) para paréntesis literales.',
        d: 'JORGE.bat, JAIRO.bat',
        b: 'avanzado'
      },
      {
        c: 'echo hola  -^>  listo',
        e: 'El ^ también escapa la flecha -> para que no se confunda con una redirección.',
        d: 'JAIRO.bat',
        b: 'avanzado'
      },
      {
        c: 'echo ESTE TEXTO >> hola1.txt',
        e: 'echo es la vía normal para escribir o añadir líneas a un archivo, combinado con > o >>. El taller lo usa como forma de «adicionar contenido».',
        d: 'IRAIDA.bat, EDWIN2.bat',
        b: 'base'
      }
    ]
  },
  {
    id: '04',
    parte: 'I',
    titulo: 'Variables — SET',
    color: '#059669',
    resumen:
      'set crea, lee, borra y calcula variables. Aquí está también la lectura del teclado y la sustitución de texto, que es la base de casi todos los menús.',
    items: [
      {
        c: 'set nombre=Juan',
        e: 'Crea la variable nombre con el valor Juan. No debe haber espacios alrededor del signo igual.',
        d: 'varios',
        b: 'base',
        w: 'set nombre = Juan crea una variable llamada «nombre » (con espacio final) y con valor « Juan»; luego %nombre% no existe. ERIKA.bat tiene exactamente ese bug.'
      },
      {
        c: 'set "reporte=%~dp0Reporte.txt"',
        e: 'Forma recomendada: entrecomillar toda la asignación permite valores con espacios y caracteres especiales, sin cortes en el primer espacio ni espacios parásitos.',
        d: 'CRISTIAN.bat, DANIEL.bat, JULIAN.bat',
        b: 'base'
      },
      {
        c: 'set PASS=admin123',
        e: 'Variable con una clave fija que después se compara en un if para simular un inicio de sesión.',
        d: 'IRAIDA.bat',
        b: 'peligro',
        w: 'No es protección real: cualquiera que abra el .bat en un editor ve la clave. En batch todo es texto plano.'
      },
      {
        c: 'set /p opcion=Seleccione una opcion:',
        e: 'Lee lo que teclea el usuario y lo guarda en opcion, mostrando el prompt sin salto de línea. Es el corazón de todos los menús del proyecto.',
        d: 'CAMILO.bat, JORGE.bat, YORMAN.bat',
        b: 'base'
      },
      {
        c: 'set /p "op=Elige una opcion: "',
        e: 'Variante segura: entrecomillar el prompt completo evita que espacios accidentales contaminen la variable.',
        d: 'broma.bat',
        b: 'base'
      },
      {
        c: 'set /p OLDWP=<"estado\\fondo_original.txt"',
        e: 'Lee la PRIMERA LÍNEA de un archivo y la guarda en la variable, en lugar de leer del teclado: el < es «entrada desde archivo».',
        d: 'counter.bat',
        b: 'avanzado'
      },
      {
        c: 'set /a contador=contador+1',
        e: 'El modificador /a convierte set en calculadora: evalúa la parte derecha como expresión aritmética y permite nombrar la variable sin %...% dentro de su propia fórmula. Es el contador típico de los bucles for.',
        d: 'EjemplosBatch.bat, DANIEL.bat',
        b: 'base'
      },
      {
        c: 'set /a media=(%num1% + %num2%) / 2',
        e: 'Con /a se dispone de paréntesis, + - * / y % (módulo), operadores de bits (& | ^ << >> ~) y las asignaciones += -= *= /=.',
        d: 'EjemplosBatch.bat',
        b: 'avanzado'
      },
      {
        c: 'set /a "x = x + 1"',
        e: 'Las comillas alrededor de la expresión son opcionales: /a las ignora.',
        d: 'EjemplosBatch.bat',
        b: 'avanzado',
        w: 'Dentro de un bloque ( ) o de un for, la variable no se vuelve a leer con %x% hasta la línea siguiente del bloque: para eso existe la expansión retardada.'
      },
      {
        c: 'set',
        e: 'Sin argumentos imprime TODAS las variables del entorno activo. Útil para depurar.',
        d: 'DANIEL.bat: set > variables.txt',
        b: 'base'
      },
      {
        c: 'set raiz',
        e: 'Con solo un nombre o prefijo, set imprime las variables que empiezan por ese texto.',
        d: '—',
        b: 'base'
      },
      {
        c: 'set "raiz="',
        e: 'Asignar un valor vacío BORRA la variable. Se hace antes de un set /p para no arrastrar la respuesta anterior si el usuario pulsa Enter sin escribir.',
        d: 'CRISTIAN.bat, JAIRO.bat, JULIAN.bat',
        b: 'base'
      },
      {
        c: 'set "raiz=%raiz:"=%"',
        e: 'Sustitución de texto dentro de una variable con la forma %var:busca=reemplaza%. Aquí busca todas las comillas y las reemplaza por nada, para quitar las que Windows añade al arrastrar una carpeta sobre la ventana.',
        d: 'JAIRO.bat',
        b: 'avanzado'
      }
    ]
  },
  {
    id: '05',
    parte: 'I',
    titulo: 'Entorno y expansión retardada',
    color: '#0d9488',
    resumen:
      'Las variables que Windows ya trae, el problema de leer variables dentro de un bloque y las dos formas de resolverlo: setlocal enabledelayedexpansion y if errorlevel.',
    items: [
      {
        c: 'echo %USERNAME% %COMPUTERNAME% %DATE% %TIME%',
        e: 'Variables predefinidas por Windows: usuario, nombre del equipo, fecha y hora actuales.',
        d: 'JAIRO.bat, EjemplosBatch.bat',
        b: 'base'
      },
      {
        c: '%CD%  %HOMEPATH%  %TEMP%  %USERPROFILE%',
        e: 'Carpeta actual, ruta del perfil, carpeta temporal y perfil completo. Otras muy usadas: %SYSTEMROOT%, %ALLUSERSPROFILE%, %NUMBER_OF_PROCESSORS% y %PROCESSOR_ARCHITECTURE%.',
        d: 'EjemplosBatch.bat, EDWIN2.bat',
        b: 'base'
      },
      {
        c: '%RANDOM%',
        e: 'Número aleatorio entre 0 y 32767; se usa para nombres únicos y ejercicios de azar.',
        d: 'EjemplosBatch.bat, taller',
        b: 'base'
      },
      {
        c: 'setlocal enabledelayedexpansion',
        e: 'Activa la expansión retardada: desde aquí las variables se pueden leer con !var! y reflejan los cambios hechos dentro del mismo bloque o del for. Casi todos los scripts serios lo abren y lo cierran con endlocal.',
        d: 'broma.bat, DANIEL.bat, JAIRO.bat, JULIAN.bat',
        b: 'avanzado'
      },
      {
        c: 'echo !BAR!',
        e: 'Lectura con expansión retardada: !var! devuelve el valor ACTUAL. Con %var% se obtendría el valor que la variable tenía al entrar al bloque.',
        d: 'EDWIN2.bat (barra de carga)',
        b: 'avanzado'
      },
      {
        c: 'endlocal',
        e: 'Cierra el ámbito abierto por setlocal y descarta las variables creadas dentro, devolviendo el entorno a como estaba.',
        d: 'EDWIN.bat, JULIAN.bat',
        b: 'avanzado'
      },
      {
        c: '%errorlevel%   ·   !errorlevel!',
        e: 'Código de resultado del último comando: 0 = todo bien, cualquier otro número = error. Dentro de un bloque la forma %errorlevel% se evalúa tarde; por eso se prefiere !errorlevel! o la forma if errorlevel N.',
        d: 'EDWIN2.bat, YEISON.bat',
        b: 'avanzado'
      },
      {
        c: 'if errorlevel 1 ( ... ) else ( ... )',
        e: 'Azúcar del intérprete que significa «errorlevel MAYOR O IGUAL que 1». No depende de la expansión, así que funciona igual dentro de bloques.',
        d: 'YEISON.bat, JULIAN.bat',
        b: 'avanzado'
      },
      {
        c: 'for /f ... do set CPUL=%%A   →   echo !CPUL!%%',
        e: 'Patrón clásico: un for /f captura la salida de un comando en una variable y después se imprime con expansión retardada para que no salga vacía.',
        d: 'WinSysToolkit-ELKIN.bat',
        b: 'avanzado'
      }
    ]
  },
  {
    id: '06',
    parte: 'II',
    titulo: 'Argumentos y modificadores',
    color: '#ea580c',
    resumen:
      'Cómo llegan los datos al script desde la línea de comandos o desde un archivo arrastrado sobre el icono, y cómo extraer partes de una ruta.',
    items: [
      {
        c: 'echo %0 %1 %2 %3',
        e: 'Al ejecutar script.bat Pedro 20: %0 es el nombre del script, %1 es Pedro y %2 es 20. Los argumentos llegan hasta %9.',
        d: 'EjemplosBatch.bat',
        b: 'base'
      },
      {
        c: '%*',
        e: 'Contiene TODOS los argumentos a la vez; combinado con un for, se recorren uno a uno.',
        d: 'for %%n in (%*) do @echo %%n',
        b: 'base'
      },
      {
        c: 'shift',
        e: 'Desplaza los argumentos una posición: %2 pasa a ser %1, %3 a %2, etc. Sirve para procesar una lista mientras queden elementos.',
        d: 'EjemplosBatch.bat',
        b: 'avanzado'
      },
      {
        c: 'shift /1   ·   shift /2',
        e: 'Descartan a partir del argumento indicado: /1 elimina el primero, /2 elimina el segundo.',
        d: 'EjemplosBatch.bat',
        b: 'avanzado'
      },
      {
        c: '%~f1  %~d1  %~p1  %~n1  %~x1',
        e: 'Modificadores que extraen partes del argumento SIN las comillas: ruta completa, unidad, ruta, nombre y extensión.',
        d: 'EjemplosBatch.bat (programa 6)',
        b: 'avanzado'
      },
      {
        c: '%~s1  %~a1  %~t1  %~z1',
        e: 'Ruta corta 8.3, atributos del archivo, fecha y hora de modificación, y tamaño en bytes.',
        d: 'EjemplosBatch.bat',
        b: 'avanzado'
      },
      {
        c: 'cd /d "%~dp0"',
        e: '%~dp0 es la carpeta donde vive el .bat (unidad + ruta, sin comillas) y cd /d cambia también de unidad. Así las rutas relativas funcionan aunque el script se lance desde otra carpeta.',
        d: 'broma.bat, snapshot.bat, JULIAN.bat',
        b: 'base'
      },
      {
        c: 'powershell -File "%~dp0comparar.ps1" -Antes "%~1" -Despues "%~2"',
        e: 'Patrón puente: el .bat recibe los argumentos (por ejemplo dos archivos arrastrados sobre el icono) y se los pasa a un script de PowerShell.',
        d: 'comparar.bat',
        b: 'avanzado'
      },
      {
        c: 'if "%1"=="/?" goto AYUDA',
        e: 'Convención de Windows: si el usuario invoca el script con /? se debe mostrar la ayuda. También se usa if not "%~1"=="hola" echo hola.',
        d: 'EjemplosBatch.bat',
        b: 'avanzado'
      }
    ]
  },
  {
    id: '07',
    parte: 'II',
    titulo: 'Condicionales — IF',
    color: '#dc2626',
    resumen:
      'Comparar cadenas, números, archivos y códigos de error. Es la sección donde se concentran los errores de sintaxis más comunes del proyecto.',
    items: [
      {
        c: `if "%opcion%"=="1" (
    echo Has elegido la opcion 1
    pause
)`,
        e: 'Comparación de CADENAS dentro de un bloque: los paréntesis agrupan varias instrucciones bajo una sola condición, y se indentan para leerse. Entrecomilla siempre las dos partes: cuesta nada y evita el fallo más frecuente de batch.',
        d: 'CAMILO.bat, JAIRO.bat, ROYNER.bat',
        b: 'base'
      },
      {
        c: `if exist "%~dp0datos.txt" (
    type "%~dp0datos.txt"
) else (
    echo Falta el archivo de datos.
    pause
)`,
        e: 'if ... else: el paréntesis de cierre, la palabra else y el de apertura van en la MISMA línea («) else (») con espacios; así se elige entre dos bloques completos, cada uno con sus propias instrucciones.',
        d: 'DANIEL.bat, EDWIN2.bat, snapshot.bat',
        b: 'base'
      },
      {
        c: `if "%opcion%"=="1" (
    echo Opcion uno
) else if "%opcion%"=="2" (
    echo Opcion dos
) else (
    echo Opcion invalida
)`,
        e: 'Cadena de alternativas sin anidar bloques: cada «) else if (...)» añade una condición nueva y el último «) else (» es el caso por defecto. Es el equivalente batch de un switch.',
        d: 'DANIEL.bat, JEINER.bat, YORMAN.bat',
        b: 'avanzado'
      },
      {
        c: `if /i "%respuesta%"=="S" (
    echo Actualizando el sistema...
    goto actualizar
)`,
        e: 'El modificador /i compara sin distinguir mayúsculas: s, S y sO valen lo mismo. Indispensable en las preguntas de S/N.',
        d: 'CRISTIAN.bat, ROYNER.bat, JULIAN.bat',
        b: 'base'
      },
      {
        c: `if not "%CLAVE%"=="%PASS%" (
    echo Clave incorrecta
    goto :error
)`,
        e: 'not niega la condición y deja el bloque para el caso contrario; con él se construye el login de IRAIDA.bat.',
        d: 'IRAIDA.bat',
        b: 'base'
      },
      {
        c: `if %edad% GEQ 18 (
    echo MAYOR DE EDAD
) else (
    echo MENOR DE EDAD
)`,
        e: 'Comparaciones numéricas: EQU igual, NEQ distinto, LSS menor, LEQ menor o igual, GTR mayor, GEQ mayor o igual. Solo para números: para texto se usa ==.',
        d: 'EjemplosBatch.bat',
        b: 'base'
      },
      {
        c: `if not exist "%~dp0Reportes\\" (
    mkdir "%~dp0Reportes"
    echo Carpeta creada.
) else (
    echo La carpeta ya existe.
)`,
        e: 'La barra invertida antes de la comilla de cierre hace que if exist compruebe una CARPETA y no un archivo; con if not exist se crea solo si falta, el patrón de las carpetas de salida.',
        d: 'WinSysToolkit-ELKIN.bat, DANIEL.bat, JULIAN.bat',
        b: 'base'
      },
      {
        c: `net session >nul 2>&1
if errorlevel 1 (
    echo Necesitas permisos de administrador.
    pause
    exit /b 1
)`,
        e: 'if errorlevel N significa «errorlevel mayor o igual que N»: detecta cualquier error sin depender de la expansión y por eso es la forma preferible dentro de bloques. Aquí comprueba si el script corre como administrador.',
        d: 'JORGE.bat, EDWIN.bat, YORMAN.bat',
        b: 'avanzado'
      },
      {
        c: `if defined VAR (
    echo VAR vale %VAR%
) else (
    echo VAR no esta definida
)`,
        e: 'if defined comprueba si la variable EXISTE, aunque esté vacía, sin expandirla: la forma segura de preguntar por una variable que puede no haberse creado nunca.',
        d: 'no aparece en los scripts; variante de apoyo',
        b: 'avanzado'
      },
      {
        c: `if %opcion%==1 (
    echo Opcion 1
)`,
        e: 'TRAMPA: sin comillas, si la variable quedó vacía la línea se convierte en «if ==1» y el script muere con error de sintaxis. Pasa siempre que el usuario pulsa Enter en un set /p.',
        d: 'Correcto: if "%opcion%"=="1" ( ... )',
        b: 'trampa'
      }
    ]
  }
];


