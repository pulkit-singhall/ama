'use client';
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter()
  let [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  })

  async function signUp(){
    axios.post("/api/users/signup",
      { username: user.username, email: user.email, password: user.password })
      .then((response) => {
        const data = response['data']
        console.log(data.message);
        if (data.success === true) {
          router.push('/login')
        }
        else {
          router.refresh()
        }
      })
      .catch((error) => {
        console.log(`error in signup: ${error}`);
      })
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-5 p-5">
        <input type="text" placeholder="username" onChange={(e) => {
          setUser({...user, username: e.target.value})
        }}/>
        <input type="email" placeholder="email" onChange={(e) => {
          setUser({...user, email: e.target.value})
        }}/>
        <input type="password" placeholder="password" onChange={(e) => {
          setUser({ ...user, password: e.target.value })
        }}/>
        <button onClick={signUp}>Sign Up</button>
      </div>
    </>
  );
}
