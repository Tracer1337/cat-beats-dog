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
            content: 'Cats Are Easy to Take Care of',
            createdAt: new Date('2022-07-20T12:00:00.000Z')
          },
          {
            content: 'No Destruction Inside and Outside the House',
            createdAt: new Date('2022-07-17T12:00:00.000Z')
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
            content: 'Cats Are Low-Maintenance',
            createdAt: new Date('2022-07-26T18:30:00.000Z')
          },
          {
            content: 'They Don\'t Need Much Space',
            createdAt: new Date('2022-07-25T18:30:00.000Z')
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
            content: 'They Keep the House Clean',
            createdAt: new Date('2022-08-02T00:01:00.000Z')
          }
        ]
      }
    },
  },
  {
    name: 'Bruno',
    avatarUrl: 'https://i.pravatar.cc/150?img=70',
    comments: {
      createMany: {
        data: [
          {
            content: 'They Can Take Care of Themselves',
            createdAt: new Date('2022-08-03T00:06:00.000Z')
          }
        ]
      }
    }
  },
  {
    name: 'Sunitha',
    avatarUrl: 'https://i.pravatar.cc/150?img=35',
    comments: {
      createMany: {
        data: [
          {
            content: 'I think you are all wrong and horses are the best',
            createdAt: new Date('2022-07-22T00:12:00.000Z')
          }
        ]
      }
    }
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
