'use client'
import NavBar from "@/components/navbar"
import { useRouter } from "next/navigation"

export default function Home() {
    let router = useRouter()
    async function onSignup() {
        router.push('/signup')
    }

    async function onLogin() {
        router.push('/login')
    }

    return (
        <>
            <NavBar
                onSignup={onSignup}
                onLogin={onLogin}
            />
        </>
    )
}