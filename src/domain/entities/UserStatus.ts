export const UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  SUSPENDED: "SUSPENDED",
  DELETED: "DELETED",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];