'use client'
import axios from "axios"
import { useState } from "react"

export default function Login() {
    let [details, setDetails] = useState({
        email: "",
        password: ""
    })
    async function login() {
        axios.post('/api/users/login', { email: details.email, password: details.password })
            .then((response) => {
                const data = response['data']
                console.log(data.message);
            })
            .catch((error) => {
                console.log(`error in login ${error}`);
            })
    }
    return (
        <>
            <div className="flex flex-col items-center justify-center p-5 m-5">
                <input type="email" placeholder="email" onChange={(e) => {
                    setDetails({...details, email: e.target.value})
                }}/>
                <input type="password" placeholder="password" onChange={(e) => {
                    setDetails({...details, password: e.target.value})
                }}/>
                <button onClick={login}>Login</button>
            </div>
        </>
    )
}