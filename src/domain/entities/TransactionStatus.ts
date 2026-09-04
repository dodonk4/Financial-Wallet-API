export const TransactionStatus = {
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
    REVERSED: "REVERSED"
} as const;

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus];
