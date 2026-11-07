# Banco de preguntas propuesto

Implementado en la fase 2: estas preguntas ya están en el quiz (`src/datos-d.mjs`), con
sus reglas de corrección en `src/verificador-reglas.mjs`. El documento queda como registro
de lo que se propuso y de dónde salió cada pregunta.

Fuentes: `BATERIAS/comandos-de-los-pdf.txt`, `6 Baterias con ciclos.pdf`,
`ANALISIS DE VIRUS.pdf`, `COMANDOS EJECUTAR ROBLES (1).pdf`,
`Taller avanzado CORREO programador de tareas.pdf`.

## Leyenda de verificación

| Etiqueta | Significado |
|---|---|
| `exacta` | Igualdad tras normalizar espacios, comillas y mayúsculas donde no importan. |
| `huecos` | Patrón con piezas libres: nombre de variable, etiqueta, ruta, texto de `echo`. |
| `conjunto` | Cualquiera de una lista cerrada de respuestas válidas. |
| `requisitos` | Se corrige por piezas y da puntuación parcial (n de m). |
| `conceptos` | Respuesta en prosa: se exigen conceptos presentes, no texto literal. |

---

## 1. WMIC (14 preguntas)

Lo que ya cubre el quiz: `logicaldisk`/`diskdrive`, `memorychip`, `SoftwareLicensingService`
y `/namespace`. Faltaban estas, todas documentadas en `comandos-de-los-pdf.txt`.

- **Número de serie grabado en la BIOS del equipo** · `wmic bios get serialnumber` · exacta
- **Nombre, fabricante y modelo del computador** · `wmic computersystem get name, manufacturer, model` · huecos (orden de columnas libre)
- **Nombre del procesador, velocidad máxima y arquitectura** · `wmic cpu get name, maxclockspeed, architecture` · huecos
- **Versión exacta del sistema operativo** · `wmic os get caption, version` · exacta
- **Licencia OEM original de Windows** · `wmic path SoftwareLicensingService get OA3xOriginalProductKey` · exacta
- **Aplicaciones instaladas con su versión** · `wmic product get name, version` · exacta
- **Todos los usuarios de Windows con detalle completo** · `wmic useraccount list full` · exacta
- **Procesos en ejecución, de forma breve** · `wmic process list brief` · exacta
- **Tarjetas de red: nombre, si están habilitadas, velocidad, MAC y fabricante** · `wmic nic get name, netenabled, speed, macaddress, manufacturer, description` · huecos
- **Descripción, IP, MAC, DHCP y servidores DNS de cada tarjeta (el equivalente a `ipconfig /all`)** · `wmic nicconfig get description, ipaddress, macaddress, dhcpenabled, dnsserversearchorder` · huecos
- **Módulos de RAM: slot, capacidad, velocidad, fabricante y serie** · `wmic memorychip get banklabel, capacity, speed, manufacturer, serialnumber` · huecos
- **Sustituto moderno en PowerShell de `wmic memorychip`** · `Get-CimInstance -ClassName Win32_PhysicalMemory | Select-Object BankLabel, Capacity, Speed, Manufacturer, SerialNumber` · huecos (`Get-CimInstance` + `Win32_PhysicalMemory` + `Select-Object` obligatorios)
- **Modificador de `wmic` que imprime cada línea como `CLAVE=VALOR`** · `/value` · exacta
- **¿Por qué `wmic` se considera obsoleto?** · migrado a `Get-CimInstance` / WMI sobre CIM · conceptos

## 2. certutil y comparación binaria (5 preguntas)

> **Corrección a la guía**: `certutil -encodebase64` **no existe**. Probado en Windows:
> `CertUtil: Argumento desconocido: -encodebase64`. El verbo real es `-encode`, y `-encodehex`
> sí existe (requiere `certutil -v -?` para verse en la ayuda).

- **Convierte `holabe.txt` a hexadecimal, sobrescribiendo el destino si existe** · `certutil -f -encodehex holabe.txt holabe.hex` · exacta
- **Convierte un archivo binario a Base64** · `certutil -encode archivo.bin archivo.b64` · exacta
- **Devuelve un Base64 a su binario original** · `certutil -decode archivo.b64 archivo.bin` · exacta
- **Compara dos archivos a nivel binario** · `fc /b holabe.txt holale.txt` · exacta
- **En el ejercicio del previo: ¿`-encodehex` cifra el archivo?** · No: lo **codifica** a hexadecimal; no hay clave ni cifrado · conceptos

Detalle para la explicación: `-encodehex` produce un volcado con desplazamiento, bytes y el
texto en ASCII al lado — no una cadena hexadecimal limpia. Es lo que se pide en el previo,
pero conviene que el alumno lo sepa.

## 3. Consolas, panel de control y utilidades (16 preguntas)

Memorización pura, verificación exacta. Aquí están las mejores trampas: varias parejas
hacen exactamente lo mismo.

- **Visor de eventos** · `eventvwr.msc` · conjunto (`eventvwr`, `eventvwr.msc`)
- **Gestor de servicios** · `services.msc` · exacta
- **Editor de directivas de grupo** · `gpedit.msc` · exacta
- **Programador de tareas (dos formas válidas)** · `taskschd.msc` · conjunto (`taskschd.msc`, `control schedtasks`)
- **Administrador de dispositivos (dos formas válidas)** · `devmgmt.msc` · conjunto (`devmgmt.msc`, `hdwwiz.cpl`)
- **Información del sistema** · `msinfo32` · exacta
- **Administrador de tareas** · `taskmgr` · exacta
- **Monitor de rendimiento** · `perfmon.msc` · conjunto (`perfmon`, `perfmon.msc`)
- **Monitor de recursos** · `resmon` · exacta
- **Editor del registro (dos nombres)** · `regedit` · conjunto (`regedit`, `regedt32`)
- **Administrador de discos** · `diskmgmt.msc` · exacta
- **Liberador de espacio en disco** · `cleanmgr` · exacta
- **Directiva de seguridad local** · `secpol.msc` · exacta
- **Usuarios y grupos locales** · `lusrmgr.msc` · exacta
- **Abre el panel de control desde CMD con `rundll32`** · `rundll32.exe shell32.dll,Control_RunDLL` · exacta
- **Abre la herramienta de eliminación de malware** · `mrt` · exacta

## 4. Red y taller de ciclos (4 preguntas)

- **Desactiva la interfaz de red llamada Ethernet** · `netsh interface set interface "Ethernet" disable` · conjunto (también `netsh interface set interface name="Ethernet" admin=disable`)
- **Actívala de nuevo** · `netsh interface set interface "Ethernet" enable` · conjunto (forma `admin=enable`)
- **Benchmark completo del equipo con detalle** · `winsat formal -v` · exacta
- **Comprueba y repara la imagen del sistema** · `DISM /Online /Cleanup-Image /RestoreHealth` · exacta

---

## 5. El previo, descompuesto

> «Termina forzosamente los procesos de `lista.txt`, compara el estado del sistema con
> otro estado y si es diferente cierra la conexión Ethernet, exporta la información del
> sistema y encriptalo en hexadecimal.»

Un script de referencia (hay muchas variantes válidas; por eso se corrige por requisitos):

```bat
@echo off
chcp 65001 >nul
net session >nul 2>&1
if errorlevel 1 ( echo Se necesitan permisos de administrador & pause & exit /b )

for /f "tokens=1 delims=," %%a in (lista.txt) do taskkill /f /im "%%a"

systeminfo > "%USERPROFILE%\Desktop\estado_actual.txt"
fc "estado_anterior.txt" "estado_actual.txt" >nul
if errorlevel 1 (
    netsh interface set interface "Ethernet" disable
)

certutil -f -encodehex "estado_actual.txt" "estado_actual.hex"
pause
```

Requisitos que se marcan por separado (puntuación n/8):

| # | Requisito |
|---|---|
| R1 | Lee `lista.txt` con `for /f` |
| R2 | Usa `taskkill /f` y el argumento es la **misma** variable que declara el bucle |
| R3 | Exporta el estado con `systeminfo >` (o `msinfo32 /report`) |
| R4 | Compara los dos estados con `fc` y dos operandos |
| R5 | Usa `if errorlevel 1` (no `errorlevel 0`, que siempre es verdadero) |
| R6 | Desactiva la interfaz con `netsh interface set interface ... disable`, dentro del `if` |
| R7 | Codifica a hexadecimal con `certutil -f -encodehex`, con entrada y salida distintas |
| R8 | (opcional) Exige administrador antes de empezar |

Preguntas individuales que salen de aquí:

- **¿Qué devuelve `fc` cuando los archivos son distintos?** · código de salida 1 · exacta
- **¿Por qué `if errorlevel 0` no sirve para detectar diferencias?** · es verdadero siempre, porque la condición es «mayor o igual» · conceptos
- **¿Por qué conviene que `lista.txt` traiga los nombres con `.exe`?** · `taskkill /im` compara contra el nombre de imagen del proceso; si falta la extensión puede no encontrarlo, así que se escribe en la lista o se usa `/pid` · conceptos

## 6. Correo desde un .bat (8 preguntas)

Un `.bat` no habla SMTP por sí solo, pero sí puede llamar a Windows PowerShell, que viene
instalado. Es la vía que usa el taller, solo que desde un archivo `.bat`.

- **Desde un `.bat`, ejecuta `mio.ps1` sin que la política de ejecución lo bloquee** · `powershell -ExecutionPolicy Bypass -File "C:\ruta\mio.ps1"` · huecos (flags en cualquier orden; `-File` y la ruta obligatorios)
- **Objeto de .NET con el que se arma el mensaje** · `System.Net.Mail.MailMessage` · exacta
- **Objeto con el que se adjunta un archivo** · `System.Net.Mail.Attachment` · exacta
- **Puerto y propiedad que exige Gmail** · puerto `587` + `EnableSsl = $true` · huecos
- **¿Qué credencial hay que usar en Gmail con verificación en dos pasos?** · contraseña de aplicación de 16 caracteres (las «apps menos seguras» ya no existen) · conceptos
- **¿Por qué pegar el script entero en `powershell -Command` desde un `.bat` falla?** · `cmd` interpreta antes `|`, `>`, `&` y `%` · conceptos
- **Flag que pasa el script en base64 y evita el infierno de comillas** · `-EncodedCommand` · exacta
- **Crea una tarea diaria a las 7:00 que ejecute `enviar.bat`** · `schtasks /create /tn "EnvioCorreo" /tr "C:\ruta\enviar.bat" /sc daily /st 07:00` · huecos (nombre y hora libres)

Nota: la guía usa `smtp.office365.com` para Outlook y `smtp.gmail.com` para Gmail; ambos
en el puerto 587 con SSL. Conviene que el banco pregunte el servidor según el proveedor.

## 7. Ciberseguridad (8 preguntas)

> Sin la URL ni el payload del PDF: esa dirección sigue viva y apunta a un `.vbs` troyano.
> Las preguntas describen el patrón, no lo reproducen.

- **Tres señales de que un `.bat` adjunto es malicioso** · descarga remota + ventana oculta + ejecución de lo descargado · conceptos (3 de 3)
- **¿Qué hace `-WindowStyle Hidden` y para qué lo usa el atacante?** · oculta la consola para que no se vea la descarga · conceptos
- **¿Qué hace `start "" /min wscript archivo.vbs`?** · ejecuta el VBS minimizado, fuera de la consola · conceptos
- **¿Por qué un ZIP con contraseña enviado por correo es sospechoso?** · el antivirus no puede escanear su contenido · conceptos
- **¿Por qué el análisis en línea del `.bat` no detectó nada?** · el `.bat` no contiene el payload, solo lo descarga · conceptos
- **¿Por qué `certutil`, `bitsadmin` o `wmic` son útiles para un atacante?** · son binarios firmados del sistema (LOLBins), no levantan sospecha · conceptos
- **¿Cuál es la forma segura de leer un `.bat` sospechoso?** · abrir el bloc de notas primero y desde ahí abrir el archivo; nunca doble clic ni «Editar» · conceptos
- **¿Qué tipo de malware era y qué efectos tenía?** · troyano; crea tareas programadas, impresoras de red y persiste · conceptos

## 8. Trampas (8 preguntas)

- **`pause > null` no funciona: ¿por qué?** · el dispositivo es `nul`, no `null` · exacta (`nul`)
- **`set origen = C:\datos` guarda el valor mal: ¿cuál es la forma correcta?** · sin espacios: `set "origen=C:\datos"` · huecos
- **`if %opcion%==1` revienta cuando el usuario pulsa Enter: ¿cómo se arregla?** · comillas en ambos lados: `if "%opcion%"=="1"` · huecos
- **`::` dentro de un bloque `( ... )` rompe el script: ¿qué se usa?** · `rem` · exacta
- **`echo Progreso: 50%` falla: ¿cómo se imprime el porcentaje literal?** · `echo Progreso: 50%%` · exacta
- **¿Qué diferencia hay entre `%a` y `%%a` en un `for`?** · `%%a` dentro de un `.bat`, `%a` solo en la consola · conceptos
- **¿Cómo se hace que el script no dependa de la carpeta desde donde se ejecuta?** · `cd /d "%~dp0"` · exacta
- **`if exist "%ruta%"\archivo.txt` falla con rutas que tienen espacios: ¿qué falta?** · las comillas deben envolver la expresión completa · conceptos

---

## Totales y pendientes técnicos

66 preguntas individuales, más el previo con 8 requisitos.

Antes de conectar el verificador hay que resolver tres cosas del corpus actual:

1. **27 ítems son familias unidas con `·`** (`netstat -a · -o · -ano · -b`): hay que partirlos en preguntas separadas o marcar el ítem como `conjunto`.
2. **18 ítems contienen `...`** y **5 usan `→`** como pseudo-secuencia: no son sintaxis ejecutable ni comparable; o se reescriben o quedan fuera del modo verificación.
3. **22 ítems son multilínea**: en esos conviene el modo «completar el hueco» en lugar de escribir el bloque entero.
