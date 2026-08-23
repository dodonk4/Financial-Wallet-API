import { InvalidCredentialsError } from "../../../domain/errors/InvalidCredentialsError";

const extractToken = (headerAuthorization: string | undefined): string => {

    if (!headerAuthorization) {
        throw new InvalidCredentialsError();
    }

    const [bearer, token] = headerAuthorization.split(" ");

    if (bearer !== "Bearer" || !token) {
        throw new InvalidCredentialsError();
    }

    return token;
}

export default extractToken;