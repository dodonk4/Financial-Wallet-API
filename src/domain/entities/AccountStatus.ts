export const AccountStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  CLOSED: "CLOSED",
} as const;

export type AccountStatus = (typeof AccountStatus)[keyof typeof AccountStatus];