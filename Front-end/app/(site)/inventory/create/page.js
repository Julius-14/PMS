'use client'

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import ItemSelect from "@/app/components/selects/itemSelect";
import { csrf } from "@/app/hooks/csrf";
import axios from "@/app/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Create ()
{
    const [stockForm, setStockForm] = useState({
        unit_price: '',
        quantity: '',
        cost: '',
        expiry: '',
        item_id: ''
    })

    const handleStockChange = e => {
        const {name, value} = e.target
        setStockForm({
            ...stockForm,
            [name]: value
        })
    }

    const handleItemChange = id => {
        setStockForm({
            ...stockForm,
            item_id: id
        })
    }

    const submitStock = async () => {
        const uid = localStorage.getItem('uid')
        try {
            await csrf()
            await axios.post('/api/inventory/store', {
                user_id: uid,
                item_id: stockForm.item_id,
                unit_price: stockForm.unit_price,
                quantity: stockForm.quantity,
                cost: stockForm.cost,
                expiry: stockForm.expiry,
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

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-4/5 top-20 right-0 p-6 flex justify-center">
                <div className="w-3/5 bg-white rounded-lg shadow-md p-6 space-y-2">
                    <p className="text-center text-2xl font-bold">Add Stock</p>
                    <div>
                        <label>Item</label>
                        <ItemSelect className="p-2 w-full rounded-lg border hover:border-black" onHandleChange={handleItemChange} />
                    </div>
                    <div className="flex gap-2">
                        <div className="w-1/2">
                            <label>Expiry Date</label>
                            <input 
                                type="date"
                                className="w-full p-2 rounded-lg border hover:border-black"
                                name="expiry"
                                onChange={handleStockChange}
                                value={stockForm.expiry}
                            />
                        </div>
                        <div className="w-1/2">
                            <label>Unit Price</label>
                            <input 
                                type="Number"
                                className="w-full p-2 rounded-lg border hover:border-black"
                                name="unit_price"
                                onChange={handleStockChange}
                                value={stockForm.unit_price}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-1/2">
                            <label>Quantity</label>
                            <input 
                                type="Number"
                                className="w-full p-2 rounded-lg border hover:border-black"
                                name="quantity"
                                onChange={handleStockChange}
                                value={stockForm.quantity}
                            />
                        </div>
                        <div className="w-1/2">
                            <label>Cost</label>
                            <input 
                                type="Number"
                                className="w-full p-2 rounded-lg border hover:border-black"
                                name="cost"
                                onChange={handleStockChange}
                                value={stockForm.cost}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={'/inventory'}
                            className="w-1/2 p-2 rounded-lg bg-slate-900 hover:bg-slate-900/80 hover:font-bold text-white text-center"
                        >
                            back
                        </Link>
                        <button
                            onClick={submitStock}
                            className="w-1/2 p-2 rounded-lg bg-teal-500 hover:bg-teal-500/80 hover:font-bold text-white"
                        >
                            add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}