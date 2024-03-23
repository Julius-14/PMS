'use client'

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import { csrf } from "@/app/hooks/csrf";
import axios from "@/app/lib/axios";
import Link from "next/link";
import BarcodeImage from "@/app/components/barcodeImage";
import { useEffect, useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import Swal from "sweetalert2";

export default function Item () {

    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const confirmDelete = id => {
        Swal.fire({
            title: 'Delete Item?',
            icon: 'question',
            showConfirmButton: true,
            showCancelButton: true
        })
        .then(res=>{
            if (res.isConfirmed) {
                archiveItem(id)
            }
        })
    }

    const archiveItem = async id => {
        try {
            await axios.post('/api/item/delete', {id:id, user_id: localStorage.getItem('uid')})
            .then(res=>{
                getItemData()
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                Swal.fire(err.message)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const getItemData = async () => {
        try {
            setIsLoading(true)
            await csrf()
            await axios.get('/api/item')
            .then(res=>{
                setItems(res.data.data)
                setIsLoading(false)
            })
            .catch(err=>{
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getItemData()
    }, [])

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-4/5 top-20 right-0 p-6 space-y-2">
                <div className="w-full rounded-lg bg-white shadow-md p-6 flex gap-2 header-background">
                    <Link
                        href={'/data-entry/item/create'}
                        className="block w-1/3 p-2 rounded-lg bg-teal-500 hover:bg-teal-500/80 hover:font-bold text-center text-white"
                    >
                        New Item
                    </Link>
                    <Link
                        href={'/data-entry/item/archive'}
                        className="block w-1/3 p-2 rounded-lg bg-red-600 hover:bg-red-600/80 hover:font-bold text-center text-white"
                    >
                        Archive
                    </Link>
                </div>
                <div className="w-full rounded-lg bg-gray-100 shadow-md p-6">
                    <div className="w-full h-96 overflow-y-scroll relative">
                        <table className="w-full table-fixed">
                            <thead className="text-teal-800 sticky top-0 w-full bg-gray-100">
                                <tr>
                                    <th>ITEM NAME</th>
                                    <th>BARCODE</th>
                                    <th>UNIT</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    isLoading ? <div className="absolute flex justify-center items-center w-full h-full bg-gray-800 text-white"><ImSpinner3 className="animate-spin w-5 h-5" /></div> :
                                    items.map((item,index)=>{
                                        return (
                                            <tr className="border border-teal-900 hover:text-teal-600" key={index}>
                                                <td className="border border-teal-900 p-2">{item?.item_name}</td>
                                                <td className="border border-teal-900 p-2"><BarcodeImage code={item?.barcode} /></td>
                                                <td className="border border-teal-900 p-2">{item?.unit}</td>
                                                <td className="border border-teal-900 p-2 text-white space-y-2">
                                                    <Link
                                                        href={'/data-entry/item/edit/'+item?.id}
                                                        className="block w-full p-2 rounded-lg bg-teal-500 hover:bg-teal-500/80 hover:font-bold text-center"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={()=>confirmDelete(item.id)}
                                                        className="w-full p-2 rounded-lg bg-red-600 hover:bg-red-600/80 hover:font-bold"
                                                    >
                                                        Archive
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