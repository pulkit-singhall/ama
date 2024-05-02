'use client'
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import ProfileNavbar from "@/components/profileNavbar"
import MessageGrid from "@/components/messageGrid"

export default function Profile() {
    let router = useRouter()
    let [username, setUsername] = useState('')
    let [messages, setMessages] = useState([])
    let [accepting, setAccepting] = useState(true)

    let uniqueLink = useRef<HTMLParagraphElement>(null)

    useEffect(() => {
        profileFetch()
    },[])

    async function profileFetch() {
        axios.get('/api/users/profile')
        .then((res) => {
            const json = res.data
            if (json.success) {
                const user = json.data.user
                setUsername(`Welcome Back!  ${user.username}`)
                setAccepting(user.isAcceptingMessages)
                setMessages(user.messages)
                if (uniqueLink.current) {
                    uniqueLink.current.innerHTML =
                        `http://localhost:3000/message?username=${user.username}`
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
        }
    }

    async function toggleAcceptingStatus() {
        axios.post('/api/users/toggleStatus',)
            .then((res) => {
                const data = res.data
                if (data.success) {
                    setAccepting(!accepting) // frontend 
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
                className="flex flex-row p-3 m-3 mb-0 items-center">
                <p className="text-black text-1xl mr-2">
                    Your Message Accepting Status : 
                </p>
                <button
                    className={`${accepting ? 'bg-green-600' : 'bg-red-600'} 
                    text-white ml-1 w-14 h-7 rounded-md`}
                    onClick={toggleAcceptingStatus}>
                    {accepting ? 'YES' : 'NO'}
                </button>
            </div>
            <div
                className="flex flex-col m-3 mt-0 mb-0 p-3">
                <p className="mb-1">
                    Your Unique Link
                </p>
                <div
                    className="flex flex-row items-center text-blue-950">
                    <p
                        className="mr-2 bg-gray-200 rounded-md h-10 p-2 w-screen 
                        pl-3 text-start "
                        ref={uniqueLink}>
                    </p>
                    <button
                        className="bg-blue-800 hover:bg-blue-950 text-white
                        rounded-md h-10 w-20 ml-2 p-1"
                        onClick={copyUniqueLink}
                    >
                        Copy
                    </button>
                </div>
            </div>
            <div className="flex flex-col m-3 p-3 mt-0">
                <p>
                    Your Messages - 
                </p>
                <MessageGrid
                    messages={messages}
                />
            </div>
        </div>
    )
}