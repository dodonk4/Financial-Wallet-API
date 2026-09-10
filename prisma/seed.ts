import { randomUUID } from "node:crypto";
import { prisma } from "../src/infrastructure/database/prisma"

async function main() {

    const _correctUser = await prisma.user.upsert({
        where: { email: "correct.user@mock.com" },
        update: {},
        create: {
            id: "931cb862-b067-4fed-a4f9-827940e83a9e",
            //I generate id manually to be able to have a reusable refresh token revoked
            //If its randomize, I cannot have a refreshToken that is allways the same form the refrshToken tests
            email: "correct.user@mock.com",
            passwordHash: "$argon2id$v=19$m=65536,p=4,t=3$qbceNDFO/vhwkql85U6wKA$pXAzfsNDJVwNUCP7xmVQeFqkuLZhrMIM4aVh0PLQfGM",
            firstName: "Correct User",
            lastName: "Case",
            identifierType: "DNI",
            identifierNumber: 33333333,
        }
    });

    const _correctUserAccount = await prisma.account.upsert({
        where: { id: "2291d9c5-724f-4c09-a5d2-7dfa8af51f63" },
        update: {},
        create: {
            id: "2291d9c5-724f-4c09-a5d2-7dfa8af51f63",
            userId: "931cb862-b067-4fed-a4f9-827940e83a9e",
            currency: "ARS",
            balanceCache: 200000,
            heldBalance: 0,
            status: "ACTIVE",   
        }
    });

    const _userAlreadyRegistered = await prisma.user.upsert({
        where: { email: "email.registered@mock.com" },
        update: {},
        create: {
            id: "458afd6f-9243-4ce8-ac94-351dd7ad5204",
            email: "email.registered@mock.com",
            passwordHash: "$argon2id$v=19$m=65536,p=4,t=3$qbceNDFO/vhwkql85U6wKA$pXAzfsNDJVwNUCP7xmVQeFqkuLZhrMIM4aVh0PLQfGM",
            firstName: "Email Already Registered",
            lastName: "Case",
            identifierType: "DNI",
            identifierNumber: 11111111,
        }
    });

    const _userAlreadyRegisteredAccount = await prisma.account.upsert({
        where: { id: "f66e84c4-8ab0-4010-8102-3f1a3fd5eb08" },
        update: {},
        create: {
            id: "f66e84c4-8ab0-4010-8102-3f1a3fd5eb08",
            userId: "458afd6f-9243-4ce8-ac94-351dd7ad5204",
            currency: "ARS",
            balanceCache: 200000,
            heldBalance: 0,
            status: "ACTIVE",   
        }
    });

    const _revokedToken = await prisma.refreshToken.upsert({
        where: { tokenHash: "ac4da12bf165dd1d26b59125cf5976ff4a8ca17f7c085f804d97b18f891ec6cb" },
        update: {},
        create: {
            userId: "931cb862-b067-4fed-a4f9-827940e83a9e",
            tokenHash: "ac4da12bf165dd1d26b59125cf5976ff4a8ca17f7c085f804d97b18f891ec6cb",
            //Manual revoked tokenHash
            familyId: randomUUID(),
            revoked: true,
            expiresAt: new Date(),
        }
    });

    const _usedToken = await prisma.refreshToken.upsert({
        where: { tokenHash: "c1190ffa5aa4037d9578199974073175e25cc6b93fdc46a2e2e276fa29a72942" },
        update: {},
        create: {
            userId: "931cb862-b067-4fed-a4f9-827940e83a9e",
            tokenHash: "c1190ffa5aa4037d9578199974073175e25cc6b93fdc46a2e2e276fa29a72942",
            //Manual used tokenHash
            familyId: randomUUID(),
            used: true,
            expiresAt: new Date(),
        }
    });

    const _tokenForLogout = await prisma.refreshToken.upsert({
        where: { tokenHash: "23205a2f4bbf529a0871ab8f094e63b673fee97d6c0c73623f0eb9faecdfb124" },
        update: {},
        create: {
            userId: "931cb862-b067-4fed-a4f9-827940e83a9e",
            tokenHash: "23205a2f4bbf529a0871ab8f094e63b673fee97d6c0c73623f0eb9faecdfb124",
            //Manual used tokenHash
            familyId: randomUUID(),
            expiresAt: new Date(),
        }
    });


}

main().
    then(async () => {
        await prisma.$disconnect();
    }).catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });