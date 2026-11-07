// Casos especiales del verificador.
//
// El motor deduce solo lo que puede: familias separadas por «·» (cualquiera
// vale), bloques multilínea, y las respuestas con «→» o «...» quedan en modo
// revelar. Aquí se declaran a mano los casos que necesitan algo más:
//
//   alt        -> varias respuestas exactas válidas
//   campos     -> la respuesta son dos o más piezas (cada una con su campo)
//   requisitos -> se corrige por piezas, con puntuación parcial
//
// La clave es el texto canónico del ítem (campo `c`) o su `cod` si lo tiene.

const PWSH_CORREO =
  'powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0enviar-correo.ps1"\n' +
  '$ClienteSMTP = New-Object Net.Mail.SmtpClient($ServidorSMTP, 587)\n' +
  '$ClienteSMTP.EnableSsl = $true';

export const reglas = {
  // --- dos piezas: el lanzador en el .bat y el cliente SMTP en el .ps1 ---
  'pwsh-correo': {
    campos: [
      {
        rotulo: 'Enviar-correo.bat: la línea que llama al .ps1',
        alt: [
          PWSH_CORREO.split('\n')[0],
          'powershell -ExecutionPolicy Bypass -File "%~dp0enviar-correo.ps1"',
          'powershell -NoProfile -ExecutionPolicy Bypass -File enviar-correo.ps1',
          'powershell -NoProfile -ExecutionPolicy Bypass -File "enviar-correo.ps1"'
        ]
      },
      {
        rotulo: 'Enviar-correo.ps1: cómo se crea y configura el cliente SMTP',
        requisitos: [
          {
            texto: 'Crea el cliente con New-Object y la clase Net.Mail.SmtpClient',
            re: 'new-object\\s+(system\\.)?net\\.mail\\.smtpclient'
          },
          { texto: 'Usa el puerto 587', re: '\\b587\\b' },
          { texto: 'Activa SSL con EnableSsl', re: 'enablessl\\s*=\\s*\\$true' }
        ]
      }
    ]
  },

  // --- piezas sueltas donde no hay una única línea correcta ---
  'net session >nul 2>&1   &   if %errorlevel% neq 0 ( ... )': {
    requisitos: [
      { texto: 'Comprueba la sesión de administrador con net session', re: 'net\\s+session' },
      { texto: 'Silencia la salida y el error con >nul 2>&1', re: '>nul\\s*2>&1' },
      { texto: 'Reacciona con if %errorlevel% distinto de 0', re: '%errorlevel%.*neq\\s*0' }
    ]
  },

  'set /p resp= Desea continuar? (S/N):   →   if /i "%resp%"=="S"': {
    requisitos: [
      { texto: 'Pide el dato con set /p', re: 'set\\s+/p' },
      { texto: 'Compara sin distinguir mayúsculas con if /i', re: 'if\\s+/i' },
      { texto: 'Compara %resp% contra "S"', re: '%resp%.*"s"' }
    ]
  },

  // --- dos formas válidas de lo mismo ---
  'netstat -ano': { alt: ['netstat -a -n -o', 'netstat -noa'] },

  // ===== Banco del previo (fase 2) =====

  // --- WMIC: columnas en cualquier orden ---
  'wmic-cs': {
    requisitos: [
      { texto: 'Consulta computersystem con wmic', re: 'wmic\\s+computersystem\\s+get' },
      { texto: 'Pide el nombre', re: '\\bname\\b' },
      { texto: 'Pide el fabricante', re: '\\bmanufacturer\\b' },
      { texto: 'Pide el modelo', re: '\\bmodel\\b' }
    ]
  },
  'wmic-cpu': {
    requisitos: [
      { texto: 'Consulta cpu con wmic', re: 'wmic\\s+cpu\\s+get' },
      { texto: 'Pide el nombre', re: '\\bname\\b' },
      { texto: 'Pide maxclockspeed', re: 'maxclockspeed' },
      { texto: 'Pide architecture', re: 'architecture' }
    ]
  },
  'wmic-os': {
    requisitos: [
      { texto: 'Consulta os con wmic', re: 'wmic\\s+os\\s+get' },
      { texto: 'Pide caption', re: 'caption' },
      { texto: 'Pide version', re: 'version' }
    ]
  },
  'wmic-nic': {
    requisitos: [
      { texto: 'Consulta nic con wmic', re: 'wmic\\s+nic\\s+get' },
      { texto: 'Pide netenabled', re: 'netenabled' },
      { texto: 'Pide macaddress', re: 'macaddress' },
      { texto: 'Pide manufacturer', re: 'manufacturer' }
    ]
  },
  'wmic-nicconfig': {
    requisitos: [
      { texto: 'Consulta nicconfig con wmic', re: 'wmic\\s+nicconfig\\s+get' },
      { texto: 'Pide ipaddress', re: 'ipaddress' },
      { texto: 'Pide dhcpenabled', re: 'dhcpenabled' },
      { texto: 'Pide dnsserversearchorder', re: 'dnsserversearchorder' }
    ]
  },
  'wmic-mem': {
    requisitos: [
      { texto: 'Consulta memorychip con wmic', re: 'wmic\\s+memorychip\\s+get' },
      { texto: 'Pide banklabel', re: 'banklabel' },
      { texto: 'Pide capacity', re: 'capacity' },
      { texto: 'Pide speed', re: 'speed' },
      { texto: 'Pide serialnumber', re: 'serialnumber' }
    ]
  },
  'cim-mem': {
    requisitos: [
      { texto: 'Usa Get-CimInstance', re: 'get-ciminstance' },
      { texto: 'Consulta Win32_PhysicalMemory', re: 'win32_physicalmemory' },
      { texto: 'Recorta con Select-Object', re: 'select-object' }
    ]
  },
  'wmic-value': { alt: ['/value', '/format:list'] },
  'wmic-obsoleto': {
    requisitos: [
      { texto: 'Dice que está desaconsejado u obsoleto', re: 'obsolet|desaconsej|migr' },
      { texto: 'Nombra el sustituto Get-CimInstance o CIM', re: 'get-ciminstance|cim' },
      { texto: 'Menciona WMI', re: 'wmi' }
    ]
  },

  // --- certutil no cifra ---
  'certutil-no-cifra': {
    requisitos: [
      { texto: 'Dice que codifica', re: 'codific' },
      { texto: 'Menciona hexadecimal', re: 'hexadecimal' },
      { texto: 'Aclara que no cifra o que no hay clave', re: 'no\\s+(cifra|cifrado|hay\\s+clave)|sin\\s+clave' }
    ]
  },

  // --- el previo ---
  'previo-export': {
    requisitos: [
      { texto: 'Exporta con systeminfo', re: 'systeminfo' },
      { texto: 'Redirige la salida a un archivo', re: '>' }
    ]
  },
  'previo-fc': {
    requisitos: [
      { texto: 'Compara con fc', re: '\\bfc\\b' },
      { texto: 'Usa dos archivos', re: '\\.txt' },
      { texto: 'Silencia la salida con >nul', re: '>\\s*nul' }
    ]
  },
  'previo-if-netsh': {
    requisitos: [
      { texto: 'Usa if errorlevel 1', re: 'if\\s+errorlevel\\s+1' },
      { texto: 'Cambia la interfaz con netsh interface set interface', re: 'netsh\\s+interface\\s+set\\s+interface' },
      { texto: 'La desactiva con disable', re: 'disable' }
    ]
  },
  'previo-fc-salida': { alt: ['1', 'codigo 1', 'codigo de salida 1'] },
  'previo-errorlevel': {
    requisitos: [
      { texto: 'Explica que siempre es verdadero', re: 'siempre' },
      { texto: 'Menciona mayor o igual', re: 'mayor\\s+o\\s+igual|>=' }
    ]
  },
  'previo-exe': {
    requisitos: [
      { texto: 'Habla del nombre de imagen o de /im', re: 'nombre\\s+de\\s+imagen|/im\\b' },
      { texto: 'Menciona la extensión .exe', re: '\\.exe|extension' }
    ]
  },

  'previo-completo': {
    requisitos: [
      { texto: 'Apaga el eco al arrancar', re: '@echo\\s+off' },
      { texto: 'Lee lista.txt con for /f', re: 'for\\s+/f[\\s\\S]*lista\\.txt' },
      { texto: 'Mata cada proceso con taskkill /f /im', re: 'taskkill\\s+/f\\s+/im' },
      { texto: 'Exporta el estado con systeminfo y una redirección', re: 'systeminfo\\s*>' },
      { texto: 'Compara los dos estados con fc', re: '\\bfc\\b[\\s\\S]*estado_anterior' },
      { texto: 'Usa if errorlevel 1', re: 'if\\s+errorlevel\\s+1' },
      { texto: 'Desactiva Ethernet con netsh ... disable', re: 'netsh\\s+interface\\s+set\\s+interface[\\s\\S]*disable' },
      { texto: 'Codifica a hexadecimal con certutil -encodehex', re: 'certutil[\\s\\S]*-encodehex' }
    ]
  },

  // --- correo ---
  'mail-lanzador': {
    requisitos: [
      { texto: 'Llama a powershell', re: 'powershell' },
      { texto: 'Usa -ExecutionPolicy Bypass', re: '-executionpolicy\\s+bypass' },
      { texto: 'Ejecuta con -File', re: '-file' },
      { texto: 'Apunta a un archivo .ps1', re: '\\.ps1' }
    ]
  },
  'mail-587': {
    requisitos: [
      { texto: 'Usa el puerto 587', re: '587' },
      { texto: 'Activa SSL con EnableSsl', re: 'enablessl' },
      { texto: 'Lo pone en true', re: 'true' }
    ]
  },
  'mail-clave-app': {
    requisitos: [
      { texto: 'Habla de una contraseña de aplicación', re: 'aplicaci' },
      { texto: 'Menciona los 16 caracteres', re: '16|diecis' }
    ]
  },
  'mail-command': {
    requisitos: [
      { texto: 'Menciona que cmd interpreta primero', re: 'cmd' },
      { texto: 'Nombra los caracteres que rompen la línea', re: '[|>&%]' }
    ]
  },
  'schtasks-diario': {
    requisitos: [
      { texto: 'Usa schtasks /create', re: 'schtasks\\s+/create' },
      { texto: 'Pone nombre con /tn', re: '/tn' },
      { texto: 'Pone la tarea con /tr', re: '/tr' },
      { texto: 'La agenda a diario con /sc daily', re: '/sc\\s+daily' },
      { texto: 'Fija la hora con /st', re: '/st\\s+\\d{1,2}:\\d{2}' }
    ]
  },

  // --- ciberseguridad: conceptos, no texto literal ---
  'ciber-senales': {
    requisitos: [
      { texto: 'Detecta la descarga remota', re: 'descarg' },
      { texto: 'Detecta la ventana oculta', re: 'ocult|hidden' },
      { texto: 'Detecta la ejecución de lo descargado', re: 'ejecut' }
    ]
  },
  'ciber-hidden': {
    requisitos: [
      { texto: 'Explica que oculta', re: 'ocult' },
      { texto: 'Nombra la consola o la ventana', re: 'consola|ventana' },
      { texto: 'Lo relaciona con la descarga', re: 'descarg' }
    ]
  },
  'ciber-wscript': {
    requisitos: [
      { texto: 'Ejecuta con wscript', re: 'wscript' },
      { texto: 'Minimizado', re: 'minimiz' },
      { texto: 'Es un .vbs', re: 'vbs' }
    ]
  },
  'ciber-zip': {
    requisitos: [
      { texto: 'Menciona el antivirus', re: 'antivirus' },
      { texto: 'No puede escanearlo o analizarlo', re: 'escan|analiz' },
      { texto: 'La contraseña', re: 'contrasena|contraseña|clave' }
    ]
  },
  'ciber-analisis': {
    requisitos: [
      { texto: 'El .bat no contiene la carga', re: 'no\\s+contiene|solo\\s+(lo\\s+)?descarga' },
      { texto: 'Nombra el payload o la carga útil', re: 'payload|carga' },
      { texto: 'No hay firma que detectar', re: 'firma|detect' }
    ]
  },
  'ciber-lolbins': {
    requisitos: [
      { texto: 'Son binarios firmados', re: 'firmad' },
      { texto: 'Del sistema', re: 'sistema' },
      { texto: 'No levantan sospecha', re: 'sospech' }
    ]
  },
  'ciber-leer': {
    requisitos: [
      { texto: 'Abre con el bloc de notas', re: 'bloc\\s+de\\s+notas|notepad' },
      { texto: 'No lo ejecuta', re: 'nunca|sin\\s+ejecutar|no\\s+abrir' }
    ]
  },
  'ciber-troyano': {
    requisitos: [
      { texto: 'Dice que era un troyano', re: 'troyano' },
      { texto: 'Crea tareas programadas', re: 'tarea' },
      { texto: 'Persiste o toca impresoras de red', re: 'impresora|persist' }
    ]
  },

  // --- trampas ---
  'trampa-nul': { alt: ['pause >nul', 'pause > nul'] },
  'trampa-doble-porcentaje': {
    requisitos: [
      { texto: 'Distingue %%a de %a', re: '%%' },
      { texto: 'Lo ubica en la consola', re: 'consola' },
      { texto: 'Lo ubica en el archivo .bat', re: '\\.bat|archivo' }
    ]
  },
  'trampa-comillas': {
    requisitos: [
      { texto: 'Habla de las comillas', re: 'comillas' },
      { texto: 'Deben envolver toda la expresión', re: 'expresi[oó]n' },
      { texto: 'Lo relaciona con las rutas o los espacios', re: 'ruta|espacios' }
    ]
  },

  // ===== Recetas que antes solo se revelaban =====
  // Se piden por requisitos: la respuesta modelo lleva «...» y no se puede
  // comparar literalmente, pero sí comprobar que el guion tiene lo esencial.

  'if errorlevel 1 ( ... ) else ( ... )': {
    requisitos: [
      { texto: 'Comprueba if errorlevel 1', re: 'if\\s+errorlevel\\s+1' },
      { texto: 'Distingue la otra rama con else', re: '\\belse\\b' },
      { texto: 'Agrupa cada rama entre paréntesis', re: '\\([\\s\\S]*\\)\\s*else\\s*\\(' }
    ]
  },

  'for /f ... do set CPUL=%%A   →   echo !CPUL!%%': {
    requisitos: [
      { texto: 'Recorre la salida con for /f', re: 'for\\s+/f' },
      { texto: 'Asigna con set y la variable del bucle', re: 'set\\s+\\w+\\s*=\\s*%%[a-z]' },
      { texto: 'Imprime con expansión retardada !CPUL!', re: '![a-z_]\\w*!' },
      { texto: 'Cierra con echo', re: 'echo' }
    ]
  },

  ':AYUDA ... :FIN   +   goto AYUDA': {
    requisitos: [
      { texto: 'Define la etiqueta :AYUDA', re: ':ayuda' },
      { texto: 'Define la etiqueta :FIN', re: ':fin' },
      { texto: 'Salta a ella con goto AYUDA', re: 'goto\\s+:?ayuda' }
    ]
  },

  ':while1 ... if %x% leq 8 ( ... ) ... goto :while1': {
    requisitos: [
      { texto: 'Abre el bucle con :while1', re: ':while1' },
      { texto: 'Compara con if %x% leq 8', re: 'if\\s+%x%\\s+leq\\s+8' },
      { texto: 'Vuelve con goto :while1', re: 'goto\\s+:while1' }
    ]
  },

  ':estudio ... :descanso ... (sin goto final)': {
    requisitos: [
      { texto: 'Define la etiqueta :estudio', re: ':estudio' },
      { texto: 'Define la etiqueta :descanso', re: ':descanso' },
      { texto: 'Explica que sin goto se cae en la etiqueta siguiente', re: 'sin\\s+goto|cae|sigue|contin' }
    ]
  },

  ':menu → cls → echo opciones → set /p → if → goto': {
    requisitos: [
      { texto: 'Abre con la etiqueta :menu', re: ':menu' },
      { texto: 'Limpia la pantalla con cls', re: '\\bcls\\b' },
      { texto: 'Lee la opción con set /p', re: 'set\\s+/p' },
      { texto: 'Decide con if y salta con goto', re: 'if[\\s\\S]*goto' }
    ]
  },

  '( echo ... & comando & echo ... ) > "%archivo%"': {
    requisitos: [
      { texto: 'Agrupa el bloque entre paréntesis', re: '\\([\\s\\S]*\\)' },
      { texto: 'Encadena los comandos con &', re: '&' },
      { texto: 'Redirige el conjunto a %archivo%', re: '\\)\\s*>\\s*"%archivo%"' }
    ]
  },

  'set BAR=   →   for %%A in (1 2 3 ...) do ( set BAR=!BAR!# & cls & echo !BAR! )': {
    requisitos: [
      { texto: 'Inicializa BAR vacía', re: 'set\\s+BAR=' },
      { texto: 'Crece dentro de un for %%A in (...)', re: 'for\\s+%%[a-z]\\s+in' },
      { texto: 'Acumula con expansión retardada !BAR!', re: '!BAR!' },
      { texto: 'Repinta la línea con cls', re: '\\bcls\\b' }
    ]
  },

  'if exist "estado\\fondo_original.txt" ( ... ) else ( ... )': {
    requisitos: [
      { texto: 'Comprueba con if exist', re: 'if\\s+exist' },
      { texto: 'Mira el archivo de estado fondo_original.txt', re: 'fondo_original\\.txt' },
      { texto: 'Distingue las dos ramas con else', re: '\\belse\\b' }
    ]
  },

  'fc viejo nuevo >nul   →   if errorlevel 1 ( avisar )': {
    requisitos: [
      { texto: 'Compara con fc', re: '\\bfc\\b' },
      { texto: 'Silencia la salida con >nul', re: '>\\s*nul' },
      { texto: 'Avisa con if errorlevel 1', re: 'if\\s+errorlevel\\s+1' }
    ]
  },

  'set origen = C:\\Users\\...\\SO Sem 1': {
    requisitos: [
      { texto: 'Usa set', re: '\\bset\\b' },
      { texto: 'Asigna la variable origen', re: 'origen\\s*=' },
      { texto: 'Apunta a la carpeta SO Sem 1', re: 'so\\s+sem\\s+1' }
    ]
  },

  'if exist %command% echo Compiling... [salto] else goto :error': {
    requisitos: [
      { texto: 'Comprueba if exist sobre %command%', re: 'if\\s+exist\\s+"?%command%"?' },
      { texto: 'Avisa con echo', re: 'echo' },
      { texto: 'Salta al error con goto :error', re: 'goto\\s+:error' }
    ]
  },

  'if %opcion%==1 ...   (con opcion vacía)': {
    requisitos: [
      { texto: 'Compara %opcion% con 1', re: 'if\\s+"?%opcion%"?\\s*==\\s*"?1"?' },
      { texto: 'Protege la comparación con comillas (o lo advierte)', re: '"%opcion%"|comillas|vac[ií]a' }
    ]
  },

  'wmic /namespace:\\\\root\\SecurityCenter2 ...': {
    requisitos: [
      { texto: 'Consulta con wmic /namespace:', re: 'wmic\\s+/namespace:' },
      { texto: 'Entra en SecurityCenter2', re: 'securitycenter2' },
      { texto: 'Cierra la ruta con una barra', re: '\\\\' }
    ]
  },

  'for ... do (  :: comentario  )': {
    requisitos: [
      { texto: 'Abre un bloque con for ... do (', re: 'for[\\s\\S]*do\\s*\\(' },
      { texto: 'Escribe un comentario dentro', re: '::|rem' },
      { texto: 'Señala que :: falla dentro del bloque', re: '::' }
    ]
  },

  '... | Select-Object Id | Export-Csv -Path C:\\Hilos.csv -NoTypeInformation': {
    requisitos: [
      { texto: 'Selecciona Id con Select-Object', re: 'select-object\\s+id' },
      { texto: 'Exporta con Export-Csv', re: 'export-csv' },
      { texto: 'Escribe en C:\\Hilos.csv', re: 'hilos\\.csv' },
      { texto: 'Omite la cabecera con -NoTypeInformation', re: '-notypeinformation' }
    ]
  },

  'powercfg -attributes 2a737441-... 48352abd-... -ATTRIB_HIDE': {
    requisitos: [
      { texto: 'Usa powercfg -attributes', re: 'powercfg\\s+-attributes' },
      { texto: 'Pasa los dos GUID', re: '2a737441[\\s\\S]*48352abd' },
      { texto: 'Oculta la opción con -ATTRIB_HIDE', re: '-attrib_hide' }
    ]
  },

  'reg add "HKCU\\...\\Advanced" /v HideIcons /t REG_DWORD /d 1 /f': {
    requisitos: [
      { texto: 'Escribe con reg add en HKCU', re: 'reg\\s+add\\s+"?hkcu' },
      { texto: 'Crea el valor HideIcons con /v', re: '/v\\s+hideicons' },
      { texto: 'Lo declara REG_DWORD con /t', re: '/t\\s+reg_dword' },
      { texto: 'Le da el valor 1 con /d', re: '/d\\s+1' },
      { texto: 'Fuerza sin preguntar con /f', re: '/f' }
    ]
  }
};
