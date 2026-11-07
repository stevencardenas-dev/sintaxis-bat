// Secciones 14 y 15 (recetas y trampas) y apéndices A-D

export const seccionesC = [
  {
    id: '13',
    parte: 'IV',
    titulo: 'Patrones recurrentes',
    color: '#b45309',
    resumen:
      'Combinaciones completas que aparecen una y otra vez en los 26 scripts. Más que sintaxis, son las recetas con las que se arma cualquier .bat de administración.',
    items: [
      {
        c: `:reintentar
timeout /t 3 >nul
if not exist "reporte.txt" goto reintentar
echo Reporte listo`,
        e: 'Espera activa: reintenta cada 3 segundos hasta que exista el reporte. La etiqueta marca el inicio y el goto vuelve a ella mientras se cumpla la condición.',
        d: 'WinSysToolkit-ELKIN.bat',
        b: 'base'
      },
      {
        c: 'if "%opcion%"=="" goto :error',
        e: 'Validación de entrada vacía: si no se eligió nada, sale por la etiqueta de error en vez de seguir con un valor vacío.',
        d: 'CRISTIAN.bat, JAIRO.bat',
        b: 'base'
      },
      {
        c: 'set "op="',
        e: 'Borrar la variable antes de leerla con set /p evita que, al pulsar Enter sin escribir, quede el valor anterior y se repita la acción por accidente.',
        d: 'CRISTIAN.bat, JAIRO.bat, broma.bat',
        b: 'base'
      },
      {
        c: 'set /p resp= Desea continuar? (S/N):   →   if /i "%resp%"=="S"',
        e: 'Confirmación antes de acciones destructivas o largas, presente en actualizaciones, borrados y análisis del sistema.',
        d: 'CRISTIAN.bat, ROYNER.bat, JULIAN.bat',
        b: 'base'
      },
      {
        c: 'net session >nul 2>&1   &   if %errorlevel% neq 0 ( ... )',
        e: 'Comprobación de privilegios: si el script no corre como administrador, se avisa o se relanza elevado.',
        d: 'JORGE.bat, JUANDIEGO-AUTO.bat, JULIAN.bat',
        b: 'avanzado'
      },
      {
        c: 'set "salida=%~dp0Reportes" & if not exist "%salida%" mkdir "%salida%"',
        e: 'Carpeta de salida junto al .bat, creada solo si falta, para que los reportes no se dispersen por el disco.',
        d: 'DANIEL.bat, EDWIN.bat, JULIAN.bat',
        b: 'base'
      },
      {
        c: '( echo ... & comando & echo ... ) > "%archivo%"',
        e: 'Reporte de una sola pasada: agrupar todo el bloque y redirigir el conjunto. Cambia el orden y el contenido según el autor, pero la idea es idéntica.',
        d: 'CRISTIAN.bat, ROYNER.bat, YORMAN.bat',
        b: 'base'
      },
      {
        c: 'echo [%date% %time%] mensaje>>"%LOG%"',
        e: 'Registro de actividad: una línea con marca de tiempo por cada acción ejecutada.',
        d: 'EDWIN2.bat, IRAIDA.bat, DANIEL.bat',
        b: 'base'
      },
      {
        c: 'set "TS=%DATE:/=-%_%TIME::=-%"',
        e: 'Marca de tiempo para nombres de archivo, en su versión 100 % batch (la variante con Get-Date es la inmune a la configuración regional).',
        d: 'ROYNER.bat, snapshot.bat',
        b: 'base'
      },
      {
        c: 'set BAR=   →   for %%A in (1 2 3 ...) do ( set BAR=!BAR!# & cls & echo !BAR! )',
        e: 'Barra de carga o animación de presentación: la variable crece dentro del for y se repinta con cls. El «ping 127.0.0.1 -n 4 >nul» que suele acompañarla es un sleep casero; timeout es mejor.',
        d: 'EDWIN2.bat',
        b: 'avanzado'
      },
      {
        c: 'if exist "estado\\fondo_original.txt" ( ... ) else ( ... )',
        e: 'Archivos de estado (.flag): el script guarda en una carpeta «estado» qué se aplicó, para que otro script sepa qué deshacer. Es la base de cualquier script reversible.',
        d: 'broma.bat / counter.bat',
        b: 'avanzado'
      },
      {
        c: 'fc viejo nuevo >nul   →   if errorlevel 1 ( avisar )',
        e: 'Detección de cambios: se comparan dos instantáneas (procesos, usuarios, drivers) y se avisa si difieren.',
        d: 'YEISON.bat',
        b: 'avanzado'
      },
      {
        c: 'cd /d "%~dp0"   +   set "OUT=%~dp0snapshots\\SNAP_%TS%.txt"',
        e: 'Rutas seguras: anclarse a la carpeta del script y construir las rutas relativas desde ahí, siempre entre comillas.',
        d: 'broma.bat, snapshot.bat, JULIAN.bat',
        b: 'base'
      }
    ]
  },
  {
    id: '14',
    parte: 'IV',
    titulo: 'Errores y trampas reales',
    color: '#b91c1c',
    resumen:
      'Fallos que ya existen en los scripts de referencia y que conviene reconocer al leerlos. Cada tarjeta muestra el código tal como está escrito (mal) y la corrección.',
    peligro: true,
    items: [
      {
        c: 'set origen = C:\\Users\\...\\SO Sem 1',
        e: 'ERROR (ERIKA.bat). Los espacios alrededor del = crean la variable «origen » con un espacio de valor delante; luego %origen% se expande vacío y el xcopy no copia nada.',
        d: 'Correcto: set "origen=C:\\Users\\...\\SO Sem 1"',
        b: 'trampa'
      },
      {
        c: 'if /i "%confirmar% == "S" (',
        e: 'ERROR (ERIKA.bat). Las comillas están fuera de lugar: la comparación nunca se cumple bien y además rompe el análisis de la línea.',
        d: 'Correcto: if /i "%confirmar%"=="S" (',
        b: 'trampa'
      },
      {
        c: 'if exist "%destino_base%\\%carperta_destino%"(  ',
        e: 'ERROR (ERIKA.bat). Faltan los espacios antes del paréntesis y la variable está mal escrita (arriba se definió carpeta_destino). Batch no avisa del typo: expande vacío.',
        d: 'Correcto: if exist "%ruta%" ( ... )',
        b: 'trampa'
      },
      {
        c: ') else(',
        e: 'ERROR (ERIKA.bat). El else necesita espacios: escrito así, el intérprete lo toma como parte del paréntesis y el script muere.',
        d: 'Correcto: ) else (',
        b: 'trampa'
      },
      {
        c: 'pause > null',
        e: 'ERROR (varios fragmentos de EjemplosBatch.bat). «null» no existe en Windows: crea un ARCHIVO llamado null en la carpeta y la pausa no se silencia.',
        d: 'Correcto: pause >nul',
        b: 'trampa'
      },
      {
        c: 'CD..   ·   CD C:Windowssystem32',
        e: 'ERROR (EjemplosBatch.bat). CD.. sin espacio no funciona (debe ser cd ..) y «C:Windowssystem32» no es una ruta válida porque le faltan las barras.',
        d: 'Correcto: cd ..   ·   cd C:\\Windows\\system32',
        b: 'trampa'
      },
      {
        c: 'if exist %command% echo Compiling... else goto :error',
        e: 'ERROR (EjemplosBatch.bat, bloque Java). La variable sin comillas revienta si está vacía, y el else en línea aparte no funciona tras una instrucción simple.',
        d: 'Correcto: if exist "%command%" ( ... ) else ( ... )',
        b: 'trampa'
      },
      {
        c: 'set /p opcion=%1',
        e: 'RARO (EjemplosBatch.bat, menu1 a menu10). %1 es el primer argumento del script; si no se le pasa, el prompt queda vacío y el usuario no sabe qué teclear.',
        d: 'Correcto: set /p opcion=Digite el numero:',
        b: 'trampa'
      },
      {
        c: 'if %opcion%==1',
        e: 'TRAMPA GENERAL: cualquier if %var%==x se rompe cuando la variable quedó vacía, porque la línea se convierte en «if ==1».',
        d: 'Correcto: if "%opcion%"=="1"',
        b: 'trampa'
      },
      {
        c: 'wmic /namespace:\\\\root\\SecurityCenter2 ...',
        e: 'OJO (ROYNER.bat): una barra invertida antes de la comilla de cierre no escapa nada dentro de comillas dobles. Una ruta que termina en \\ dentro de comillas «rompe» la comilla final.',
        d: 'Correcto: "%ruta%\\\\" o armar la ruta sin barra final',
        b: 'trampa'
      },
      {
        c: 'echo Escaneo completado   (acentos sin chcp)',
        e: 'ERROR FRECUENTE: ver «Â¡» o «Ã©» significa que el archivo está en UTF-8 pero la consola usa otra codificación (o al revés).',
        d: 'Correcto: chcp 65001 >nul en la primera línea + archivo guardado en UTF-8',
        b: 'trampa'
      },
      {
        c: 'for ... do (  :: comentario  )',
        e: 'TRAMPA: los comentarios con :: fallan dentro de bloques parentizados y detrás de tuberías.',
        d: 'Correcto: usar rem en esos casos',
        b: 'trampa'
      },
      {
        c: 'echo Progreso: 50%   (porcentaje suelto)',
        e: 'TRAMPA: un % solo intenta abrir una variable y puede comerse el resto de la línea o imprimir algo inesperado.',
        d: 'Correcto: echo Progreso: 50%%',
        b: 'trampa'
      }
    ]
  }
];

export const apendices = [
  {
    id: 'A',
    parte: 'AP',
    titulo: 'PowerShell desde un .bat',
    color: '#1e40af',
    resumen:
      'Cuando batch no da abasto (hardware, WMI, listar archivos grandes, elevar permisos), la solución del proyecto es delegar en PowerShell desde la misma ventana.',
    items: [
      {
        c: 'powershell -NoProfile -Command "Get-ChildItem C:\\ -File -Recurse | Sort-Object Length -Descending | Select-Object -First 20"',
        e: 'Lanza PowerShell para una instrucción concreta. -NoProfile evita cargar tu configuración (más rápido y predecible).',
        d: 'EspacioDisco.bat, Programas.bat',
        b: 'avanzado'
      },
      {
        c: 'powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0recolectar.ps1" -OutFile "%OUT%"',
        e: '-ExecutionPolicy Bypass esquiva la política de ejecución y -File ejecuta un script completo con parámetros. Es el patrón recomendado cuando la lógica es seria: el .bat maneja menús y rutas, el .ps1 hace el trabajo.',
        d: 'snapshot.bat, comparar.bat, enviar_correo.bat',
        b: 'avanzado'
      },
      {
        c: 'powershell -Command "(New-Object -ComObject SAPI.SpVoice).Speak(\'Hola\')"',
        e: 'PowerShell puede usar objetos COM de Windows; aquí el sintetizador de voz. También se usa para SendKeys y MessageBox.',
        d: 'broma.bat',
        b: 'peligro'
      },
      {
        c: 'powershell -Command "Start-Process \'%~f0\' -Verb RunAs"',
        e: 'AUTOELEVACIÓN: relanza el propio .bat (%~f0 es su ruta completa) pidiendo permisos de administrador. Es el equivalente moderno de runas.',
        d: 'JUANDIEGO-AUTO.bat, JULIAN.bat',
        b: 'avanzado',
        w: 'Al elevar, Windows arranca el script desde System32: añade cd /d "%~dp0" al principio, como hace JULIAN.bat.'
      },
      {
        c: 'Get-CimInstance -ClassName Win32_PhysicalMemory | Select-Object BankLabel, Capacity, Speed',
        e: 'El reemplazo moderno de wmic memorychip. Microsoft desaconseja WMIC y pide migrar a Get-CimInstance.',
        d: 'JHOJAN.bat, EDWIN2.bat',
        b: 'avanzado'
      },
      {
        c: '(Get-Process -Id 20640).Threads   ·   Get-Process | ForEach-Object { $_.Threads }',
        e: 'Lista los HILOS de un proceso concreto. Sirve para conectar la teoría de procesos e hilos con la práctica: el proceso 20640 tenía 43 hilos.',
        d: 'Taller baterías 1',
        b: 'avanzado'
      },
      {
        c: '... | Select-Object Id | Export-Csv -Path C:\\Hilos.csv -NoTypeInformation',
        e: 'Patrón de reporte: exportar el resultado a CSV sin cabecera de tipo, listo para abrir en Excel.',
        d: 'Taller baterías 1',
        b: 'avanzado'
      },
      {
        cod: 'pwsh-correo',
        c: 'powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0enviar-correo.ps1"\n$ClienteSMTP = New-Object Net.Mail.SmtpClient($ServidorSMTP, 587)\n$ClienteSMTP.EnableSsl = $true',
        e: 'Enviar correo es el caso de dos piezas: un .bat no habla SMTP, así que llama a un .ps1 con -File, y dentro del script se crea el cliente SmtpClient en el puerto 587 con SSL. Escribe las dos piezas.',
        d: 'Taller avanzado CORREO, Programador de tareas',
        b: 'avanzado'
      }
    ]
  },
  {
    id: 'B',
    parte: 'AP',
    titulo: 'Comandos del sistema invocados desde el .bat',
    color: '#475569',
    resumen:
      'No son sintaxis de batch, pero se escriben dentro de los scripts y son los que hacen el trabajo: procesos, servicios, red, energía, reparación y paquetes.',
    items: [
      {
        c: 'start notepad   ·   start "" notepad',
        e: 'start abre un programa en una ventana NUEVA sin bloquear el script. Las comillas vacías son el TÍTULO de la ventana: son necesarias si la ruta del programa tiene espacios, porque si no start las interpretaría como título.',
        d: 'EDWIN2.bat',
        b: 'base'
      },
      {
        c: 'start "" "https://github.com"',
        e: 'start también abre una URL con el navegador predeterminado.',
        d: 'JORGE.bat, taller',
        b: 'base'
      },
      {
        c: 'start cmd /k systeminfo',
        e: 'cmd /k abre una consola y deja el comando corriendo sin cerrarse; con /c la cerraría al terminar. Patrón para lanzar herramientas del sistema en ventanas aparte.',
        d: 'EjemplosBatch.bat',
        b: 'base'
      },
      {
        c: 'start /b cmd /c java -version',
        e: '/b hace que el comando corra en la MISMA ventana, sin abrir otra.',
        d: 'EjemplosBatch.bat',
        b: 'avanzado'
      },
      {
        c: 'choice /c 1234567890A /n /m "Seleccione una opcion: "',
        e: 'Alternativa moderna a set /p para menús: no deja teclear texto, solo pulsar una de las teclas listadas, y el código de la tecla queda en %errorlevel% (1 = primera tecla, 2 = segunda...). /n oculta la lista y /m define el mensaje.',
        d: 'DANIEL.bat',
        b: 'avanzado'
      },
      {
        c: 'tasklist /v   ·   taskkill /PID 1234 /F   ·   taskkill /f /im explorer.exe',
        e: 'Lista procesos (tasklist /v con detalle) y los mata por PID o por nombre de imagen (/im), con /f de fuerza.',
        d: 'CAMILO.bat, broma.bat, counter.bat',
        b: 'peligro'
      },
      {
        c: 'systeminfo   ·   hostname   ·   whoami   ·   ver',
        e: 'Información básica del equipo y de la sesión: inventario completo, nombre del equipo, usuario actual y versión corta de Windows.',
        d: 'DANIEL.bat, ROYNER.bat',
        b: 'base'
      },
      {
        c: 'ipconfig /all   ·   /flushdns   ·   /release   ·   /renew   ·   /displaydns',
        e: 'Configuración de red completa (MAC, DHCP, DNS), vaciar la caché DNS, liberar y renovar la IP, y ver la caché de resoluciones.',
        d: 'JORGE.bat, JULIAN.bat',
        b: 'base'
      },
      {
        c: 'ping google.com -n 4   ·   ping -t',
        e: 'Prueba de conectividad. En Windows -n 4 envía cuatro paquetes (por defecto ya son cuatro; en Linux el número va con -c) y -t repite sin parar hasta Ctrl+C.',
        d: 'EDWIN2.bat',
        b: 'base'
      },
      {
        c: 'netstat -ano',
        e: 'Conexiones de red con el PID del proceso dueño: -a todas, -n en números (sin resolver DNS) y -o el PID. Se filtra con find ESTABLISHED o findstr LISTENING.',
        d: 'JORGE.bat, DANIEL.bat',
        b: 'base'
      },
      {
        c: 'net user   ·   net localgroup   ·   net start',
        e: 'Gestión de usuarios locales, grupos y servicios iniciados. Con net user nombre clave /add se crea un usuario y con /delete se borra.',
        d: 'WinSysToolkit-ELKIN.bat',
        b: 'avanzado'
      },
      {
        c: 'sc query type= service state= all',
        e: 'Consulta los servicios de Windows. sc exige un ESPACIO antes de los signos igual: «state= all», nunca «state=all».',
        d: 'WinSysToolkit-ELKIN.bat, DANIEL.bat',
        b: 'avanzado'
      },
      {
        c: 'wmic logicaldisk get name, freespace, size   ·   wmic diskdrive get model, size, status',
        e: 'Espacio libre y total por unidad lógica, e información física de los discos con su estado. Con «wmic path SoftwareLicensingService get OA3xOriginalProductKey» se extrae además la licencia OEM de Windows.',
        d: 'IRAIDA.bat, ROYNER.bat, WinSysToolkit-ELKIN.bat',
        b: 'avanzado'
      },
      {
        c: 'wmic memorychip get BankLabel, Capacity, Speed',
        e: 'WMIC consulta hardware y sistema por consola: RAM, discos, CPU, placa base, licencia. Está obsoleto en Windows 11 y Microsoft pide migrar a PowerShell/Get-CimInstance.',
        d: 'JUANDIEGO-AUTO.bat, ROYNER.bat',
        b: 'avanzado',
        soloGuia: true
      },
      {
        c: 'winget install --id Git.Git --silent   ·   winget upgrade --all',
        e: 'El gestor de paquetes de Windows: instala y actualiza programas sin descargar instaladores a mano. winget list --upgrade-available lista lo actualizable.',
        d: 'YORMAN.bat, CRISTIAN.bat, JEINER.bat',
        b: 'base'
      },
      {
        c: 'where git >nul 2>&1',
        e: 'Busca un ejecutable en el PATH (como which en Linux). Con if %errorlevel%==0 sirve para verificar si algo está instalado.',
        d: 'YORMAN.bat',
        b: 'base'
      },
      {
        c: 'shutdown.exe -s -t 90 -c "Saludos chao"',
        e: 'Apaga el equipo en 90 segundos con un mensaje: -s apagar (-r reiniciar), -t segundos de espera, -c comentario en pantalla.',
        d: 'EjemplosBatch.bat, taller',
        b: 'peligro'
      },
      {
        c: 'shutdown -a',
        e: 'ABORTA un apagado programado. Es el salvavidas si el comando anterior se ejecutó por error.',
        d: 'taller baterías 1',
        b: 'base'
      },
      {
        c: 'powercfg /batteryreport /output "bateria.html"',
        e: 'Genera el informe de batería en HTML: ciclos de carga y comparación entre capacidad de diseño y capacidad real de carga.',
        d: 'CAMILO.bat, JULIAN.bat',
        b: 'base'
      },
      {
        c: 'powercfg /energy   ·   powercfg /list',
        e: '/energy analiza 60 segundos y reporta problemas de eficiencia energética; /list muestra los esquemas de energía disponibles.',
        d: 'JULIAN.bat, DANIEL.bat',
        b: 'base'
      },
      {
        c: 'powercfg -attributes 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 -ATTRIB_HIDE',
        e: 'Muestra u oculta una opción avanzada de energía que el panel no expone, cambiando sus atributos con los GUID de subgrupo y de opción. Antes se hacía a mano en REGEDIT (valor 2 en ATRIBUTES).',
        d: 'taller baterías 1',
        b: 'peligro'
      },
      {
        c: 'sfc /scannow   ·   DISM /Online /Cleanup-Image /RestoreHealth   ·   chkdsk C: /scan',
        e: 'Reparación del sistema: sfc repara archivos del sistema, DISM repara la imagen de la que se abastece sfc (por eso va primero) y chkdsk /scan revisa el disco en caliente sin reiniciar.',
        d: 'JORGE.bat, JULIAN.bat, EDWIN2.bat',
        b: 'avanzado'
      },
      {
        c: 'reg add "HKCU\\...\\Advanced" /v HideIcons /t REG_DWORD /d 1 /f',
        e: 'Modifica el registro de Windows: /v nombre del valor, /t tipo, /d dato y /f fuerza sin preguntar. reg query lee valores.',
        d: 'broma.bat, counter.bat',
        b: 'peligro'
      },
      {
        c: 'driverquery /v   ·   cmdkey /list   ·   runas /user:sistemas cmd   ·   icacls hola.txt',
        e: 'Inventario de controladores, credenciales guardadas, ejecución con otro usuario y permisos (ACL) de un archivo. icacls muestra (I) heredado, (F) control total, (RX) lectura y ejecución; se otorgan con /grant y se quitan con /remove o /deny.',
        d: 'DANIEL.bat, taller baterías 1',
        b: 'avanzado'
      },
      {
        c: 'curl wttr.in/cucuta   ·   rundll32 user32.dll,UpdatePerUserSystemParameters   ·   mshta "app.hta"',
        e: 'Descargar por HTTP (curl viene incluido en Windows 10/11), refrescar la configuración visual tras cambiar el registro, y ejecutar aplicaciones HTA.',
        d: 'JORGE.bat, broma.bat',
        b: 'avanzado'
      },
      {
        c: 'taskschd.msc   ·   start rundll32 user32.dll MessageBeep',
        e: 'Abrir el Programador de tareas y reproducir el sonido de notificación del sistema (truco del segundo ejercicio del taller).',
        d: 'taller baterías 1',
        b: 'base'
      }
    ]
  },
  {
    id: 'C',
    parte: 'AP',
    titulo: 'Red: comandos de los talleres',
    color: '#0369a1',
    resumen:
      'Los comandos de auditoría y configuración de red que aparecen en el Taller No 4 y se combinan con los .bat de diagnóstico.',
    items: [
      {
        c: 'netstat -a   ·   -o   ·   -ano   ·   -b',
        e: 'Todas las conexiones y puertos con su estado; -o añade el PID dueño, -n evita resolver nombres (más rápido y fácil de filtrar) y -b muestra el ejecutable asociado, lo que exige permisos de administrador.',
        d: 'JORGE.bat, DANIEL.bat, WinSysToolkit-ELKIN.bat',
        b: 'base'
      },
      {
        c: 'nslookup www.google.com',
        e: 'Consulta el DNS y devuelve la IP del dominio. Un mismo dominio puede devolver IPs distintas porque hay varios servidores.',
        d: 'taller redes',
        b: 'base'
      },
      {
        c: 'nslookup -type=mx www.ufps.edu.co   ·   -type=ptr',
        e: 'Consulta los registros MX (servidores de correo del dominio) y los PTR (resolución inversa hostname ↔ IP).',
        d: 'taller redes',
        b: 'avanzado'
      },
      {
        c: 'arp -a   ·   arp -a -v   ·   arp -s IP MAC',
        e: 'Muestra la tabla ARP (qué IP local corresponde a qué MAC, con tipo DINÁMICO o ESTÁTICO) y permite fijar una entrada manual.',
        d: 'taller redes',
        b: 'avanzado'
      },
      {
        c: 'net view   ·   net view \\\\NOMBREPC /ALL',
        e: 'Lista los equipos visibles en la red local y los recursos compartidos de uno concreto. Falla con error 6118 cuando el descubrimiento está bloqueado o la red es PÚBLICA.',
        d: 'taller redes',
        b: 'base'
      },
      {
        c: 'tracert www.google.com   ·   pathping www.google.com',
        e: 'tracert muestra cada salto (hop) de la ruta con su IP y tiempo; pathping combina ping y tracert y además mide la pérdida de paquetes por nodo (más lento).',
        d: 'taller redes',
        b: 'base'
      },
      {
        c: 'netsh interface show interface',
        e: 'Estado de todas las interfaces de red: nombre, si está conectada y su modo. netsh sin argumentos entra a su propio entorno interactivo (netsh>).',
        d: 'JORGE.bat, WinSysToolkit-ELKIN.bat',
        b: 'base'
      },
      {
        c: 'netsh interface ipv4 set address "Ethernet" source=static address=192.168.1.6 mask=255.255.255.0 gateway=192.168.1.1',
        e: 'Configura IP estática. Respeta los espacios antes de los signos =: netsh los exige. Para volver a DHCP se usa el mismo comando terminando en «dhcp».',
        d: 'JORGE.bat, EjemplosBatch.bat',
        b: 'avanzado'
      },
      {
        c: 'netsh interface ipv4 set dnsservers "Ethernet" static address=8.8.8.8 primary',
        e: 'Fija el DNS primario; con add dnsservers ... index=2 se agrega uno secundario y con «dhcp» vuelve a automático.',
        d: 'taller redes',
        b: 'avanzado'
      },
      {
        c: 'netsh advfirewall firewall add rule name="Puerto TCP 443" dir=in action=allow protocol=TCP localport=443',
        e: 'Crea una regla de firewall para abrir un puerto: action=allow para abrir, dir=in entrada (dir=out salida). Con action=block se cierra y con delete rule name=... se elimina.',
        d: 'taller redes, ROYNER.bat',
        b: 'avanzado',
        w: 'Si creas otra regla con el mismo nombre, Windows añade una nueva en vez de reemplazarla: borra la anterior primero.'
      },
      {
        c: 'netsh wlan show wlanreport',
        e: 'Genera un informe del WiFi en HTML, XML y CAB: consulta NCSI (conectividad), NDIS (controlador), EAP (autenticación) y WCM (gestión de conexiones).',
        d: 'taller redes',
        b: 'avanzado'
      },
      {
        c: 'nmap -sVC -O 192.168.20.72',
        e: 'Herramienta externa de escaneo: -sV detecta servicios y versiones, -sC ejecuta scripts básicos y -O identifica el sistema operativo. Se usa para verificar que las reglas de firewall funcionan.',
        d: 'taller redes',
        b: 'peligro'
      }
    ]
  },
  {
    id: 'D',
    parte: 'AP',
    titulo: 'Chuletas de referencia rápida',
    color: '#0f766e',
    resumen:
      'Las tablas que conviene tener a mano: escapes de caracteres, códigos de color, comparadores y la lista mínima que exige el taller.',
    items: [],
    tablas: [
      {
        titulo: 'Caracteres que hay que escapar con ^',
        head: ['Carácter', 'Significado normal', 'Cómo imprimirlo o usarlo literal'],
        rows: [
          ['^', 'Escape: neutraliza el carácter siguiente', '^^'],
          ['&', 'Separador de comandos', '^&'],
          ['|', 'Tubería', '^|'],
          ['<  >', 'Redirección de entrada y salida', '^<   ^>'],
          ['(  )', 'Agrupación de bloques', '^(   ^)'],
          ['%', 'Inicio de variable', '%%'],
          ['->', 'Flecha leída como redirección', '-^>'],
          ['"', 'Comillas: se imprimen tal cual', '—']
        ]
      },
      {
        titulo: 'Códigos de color de la consola',
        head: ['Código', 'Fondo', 'Texto'],
        rows: [
          ['0A', 'Negro', 'Verde claro (clásico Matrix)'],
          ['1F', 'Azul', 'Blanco brillante'],
          ['4F', 'Rojo', 'Blanco brillante'],
          ['06', 'Negro', 'Amarillo'],
          ['2F / 4E / 5A', 'Verde / Rojo / Púrpura', 'Blanco / Amarillo / Verde claro'],
          ['(sin argumentos)', 'Restablece negro', 'Restablece blanco']
        ]
      },
      {
        titulo: 'Comparadores y verificaciones',
        head: ['Sintaxis', 'Qué comprueba'],
        rows: [
          ['if "%a%"=="%b%"', 'Igualdad de texto (siempre entre comillas)'],
          ['if /i "a"=="A"', 'Igualdad sin distinguir mayúsculas'],
          ['if not ...', 'Niega cualquier condición'],
          ['EQU / NEQ', 'Igual / distinto (numérico)'],
          ['LSS / LEQ', 'Menor / menor o igual'],
          ['GTR / GEQ', 'Mayor / mayor o igual'],
          ['if exist "ruta"', 'Existe archivo o carpeta'],
          ['if exist "ruta\\"', 'Existe y es una carpeta'],
          ['if errorlevel N', 'errorlevel mayor o igual que N'],
          ['if %errorlevel%==0', 'El comando anterior terminó bien']
        ]
      },
      {
        titulo: 'Lista mínima del Taller No 5',
        head: ['Comando', 'Para qué'],
        rows: [
          ['ECHO / @ECHO OFF', 'Imprimir texto / apagar el eco'],
          ['REM o ::', 'Comentarios'],
          ['MKDIR / RMDIR', 'Crear y borrar directorios'],
          ['DEL / COPY', 'Borrar y copiar archivos'],
          ['TITLE / COLOR', 'Título y colores de la ventana'],
          ['PAUSE / PAUSE > NUL', 'Pausa con y sin mensaje'],
          ['ECHO.', 'Línea en blanco'],
          ['SET / SET /a / SET /p', 'Declarar, calcular y leer del teclado'],
          ['EXIT  0 / 1', 'Cerrar con salida correcta o incorrecta']
        ]
      }
    ]
  }
];
