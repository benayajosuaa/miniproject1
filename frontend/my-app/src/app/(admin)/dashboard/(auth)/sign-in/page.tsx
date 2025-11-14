"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignInPage (){
    
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("Email Login :", email, "Password :", password)

        if (email && password) {
            router.push("/dashboard")
        }
    };
    
    return (
        <div className="bg-white text-black h-screen w-auto">
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col rounded-3xl pr-10 pl-10 p-12 gap-y-5 bg-gray-100">
                    {/* Title */}
                    <div className="flex flex-col">
                        <span className="text-xl">Sign In Your Account</span>
                        <span className="">Enter your email below to login to your account</span>
                    </div>

                    {/* form */}
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-4 text-left">
                            {/*email*/}
                            <div className="flex flex-col gap-y-1"> 
                                <label className="relative left-1">
                                    <h1 className="text-base">
                                        Email
                                    </h1>
                                </label>
                                <input 
                                    type="email" 
                                    placeholder="e.g test@halobenaya.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-2 pr-3 pl-3 border text-sm border-slate-500 rounded-xl"
                                />
                            </div>
                            {/* Password */}
                            <div>
                                <label className="relative left-1">
                                    <h1 className="text-base">
                                        Password
                                    </h1>
                                </label>
                                <input 
                                    type="password"
                                    placeholder="e.g Xjdhfsdzg123@"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-2 pr-3 pl-3 border text-sm border-slate-500 rounded-xl"
                                />
                            </div>
                            {/* Button */}
                            <div>
                                <button 
                                    type="submit"
                                    disabled={!email || !password}
                                    className={`bg-blue-500 p-2 w-full text-center rounded-xl ${email && password ? "bg-blue-500" : "bg-gray-400 cursor-not-allowed"} text-white`}
                                >
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
        </div>
    )
}