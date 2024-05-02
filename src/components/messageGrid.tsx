import MessageCard from "./messageCard"

export default function MessageGrid(props: any) {
    let messages=props.messages
    let length = messages.length
    const cards = []
    for (let i = 0; i < length; i++) {
        cards.push(
            <MessageCard
                content={messages[i].content}
                createdAt={messages[i].createdAt}
                _id={messages[i]._id}
            />
        )
    }
    return (
        <div className="grid grid-cols-2">
            {cards}
        </div>
    )
}