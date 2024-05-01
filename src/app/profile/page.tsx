'use client'
import axios from "axios"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ProfileNavbar from "@/components/profileNavbar"

export default function Profile() {
    let router = useRouter()
    let [username, setUsername] = useState('')
    let [messages, setMessages] = useState([])
    let [accepting, setAccepting] = useState(true)

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
        <div className="flex flex-col">
            <ProfileNavbar
                username={username}
                onLogout = {replaceLogout}
            />
            <div
                className="flex flex-row p-3 m-3 items-center">
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
            <div className="flex flex-col m-3 p-3">
                <p>
                    Messages you received in last 24 hours :
                </p>
            </div>
        </div>
    )
}