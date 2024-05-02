export default function ProfileNavbar({username, onLogout}: any) {
    return (
        <div
            className="flex flex-row items-center justify-between bg-blue-950
            p-5">
            <p
                className="text-white text-3xl italic font-medium font-oswald">
                AMA
            </p>
            <p
                className="text-white text-2xl font-medium font-oswald">
                {username}
            </p>
            <button
                className="text-white h-9 border-white 
                border-2 rounded-md w-24 text-md mr-5
                hover:bg-white hover:text-blue-950"
                onClick={()=>onLogout()}
            >
                Logout
            </button>
        </div>
    )
}