import express from 'express'
import { z } from 'zod'
import { prisma } from './db'
import { userMiddleware } from './user'

const router = express.Router()

router.get('/', async (_req, res) => {
    const comments = await prisma.comment.findMany({
        include: {
            _count: {
                select: { upvotes: true }
            },
            user: true
        },
        orderBy: { createdAt: 'desc' }
    })
    res.send(comments)
})

const CreateComment = z.object({
    content: z.string()
})

router.post('/', userMiddleware, async (req, res) => {
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

router.post('/:id/upvote', userMiddleware, async (req, res) => {
    const commentId = parseInt(req.params.id)
    const comment = await prisma.comment.findFirst({
        where: { id: commentId }
    })
    if (!comment) {
        res.sendStatus(404)
        return
    }

    const upvote = await prisma.upvote.findFirst({
        where: {
            userId: req.user.id,
            commentId
        }
    })
    if (upvote) {
        res.sendStatus(409)
        return
    }

    await prisma.upvote.create({
        data: {
            userId: req.user.id,
            commentId
        }
    })

    const newComment = await prisma.comment.findFirst({
        include: {
            _count: {
                select: { upvotes: true }
            }
        },
        where: { id: commentId }
    })
    res.send({ upvotes: newComment?._count.upvotes })
})

export { router as commentsRouter }
