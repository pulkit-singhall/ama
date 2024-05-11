'use client'
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function Login() {
    const router = useRouter()

    let { toast } = useToast()

    let [details, setDetails] = useState({
        email: "",
    })
    let [verify, setVerify] = useState(false)
    let [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (details.email !== '') {
            setVerify(true)
        }
        else {
            setVerify(false)
        }
    },
        [
            setVerify,
            details
        ])
    
    async function replaceVerifyPage() {
        if (verify) {
            axios.post('/api/users/emailCollect', { email: details.email })
                .then((res) => {
                    const data = res.data
                    if (data.success) {
                        toast({
                            title: 'Verification Code sent!'
                        })
                        router.push(`/verifyEmail?email=${details.email}`)
                    }
                    else {
                        setErrorMessage(`${data.message}`)
                    }
                })
                .catch((err) => {
                    setErrorMessage(`${err.message}`)
                })
        }
        else {
            setErrorMessage('Pls enter valid email')
        }
    }

    return (
        <div
            className="flex items-center justify-center h-screen
            w-screen bg-blue-950">
            <div
                className="flex flex-col items-center justify-evenly 
                bg-white w-96 h-96 rounded-xl">
                <p
                    className="align-center text-blue-950">
                    Login
                </p>
                <input
                    className="mb-1 w-48 h-8 rounded-md p-2 border-black border"
                    type="email"
                    placeholder="email"
                    onChange={(e) => {
                        setDetails({ ...details, email: e.target.value })
                    }} />
                <button
                    className={`${verify ? 'bg-blue-950' : 'bg-blue-800'} 
                    rounded-md text-white h-10 w-48`}
                    onClick={replaceVerifyPage}>
                    Send Verify Code
                </button>
                <p
                    className="text-sm text-red-700">{errorMessage}</p>
            </div>
        </div>
    )
}