import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    avatarUrl: 'https://i.pravatar.cc/150?img=36',
    comments: {
      createMany: {
        data: [
          {
            content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et',
            createdAt: new Date('2022-07-20T12:00:00.000Z')
          }
        ]
      }
    }
  },
  {
    name: 'Nilu',
    avatarUrl: 'https://i.pravatar.cc/150?img=55',
    comments: {
      createMany: {
        data: [
          {
            content: 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
            createdAt: new Date('2022-07-26T18:30:00.000Z')
          }
        ]
      }
    }
  },
  {
    name: 'Mahmoud',
    avatarUrl: 'https://i.pravatar.cc/150?img=13',
    comments: {
      createMany: {
        data: [
          {
            content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
            createdAt: new Date('2022-08-02T00:01:00.000Z')
          }
        ]
      }
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const data of userData) {
    const user = await prisma.user.create({ data })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
