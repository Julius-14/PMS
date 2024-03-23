'use client'

import Image from "next/image";

export default function Logo ()
{
    return (
        <div className="w-full flex justify-center items-center px-10">
            <Image 
                src={'/images/pharmacy-logo.png'}
                alt="logo"
                width={40}
                height={40}
            />
            <p className="p-2 text-sm text-white font-bold">Pharmacy Inventory Management</p>
        </div>
    )
}