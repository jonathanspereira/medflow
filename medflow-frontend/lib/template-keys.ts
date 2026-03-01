export const TEMPLATE_KEYS = {
  WHATSAPP_AUTHORIZED: "WHATSAPP_AUTHORIZED",
  WHATSAPP_REJECTED: "WHATSAPP_REJECTED",
  EMAIL_AUTHORIZED: "EMAIL_AUTHORIZED",
  EMAIL_REJECTED: "EMAIL_REJECTED",
} as const;

export type TemplateKey = (typeof TEMPLATE_KEYS)[keyof typeof TEMPLATE_KEYS];

export const DEFAULT_TEMPLATE_MESSAGES: Record<TemplateKey, string> = {
  WHATSAPP_AUTHORIZED:
    "Olá, sua solicitação foi autorizada. Em caso de dúvidas, responda esta mensagem.",
  WHATSAPP_REJECTED:
    "Olá, sua solicitação foi negada. Entre em contato com a clínica para mais detalhes.",
  EMAIL_AUTHORIZED:
    "Sua solicitação foi autorizada com sucesso.",
  EMAIL_REJECTED:
    "Sua solicitação foi negada. Entre em contato com a clínica para orientações.",
};
