'use client';
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast"

export default function Signup() {
  const router = useRouter()
  let [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  })
  let [verify, setVerify] = useState(false)
  let [errorMessage, setErrorMessage] = useState('')

  let {toast} = useToast()

  useEffect(() => {
    if (user.email !== "" && user.password !== "" && user.username !== "") {
      setVerify(true)
    }
    else {
      setVerify(false)
    }
  },
    [setVerify, user])

  async function loginReplace() {
    router.replace('/login')
  }

  async function signUp() {
    if (verify) {
      axios.post('/api/users/signup',
        {
          username: user.username,
          email: user.email,
          password: user.password,
        })
        .then((response) => {
          const data = response['data']
          if (!data.success) {
            setErrorMessage(data.message)
          }
          else {
            toast({
              title: 'User signed up successfully'
            })
            router.push(`/verifyEmail?email=${user.email}`)
          }
        }).catch((err) => {
          setErrorMessage(err.message)
        })
    }
    else {
      setErrorMessage('Pls fill the details!')
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
          Create Account
        </p>
        <input
          className="mb-1 w-48 h-8 rounded-md p-2 border-black border"
          type="text"
          placeholder="username"
          onChange={(e) => {
            setUser({ ...user, username: e.target.value })
          }} />
        <input
          className="mb-1 w-48 h-8 rounded-md p-2 border-black border"
          type="email"
          placeholder="email"
          onChange={(e) => {
            setUser({ ...user, email: e.target.value })
          }} />
        <input
          className="mb-3 w-48 h-8 rounded-md p-2 border-black border"
          type="password"
          placeholder="password"
          onChange={(e) => {
            setUser({ ...user, password: e.target.value })
          }} />
        <button
          className={`${verify ? 'bg-blue-950' : 'bg-blue-800'} rounded-md 
          text-white h-10 w-48`}
          onClick={signUp}>Sign Up</button>
        <p
          className="text-sm text-red-700">{errorMessage}</p>
        <p
          className="text-sm">
          Already have an account?
          <button
            className="ml-2 text-sm text-blue-950"
            onClick={loginReplace}>
            Login Here!
          </button>
        </p>
      </div>
    </div>
  );
}
