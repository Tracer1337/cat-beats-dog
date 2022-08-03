import { RequestHandler } from "express"
import { prisma } from "./db"

export const userMiddleware: RequestHandler = async (req, res, next) => {
    let userId = req.headers["authorization"]
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
