import express, { RequestHandler } from 'express'
import { prisma } from './db'

export const userMiddleware: RequestHandler = async (req, res, next) => {
    let userId = req.headers['authorization']
    if (!userId || Number.isNaN(parseInt(userId))) {
        res.sendStatus(401)
        return
    }
    const user = await prisma.user.findFirst({
        where: { id: parseInt(userId) }
    })
    if (!user) {
        res.sendStatus(401)
        return
    }
    req.user = user
    next()
}

const router = express.Router()

router.get('/random', async (_req, res) => {
    const usersCount = await prisma.user.count()
    const skip = Math.max(0, Math.floor(Math.random() * usersCount))
    const user = await prisma.user.findFirst({ take: 1, skip })
    res.send(user)
})

export { router as usersRouter }
