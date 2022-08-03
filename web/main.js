import * as timeago from "timeago.js"
import React from "react"
import ReactDOM from "react-dom/client"
import config from "./config.js"
import Upvotes from "./Upvotes"
import { getComments, getRandomUser, postComment } from "./api"

function setUser(user) {
    config.currentUser = user
    document.querySelector("#comment-form").classList.remove("d-none")
    document.querySelector("#comment-form img").src = config.currentUser.avatarUrl
}

function addComment(comment, container) {
    const template = document.querySelector("#comment-template")
    if (!container) {
        container = document.querySelector("#comments")
    }
    const element = template.content.cloneNode(true)
    element.querySelector("div").dataset.commentId = comment.id
    element.querySelector(".avatar").src = comment.user.avatarUrl
    element.querySelector(".username").textContent = comment.user.name
    element.querySelector(".creation-date").setAttribute("datetime", comment.createdAt)
    element.querySelector(".content").textContent = comment.content
    timeago.render(element.querySelector(".creation-date"))
    ReactDOM.createRoot(element.querySelector(".upvotes")).render(
        React.createElement(
            React.StrictMode,
            null,
            React.createElement(Upvotes, { comment })
        )
    )
    if ('replies' in comment) {
        element.querySelector(".reply").classList.remove("d-none")
        element.querySelector(".reply").addEventListener("click", () => {
            setReply(comment)
        })
        const repliesContainer = element.querySelector(".replies")
        comment.replies.forEach((reply) => addComment(reply, repliesContainer))
    }
    container.prepend(element)
}

function setReply(comment) {
    config.currentReplyComment = comment
    const container = document.querySelector(".replying-to")
    if (comment === null) {
        container.classList.add("d-none")
        return
    }
    container.querySelector("span").textContent = comment.user.name
    container.classList.remove("d-none")
    container.querySelector("a").addEventListener("click", () => {
        setReply(null)
    }, { once: true })
}

getRandomUser().then(setUser)

getComments().then((comments) =>
    comments.reverse().forEach((comment) => addComment(comment))
)

const commentForm = document.querySelector("#comment-form")

commentForm.addEventListener("submit", (event) => {
    event.preventDefault()
    const contentInput = commentForm.querySelector("textarea")
    if (contentInput.value === "") {
        return
    }
    const parentId = config.currentReplyComment?.id
    postComment({
        content: contentInput.value,
        parentId
    }).then((comment) => {
        let container
        if (parentId) {
            setReply(null)
            container = document.querySelector(`[data-comment-id="${parentId}"] .replies`)
        }
        addComment(comment, container)
        contentInput.value = ""
    })
})
