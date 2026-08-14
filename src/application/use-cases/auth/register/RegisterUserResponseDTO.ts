import { Currency } from "../../../../domain/entities/Currency";
import { UserRole } from "../../../../domain/entities/UserRole";

export interface RegisterUserResponseDTO {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
  };

  account: {
    id: string;
    currency: Currency;
    heldBalance: number;
  };

  accessToken: string;
  refreshToken: string;
}