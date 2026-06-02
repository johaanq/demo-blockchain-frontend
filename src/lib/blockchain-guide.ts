export const BLOCKCHAIN_GUIDE = {
  title: "Transparencia del sufragio digital",
  intro:
    "Inspirado en auditorías abiertas de Estonia y comprobantes de voto de varios estados de EE.UU., esta capa registra cada sufragio en una cadena verificable. La ONPE real aún no opera voto remoto; aquí se modela cómo podría auditarse.",
  steps: [
    {
      title: "Identificación (como e-Estonia / RENIEC)",
      text: "El elector se autentica con DNI y fecha de nacimiento. El sistema consulta el padrón y asigna automáticamente su mesa y local de votación.",
    },
    {
      title: "Emisión y comprobante (como EE.UU.)",
      text: "Tras revisar la cédula virtual, confirma su preferencia y recibe un código de comprobante para verificar que el voto quedó registrado.",
    },
    {
      title: "Registro encadenado y sellado",
      text: "Al confirmar, el sufragio se registra con SHA-256 y prueba de trabajo (PoW). Puede ajustar la dificultad (ceros iniciales) antes de emitir.",
    },
    {
      title: "Auditoría ciudadana",
      text: "En Consulta y auditoría puede revisar la cadena, validar integridad y simular un fraude para comprobar la detección automática.",
    },
  ],
  fields: [
    {
      term: "Padrón electoral",
      def: "Base de electores habilitados. Aquí la mesa no se digita: se obtiene del DNI consultado.",
    },
    {
      term: "Comprobante",
      def: "Código único emitido al votar, similar a los recibos de confirmación en votación en línea.",
    },
    {
      term: "Blockchain",
      def: "Ledger público que garantiza integridad y trazabilidad de los sufragios emitidos.",
    },
  ],
};
