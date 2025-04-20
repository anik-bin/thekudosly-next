"use client";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {

    const router = useRouter();
    const { data: session, status, update } = useSession();
    const [username, setUsername] = useState("")
    const [loading, setLoading] = useState(false)

    // useEffect(() => {
    //     if (session?.user?.username) {
    //         router.replace("/dashboard")
    //     }
    // }, [session, router])


    /* eslint-disable @typescript-eslint/no-explicit-any */
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("/api/set-username",
                {
                    username
                });

            if (response.data.success) {
                await update();

                router.replace("/");
            }

        /* eslint-disable @typescript-eslint/no-explicit-any */
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to set the username")
        } finally {
            setLoading(false);
        }
    }

    if (status === "loading") {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    return (
        <div className="dark:bg-gray-800">
            {session ? (
                <div className="flex flex-col gap-4 justify-center items-center h-screen">
                    <h1 className="text-xl font-bold">Create Your Username</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="px-4 py-2 rounded border text-black"
                            required
                            minLength={3}
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Submit"}
                        </button>
                    </form>
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-4 justify-center items-center h-screen">
                        <h1 className="text-xl font-bold mb-4">Sign in/Sign up</h1>
                        <button
                            className="px-4 py-2 border flex gap-2 bg-white border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
                            onClick={() => signIn("google")}
                        >
                            <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                            <span>Login with Google</span>
                        </button>
                    </div>

                </>
            )}
        </div>

    )
}

export default Login