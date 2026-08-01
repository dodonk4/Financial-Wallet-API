import { User } from "../../../domain/entities/User.ts";
import { IAccountRepository } from "../../ports/output/IAccountRepository.ts";
import { IEventPublisher } from "../../ports/output/IEventPublisher.ts";
import { IPasswordHasher } from "../../ports/output/IPasswordHasher.ts";
import { IRefreshTokenRepository } from "../../ports/output/IRefreshTokenRepository.ts";
import { ITokenServiceProvider } from "../../ports/output/ITokenServiceProvider.ts";
import { IUnitOfWork } from "../../ports/output/IUnitOfWork.ts";
import { IUserRepository } from "../../ports/output/IUserRepository.ts";
import { RegisterUserRequestDTO } from "./RegisterUserRequestDTO.ts";
import { RegisterUserResponseDTO } from "./RegisterUserResponseDTO.ts";

export class RegisterUserService {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly accountRepository: IAccountRepository,
        private readonly refreshTokenRepository: IRefreshTokenRepository,
        private readonly passwordHashProvider: IPasswordHasher,
        private readonly tokenProvider: ITokenServiceProvider,
        private readonly eventPublisher: IEventPublisher,
        private readonly unitOfWork: IUnitOfWork
    ) { }

    async execute(
        dto: RegisterUserRequestDTO
    ): Promise<RegisterUserResponseDTO> {

        // 1. Verificar email

        const emailExists = await this.userRepository.existsByEmail(dto.email);

        if (emailExists) {
            throw new EmailAlreadyExistsError(dto.email);
        }

        // 2. Verificar documento

        const documentExists = await this.userRepository.existsByDocument(
            dto.document.type,
            dto.document.number,
        );

        if (documentExists) {
            throw new DocumentAlreadyExistsError(dto.document.number);
        }

        // 3. Hashear contraseña

        const passwordHash = await this.passwordHashProvider.hash(dto.password);

        // 4. Crear entidad User

        const user = User.create({
            id: crypto.randomUUID(),
            email: dto.email,
            passwordHash,
            firstName: dto.firstName,
            lastName: dto.lastName,
        });


        // 5. Crear entidad Account

        // 6. Generar tokens

        // 7. Guardar refresh token

        // 8. Ejecutar transacción

        await this.unitOfWork.execute(async (repositories) => {

            await repositories.user.create(user);

            await repositories.account.create(account);

            await repositories.refreshToken.save(...);

        });

        // 9. Publicar evento

        // 10. Devolver DTO
    }

}