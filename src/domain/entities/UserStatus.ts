export const UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];