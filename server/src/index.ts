require('dotenv').config()
import express from 'express'
import cors from 'cors'
import { commentsRouter } from './comments'
import { usersRouter } from './user'

const app = express()

app.use(express.json())
app.use(cors())

app.use('/users', usersRouter)

app.use('/comments', commentsRouter)

app.listen(process.env.PORT, () => {
    console.info(`Server started at port ${process.env.PORT}`)
})
