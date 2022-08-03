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
            content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et'
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
            content: 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
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
            content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'
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
