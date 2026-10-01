export const NotificationType = {
    TRANSFER_RECEIVED: "TRANSFER_RECEIVED",
    TRANSFER_SENT: "TRANSFER_SENT",
    CARD_BLOCKED: "CARD_BLOCKED"
} as const;

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];