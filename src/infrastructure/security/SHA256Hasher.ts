import crypto from "node:crypto"
import { ITokenHasher } from "../../application/ports/output/ITokenHasher";

export class SHA256Hasher implements ITokenHasher {
    async hash(token: string): Promise<string> {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    async verify(token: string, hash: string): Promise<boolean> {
        const tokenHash = await this.hash(token);

        return crypto.timingSafeEqual(
            Buffer.from(tokenHash, 'hex'),
            Buffer.from(hash, 'hex')
        );
    }
}

