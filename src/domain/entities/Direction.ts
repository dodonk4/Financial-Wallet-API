export const Direction = {
  DEBIT: "DEBIT",
  CREDIT: "CREDIT",
} as const;

export type Direction = (typeof Direction)[keyof typeof Direction];
