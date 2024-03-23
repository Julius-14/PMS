'use client';

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import { csrf } from "@/app/hooks/csrf";
import axios from "@/app/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Edit ({ params }) {

    const [itemForm, setItemForm] = useState({
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

    const updateItem = async () => {
        try {
            await csrf()
            await axios.post('/api/item/update', {
                id: params.slug,
                item_name: itemForm.item_name,
                barcode: itemForm.barcode,
                unit: itemForm.unit
            })
            .then(res=>{
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        const getData = async () => {
            try {
                await csrf()
                await axios.post('/api/item/show', {id: params.slug})
                .then(res=>{
                    setItemForm(res.data.data)
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
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-4/5 top-20 right-0 p-6">
                <div className="w-3/5 rounded-lg bg-white shadow-md p-6 space-y-2">
                    <p className="text-center text-2xl font-bold">Edit Item</p>
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
                            onClick={updateItem}
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