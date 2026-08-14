import { IEventPublisher } from "../../../ports/output/IEventPublisher.ts";
import { IUserRepository } from "../../../ports/output/IUserRepository.ts";

export class LoginUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventPublisher: IEventPublisher,
    ) {}
}