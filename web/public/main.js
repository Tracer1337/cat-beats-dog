const apiHost = "http://localhost:8080"

let currentUser

function setUser(user) {
    currentUser = user
    document.querySelector("#comment-form").classList.remove("d-none")
    document.querySelector("#comment-form img").src = user.avatarUrl
}

function setComments(comments) {
    const template = document.querySelector("#comment-template")
    const container = document.querySelector("#comments")
    comments.forEach((comment) => {
        const element = template.content.cloneNode(true)
        element.querySelector("div").dataset.commentId = comment.id
        element.querySelector(".avatar").src = comment.user.avatarUrl
        element.querySelector(".username").textContent = comment.user.name
        element.querySelector(".creation-date").setAttribute("datetime", comment.createdAt)
        element.querySelector(".content").textContent = comment.content
        element.querySelector(".upvotes").textContent = comment._count.upvotes
        element.querySelector(".upvote").addEventListener("click", () => {
            upvote(comment)
        })
        timeago.render(element.querySelector(".creation-date"))
        container.appendChild(element)
    })
}

function upvote(comment) {
    if (!currentUser) {
        return
    }
    fetch(`${apiHost}/comments/${comment.id}/upvote`, {
        method: "POST",
        headers: {
            Authorization: currentUser.id
        }
    })
        .then((res) => res.json())
        .then((res) => {
            document.querySelector(`[data-comment-id="${comment.id}"] .upvotes`).textContent = res.upvotes
        })
        .catch(() => alert("You have already upvoted this comment"))
}

fetch(`${apiHost}/users/random`)
    .then((res) => res.json())
    .then(setUser)

fetch(`${apiHost}/comments`)
    .then((res) => res.json())
    .then(setComments)
