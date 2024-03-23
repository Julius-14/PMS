'use client';

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import { csrf } from "@/app/hooks/csrf";
import axios from "@/app/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ImSpinner, ImSpinner3 } from "react-icons/im";
import Swal from "sweetalert2";

export default function Archive () {

    const [archive, setArchive] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const getData = async () => {
        try {
            setIsLoading(true)
            await csrf()
            await axios.get('/api/user/archive')
            .then(res=>{
                setArchive(res.data.data)
                setIsLoading(false)
            })
            .catch(err=>{
                console.log(err)
                setIsLoading(false)
            })
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    const confirmRestore = (id, idx) => {
        Swal.fire({
            title: 'Are you sure you want to restore User: '+archive[idx].name+'?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        })
        .then(res=>{
            if (res.isConfirmed) {
                restore(id)
            }
        })
    }

    const restore = async id => {
        try {
            await csrf()
            await axios.post('/api/user/restore', {id: id, user_id: localStorage.getItem('uid')})
            .then(res=>{
                getData()
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                Swal.fire(err.message)
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getData()
    }, [])

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-4/5 top-20 right-0 p-6 space-y-2">
                <div className="w-full bg-white shadow-md rounded-lg p-6">
                    <Link
                        href={'/user'}
                        className="block w-1/3 p-2 rounded-lg bg-slate-900 hover:bg-slate-900/80 text-white text-center"
                    >
                        back
                    </Link>
                </div>
                <div className="w-full bg-white shadow-md rounded-lg p-6">
                    <div className="w-full h-96 overflow-y-scroll relative">
                        <table className="w-full table-auto">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Password</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    isLoading ? 
                                    <div className="absolute w-full h-full bg-gray-800 text-white flex justify-center items-center">
                                        <ImSpinner3 className="w-5 h-5 animate-spin" />
                                    </div>
                                    :
                                    archive.map((item, idx) => {
                                        return(
                                            <tr key={idx}>
                                                <td>{item.name}</td>
                                                <td>{item.email}</td>
                                                <td>{item.default_password}</td>
                                                <td>
                                                    <button
                                                        onClick={()=>confirmRestore(item.id, idx)}
                                                        className="w-full p-2 rounded-lg text-white bg-teal-500 hover:bg-teal-500/80"
                                                    >
                                                        restore
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
        </div>
    )
}