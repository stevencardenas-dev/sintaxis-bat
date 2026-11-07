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
  'netstat -ano': { alt: ['netstat -a -n -o', 'netstat -noa'] }
};
