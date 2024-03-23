'use client'

import DateFrame from "@/app/components/dateFrame"
import SideNav from "@/app/components/navigation/sideNav"
import TopNav from "@/app/components/navigation/topNav"
import { csrf } from "@/app/hooks/csrf"
import axios from "@/app/lib/axios"
import { useEffect, useState } from "react"

export default function Sales () 
{
    const [sales, setSales] = useState([])

    useEffect(()=>{
        const getData = async () => {
            try {
                await csrf()
                await axios.get('/api/sale')
                .then(res=>{
                    setSales(res.data.data)
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

    return (
        <>
            <TopNav />
            <SideNav />
            <div className="absolute w-4/5 top-20 right-0 p-6 space-y-2">
                <div className="w-full bg-gray-100 rounded-lg shadow-md p-6">
                    <div className="w-full h-96 overflow-y-scroll relative">
                        <table className="w-full table-fixed relative">
                            <thead className="sticky top-0 w-full bg-gray-100">
                                <tr>
                                    <th>ITEMS</th>
                                    <th>TOTAL PRICE</th>
                                    <th>OR NUMBER</th>
                                    <th>DATE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    sales.map((item, id)=>{
                                        return (
                                            <tr key={id}>
                                                <td className="p-2 border border-slate-900">
                                                    {
                                                        item?.orders?.map((element,idx)=>{
                                                            return (
                                                                <div key={idx} className="border-b border-slate-900">
                                                                    <p className="font-bold">
                                                                        <span className="text-gray-500">Name: </span>
                                                                        <span className="text-teal-600">{element?.stocks?.item?.item_name}</span>
                                                                    </p>
                                                                    <p>
                                                                        <span className="text-gray-500">Quantity: </span>
                                                                        <span className="text-blue-500">{element?.quantity}</span>
                                                                    </p>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </td>
                                                <td className="p-2 border border-slate-900">{item?.total?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                <td className="p-2 border border-slate-900">{item?.or_number}</td>
                                                <td className="p-2 border border-slate-900"><DateFrame dateStr={item?.created_at} /></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}