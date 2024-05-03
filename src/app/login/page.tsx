'use client'
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function Login() {
    const router = useRouter()

    let {toast} = useToast()
 
    let [details, setDetails] = useState({
        email: "",
        password: ""
    })
    let [verify, setVerify] = useState(false)
    let [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (details.email !== '' && details.password !== '') {
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

    async function signupReplace() {
        router.replace('/signup')
    }
    
    async function login() {
        if (verify) {
            axios.post("/api/users/login",
                {
                    email: details.email,
                    password: details.password,
                })
                .then((res) => {
                    const data = res['data']
                    if (data.success) {
                        toast({
                            title: 'User logged in successfully'
                        })
                        router.replace('/profile')
                    }
                    else {
                        setErrorMessage(data.message)
                    }
                })
                .catch((err) => {
                    setErrorMessage(err.message)
                })
        }
        else {
            setErrorMessage('Pls fill the credentials!')
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
                <input
                    className="mb-1 w-48 h-8 rounded-md p-2 border-black border"
                    type="password"
                    placeholder="password"
                    onChange={(e) => {
                        setDetails({ ...details, password: e.target.value })
                    }} />
                <button
                    className={`${verify ? 'bg-blue-950' : 'bg-blue-800'} 
                    rounded-md text-white h-10 w-48`}
                    onClick={login}>Login</button>
                <p
                    className="text-sm text-red-700">{errorMessage}</p>
                <p
                    className="text-sm">
                    {`Didn't have an account?`}
                    <button
                        className="ml-2 text-sm text-blue-950"
                        onClick={signupReplace}>
                        Signup Here!
                    </button>
                </p>
            </div>
        </div>
    )
}