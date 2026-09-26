import { AccountProps } from "../../../../domain/entities/Account";

export type CreateAdditionalAccountResponseDTO = Omit<AccountProps, 'balanceCache' | 'heldBalance'>;
