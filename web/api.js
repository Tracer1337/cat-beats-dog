import config from "./config.js"

export async function getRandomUser() {
    const res = await fetch(`${config.apiHost}/users/random`)
    return res.json()
}

export async function getComments() {
    const res = await fetch(`${config.apiHost}/comments`)
    return res.json()
}

export async function postComment(data) {
    try {
        const res = await fetch(`${config.apiHost}/comments`, {
            method: "POST",
            headers: {
                Authorization: user.currentUser.id,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        return res.json()
    } catch {
        alert("Could not create comment")
    }
}

export async function upvote(comment) {
    try {
        const res = await fetch(
            `${config.apiHost}/comments/${comment.id}/upvote`,
            {
                method: "POST",
                headers: {
                    Authorization: user.currentUser.id
                }
            }
        )
        return res.json()
    } catch {
        alert("You have already upvoted this comment")
    }
}
