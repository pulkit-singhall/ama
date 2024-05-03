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
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";

export default function Alertdialog(props: any) {
    let { toast } = useToast()
    
    let router = useRouter()
    const _id = props._id;
    const content = props.content
    const createdAt = props.createdAt

    async function deleteMessage() {
        axios.post("/api/messages/delete", { _id, content, createdAt })
            .then((res) => { 
                const data = res.data
                if (data.success) {
                    toast({
                        title: 'Message deleted successfully'
                    })
                    router.refresh()
                }
                else {
                    alert(`Error in deleting this message: ${data.message}`)
                }
            })
            .catch((err) => { 
                alert(`Error in deleting this message: ${err.message}`)
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