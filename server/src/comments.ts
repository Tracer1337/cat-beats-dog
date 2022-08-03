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
            user: true,
            replies: {
                include: {
                    _count: {
                        select: { upvotes: true }
                    },
                    user: true
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        where: {
            parentId: null
        }
    })
    res.send(comments)
})

const CreateComment = z.object({
    content: z.string().min(1).max(500),
    parentId: z.number().optional()
})

router.post('/', userMiddleware, async (req, res) => {
    const parsed = CreateComment.safeParse(req.body)
    if (!parsed.success) {
        res.status(400).send(parsed.error)
        return
    }
    if (parsed.data.parentId) {
        const parent = await prisma.comment.findFirst({
            where: { id: parsed.data.parentId }
        })
        if (!parent) {
            res.sendStatus(404)
            return
        }
        if (parent.parentId !== null) {
            res.sendStatus(409)
            return
        }
    }
    const comment = await prisma.comment.create({
        data: {
            ...parsed.data,
            userId: req.user.id,
            parentId: parsed.data.parentId
        },
        include: {
            _count: {
                select: { upvotes: true }
            },
            user: true
        }
    })
    res.send(comment)
})

router.get("/:id/upvotes", async (req, res) => {
    const commentId = parseInt(req.params.id)
    const comment = await prisma.comment.findFirst({
        include: {
            _count: {
                select: { upvotes: true }
            }
        },
        where: { id: commentId }
    })
    if (!comment) {
        res.sendStatus(404)
        return
    }
    res.send({ upvotes: comment?._count.upvotes })
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
            },
            user: true
        },
        where: { id: commentId }
    })
    res.send({ upvotes: newComment?._count.upvotes })
})

export { router as commentsRouter }
