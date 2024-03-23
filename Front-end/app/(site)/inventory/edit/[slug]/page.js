'use client'

import SideNav from "@/app/components/navigation/sideNav"
import TopNav from "@/app/components/navigation/topNav"
import ItemSelect from "@/app/components/selects/itemSelect"
import { csrf } from "@/app/hooks/csrf"
import axios from "@/app/lib/axios"
import Link from "next/link"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

export default function Edit ({ params })
{
    const [inventoryForm, setInventoryForm] = useState({
        item_id: '',
        expiry: '',
        unit_price: '',
        quantity: '',
        total_cost: ''
    })

    const handleForm = e => {
        const {name, value} = e.target
        setInventoryForm({
            ...inventoryForm,
            [name]: value
        })
    }

    const handleItemChange = id => {
        setInventoryForm({
            ...inventoryForm,
            item_id: id
        })
    }

    const getData = async () => {
        try {
            await csrf()
            await axios.post('/api/inventory/show', {id: params.slug})
            .then(res=>{
                setInventoryForm(res.data.data)
            })
            .catch(err=>{
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const updateStock = async () => {
        try {
            await csrf()
            await axios.post('/api/inventory/update', {
                id: params.slug,
                item_id: inventoryForm.item_id,
                unit_price: inventoryForm.unit_price,
                total_cost: inventoryForm.total_cost,
                quantity: inventoryForm.quantity,
                expiry: inventoryForm.expiry
            })
            .then(res=>{
                getData()
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                console.log(err)
                Swal.fire(err.response.data.message)
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
            <div className="absolute w-4/5 top-20 right-0 p-6 flex justify-center">
                <div className="w-3/5 bg-white rounded-lg shadow-md p-6 space-y-2">
                    <p className="text-center text-2xl font-bold">Edit Stock</p>
                    <div>
                        <label>Item</label>
                        <ItemSelect defaultVal={inventoryForm.item_id} className="p-2 w-full rounded-lg border hover:border-black" onHandleChange={handleItemChange} />
                    </div>
                    <div>
                        <label>Unit Price</label>
                        <input 
                            type="number"
                            className="w-full p-2 rounded-lg border hover:border-black"
                            name="unit_price"
                            onChange={handleForm}
                            value={inventoryForm.unit_price}
                        />
                    </div>
                    <div>
                        <label>Quantity</label>
                        <input 
                            type="number"
                            className="w-full p-2 rounded-lg border hover:border-black"
                            name="quantity"
                            onChange={handleForm}
                            value={inventoryForm.quantity}
                        />
                    </div>
                    <div>
                        <label>Cost</label>
                        <input 
                            type="number"
                            className="w-full p-2 rounded-lg border hover:border-black"
                            name="cost"
                            onChange={handleForm}
                            value={inventoryForm.total_cost}
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
                            onClick={updateStock}
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