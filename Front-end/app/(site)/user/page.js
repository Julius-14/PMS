'use client'

import DateFrame from "@/app/components/dateFrame";
import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import { csrf } from "@/app/hooks/csrf";
import axios from "@/app/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import Swal from "sweetalert2";

export default function User ()
{
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const confirmDelete = (id,idx) => {
        Swal.fire({
            title: 'Are you sure you want to delete User: '+users[idx].name+'?',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true
        })
        .then(res=>{
            if (res.isConfirmed) {
                archiveUser(id)
            }
        })
    }

    const archiveUser = async (id) => {
        try {
            await csrf()
            await axios.post('/api/user/delete', {id:id, user_id: localStorage.getItem('uid')})
            .then(res=>{
                getUsers()
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                console.log(err)
                Swal.fire(err.message)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const getUsers = async () => {
        try {
            setIsLoading(true)
            await csrf()
            await axios.get('/api/user/index')
            .then(res=>{
                setIsLoading(false)
                setUsers(res.data.data)
            })
            .catch(err=>{
                setIsLoading(false)
                console.log(err)
            })
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }

    useEffect(()=>{
        getUsers()
    }, [])

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-4/5 top-20 right-0 p-6 space-y-2">
                <div className="w-full rounded-lg shadow-md p-6 bg-white/80 flex gap-2">
                    <Link
                        href={'/user/create'}
                        className="block p-2 rounded-lg w-1/3 bg-teal-500 hover:bg-teal-500/80 hover:font-bold text-white text-center"
                    >
                        create user
                    </Link>
                    <Link
                        href={'/user/archive'}
                        className="block p-2 rounded-lg w-1/3 bg-red-600 hover:bg-red-600/80 hover:font-bold text-white text-center"
                    >
                        archive
                    </Link>
                </div>
                <div className="w-full rounded-lg shadow-md p-6 bg-gray-100 h-96 overflow-y-scroll relative">
                    <table className="w-full table-fixed">
                        <thead className="text-gray-900 sticky top-0 bg-gray-100 w-full">
                            <tr>
                                <th>NAME</th>
                                <th>EMAIL</th>
                                <th>PASSWORD</th>
                                <th>DATE CREATED</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                isLoading ? 
                                <div className="absolute w-full h-full bg-gray-800 flex justify-center items-center">
                                    <ImSpinner3 className="w-5 h-5 animate-spin text-white" />
                                </div>
                                :
                                users.map((item,index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item?.name}</td>
                                            <td>{item?.email}</td>
                                            <td>{item?.default_password}</td>
                                            <td><DateFrame dateStr={item?.created_at} /></td>
                                            <td className="flex gap-2">
                                                <button
                                                    onClick={()=>confirmDelete(item?.id, index)}
                                                    className="p-2 w-full rounded-lg bg-red-600 hover:bg-red-600/80 hover:font-bold text-white"
                                                >
                                                    archive
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}