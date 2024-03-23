'use client';

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { csrf } from "@/app/hooks/csrf";
import axios from "@/app/lib/axios";
import Swal from "sweetalert2";
import { BsTrash3Fill } from "react-icons/bs";
import DateFrame from "@/app/components/dateFrame";
import { ImSpinner10 } from "react-icons/im";

export default function Pos () {
    const [scanResult, setScanResult] = useState('')
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [change, setChange] = useState({
        cash: 0,
        change: 0
    })
    const [isLoading, setIsLoading] = useState(false)
    const [stocks, setStocks] = useState([])

    const addToCart = (item) => {
        let updatedCart = [...cart]
        const itemIndex = cart.findIndex((cartItem) => cartItem.barcode === item.barcode)
        if (itemIndex !== -1) {
            // updatedCart = [...cart];
            updatedCart[itemIndex].quantity += 1;
            setCart(updatedCart);
        } else {
            // updatedCart = [...cart, { ...item, quantity: 1 }];
            updatedCart.push(item)
            setCart(updatedCart);
        }
        const updatedTotal = updatedCart.reduce((acc, cartItem) => {
            return acc + cartItem.unit_price * cartItem.quantity;
        }, 0);
        setTotal(updatedTotal)
    }

    const getQuantity = barcode => {
        let quantity = 0
        const itemIndex = cart.findIndex((cartItem) => cartItem.barcode === barcode)
        if (itemIndex !== -1) {
            const currentCart = [...cart]
            return currentCart[itemIndex].quantity
        }
        return quantity
    }

    const processCart = arr => {
        const result = {}
        arr.forEach(element => {
            for (const key in element) {
                if (!result[key]) {
                    result[key] = []
                }
                result[key].push(element[key])
            } 
        })
        result['ro_num'] = generateORNum()
        result['user_id'] = localStorage.getItem('uid')
        result['total'] = total
        return result
    }

    const generateORNum = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        const randomDigits = String(Math.floor(Math.random() * 10000)).padStart(4, '0');

        const receiptNumber = `${year}${month}${day}-${randomDigits}`;

        return receiptNumber
    }

    const printReceipt = message => {
        var elementToPrint = document.getElementById('to-print')
        var clonedElement = elementToPrint.cloneNode(true)
        var printWindow = window.open('', '', '')
        printWindow.document.body.appendChild(clonedElement)
        printWindow.print()
        printWindow.close()
        setCart([])
        setTotal(0)
        setScanResult(null)
        Swal.fire(message)
    }

    const validateOrder = () => {
        Swal.fire({
            title: 'Enter Cash',
            icon: 'info',
            input: 'number',
            inputValidator: value=>{
                if (!value) {
                    return 'cash is required'
                }
                if (value < total) {
                    return 'cash is insufficient'
                }
            }
        })
        .then(res=>{
            if (res.value) {
                const changeVal = res.value - total
                setChange({
                    cash: res.value,
                    change: changeVal
                })
                submitOrder()
            }
        })
    }

    const submitOrder = async () => {
        try {
            const order = processCart(cart)
            await axios.post('/api/order/store', order)
            .then(res=>{
                printReceipt(res.data.message)
            })
            .catch(err=>{
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const searchItem = async (barcode) => {
        const quantity = getQuantity(barcode)
        try {
            setIsLoading(true)
            await csrf()
            await axios.post('/api/order/barcode', {barcode:barcode, quantity: quantity})
            .then(res=>{
                addToCart(res.data.data)
                setIsLoading(false)
            })
            .catch(err=>{
                console.log(err)
                Swal.fire(err.response.data.message)
                setIsLoading(false)
            })
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    const startScanner = () => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
              width: 250,
              height: 250,
            },
            fps: 5,
          });
        
          scanner.render(success, error);
        
          function success(result) 
          {
            searchItem(result)
              // submitBarcode(result)
              setScanResult(result)
              scanner.clear()
          }
        
          function error(err)
          {
            console.log(err);
          }
    }

    const handleBarcodeSelect = e => {
        const barcode = e.target.value
        searchItem(barcode)
    }

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
          qrbox: {
            width: 250,
            height: 250,
          },
          fps: 5,
        });
      
        scanner.render(success, error);
      
        function success(result) 
        {
          searchItem(result)
            // submitBarcode(result)
            setScanResult(result)
            scanner.clear()
        }
      
        function error(err)
        {
          console.log(err);
        }

        const getStocks = async () => {
            try {
                await csrf()
                await axios.get('/api/inventory/select')
                .then(res=>{
                    console.log(res)
                    setStocks(res.data.data)
                })
                .catch(err=>{
                    console.log(err)
                })
            } catch (error) {
                console.log(error)
            }
        }
        getStocks()
    }, [])

    const removeFromCart = (itemIndex) => {
        Swal.fire({
            title: 'Do you want to remove item?',
            icon: 'question',
            showConfirmButton: true,
            showCancelButton: true
        })
        .then(res=>{
            if (res.isConfirmed) {
                const removedItem = cart[itemIndex];
                const updatedTotal = total - removedItem.unit_price * removedItem.quantity;
            
                const updatedCart = [...cart];
                updatedCart.splice(itemIndex, 1);
            
                setCart(updatedCart);
                setTotal(updatedTotal);
            }
        })
    }

    const increaseQty = index => {
        const cartArr = [...cart]
        cartArr[index].quantity++
        if (cartArr[index].stock >= cartArr[index].quantity) {
            setCart(cartArr)
            const updatedTotal = cartArr.reduce((acc, cartItem) => {
                return acc + cartItem.unit_price * cartItem.quantity;
            }, 0);
            setTotal(updatedTotal)
        } else {
            Swal.fire({
                title: 'Quantity exceeded available Stocks',
                icon: 'warning',
            })
        }
    }

    const decreaseQty = index => {
        const cartArr = [...cart]
        if (cartArr[index].quantity > 1) {
            cartArr[index].quantity--
            setCart(cartArr)
            const updatedTotal = cartArr.reduce((acc, cartItem) => {
                return acc + cartItem.unit_price * cartItem.quantity;
            }, 0);
            setTotal(updatedTotal)
        } else {
            removeFromCart(index)
        }
    }

    return (
        <div>
            <TopNav />
            <SideNav />
            <div id="to-print" className="absolute h-full to-print text-sm w-[216px]">
                <p className="text-center text-xs">Pharmacy Inventory Management</p>
                <p className="text-xs text-center"><DateFrame dateStr={new Date()} /></p>
                <table className="w-full table-fixed">
                    <thead className="border-b border-t border-slate-900">
                        <tr>
                            <th>Qty</th>
                            <th>Item</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            cart.map((itm,idx)=>{
                                return (
                                    <tr key={idx} className="border-b border-slate-900">
                                        <td>{itm.quantity}</td>
                                        <td>{itm.item_name}</td>
                                        <td className="text-right">
                                            {new Intl.NumberFormat("en-US", {
                                                style: "decimal",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(itm.unit_price)}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <p className="text-right font-bold text-md">
                    Total: {new Intl.NumberFormat("en-US", {
                        style: "decimal",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(total)}
                </p>
                <p className="text-right">Cash: {new Intl.NumberFormat("en-US", {
                        style: "decimal",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(change.cash)}</p>
                <p className="text-right border-b border-slate-900">Change: {new Intl.NumberFormat("en-US", {
                        style: "decimal",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(change.change)}</p>
                <p className="font-bold text-center">THANK YOU</p>
            </div>
            <div className="absolute top-20 right-0 w-4/5 z-1 p-6 no-print">
                <div className="w-full bg-white rounded-lg shadow-md p-6 flex gap-2">
                    <div className="w-1/2">
                        <div className="h-60 w-full">
                            <div id="reader"></div>
                        </div>
                        {/* <input 
                            type="text"
                            className="w-full p-2 border hover:border-black rounded-lg"
                            placeholder="Barcode"
                            value={scanResult}
                            onChange={(e)=>setScanResult(e.target.value)}
                        />
                        <button 
                            onClick={()=>searchItem(scanResult)}
                            className="w-full mt-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-600/80 text-white"
                        >
                            Add Item
                        </button> */}
                        <button
                            className="w-full mt-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-600/80 text-white"
                            onClick={startScanner}
                        >
                            Open Scanner
                        </button>
                        <select
                            className="w-full mt-2 p-2 rounded-lg border hover:border-black"
                            onChange={handleBarcodeSelect}
                        >
                            <option>Select</option>
                            {
                                stocks.map((item,id)=>{
                                    return (
                                        <option key={id} value={item?.item?.barcode}>{item?.item?.item_name} || Stock: {item?.stock} || Expiry: <DateFrame dateStr={item?.expiry} /></option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="w-1/2 space-y-2">
                        <div className="w-full p-6 h-96 border border-slate-900 rounded-lg relative">
                            {
                                isLoading && (
                                    <div className="absolute w-full h-full top-0 left-0 bg-slate-900 flex justify-center items-center">
                                        <ImSpinner10 className="w-5 h-5 animate-spin text-white" />
                                    </div>
                                )
                            }
                            <table className="w-full table-auto">
                                <thead className="bg-teal-900/90 text-cyan-400 border-cyan-400">
                                    <tr>
                                        <th>QUANTITY</th>
                                        <th>ITEM NAME</th>
                                        <th>PRICE</th>
                                        <th>STOCK</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        cart.map((item,idx)=>{
                                            return(
                                                <tr className="border text-cyan-400 border-cyan-400 bg-slate-900/80 hover:backdrop-blur-sm" key={idx}>
                                                    <td className="p-2 font-bold border border-cyan-400">{item?.quantity}</td>
                                                    <td className="p-2 font-bold border border-cyan-400">{item?.item_name}</td>
                                                    <td className="p-2 font-bold border border-cyan-400">{item?.unit_price}</td>
                                                    <td className="p-2 font-bold border border-cyan-400">{item?.stock}</td>
                                                    <td className="p-2 flex gap-2">
                                                        <button
                                                            onClick={()=>increaseQty(idx)}
                                                            className="pb-3 pt-1 px-2 rounded-lg bg-teal-600 hover:bg-teal-600/80 text-white flex items-center"
                                                        >
                                                            <p className="block w-4 h-4">+</p>
                                                        </button>
                                                        <button
                                                            onClick={()=>decreaseQty(idx)}
                                                            className="pb-3 pt-1 px-2 rounded-lg bg-red-600 hover:bg-red-600/80 text-white flex justify-center items-center"
                                                        >
                                                            <span className="block w-4 h-4">-</span>
                                                        </button>
                                                        <button
                                                            className="bg-red-600 hover:bg-red-600/80 text-white p-2 rounded-lg"
                                                            onClick={()=>removeFromCart(idx)}
                                                        >
                                                            <BsTrash3Fill className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="flex space-x-2">
                            <span className="block w-1/3 p-2 bg-purple-600 text-white font-bold rounded-lg">Total: {total.toLocaleString('en-US')}</span>
                            <button
                                onClick={validateOrder}
                                className="w-1/3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-600/80"
                            >
                                Order
                            </button>
                            <button
                                className="w-1/3 p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-600/80"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}