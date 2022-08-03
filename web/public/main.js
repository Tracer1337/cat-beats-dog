const apiHost = "http://localhost:8080"

function setUser(user) {
    document.querySelector("#comment-form").classList.remove("d-none")
    document.querySelector("#comment-form img").src = user.avatarUrl
}

function setComments(comments) {
    const template = document.querySelector("#comment-template")
    const container = document.querySelector("#comments")
    comments.forEach((comment) => {
        const element = template.content.cloneNode(true)
        element.querySelector(".avatar").src = comment.user.avatarUrl
        element.querySelector(".username").textContent = comment.user.name
        element.querySelector(".creation-date").setAttribute("datetime", comment.createdAt)
        element.querySelector(".content").textContent = comment.content
        element.querySelector(".upvotes").textContent = comment._count.upvotes
        timeago.render(element.querySelector(".creation-date"))
        container.appendChild(element)
    })
}

fetch(`${apiHost}/users/random`)
    .then((res) => res.json())
    .then(setUser)

fetch(`${apiHost}/comments`)
    .then((res) => res.json())
    .then(setComments)
