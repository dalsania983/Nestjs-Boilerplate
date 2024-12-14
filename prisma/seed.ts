import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.users.upsert({
    where: { uuid: 'asdf5454545' },
    update: {},
    create: {
      uuid: 'asdf5454545',
      first_name: 'MMM',
      last_name: 'Dalsania',
      email: 'dalsania@gmail.com',
      password: 'Admin@123',
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
