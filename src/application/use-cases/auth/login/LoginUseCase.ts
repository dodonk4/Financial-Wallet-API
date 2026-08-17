import { ForbiddenError } from "../../../../domain/errors/ForbiddenError.ts";
import { InvalidCredentialsError } from "../../../../domain/errors/InvalidCredentialsError.ts";
import { IEventPublisher } from "../../../ports/output/IEventPublisher.ts";
import { IPasswordHasher } from "../../../ports/output/IPasswordHasher.ts";
import { ITokenServiceProvider } from "../../../ports/output/ITokenServiceProvider.ts";
import { IUnitOfWork } from "../../../ports/output/IUnitOfWork.ts";
import { IUserRepository } from "../../../ports/output/IUserRepository.ts";
import { LoginRequestDTO } from "./LoginRequestDTO.ts";
import { LoginResponseDTO } from "./LoginResponseDTO.ts";

export class LoginUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventPublisher: IEventPublisher,
        private readonly tokenProvider: ITokenServiceProvider,
        private readonly passwordHasher: IPasswordHasher,
        private readonly unitOfWork: IUnitOfWork,
        //Se aplica Unit of work? Porque realmente no se crea nada
        //Se crea un RefreshToken con una nueva familia
    ) { }

    async execute(dto: LoginRequestDTO): Promise<LoginResponseDTO> {
        //2. Buscar el usuario por su email, normalizado

        const emailExists = await this.userRepository.existsByEmail(dto.email);

        //2.1 Si no se encuentra, devolver un error 401. Este error no tiene que diferenciarse
        //de si la contraseña es incorrecta, para mitigar la enumeración de usuarios
        if(!emailExists){
            throw new InvalidCredentialsError();
        }

        const user = await this.userRepository.findByEmail(dto.email);

        //2.2 Si se encuentra, pero la cuenta está SUSPENDED o DELETED, se envía un error 403
        //sin detalles.
        if(user?.status != "ACTIVE"){
            throw new ForbiddenError();
        }

        //3. Comparar los passwords

        const verifiedPassword = await this.passwordHasher.verify(dto.password, user.passwordHash);

         //3.1 Si la contraseña no coinicide, devolver error 401
        if(!verifiedPassword){
            throw new InvalidCredentialsError();
        }

        //4. Generar un RefreshToken y un access Token

        //5. Generar una entidad de RefreshToken, generar un familyId, y guardarlo en la BD

        //6. Devolver los datos públicos del usuario y los tokens
    }
}