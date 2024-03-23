'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineDashboard, MdOutlineInventory, MdInventory } from "react-icons/md";
import { BsFillPersonFill, BsCapsule } from "react-icons/bs";
import { LiaCashRegisterSolid } from "react-icons/lia";
import { GiMedicines } from "react-icons/gi";
import { AiOutlineStock } from "react-icons/ai";
import { FaChartSimple } from "react-icons/fa6";
import Logo from "../logo";
import { useEffect, useState } from "react";

export default function SideNav () {

    const currentPath = usePathname()
    const [role, setRole] = useState('user')

    useEffect(()=>{
        if(typeof window !== 'undefined' && window.localStorage) {
            setRole(localStorage.getItem('role'))
        }
    }, [])

    return (
        <div className="fixed w-1/5 h-full left-0 bg-blue-600/80 text-gray-300 no-print">
            <div>
                <Logo />
            </div>
            <ul className={`${role == 'admin' ? 'w-full p-6 space-y-2' : 'hidden'}`}>
                <p className="text-xs font-bold">ADMIN</p>
                <li>
                    <Link
                        href={'/'}
                        className={`flex block w-full p-2 gap-2 rounded-lg hover:bg-slate-900 hover:text-white ${currentPath == '/' ? 'bg-gray-600' : ''}`}
                    >
                        <MdOutlineDashboard className="w-6 h-6" />
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link
                        href={'/user'}
                        className={`flex block w-full p-2 gap-2 rounded-lg hover:bg-slate-900 hover:text-white ${currentPath.startsWith('/user') ? 'bg-gray-600' : ''}`}
                    >
                        <BsFillPersonFill className="w-6 h-6" />
                        User
                    </Link>
                </li>
            </ul>
            <div className="w-full h-96 overflow-y-scroll">
                <ul className="w-full p-6 space-y-2">
                    <p className="text-xs font-bold">MENU</p>
                    <li>
                        <Link
                            href={'/inventory'}
                            className={`flex block w-full p-2 gap-2 rounded-lg hover:bg-slate-900 hover:text-white ${currentPath == '/inventory' ? 'bg-gray-600' : ''}`}
                        >
                            <MdOutlineInventory className="w-6 h-6" />
                            Inventory
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={'/pos'}
                            className={`flex block w-full p-2 gap-2 rounded-lg hover:bg-slate-900 hover:text-white ${currentPath == '/pos' ? 'bg-gray-600' : ''}`}
                        >
                            <LiaCashRegisterSolid className="w-6 h-6" />
                            POS
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={'/sales'}
                            className={`flex block w-full p-2 gap-2 rounded-lg hover:bg-slate-900 hover:text-white ${currentPath == '/sales' ? 'bg-gray-600' : ''}`}
                        >
                            <FaChartSimple className="w-6 h-6" />
                            Sales
                        </Link>
                    </li>
                </ul>
                <ul className="w-full p-6 space-y-2">
                    <p className="text-xs font-bold">DATA ENTRY</p>
                    <li>
                        <Link
                            href={'/data-entry/item'}
                            className={`flex block w-full p-2 gap-2 rounded-lg hover:bg-slate-900 hover:text-white ${currentPath.startsWith('/data-entry/item') ? 'bg-gray-600' : ''}`}
                        >
                            <GiMedicines className="w-6 h-6" />
                            Item
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={'/data-entry/stock'}
                            className={`flex block w-full p-2 gap-2 rounded-lg hover:bg-slate-900 hover:text-white ${currentPath.startsWith('/data-entry/stock') ? 'bg-gray-600' : ''}`}
                        >
                            <AiOutlineStock className="w-6 h-6" />
                            Stock
                        </Link>
                    </li>
                </ul>
                <ul className="w-full p-6 space-y-2">
                    <p className="text-xs font-bold">ARCHIVE</p>
                    <li>
                        <Link
                            href={'/archive/inventory'}
                            className={`flex block w-full p-2 gap-2 rounded-lg hover:bg-slate-900 hover:text-white ${currentPath.startsWith('/archive/inventory') ? 'bg-gray-600' : ''}`}
                        >
                            <MdInventory className="w-6 h-6" />
                            Inventory
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={'/archive/item'}
                            className={`flex block w-full p-2 gap-2 rounded-lg hover:bg-slate-900 hover:text-white ${currentPath.startsWith('/archive/item') ? 'bg-gray-600' : ''}`}
                        >
                            <BsCapsule className="w-6 h-6" />
                            Item
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}