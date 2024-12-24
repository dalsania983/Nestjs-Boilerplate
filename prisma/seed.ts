import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';
const prisma = new PrismaClient();

async function main() {
  const newUserId = uuid();
  const users = await prisma.users.upsert({
    where: { uuid: newUserId },
    update: {},
    create: {
      uuid: newUserId,
      first_name: 'Admin',
      last_name: 'Admin',
      email: 'admin@gmail.com',
      password: '$2b$10$AAXIVAmqEblNYKLRKE9nie194mzXWOGE/pZVlYOmUyuxENMKjupdG', // Admin@123
      phone_number: '+918128526089',
    },
  });
  console.log({ users });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
