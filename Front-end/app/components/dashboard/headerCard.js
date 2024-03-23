'use client'

import { BsArrowUpLeftCircleFill } from "react-icons/bs"
import { TbCurrencyPeso } from "react-icons/tb"

export default function HeaderCard ({ className, title, amount }) {
    return (
        <div className={className}>
            <p className="text-center">{title}</p>
            <p className="font-bold text-xl flex"><TbCurrencyPeso className="w-6 h-6" />{amount}</p>
            <div className="flex gap-4">
                <BsArrowUpLeftCircleFill className="text-green-300" />
                <p className="text-green-300 font-bold text-xs">+9%</p>
                <p className="text-gray-300 text-xs">last month</p>
            </div>
        </div>
    )
}