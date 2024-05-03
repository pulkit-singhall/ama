'use client'
import axios from "axios"
import { Suspense, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import ProfileNavbar from "@/components/profileNavbar"
import MessageGrid from "@/components/messageGrid"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

const Profile = () => {
    let router = useRouter()

    let {toast} = useToast()

    let [username, setUsername] = useState('')
    let [messages, setMessages] = useState([])
    let [accepting, setAccepting] = useState(true)
    
    const origin =
        typeof window !== 'undefined' && window.location.origin
            ? window.location.origin
            : '';

    let uniqueLink = useRef<HTMLParagraphElement>(null)

    useEffect(() => {
        profileFetch()
    },[])

    async function profileFetch() {
        axios.post('/api/users/profile')
        .then((res) => {
            const json = res.data
            if (json.success) {
                const user = json.data.user
                setUsername(`Welcome Back!  ${user.username}`)
                setAccepting(user.isAcceptingMessages)
                setMessages(user.messages)
                if (uniqueLink.current) {
                    uniqueLink.current.innerHTML =
                        `${origin}/message?username=${user.username}`
                }
            }
            else {
                setUsername(`User not found! : ${json.message}`)
            }
        })
        .catch((err)=>{
            setUsername(`User not found: ${err.message}`)
        })
    }

    async function replaceLogout() {
        axios.post('/api/users/logout')
            .then((res) => {
                const data = res.data
                if (!data.success) {
                    alert(`Error in logout: ${data.message}`)
                }
                else {
                    router.replace('/')
                }
            })
            .catch((err) => {
                alert(`Error in logout: ${err.message}`)
            }
        )
    }

    async function copyUniqueLink() {
        if (uniqueLink.current) {
            const link = uniqueLink.current.innerHTML
            window.navigator.clipboard.writeText(link)
            toast({
              title: 'Link copied to clipboard'
            })
        }
    }

    async function toggleAcceptingStatus() {
        axios.post('/api/users/toggleStatus',)
            .then((res) => {
                const data = res.data
                if (data.success) {
                    setAccepting(!accepting) // frontend 
                    toast({
                        title: 'Message status toggled',
                    })
                }
                else {
                    alert(`Error in status toggling : ${data.message}`)
                }
            })
            .catch((err) => {
                alert(`Error in status toggling : ${err.message}`)
            }
        )
    }

    return (
        <div className="flex flex-col items-evenly">
            <ProfileNavbar
                username={username}
                onLogout = {replaceLogout}
            />
            <div
                className="flex flex-row p-3 m-16 mb-0 mt-6 items-center">
                <p className="text-blue-950 text-1xl mr-2">
                    <b>Your Message Accepting Status : </b>
                </p>
                <Switch
                    className="data-[state=checked]:bg-blue-950
                    data-[state=unchecked]:bg-gray-200"
                    checked={accepting}
                    onCheckedChange={toggleAcceptingStatus}
                />
            </div>
            <div
                className="flex flex-col m-16 mt-0 mb-0 p-3">
                <p className="mb-1 text-blue-950">
                    <b>Your Unique Link</b>
                </p>
                <div
                    className="flex flex-row items-center">
                    <p
                        className="mr-2 bg-gray-200 rounded-md h-10 p-2 w-screen 
                        pl-3 text-start text-blue-950"
                        ref={uniqueLink}
                    >
                    </p>
                    <button
                        className="bg-blue-950 hover:bg-blue-950 text-white
                        rounded-md h-10 w-20 ml-2 p-1"
                        onClick={copyUniqueLink}
                    >
                        Copy
                    </button>
                </div>
            </div>
            <div className="flex flex-col m-16 p-3 mt-0">
                <p
                    className="text-blue-950">
                    <b>Your Messages - </b>
                </p>
                <MessageGrid
                    messages={messages}
                />
            </div>
        </div>
    )
}

export default function ProfileComponent() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Profile />
        </Suspense>
    )
}