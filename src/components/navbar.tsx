export default function NavBar({onLogin, onSignup}: any) {
    return (
        <>
            <div
                className="
                w-screen h-16 bg-orange-400
                flex flex-row items-center
                justify-between p-8"
            >
                <p
                    className="text-white text-3xl italic font-medium font-oswald">
                    AMA
                </p>
                <div>
                    <button
                        className="text-white h-9 border-white 
                        border-2 rounded-md w-24 text-md p-1 mr-5
                        hover:bg-white hover:text-black"
                        onClick={()=>onSignup()}
                    >
                        Signup
                    </button>
                    <button className="text-white h-9 border-white 
                        border-2 rounded-md w-24 text-md
                        hover:bg-white hover:text-black"
                        onClick={()=>onLogin()}
                    >
                        Login
                    </button>
                </div>
            </div>
        </>
    )
}