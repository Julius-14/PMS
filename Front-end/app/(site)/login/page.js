'use client'

import Logo from "@/app/components/logo"
import { csrf } from "@/app/hooks/csrf"
import axios from "@/app/lib/axios"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { LoginRedirect } from "@/app/hooks/login"
import { ImSpinner3 } from "react-icons/im"
import Swal from "sweetalert2"
import { BsFillPersonFill } from "react-icons/bs"
import { BiSolidKey } from "react-icons/bi"

export default function Login () 
{
    const router = useRouter()
    const {login} = LoginRedirect({url:'/'})
    const [isLoading, setIsLoading] = useState(false)
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    })

    const handleLoginChange = e => {
        const {name, value} = e.target
        setLoginForm({
            ...loginForm,
            [name]: value
        })
    }

    const submitLogin = async () => {
        try {
            setIsLoading(true)
            await csrf()
            await axios.post('/api/user/login', loginForm)
            .then(res=>{
                const uid = res.data.uid
                localStorage.setItem('uid', uid.id)
                localStorage.setItem('role', res.data.role)
                login({user: uid})
            })
            .catch(err=>{
                console.log(err)
                Swal.fire(err.response.data.errors)
                setIsLoading(false)
            })
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    return (
        <div className="flex justify-end px-40 items-center absolute w-full h-full text-gray-200 login">
            {
                isLoading && (
                    <div className="fixed w-full h-full bg-slate-900/90 flex top-0 left-0 right-0 justify-center items-center gap-2">
                        <ImSpinner3 className="animate-spin w-6 h-6" /> 
                        <span className="text-white text-xl font-bold">Logging in</span>
                        <span className="text-white text-xl font-bold animate-pulse">.</span>
                        <span className="text-white text-xl font-bold animate-pulse">.</span>
                        <span className="text-white text-xl font-bold animate-pulse">.</span>
                    </div>
                )
            }
            <div className="w-1/2 bg-slate-900/60 rounded-lg">
                <div className="p-6">
                    <Logo />
                </div>
                <div className="p-6 space-y-5">
                    <div className="group">
                        <label className="group-hover:text-white">Email</label>
                        <div className="flex">
                            <BsFillPersonFill className="bg-red-500 p-2 w-10 h-11 group-hover:text-white group-hover:border-white border border-gray-400" />
                            <input 
                                type="text"
                                className="w-full focus:outline-none focus:bg-slate-900 p-2 border border-gray-400 group-hover:border-white bg-slate-900/10"
                                name="email"
                                onChange={handleLoginChange}
                                value={loginForm.email}
                            />
                        </div>
                    </div>
                    <div className="group">
                        <label className="group-hover:text-white">Password</label>
                        <div className="flex">
                            <BiSolidKey className="w-10 h-11 p-2 bg-red-500 border border-gray-400 group-hover:border-white group-hover:text-white" />
                            <input 
                                type="password"
                                className="w-full focus:outline-none focus:bg-slate-900 p-2 border border-gray-400 group-hover:border-white bg-slate-900/10"
                                name="password"
                                onChange={handleLoginChange}
                                value={loginForm.password}
                            />
                        </div>
                    </div>
                    <button
                        onClick={submitLogin}
                        className="w-full p-2 bg-red-500 rounded-lg border border-gray-400 hover:bg-red-500/80 hover:border-white hover:text-white"
                    >
                        login
                    </button>
                </div>
            </div>
        </div>
    )
}