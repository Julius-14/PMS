'use client';

import BarcodeImage from "@/app/components/barcodeImage";
import DateFrame from "@/app/components/dateFrame";
import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import { csrf } from "@/app/hooks/csrf";
import axios from "@/app/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import Swal from "sweetalert2";

export default function Archive () {

    const [archive, setArchive] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const getData = async () => {
        try {
            setIsLoading(true)
            await csrf()
            await axios.get('/api/item/archive')
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

    const restore = async id => {
        try {
            await csrf()
            await axios.post('/api/item/restore', {id: id, user_id: localStorage.getItem('uid')})
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
                {/* <div className="flex gap-2 w-full bg-white rounded-lg shadow-md p-6 archive-header-background">
                    <Link
                        href={'/data-entry/item'}
                        className="block w-1/3 bg-slate-900 hover:bg-slate-900/80 rounded-lg text-center text-white p-2"
                    >
                        back
                    </Link>
                </div> */}
                <div className="bg-gray-100 rounded-lg shadow-md p-6">
                    {
                        isLoading ?
                        <div className="rounded-lg w-full h-96 bg-slate-900">
                            <div className="absolute top-0 left-0 w-full h-96 flex justify-center items-center">
                                <ImSpinner3 className="w-5 h-5 animate-spin text-white" />
                            </div>
                        </div>
                        :
                        <div className="w-full h-96 overflow-y-scroll relative">
                            <table className="w-full table-fixed">
                                <thead className="text-gray-900 bg-gray-100 sticky top-0 w-full">
                                    <tr>
                                        <th>ITEM NAME</th>
                                        <th>BARCODE</th>
                                        <th>DATE DELETED</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        isLoading ?
                                        <div className="absolute w-full h-full flex justify-center items-center bg-gray-800 text-white">
                                            <ImSpinner3 className="w-5 h-5 animate-spin" />
                                        </div>
                                        :
                                        archive.map((item,idx)=>{
                                            return(
                                                <tr key={idx} className="border border-slate-900 hover:bg-slate-900/20">
                                                    <td className="border border border-slate-900 p-2">{item.item_name}</td>
                                                    <td className="border border border-slate-900 p-2"><BarcodeImage code={item.barcode} /></td>
                                                    <td className="border border border-slate-900 p-2"><DateFrame dateStr={item.deleted_at} /></td>
                                                    <td className="border border border-slate-900 p-2">
                                                        <button
                                                            onClick={()=>restore(item.id)}
                                                            className="w-full p-2 rounded-lg text-white bg-teal-600 hover:bg-teal-600/80"
                                                        >
                                                            Restore
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}