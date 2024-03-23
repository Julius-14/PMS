'use client'

import { csrf } from "@/app/hooks/csrf"
import axios from "@/app/lib/axios"
import { useEffect, useState } from "react"

export default function ItemSelect ({ className, onHandleChange, defaultVal }) 
{
    const [items, setItems] = useState([])

    useEffect(()=>{
        const getItems = async () => {
            try {
                await csrf()
                await axios.get('/api/item')
                .then(res=>{
                    setItems(res.data.data)
                })
                .catch(err=>{
                    console.log(err)
                })
            } catch (error) {
                console.log(error)
            }
        }
        getItems()
    }, [items])
    
    return (
        <select
            className={className}
            onChange={e=>onHandleChange(e.target.value)}
            value={defaultVal}
        >
            <option>-- Select Item --</option>
            {
                items.map((item,index)=>{
                    return(
                        <option key={index} value={item?.id}>{item?.item_name}</option>
                    )
                })
            }
        </select>
    )
}