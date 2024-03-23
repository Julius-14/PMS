'use client'

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import { csrf } from "@/app/hooks/csrf";
import axios from "@/app/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Create ()
{
    const [itemForm, setItemForm] = useState({
        user_id: '',
        item_name: '',
        barcode: '',
        unit: ''
    })

    const handleItemChange = e => {
        const {name, value} = e.target
        setItemForm({
            ...itemForm,
            [name]: value
        })
    }

    useEffect(()=>{
        if (typeof(window) !== 'undefined' && localStorage) {
            setItemForm({
                ...itemForm,
                user_id: localStorage.getItem('uid')
            })
        }
    }, [])

    const submitItem = async () => {
        try {
            await csrf()
            await axios.post('/api/item/store', itemForm)
            .then(res=>{
                setItemForm({
                    user_id: localStorage.getItem('uid'),
                    item_name: '',
                    barcode: '',
                    unit: ''
                })
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-4/5 top-20 right-0 p-6 flex justify-center">
                <div className="w-3/5 rounded-lg bg-white shadow-md p-6 space-y-2">
                    <p className="text-center text-2xl font-bold">Create Item</p>
                    <div>
                        <label className="text-xs font-bold">Item Name</label>
                        <input 
                            type="text"
                            className="w-full p-2 rounded-lg border hover:border-black"
                            name="item_name"
                            onChange={handleItemChange}
                            value={itemForm.item_name}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold">Barcode</label>
                        <input 
                            type="text"
                            className="w-full p-2 rounded-lg border hover:border-black"
                            name="barcode"
                            onChange={handleItemChange}
                            value={itemForm.barcode}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold">Unit</label>
                        <input 
                            type="text"
                            className="w-full p-2 rounded-lg border hover:border-black"
                            name="unit"
                            onChange={handleItemChange}
                            value={itemForm.unit}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={'/data-entry/item'}
                            className="block p-2 w-1/2 rounded-lg bg-slate-900 hover:bg-slate-900/80 hover:font-bold text-white text-center"
                        >
                            back
                        </Link>
                        <button
                            onClick={submitItem}
                            className="p-2 w-1/2 rounded-lg bg-teal-500 hover:bg-teal-500/80 hover:font-bold text-white"
                        >
                            create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}