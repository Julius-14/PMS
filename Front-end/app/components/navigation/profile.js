'use client'

import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AiOutlineCaretDown } from "react-icons/ai"

export default function Profile () {
    const router = useRouter()

    const [isOpen, setIsOpen] = useState(false)

    const [userData, setUserData] = useState({
        first_name: '',
        last_name: ''
    })

    const logout = async () => {
        try {
            await axios.get('/api/logout')
            .then(res=>{
                router.push('/login')
            })
            .catch(err=>{
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="relative z-50">
            <button 
                className="flex gap-2 p-2"
                onClick={()=>setIsOpen(!isOpen)}
            >
                <span>{userData.first_name} {userData.last_name}</span>
                <AiOutlineCaretDown />
            </button>
            {
                isOpen && (
                    <div className="absolute right-0 w-[300px] rounded-lg h-40 bg-slate-900 text-gray-400 space-y-2 p-6">
                        <Link
                            href={'/profile'}
                            className="block w-full p-2 text-center rounded-lg border hover:text-white hover:border-white"
                        >
                            <p className="font-bold">view my profile</p>
                            <p className="text-xs">{userData.first_name} {userData.last_name}</p>
                        </Link>
                        <button
                            onClick={logout}
                            className="p-2 w-full rounded-lg border hover:text-white hover:border-white"
                        >
                            logout
                        </button>
                    </div>
                )
            }
        </div>
    )
}