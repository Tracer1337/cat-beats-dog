import { useState, useEffect } from "react"
import { upvote } from "./api"

function Upvotes({ comment }) {
    const [upvotes, setUpvotes] = useState(comment._count.upvotes)

    useEffect(() => {
        setUpvotes(comment._count.upvotes)
    }, [comment])

    const handleClick = async () => {
        const result = await upvote(comment)
        if (result) {
            setUpvotes(result.upvotes)
        }
    }

    return (
        <a className="upvote text-decoration-none text-secondary" onClick={handleClick}>
            <img src="images/triangle-small-up.png" alt="Up" style={{ opacity: 0.5 }} />
            <small>
                <span className="me-1">Upvote</span>
                <span className="upvotes">{upvotes}</span>
            </small>
        </a>
    )
}

export default Upvotes
