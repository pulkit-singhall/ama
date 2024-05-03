'use client'
import axios from "axios"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { useToast } from "@/components/ui/use-toast"

const VerifyEmail = () => {
    let router = useRouter()
    let searchParams = useSearchParams()

    const { toast } = useToast()

    let [details, setDetails] = useState({
        code: "",
    })
    let [verify, setVerify] = useState(false)
    let [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (details.code !== "" && details.code.length === 6) {
            setVerify(true)
        }
        else {
            setVerify(false)
        }
    },
        [details, setVerify])

    async function verifyEmail() {
        if (verify) {
            const userEmail = searchParams.get('email');
            axios.post("/api/users/verifyEmail",
                {
                    email: userEmail,
                    verifyEmailCode: details.code
                })
                .then((response) => {
                    const data = response['data']
                    if (data.success) {
                        // toast
                        toast({
                            title: 'User verified successfully'
                        })
                        router.replace('/login')
                    }
                    else {
                        setErrorMessage(data.message)
                    }
                })
                .catch((error) => {
                    setErrorMessage(error.message)
                })
        }
        else {
            setErrorMessage('Pls fill the code!')
        }
    }

    return (
        <div className="flex items-center h-screen justify-center 
        w-screen bg-blue-950">
            <div
                className="flex flex-col items-center justify-evenly 
                bg-white w-96 h-96 rounded-xl">
                <p
                    className="align-center text-blue-950">
                    Verify Email
                </p>
                <input
                    className="mb-3 w-48 h-8 rounded-md p-2 border-black border"
                    type="text"
                    placeholder="code"
                    onChange={(e) => {
                        setDetails({ ...details, code: e.target.value })
                    }} />
                <button
                    className={`${verify ? 'bg-blue-950' : 'bg-blue-800'} rounded-md text-white h-10 w-48`}
                    onClick={verifyEmail}>Verify Email</button>
                <p
                    className="text-sm text-red-700">{errorMessage}</p>
                </div>
            </div>
    )
}

export default function Verify() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmail />
        </Suspense>
    );
}