export const TransactionType = {
    TRANSFER: "TRANSFER",
    REVERSAL: "REVERSAL",
} as const;

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];
