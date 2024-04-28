'use client'
import axios from "axios"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function VerifyEmail() {
    let router = useRouter()

    let [details, setDetails] = useState({
        code: "",
        email: "",
    })
    let [verify, setVerify] = useState(false)
    let [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (details.code !== "" && details.email !== "") {
            setVerify(true)
        }
        else {
            setVerify(false)
        }
    },
        [details, setVerify])

    async function verifyEmail() {
        if (verify) {
            axios.post("/api/users/verifyEmail",
                {
                    email: details.email,
                    verifyEmailCode: details.code
                })
                .then((response) => {
                    const data = response['data']
                    if (data.success) {
                        setErrorMessage('User verified successfully')
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
            setErrorMessage('Pls fill the credentials!')
        }
    }

    return (
        <div className="flex items-center h-screen justify-center">
            <div
                className="flex flex-col items-center justify-evenly bg-orange-50 w-96 h-96 rounded-xl">
                <p
                    className="align-center">Verify Email</p>
                <input
                    className="mb-3 w-48 h-8 rounded-md p-2 border-black border"
                    type="email"
                    placeholder="email"
                    onChange={(e) => {
                        setDetails({ ...details, email: e.target.value })
                    }} />
                <input
                    className="mb-3 w-48 h-8 rounded-md p-2 border-black border"
                    type="text"
                    placeholder="code"
                    onChange={(e) => {
                        setDetails({ ...details, code: e.target.value })
                    }} />
                <button
                    className={`${verify ? 'bg-orange-600' : 'bg-orange-400'} rounded-md text-white h-10 w-48`}
                    onClick={verifyEmail}>Verify Email</button>
                <p
                    className="text-sm text-red-700">{errorMessage}</p>
            </div>
        </div>
    )
}