import { UnauthorizedError } from "../../../domain/errors/http/UnauthorizedError";

const extractToken = (headerAuthorization: string | undefined): string => {

    if (!headerAuthorization) {
        throw new UnauthorizedError("Invalid credentials.");
    }

    const [bearer, token] = headerAuthorization.split(" ");

    if (bearer !== "Bearer" || !token) {
        throw new UnauthorizedError("Invalid credentials.");
    }

    return token;
}

export default extractToken;