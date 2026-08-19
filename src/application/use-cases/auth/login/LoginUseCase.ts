import { randomUUID } from "node:crypto";
import { RefreshToken } from "../../../../domain/entities/RefreshToken.ts";
import { User } from "../../../../domain/entities/User.ts";
import { ForbiddenError } from "../../../../domain/errors/ForbiddenError.ts";
import { InvalidCredentialsError } from "../../../../domain/errors/InvalidCredentialsError.ts";
import { IEventPublisher } from "../../../ports/output/IEventPublisher.ts";
import { IPasswordHasher } from "../../../ports/output/IPasswordHasher.ts";
import { ITokenServiceProvider } from "../../../ports/output/ITokenServiceProvider.ts";
import { IUnitOfWork } from "../../../ports/output/IUnitOfWork.ts";
import { IUserRepository } from "../../../ports/output/IUserRepository.ts";
import { LoginRequestDTO } from "./LoginRequestDTO.ts";
import { LoginResponseDTO } from "./LoginResponseDTO.ts";
import { ITokenHasher } from "../../../ports/output/ITokenHasher.ts";
import { userLoggedEvent } from "../../../../domain/events/UserLoggedEvent.ts";

export class LoginUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventPublisher: IEventPublisher,
        private readonly tokenProvider: ITokenServiceProvider,
        private readonly passwordHasher: IPasswordHasher,
        private readonly tokenHasher: ITokenHasher,
        private readonly unitOfWork: IUnitOfWork,
    ) { }

    async execute(dto: LoginRequestDTO): Promise<LoginResponseDTO> {

        const emailExists = await this.userRepository.existsByEmail(dto.email);

        if (!emailExists) {
            throw new InvalidCredentialsError();
        }

        const user = await this.userRepository.findByEmail(dto.email);

        if (user?.status != "ACTIVE") {
            throw new ForbiddenError();
        }

        const verifiedPassword = await this.passwordHasher.verify(dto.password, user.passwordHash);

        if (!verifiedPassword) {
            throw new InvalidCredentialsError();
        }

        const userTransformed = User.reconstitute(user);

        const tokens = await this.tokenProvider.generate(userTransformed);

        const hashedToken = await this.tokenHasher.hash(tokens.refreshToken);

        const refreshToken = RefreshToken.create({
            id: randomUUID(),
            userId: userTransformed.id,
            tokenHash: hashedToken,
            familyId: randomUUID(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            deviceInfo: null,
        })

        await this.unitOfWork.execute(async (repositories) => {
            await repositories.refreshToken.save(refreshToken);
        })

        await this.eventPublisher.publish(
            new userLoggedEvent(user.id, user.email),
        );

        return {
            user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        }
    }
}