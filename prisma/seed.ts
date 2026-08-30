import { prisma } from "../src/infrastructure/database/prisma"

async function main() {
    const userRegistered = await prisma.user.upsert({
        where: { email: "email.registered@mock.com" },
        update: {},
        create: {
            email: "email.registered@mock.com",
            passwordHash: "$argon2id$v=19$m=65536,p=4,t=3$qbceNDFO/vhwkql85U6wKA$pXAzfsNDJVwNUCP7xmVQeFqkuLZhrMIM4aVh0PLQfGM",
            firstName: ,
            lastName: ,
            identifierType: ,
            identifierNumber: ,
             
        }
    })
}