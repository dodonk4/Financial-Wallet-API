export const Currency = {
    ARG: "ARG",
    USD: "USD",
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];