import { randomUUID } from "node:crypto";

import { Account } from "../../../../domain/entities/Account.ts";
import { Currency } from "../../../../domain/entities/Currency.ts";
import { RefreshToken } from "../../../../domain/entities/RefreshToken.ts";
import { User } from "../../../../domain/entities/User.ts";

import { EmailAlreadyExistsError } from "../../../../domain/errors/EmaiAlreadyExistsError.ts";
import { DocumentAlreadyExistsError } from "../../../../domain/errors/DocumentAlreadyExistsError.ts";

import { UserRegisteredEvent } from "../../../../domain/events/UserRegisteredEvent.ts";

import type { IUserRepository } from "../../../ports/output/IUserRepository.ts";
import type { IPasswordHasher } from "../../../ports/output/IPasswordHasher.ts";
import type { ITokenServiceProvider } from "../../../ports/output/ITokenServiceProvider.ts";
import type { IEventPublisher } from "../../../ports/output/IEventPublisher.ts";
import type { IUnitOfWork } from "../../../ports/output/IUnitOfWork.ts";

import type { RegisterUserRequestDTO } from "./RegisterUserRequestDTO.ts";
import type { RegisterUserResponseDTO } from "./RegisterUserResponseDTO.ts";

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenProvider: ITokenServiceProvider,
    private readonly eventPublisher: IEventPublisher,
    private readonly unitOfWork: IUnitOfWork,
  ) { }

  async execute(
    dto: RegisterUserRequestDTO,
  ): Promise<RegisterUserResponseDTO> {

    const emailExists = await this.userRepository.existsByEmail(dto.email);

    if (emailExists) {
      throw new EmailAlreadyExistsError(dto.email);
    }


    const documentExists = await this.userRepository.existsByDocument(
      dto.document.type,
      dto.document.number,
    );

    if (documentExists) {
      throw new DocumentAlreadyExistsError(dto.document.number.toString());
    }



    const passwordHash = await this.passwordHasher.hash(dto.password);




    const user = User.create({
      id: randomUUID(),
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      identifierType: dto.document.type,
      identifierNumber: dto.document.number,
    });




    const account = Account.create({
      id: randomUUID(),
      userId: user.id,
      currency: Currency.ARS,
    });




    const tokens = await this.tokenProvider.generate(user);

    const refreshToken = RefreshToken.create({
      id: randomUUID(),
      userId: user.id,
      token: tokens.refreshToken,
      expiresAt: new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 30,
      ),
    });




    await this.unitOfWork.execute(async (repositories) => {

      await repositories.user.create(user);

      await repositories.account.create(account);

      await repositories.refreshToken.save(refreshToken);

    });




    await this.eventPublisher.publish(
      new UserRegisteredEvent(user.id, user.email),
    );




    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      account: {
        id: account.id,
        currency: account.currency,
        heldBalance: account.heldBalance
      },
      accessToken: tokens.accessToken,
      refreshToken: refreshToken.token
    };
  }
}