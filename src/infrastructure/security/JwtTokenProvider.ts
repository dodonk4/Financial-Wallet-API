import jwt from "jsonwebtoken";

import { User } from "../../domain/entities/User.ts";
import { ITokenServiceProvider } from "../../application/ports/output/ITokenServiceProvider.ts";
import { GeneratedTokens } from "../../application/ports/output/token/GeneratedTokens.ts";
import { AccessTokenPayload } from "../../application/ports/output/token/AccessTokenPayload.ts";
import { RefreshTokenPayload } from "../../application/ports/output/token/RefreshTokenPayload.ts";

export class JwtTokenProvider implements ITokenServiceProvider {
    async generate(user: User): Promise<GeneratedTokens> {

        const accessToken = jwt.sign(
            {
                sub: user.id,
                role: user.role,
            },
            process.env.JWT_ACCESS_SECRET!,
            {
                expiresIn: "15m",
            },
        );

        const refreshToken = jwt.sign(
            {
                sub: user.id,
            },
            process.env.JWT_REFRESH_SECRET!,
            {
                expiresIn: "30d",
            },
        );

        return {
            accessToken,
            refreshToken,
            refreshTokenExpiresAt: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000,
            ),
        };
    }

    async verifyAccessToken(token: string) {
        return jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET!,
        ) as AccessTokenPayload;
    }

    async verifyRefreshToken(token: string) {
        return jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET!,
        ) as RefreshTokenPayload;
    }
}