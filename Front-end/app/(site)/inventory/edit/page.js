'use client'

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import ItemSelect from "@/app/components/selects/itemSelect";
import { csrf } from "@/app/hooks/csrf";
import axios from "@/app/lib/axios";
import Link from "next/link";
import { useState } from "react";

export default function Edit ()
{
    const [stockForm, setStockForm] = useState({
        unit_price: '',
        quantity: ''
    })

    const handleItemChange = id => {
        setStockForm({
            ...stockForm,
            item_id: id
        })
    }

    const updateStock = async () => {
        try {
            await csrf()
            await axios.post()
            .then(res=>{
                
            })
            .catch(err=>{

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
                    <p className="text-center text-2xl font-bold">Edit Stock</p>
                    <div>
                        <label>Item</label>
                        <ItemSelect className="p-2 w-full rounded-lg border hover:border-black" onHandleChange={handleItemChange} />
                    </div>
                    <div>
                        <label>Unit Price</label>
                        <input 
                            type="text"
                            className="w-full p-2 rounded-lg border hover:border-black"
                        />
                    </div>
                    <div>
                        <label>Quantity</label>
                        <input 
                            type="text"
                            className="w-full p-2 rounded-lg border hover:border-black"
                        />
                    </div>
                    <div>
                        <label>Cost</label>
                        <input 
                            type="text"
                            className="w-full p-2 rounded-lg border hover:border-black"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={'/inventory'}
                            className="w-1/2 p-2 rounded-lg bg-slate-900 hover:bg-slate-900/80 hover:font-bold text-white text-center"
                        >
                            back
                        </Link>
                        <button
                            className="w-1/2 p-2 rounded-lg bg-teal-500 hover:bg-teal-500/80 hover:font-bold text-white"
                        >
                            save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}