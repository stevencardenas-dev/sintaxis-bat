// Fase 2: banco de preguntas del previo.
// WMIC, certutil, utilidades de Windows, red, el previo descompuesto, correo,
// ciberseguridad y trampas. Lo que no se puede comparar literalmente lleva su
// `cod` y su regla en verificador-reglas.mjs.

export const seccionesD = [
  {
    id: '16',
    parte: 'AP',
    titulo: 'WMIC a fondo',
    color: '#7c3aed',
    resumen:
      'Consulta de hardware, sistema y licencias desde la consola. Es el comando que más aparece en los scripts de inventario y el que Microsoft está retirando: conviene saber cuál es su sustituto.',
    items: [
      {
        c: 'wmic bios get serialnumber',
        e: 'El número de serie grabado en la BIOS del equipo: la forma más rápida de identificar una máquina sin abrirla.',
        d: 'comandos-de-los-pdf.txt',
        b: 'base'
      },
      {
        cod: 'wmic-cs',
        c: 'wmic computersystem get name, manufacturer, model',
        e: 'Nombre, fabricante y modelo del computador. El orden de las columnas se puede cambiar: lo que importa es pedir las tres.',
        d: 'comandos-de-los-pdf.txt',
        b: 'base'
      },
      {
        cod: 'wmic-cpu',
        c: 'wmic cpu get name, maxclockspeed, architecture',
        e: 'Procesador: nombre comercial, velocidad máxima en MHz y arquitectura (0 = x86, 9 = x64).',
        d: 'comandos-de-los-pdf.txt',
        b: 'base'
      },
      {
        cod: 'wmic-os',
        c: 'wmic os get caption, version',
        e: 'Versión exacta de Windows: el nombre comercial en caption y el número de build en version.',
        d: 'comandos-de-los-pdf.txt',
        b: 'base'
      },
      {
        c: 'wmic path SoftwareLicensingService get OA3xOriginalProductKey',
        e: 'La licencia OEM original grabada en el firmware. Si el equipo nunca tuvo Windows OEM, la columna sale vacía.',
        d: 'comandos-de-los-pdf.txt',
        b: 'avanzado'
      },
      {
        c: 'wmic product get name, version',
        e: 'Aplicaciones instaladas con su versión. Tarda bastante porque consulta el instalador de Windows de cada programa.',
        d: 'comandos-de-los-pdf.txt',
        b: 'base'
      },
      {
        c: 'wmic useraccount list full',
        e: 'Todos los usuarios de Windows con el detalle completo: SID, estado, si la clave caduca, cuándo se cambió.',
        d: 'comandos-de-los-pdf.txt',
        b: 'avanzado'
      },
      {
        c: 'wmic process list brief',
        e: 'Procesos en ejecución en formato corto: nombre, PID, uso de memoria y de CPU.',
        d: 'comandos-de-los-pdf.txt',
        b: 'base'
      },
      {
        cod: 'wmic-nic',
        c: 'wmic nic get name, netenabled, speed, macaddress, manufacturer, description',
        e: 'Tarjetas de red: si están habilitadas, su velocidad, su MAC y el fabricante.',
        d: 'comandos-de-los-pdf.txt',
        b: 'avanzado'
      },
      {
        cod: 'wmic-nicconfig',
        c: 'wmic nicconfig get description, ipaddress, macaddress, dhcpenabled, dnsserversearchorder',
        e: 'El equivalente a ipconfig /all: IP, MAC, si usa DHCP y los servidores DNS de cada tarjeta.',
        d: 'comandos-de-los-pdf.txt',
        b: 'avanzado'
      },
      {
        cod: 'wmic-mem',
        c: 'wmic memorychip get banklabel, capacity, speed, manufacturer, serialnumber',
        e: 'Módulos de RAM: en qué slot está cada uno, su capacidad, velocidad, fabricante y número de serie.',
        d: 'JUANDIEGO-AUTO.bat, ROYNER.bat',
        b: 'avanzado'
      },
      {
        cod: 'cim-mem',
        c: 'Get-CimInstance -ClassName Win32_PhysicalMemory | Select-Object BankLabel, Capacity, Speed',
        e: 'El sustituto moderno en PowerShell: la misma clase WMI, consultada con Get-CimInstance y recortada con Select-Object.',
        d: 'JHOJAN.bat, EDWIN2.bat',
        b: 'avanzado'
      },
      {
        cod: 'wmic-value',
        c: '/value',
        e: 'Modificador que imprime cada dato como CLAVE=VALOR, una por línea. /format:list hace lo mismo.',
        d: 'comandos-de-los-pdf.txt',
        b: 'avanzado'
      },
      {
        cod: 'wmic-obsoleto',
        c: 'WMIC está desaconsejado: Microsoft pide migrar a Get-CimInstance, que consulta el mismo WMI a través de CIM.',
        e: 'La respuesta tiene que nombrar el sustituto y explicar que no es otro sistema, sino otra forma de llegar al mismo WMI.',
        d: 'comandos-de-los-pdf.txt',
        b: 'avanzado'
      }
    ]
  },
  {
    id: '17',
    parte: 'AP',
    titulo: 'certutil y comparación binaria',
    color: '#0f766e',
    resumen:
      'Codificar no es cifrar. Estos comandos convierten, comparan y verifican archivos sin clave ni contraseña, y son la base del ejercicio de integridad del previo.',
    items: [
      {
        c: 'certutil -f -encodehex holabe.txt holabe.hex',
        e: 'Convierte el archivo a un volcado hexadecimal sobrescribiendo el destino si ya existe: -f fuerza y -encodehex codifica.',
        d: 'previo, ANALISIS DE VIRUS.pdf',
        b: 'base',
        w: 'La guía del curso dice -encodebase64: ese argumento no existe. El verbo real es -encode, y -encodehex aparece con certutil -v -?.'
      },
      {
        c: 'certutil -encode archivo.bin archivo.b64',
        e: 'Convierte un binario a Base64, el formato de texto que se puede pegar en un correo o en un script.',
        d: 'ANALISIS DE VIRUS.pdf',
        b: 'base'
      },
      {
        c: 'certutil -decode archivo.b64 archivo.bin',
        e: 'Devuelve un Base64 a su binario original. Es la operación inversa de -encode.',
        d: 'ANALISIS DE VIRUS.pdf',
        b: 'base'
      },
      {
        c: 'fc /b holabe.txt holale.txt',
        e: 'Compara dos archivos byte a byte. Sin /b compara línea a línea, que es lo que se usa para comparar dos instantáneas de texto.',
        d: 'previo',
        b: 'base'
      },
      {
        cod: 'certutil-no-cifra',
        c: 'No: -encodehex codifica el archivo a hexadecimal; no cifra, no hay clave ni cifrado.',
        e: 'Codificar cambia la representación; cifrar necesita una clave. Confundirlos es el error conceptual del ejercicio.',
        d: 'previo',
        b: 'avanzado'
      }
    ]
  },
  {
    id: '18',
    parte: 'AP',
    titulo: 'Consolas y utilidades de Windows',
    color: '#b45309',
    resumen:
      'Memorización pura: el nombre exacto de cada herramienta. Aquí están las mejores trampas, porque varias parejas hacen exactamente lo mismo.',
    items: [
      { c: 'eventvwr · eventvwr.msc', e: 'Visor de eventos: registros de aplicación, sistema y seguridad.', d: 'comandos-de-los-pdf.txt', b: 'base' },
      { c: 'services.msc', e: 'Gestor de servicios: iniciar, detener y cambiar el tipo de inicio.', d: 'comandos-de-los-pdf.txt', b: 'base' },
      { c: 'gpedit.msc', e: 'Editor de directivas de grupo locales.', d: 'comandos-de-los-pdf.txt', b: 'base' },
      { c: 'taskschd.msc · control schedtasks', e: 'Programador de tareas: dos formas válidas de abrirlo.', d: 'taller correo', b: 'base' },
      { c: 'devmgmt.msc · hdwwiz.cpl', e: 'Administrador de dispositivos: dos formas válidas.', d: 'comandos-de-los-pdf.txt', b: 'base' },
      { c: 'msinfo32', e: 'Información del sistema: resumen de hardware, componentes y entorno.', d: 'comandos-de-los-pdf.txt', b: 'base' },
      { c: 'taskmgr', e: 'Administrador de tareas.', d: 'comandos-de-los-pdf.txt', b: 'base' },
      { c: 'perfmon · perfmon.msc', e: 'Monitor de rendimiento: contadores en tiempo real y registros de datos.', d: 'comandos-de-los-pdf.txt', b: 'base' },
      { c: 'resmon', e: 'Monitor de recursos: CPU, disco, red y memoria en una sola pantalla.', d: 'comandos-de-los-pdf.txt', b: 'base' },
      { c: 'regedit · regedt32', e: 'Editor del registro: dos nombres para la misma herramienta.', d: 'comandos-de-los-pdf.txt', b: 'base' },
      { c: 'diskmgmt.msc', e: 'Administrador de discos: particiones, volúmenes y letras.', d: 'comandos-de-los-pdf.txt', b: 'base' },
      { c: 'cleanmgr', e: 'Liberador de espacio en disco.', d: 'comandos-de-los-pdf.txt', b: 'base' },
      { c: 'secpol.msc', e: 'Directiva de seguridad local: contraseñas, bloqueo de cuentas, auditoría.', d: 'comandos-de-los-pdf.txt', b: 'base' },
      { c: 'lusrmgr.msc', e: 'Usuarios y grupos locales.', d: 'comandos-de-los-pdf.txt', b: 'base' },
      {
        c: 'rundll32.exe shell32.dll,Control_RunDLL',
        e: 'Abre el panel de control desde CMD llamando a una función exportada de shell32.dll.',
        d: 'comandos-de-los-pdf.txt',
        b: 'avanzado'
      },
      { c: 'mrt', e: 'Herramienta de eliminación de software malintencionado de Microsoft.', d: 'comandos-de-los-pdf.txt', b: 'base' }
    ]
  },
  {
    id: '19',
    parte: 'AP',
    titulo: 'Red y taller de ciclos',
    color: '#0369a1',
    resumen:
      'Los comandos de los talleres que no son de diagnóstico sino de acción: apagar y encender una interfaz, medir el equipo y reparar la imagen del sistema.',
    items: [
      {
        c: 'netsh interface set interface "Ethernet" disable · netsh interface set interface name="Ethernet" admin=disable',
        e: 'Desactiva la interfaz llamada Ethernet. La segunda forma, con name= y admin=, es la que documenta Microsoft.',
        d: 'taller redes',
        b: 'avanzado'
      },
      {
        c: 'netsh interface set interface "Ethernet" enable · netsh interface set interface name="Ethernet" admin=enable',
        e: 'La vuelve a activar. Sin esto, el script que desconecta por seguridad deja el equipo sin red.',
        d: 'taller redes',
        b: 'avanzado'
      },
      {
        c: 'winsat formal -v',
        e: 'Benchmark completo del equipo con detalle: CPU, disco, gráficos y memoria.',
        d: 'taller baterías 1',
        b: 'base'
      },
      {
        c: 'DISM /Online /Cleanup-Image /RestoreHealth',
        e: 'Comprueba y repara la imagen del sistema de la que se abastece sfc. Va antes que sfc /scannow.',
        d: 'taller baterías 1',
        b: 'avanzado'
      }
    ]
  },
  {
    id: '20',
    parte: 'AP',
    titulo: 'El previo, pieza por pieza',
    color: '#b91c1c',
    resumen:
      'El enunciado del previo descompuesto en las instrucciones que lo resuelven: leer la lista, matar procesos, exportar el estado, compararlo y codificarlo.',
    items: [
      {
        c: 'for /f "tokens=1 delims=," %%a in (lista.txt) do taskkill /f /im %%a',
        e: 'Lee la primera columna de lista.txt y mata cada proceso. La variable del bucle es libre, pero tiene que ser la misma en todo el comando.',
        d: 'previo',
        b: 'avanzado'
      },
      {
        cod: 'previo-export',
        c: 'systeminfo > "%USERPROFILE%\\Desktop\\estado_actual.txt"',
        e: 'Exporta el estado del sistema a un archivo. La ruta es libre; lo que importa es redirigir systeminfo con >.',
        d: 'previo',
        b: 'base'
      },
      {
        cod: 'previo-fc',
        c: 'fc "estado_anterior.txt" "estado_actual.txt" >nul',
        e: 'Compara las dos instantáneas y silencia la salida: el resultado útil es el código de salida.',
        d: 'previo',
        b: 'avanzado'
      },
      {
        cod: 'previo-if-netsh',
        c: 'if errorlevel 1 netsh interface set interface "Ethernet" disable',
        e: 'Si los estados difieren, corta la conexión. if errorlevel 1 significa «código mayor o igual que 1».',
        d: 'previo',
        b: 'avanzado'
      },
      {
        c: 'if exist "estado_anterior.txt" ( fc /b estado_anterior.txt estado_actual.txt ) else ( echo Primera ejecucion )',
        e: 'El bloque completo: compara solo si hay con qué, y si es la primera vez lo dice en lugar de fallar.',
        d: 'previo',
        b: 'avanzado'
      },
      {
        cod: 'previo-fc-salida',
        c: '1',
        e: 'fc devuelve 1 cuando encuentra diferencias y 0 cuando son iguales.',
        d: 'previo',
        b: 'base'
      },
      {
        cod: 'previo-errorlevel',
        c: 'Porque if errorlevel compara mayor o igual: errorlevel 0 siempre es verdadero.',
        e: 'if errorlevel N no pregunta «¿es N?» sino «¿es N o más?». Por eso 0 siempre pasa.',
        d: 'previo',
        b: 'avanzado'
      },
      {
        cod: 'previo-exe',
        c: 'Porque taskkill /im compara contra el nombre de imagen del proceso; sin la extensión .exe puede no encontrarlo.',
        e: 'Por eso conviene que lista.txt traiga los nombres completos, o usar /pid.',
        d: 'previo',
        b: 'avanzado'
      }
    ]
  },
  {
    id: '21',
    parte: 'AP',
    titulo: 'Correo desde un .bat',
    color: '#1d4ed8',
    resumen:
      'Un .bat no habla SMTP, pero puede llamar a PowerShell, que sí. Este es el camino del taller de correo, con sus dos trampas: comillas y credenciales.',
    items: [
      {
        cod: 'mail-lanzador',
        c: 'powershell -ExecutionPolicy Bypass -File "C:\\ruta\\mio.ps1"',
        e: 'Ejecuta el .ps1 sin que la política de ejecución lo bloquee. Los modificadores pueden ir en cualquier orden, pero -File y la ruta son obligatorios.',
        d: 'taller correo',
        b: 'base'
      },
      { c: 'System.Net.Mail.MailMessage', e: 'El objeto .NET con el que se arma el mensaje: de, para, asunto y cuerpo.', d: 'taller correo', b: 'avanzado' },
      { c: 'System.Net.Mail.Attachment', e: 'El objeto con el que se adjunta un archivo al mensaje.', d: 'taller correo', b: 'avanzado' },
      {
        cod: 'mail-587',
        c: 'El puerto 587 y la propiedad EnableSsl en $true.',
        e: 'Gmail y Outlook usan 587 con STARTTLS; sin EnableSsl la conexión se rechaza.',
        d: 'taller correo',
        b: 'base'
      },
      {
        cod: 'mail-clave-app',
        c: 'Una contraseña de aplicación de 16 caracteres.',
        e: 'Con verificación en dos pasos, la contraseña normal no sirve para SMTP; las «apps menos seguras» ya no existen.',
        d: 'taller correo',
        b: 'avanzado'
      },
      {
        cod: 'mail-command',
        c: 'Porque cmd interpreta antes |, >, & y %: se come el script antes de que PowerShell lo vea.',
        e: 'Es el motivo de usar -File o -EncodedCommand en lugar de pegar el script en -Command.',
        d: 'taller correo',
        b: 'avanzado'
      },
      { c: '-EncodedCommand', e: 'Pasa el script en base64 y evita el infierno de comillas entre cmd y PowerShell.', d: 'taller correo', b: 'avanzado' },
      {
        cod: 'schtasks-diario',
        c: 'schtasks /create /tn "EnvioCorreo" /tr "C:\\ruta\\enviar.bat" /sc daily /st 07:00',
        e: 'Crea la tarea diaria a las 7:00. El nombre y la hora son libres; /tn, /tr, /sc daily y /st son obligatorios.',
        d: 'taller correo',
        b: 'avanzado'
      }
    ]
  },
  {
    id: '22',
    parte: 'AP',
    titulo: 'Ciberseguridad: leer un .bat ajeno',
    color: '#7f1d1d',
    resumen:
      'El caso del .bat troyano, contado como patrón y no como receta: qué señales lo delatan, por qué el antivirus no lo ve y cómo se abre sin ejecutarlo.',
    items: [
      {
        cod: 'ciber-senales',
        c: 'Descarga algo de internet, oculta la ventana y ejecuta lo descargado.',
        e: 'Las tres señales juntas: descarga, ocultamiento y ejecución. Cualquiera sola puede ser legítima; las tres no.',
        d: 'ANALISIS DE VIRUS.pdf',
        b: 'avanzado'
      },
      {
        cod: 'ciber-hidden',
        c: 'Oculta la consola para que la descarga no se vea.',
        e: '-WindowStyle Hidden no es sigilo técnico: solo evita que el usuario mire.',
        d: 'ANALISIS DE VIRUS.pdf',
        b: 'base'
      },
      {
        cod: 'ciber-wscript',
        c: 'Ejecuta el .vbs con wscript minimizado, fuera de la consola.',
        e: 'start "" /min wscript archivo.vbs: el VBS corre aparte, en su propio proceso.',
        d: 'ANALISIS DE VIRUS.pdf',
        b: 'avanzado'
      },
      {
        cod: 'ciber-zip',
        c: 'Porque el antivirus no puede escanear el contenido de un ZIP con contraseña.',
        e: 'La contraseña no protege el contenido: solo impide que el antivirus lo lea.',
        d: 'ANALISIS DE VIRUS.pdf',
        b: 'base'
      },
      {
        cod: 'ciber-analisis',
        c: 'Porque el .bat no contiene el payload: solo lo descarga, así que no hay firma que detectar.',
        e: 'El análisis en línea ve un descargador limpio; el daño llega después, desde otro archivo.',
        d: 'ANALISIS DE VIRUS.pdf',
        b: 'avanzado'
      },
      {
        cod: 'ciber-lolbins',
        c: 'Porque son binarios firmados del sistema (LOLBins) y no levantan sospecha.',
        e: 'certutil, bitsadmin y wmic se usan a diario en administración legítima; por eso sirven de camuflaje.',
        d: 'ANALISIS DE VIRUS.pdf',
        b: 'avanzado'
      },
      {
        cod: 'ciber-leer',
        c: 'Abrirlo con el bloc de notas primero y desde ahí abrirlo; nunca doble clic.',
        e: 'Leer antes de ejecutar: el código se entiende en texto, no haciéndolo correr.',
        d: 'ANALISIS DE VIRUS.pdf',
        b: 'base'
      },
      {
        cod: 'ciber-troyano',
        c: 'Era un troyano: crea tareas programadas, impresoras de red y persiste.',
        e: 'Un descargador con persistencia: vuelve a ejecutarse solo aunque se borre el archivo original.',
        d: 'ANALISIS DE VIRUS.pdf',
        b: 'avanzado'
      }
    ]
  },
  {
    id: '23',
    parte: 'AP',
    titulo: 'Trampas que sí revientan',
    color: '#9f1239',
    resumen:
      'Los errores que no dan mensaje de error: el script sigue, imprime otra cosa y nadie entiende por qué. Todos aparecen en los .bat del curso.',
    items: [
      {
        cod: 'trampa-nul',
        c: 'pause >nul',
        e: 'En Windows el dispositivo es nul, con una sola l. null no existe: crea un archivo llamado null y la pausa no se silencia.',
        d: 'EjemplosBatch.bat',
        b: 'trampa'
      },
      {
        c: 'set "origen=C:\\datos"',
        e: 'Sin espacios alrededor del igual y con comillas que envuelven la asignación completa.',
        d: 'ERIKA.bat',
        b: 'trampa'
      },
      {
        c: 'if "%opcion%"=="1"',
        e: 'Con comillas en los dos lados: si la variable queda vacía, la línea no se rompe.',
        d: 'ERIKA.bat',
        b: 'trampa'
      },
      { c: 'rem', e: 'Dentro de un bloque entre paréntesis, :: rompe el script; rem funciona siempre.', d: 'EjemplosBatch.bat', b: 'trampa' },
      { c: 'echo Progreso: 50%%', e: 'El porcentaje literal se escribe doble, porque un % solo intenta abrir una variable.', d: 'guía', b: 'trampa' },
      {
        cod: 'trampa-doble-porcentaje',
        c: 'Dentro de un .bat se escribe %%a; en la consola, %a.',
        e: 'La consola no necesita escape porque no guarda el script en un archivo; el intérprete del .bat sí.',
        d: 'guía',
        b: 'base'
      },
      { c: 'cd /d "%~dp0"', e: 'Ancla el script a su propia carpeta, sin importar desde dónde se ejecute.', d: 'JULIAN.bat, broma.bat', b: 'base' },
      {
        cod: 'trampa-comillas',
        c: 'Faltan las comillas que envuelven toda la expresión: if exist "%ruta%\\archivo.txt".',
        e: 'Con rutas que tienen espacios, las comillas deben abarcar la ruta completa, no solo una parte.',
        d: 'ERIKA.bat',
        b: 'trampa'
      }
    ]
  }
];
