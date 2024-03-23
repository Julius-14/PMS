'use client';

import DateFrame from "@/app/components/dateFrame";
import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import { csrf } from "@/app/hooks/csrf";
import axios from "@/app/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Archive () {

    const [archive, setArchive] = useState([])

    useEffect(()=>{
        const getData = async () => {
            try {
                await csrf()
                await axios.get('/api/inventory/archive')
                .then(res=>{
                    setArchive(res.data.data)
                })
                .catch(err=>{
                    console.log(err)
                })
            } catch (error) {
                console.log(error)
            }
        }
        getData()
    }, [])

    const restore = async (id) => {
        try {
            await csrf()
            await axios.post('/api/inventory/restore', {id:id, user_id:localStorage.getItem('uid')})
            .then(res=>{
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                Swal.fire(err.message)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-4/5 top-20 right-0 p-6 space-y-2">
                <div className="w-full bg-white rounded-lg shadow-md p-6 flex gap-2 archive-header-background">
                    <Link
                        href={'/inventory'}
                        className="block w-1/3 p-2 rounded-lg bg-slate-900 hover:bg-slate-900/80 hover:font-bold text-center text-white"
                    >
                        back
                    </Link>
                </div>
                <div className="w-full bg-white text-cyan-400 rounded-lg shadow-md p-6 archive-background">
                    <div className="w-full h-96 overflow-y-scroll">
                        <table className="w-full table-auto">
                            <thead className="text-gray-300">
                                <tr>
                                    <th>Item Name</th>
                                    <th>Stock</th>
                                    <th>Total Price</th>
                                    <th>Total Cost</th>
                                    <th>Date Deleted</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    archive.map((item,idx)=>{
                                        return (
                                            <tr className="border border-cyan-400 hover:backdrop-blur-sm hover:bg-slate-900/20" key={idx}>
                                                <td className="border border-cyan-400 p-2">{item?.item?.item_name}</td>
                                                <td className="border border-cyan-400 p-2">{item?.stock}</td>
                                                <td className="border border-cyan-400 p-2">{item?.unit_price * item?.quantity}</td>
                                                <td className="border border-cyan-400 p-2">{item?.total_cost}</td>
                                                <td className="border border-cyan-400 p-2"><DateFrame dateStr={item?.deleted_at} /></td>
                                                <td className="text-white p-2">
                                                    <button
                                                        onClick={()=>restore(item.id)}
                                                        className="w-full p-2 rounded-lg bg-teal-500 hover:bg-teal-500/80"
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