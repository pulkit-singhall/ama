import axios from "axios"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function Alertdialog(props: any) {
    const _id = props._id;

    async function deleteMessage() {
        axios.post("/api/messages/delete", { _id })
            .then((res) => { 

            })
            .catch((err) => { 
                
            })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button
                    className="bg-red-500 text-white h-8 w-16 rounded-md
                    text-xl">
                    <b>x</b>
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle
                        className="text-blue-950">
                        Are you sure to want to delete this message?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        message and remove this data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={deleteMessage}
                        className="bg-blue-950 hover:bg-blur-950">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}