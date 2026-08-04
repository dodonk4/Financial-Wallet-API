import { randomUUID } from "node:crypto";

import { Account } from "../../../domain/entities/Account.ts";
import { Currency } from "../../../domain/entities/Currency.ts";
import { RefreshToken } from "../../../domain/entities/RefreshToken.ts";
import { User } from "../../../domain/entities/User.ts";

import { EmailAlreadyExistsError } from "../../../domain/errors/EmaiAlreadyExistsError.ts";
import { DocumentAlreadyExistsError } from "../../../domain/errors/DocumentAlreadyExistsError.ts";

import { UserRegisteredEvent } from "../../../domain/events/UserRegisteredEvent.ts";

import { IUserRepository } from "../../ports/output/IUserRepository.ts";
import { IPasswordHasher } from "../../ports/output/IPasswordHasher.ts";
import { ITokenServiceProvider } from "../../ports/output/ITokenServiceProvider.ts";
import { IEventPublisher } from "../../ports/output/IEventPublisher.ts";
import { IUnitOfWork } from "../../ports/output/IUnitOfWork.ts";

import { RegisterUserRequestDTO } from "./RegisterUserRequestDTO.ts";
import { RegisterUserResponseDTO } from "./RegisterUserResponseDTO.ts";

export class RegisterUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenProvider: ITokenServiceProvider,
    private readonly eventPublisher: IEventPublisher,
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(
    dto: RegisterUserRequestDTO,
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

    const passwordHash = await this.passwordHasher.hash(dto.password);

    // 4. Crear User

    const user = User.create({
      id: randomUUID(),
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    // 5. Crear Account

    const account = Account.create({
      id: randomUUID(),
      userId: user.id,
      currency: Currency.ARG,
    });

    // 6. Generar tokens

    const accessToken = await this.tokenProvider.generateAccessToken(
      user.id,
      user.role,
    );

    const refreshTokenValue = await this.tokenProvider.generateRefreshToken(user.id);

    // 7. Crear entidad RefreshToken

    const refreshToken = RefreshToken.create({
      id: randomUUID(),
      userId: user.id,
      token: refreshTokenValue,
      expiresAt: new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 30,
      ),
    });

    // 8. Persistir todo

    await this.unitOfWork.execute(async (repositories) => {

      await repositories.user.create(user);

      await repositories.account.create(account);

      await repositories.refreshToken.save(refreshToken);

    });

    // 9. Publicar evento

    await this.eventPublisher.publish(
      new UserRegisteredEvent(user.id, user.email),
    );

    // 10. Responder

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      account : {
        id: account.id,
        currency: account.currency,
        balance: account.balance
      },
      accessToken,
      refreshToken: refreshToken.token
    };
  }
}