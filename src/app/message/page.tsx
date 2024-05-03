'use client'
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { useEffect, useState, useRef } from "react"
import NavBar from "@/components/navbar"
import { Suspense } from "react"
import Footer from "@/components/footer"
import { useToast } from "@/components/ui/use-toast"

const Message = () => {
    let router = useRouter()
    let searchParams = useSearchParams()

    let {toast} = useToast()
 
    // useRef
    let contentRef = useRef<HTMLTextAreaElement>(null)

    // useState
    let [username, setUsername] = useState('')
    let [errorMessage, setErrorMessage] = useState('')
    let [message, setMessage] = useState('')

    useEffect(() => {
        let userName = searchParams.get('username')
        if (userName) {
            setUsername(userName)
        }
    }, [searchParams, setUsername])
    
    async function onSignup() {
        router.push('/signup')
    }

    async function onLogin() {
        router.push('/login')
    }

    function resetContent() {
        if (contentRef.current) {
            contentRef.current.value = ''
            setMessage('')
            setErrorMessage('')
        }
    }

    async function sendMessage() {
        if (message.length > 300) {
            setErrorMessage('content should not be more than 300 characters')
            return
        }
        else if (message.length < 5) {
            setErrorMessage('content should be atleast 5 characters')
            return
        }
        axios.post('/api/messages/send', { content: message, username })
            .then((res) => {
                const data = res.data
                if (data.success) {
                    resetContent()
                    toast({
                        title: 'Message sent successfully'
                    })
                }
                else {
                    alert(`Error in sending the message : ${data.message}`)
                }
            })
            .catch((err) => {
                alert(`Error in sending the message : ${err.message}`)
            })
    }

    return (
        <div className="flex flex-col items-center justify-between h-screen">
            <NavBar
                onLogin={onLogin}
                onSignup={onSignup}
            />
            <div className="flex flex-col items-center justify-evenly">
                <div
                    className="flex flex-col items-start justify-evenly p-3
                    mt-8 mb-5">
                    <p className="text-black text-1xl p-1 m-2">
                        Send anonymous message to <b>{username}</b>
                    </p>
                    <textarea
                        ref={contentRef}
                        onChange={(e) => {
                            setMessage(e.target.value)
                        }}
                        className="border-black border-2 p-2 rounded-md"
                        cols={65} rows={10} placeholder="Write something!">
                    </textarea>
                    <p
                        className="text-red-500 text-sm m-2">
                        {errorMessage}
                    </p>
                </div>
                <div
                    className="flex flex-row items-center justify-center w-screen
                    p-2 mt-1">
                    <button
                        onClick={resetContent}
                        className="bg-green-500 text-white p-1 mr-4 rounded-md 
                        h-9 w-16 hover:bg-green-600">
                        Reset
                    </button>
                    <button
                        onClick={sendMessage}
                        className="text-white p-1 ml-2 rounded-md h-9 w-32
                        bg-blue-950 hover:bg-blue-950">
                        Send Message
                    </button>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default function MessageComponent() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Message />
        </Suspense>
    );
}