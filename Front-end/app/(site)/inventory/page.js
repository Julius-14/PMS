'use client';

import BarcodeImage from "@/app/components/barcodeImage";
import DateExpiry from "@/app/components/dateExpiry";
import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import { csrf } from "@/app/hooks/csrf";
import axios from "@/app/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import Swal from "sweetalert2";

export default function Inventory () {

    const [stocks, setStocks] = useState([])
    const [isTableLoading, setIsTableLoading] = useState(false)

    const confirmDelete = id => {
        Swal.fire({
            title: 'Are you sure you want to delete this inventory?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        })
        .then(res=>{
            if (res.isConfirmed) {
                archiveStock(id)
            }
        })
    }

    const archiveStock = async (id) => {
        try {
            await csrf()
            await axios.post('/api/inventory/delete', {id:id, user_id: localStorage.getItem('uid')})
            .then(res=>{
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

    useEffect(()=>{
        const getStocks = async () => {
            try {
                setIsTableLoading(true)
                await csrf()
                await axios.get('/api/inventory')
                .then(res=>{
                    setStocks(res.data.data)
                    setIsTableLoading(false)
                })
                .catch(err=>{
                    console.log(err)
                })
            } catch (error) {
                console.log(error)
            }
        }
        getStocks()
    }, [])

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-4/5 top-20 right-0 p-6 space-y-2">
                {/* <div className="w-full bg-white rounded-lg shadow-md p-6 flex gap-2 header-background">
                    <Link 
                        href={'/inventory/create'}
                        className="block w-1/3 p-2 rounded-lg bg-teal-500 hover:bg-teal-500/80 hover:font-bold text-center text-white"
                    >
                        add stock
                    </Link>
                    <Link 
                        href={'/inventory/archive'}
                        className="block w-1/3 p-2 rounded-lg bg-red-600 hover:bg-red-600/80 hover:font-bold text-center text-white"
                    >
                        archive
                    </Link>
                </div> */}
                <div className="w-full bg-gray-100 rounded-lg shadow-md p-6">
                    <div className="w-full h-96 overflow-y-scroll relative">
                        <table className="w-full table-fixed text-gray-900">
                            <thead className="text-teal-400 sticky top-0 w-full bg-gray-100">
                                <tr>
                                    <th>ITEM NAME</th>
                                    <th>BARCODE</th>
                                    <th>UNIT PRICE</th>
                                    <th>STOCKS</th>
                                    <th>EXPIRY</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    isTableLoading ? (
                                        <div className="absolute w-full h-full bg-slate-900/90 flex justify-center items-center text-white">
                                            <ImSpinner3 className="animate-spin w-6 h-6" />
                                        </div>
                                    )
                                    :
                                    stocks.map((item,index)=>{
                                        return(
                                            <tr key={index} className="hover:backdrop-blur-sm">
                                                <td className="font-bold border border-slate-900 p-2">{item?.item?.item_name}</td>
                                                <td className="border border-slate-900 p-2"><BarcodeImage code={item?.item?.barcode} /></td>
                                                <td className="border border-slate-900 p-2">{item?.unit_price}</td>
                                                <td className="border border-slate-900 p-2">{item?.stock}</td>
                                                <td className="border border-slate-900 p-2 font-bold"><DateExpiry date={item?.expiry} /></td>
                                                <td className="border border-slate-900 p-2 space-y-2 text-white">
                                                    <Link
                                                        href={'/inventory/edit/'+item?.id}
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