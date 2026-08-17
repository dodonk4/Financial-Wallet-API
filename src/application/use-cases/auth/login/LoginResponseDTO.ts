import { UserRole } from "../../../../domain/entities/UserRole.ts";

export interface LoginResponseDTO {
    user: {
        email: string;
        firstName: string;
        lastName: string;
        role: UserRole;
    },
    accessToken: string;
    refreshToken: string;
}