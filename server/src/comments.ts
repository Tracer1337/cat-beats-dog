import express, { Request } from "express"
import { z } from "zod"
import { prisma } from "./db"
import { userMiddleware } from "./user"

const router = express.Router()

router.get("/", async (_req, res) => {
    const comments = await prisma.comment.findMany({
        include: {
            _count: {
                select: { upvotes: true }
            }
        },
        orderBy: { createdAt: "desc" }
    })
    res.send(comments)
})

const CreateComment = z.object({
    content: z.string()
})

router.post("/", userMiddleware, async (req, res) => {
    const parsed = CreateComment.safeParse(req.body)
    if (!parsed.success) {
        res.status(400).send(parsed.error)
        return
    }
    const comment = await prisma.comment.create({
        data: {
            ...parsed.data,
            userId: req.user.id
        }
    })
    res.send(comment)
})

export { router as commentsRouter }
