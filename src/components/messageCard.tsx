import Alertdialog from "./alertdialog";

export default function MessageCard({ content, createdAt, _id }: any) {
    return (
        <div
            className="border-gray-200 border-2
            flex flex-col justify-evenly rounded-lg p-4 m-4">
            <div
                className="flex flex-row items-center justify-between
                mb-2">
                <p
                    className="m-2 text-xl">
                    <b>{content}</b>
                </p>
                <Alertdialog
                    _id={_id}
                    content={content}
                    createdAt={createdAt}
                />
            </div>
            <p
                className="m-2 mt-2 text-sm text-gray-600">
                {createdAt}
            </p>
        </div>
    )
}