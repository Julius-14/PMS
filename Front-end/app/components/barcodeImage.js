'use client'

import { useBarcode } from "next-barcode"

export default function BarcodeImage ({ code }) {

    const {inputRef} = useBarcode({
        value: code
    })

    return <img ref={inputRef} />
}