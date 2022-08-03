require("dotenv").config()
import express from "express"
import { commentsRouter } from "./comments"

const app = express()

app.use(express.json())

app.use("/comments", commentsRouter)

app.listen(process.env.PORT, () => {
    console.info(`Server started at port ${process.env.PORT}`)
})
