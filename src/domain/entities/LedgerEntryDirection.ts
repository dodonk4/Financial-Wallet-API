export const LedgerEntryDirection = {
  DEBIT: "DEBIT",
  CREDIT: "CREDIT",
};

export type LedgerEntryDirection = (typeof LedgerEntryDirection)[keyof typeof LedgerEntryDirection];
