'use client'
import HomeCarousel from "@/components/carousel"
import Footer from "@/components/footer"
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

    async function onVerify() {
        router.push('/emailCollect')
    }

    return (
        <div
            className="flex flex-col items-center h-screen w-screen justify-between">
            <NavBar
                onSignup={onSignup}
                onLogin={onLogin}
                onVerify={onVerify}
            />
            <div className="flex flex-col items-center justify-evenly">
                <div
                    className="flex flex-col items-start mb-10">
                    <p className="text-5xl p-1 text-blue-950">
                        <b>Deep dive into the world of</b>
                    </p>
                    <p className="text-5xl p-1 text-blue-950">
                        <b>Anonymous Messages!</b>
                    </p>
                </div>
                <HomeCarousel/>
            </div>
            <Footer/>
        </div>
    )
}