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

function addComment(comment) {
    const template = document.querySelector("#comment-template")
    const container = document.querySelector("#comments")
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
    container.prepend(element)
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
    postComment({ content: contentInput.value }).then((comment) => {
        addComment(comment)
        contentInput.value = ""
    })
})
