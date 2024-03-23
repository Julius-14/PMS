'use client'

import Image from 'next/image'
import SideNav from '../components/navigation/sideNav'
import TopNav from '../components/navigation/topNav'
import { BsExclamationTriangleFill } from "react-icons/bs"
import { GiReceiveMoney } from "react-icons/gi"
import { useEffect, useState } from 'react'
import { TbCurrencyPeso } from "react-icons/tb"
import SalesOverview from '../components/dashboard/salesOverview'
import HeaderCard from '../components/dashboard/headerCard'
import { csrf } from '../hooks/csrf'
import axios from '../lib/axios'
import DateExpiry from '../components/dateExpiry'
import { ImSpinner3 } from 'react-icons/im'

export default function Home() {

  const [isExpiryModalOpen, setIsExpiryModalOpen] = useState(false)
  const [expiredGoods, setExpiredGoods] = useState([])
  const [availableStock, setAvailableStock] = useState([])
  const [stockIsLoading, setStockIsLoading] = useState(false)
  const [expiredTotal, setExpiredTotal] = useState(0)
  const [expiredPercent, setExpiredPercent] = useState(0)
  const [todayPercent, setTodayPercent] = useState(0)
  const [weekPercent, setWeekPercent] = useState(0)
  const [monthRevenue, setMonthRevenue] = useState(0)
  const [yearRevenue, setYearRevenue] = useState(0)
  const [cardPrice, setCardPrice] = useState({
    todayProfit: 0,
    weekProfit: 0
  })

  const handleExpiry = (arr, per) => {
    let totalCost = 0
    arr.forEach(element => {
      totalCost += element?.stock * element.unit_price
    })
    const percent = (totalCost/per) * 100
    setExpiredTotal(totalCost)
    setExpiredPercent(percent)
    setExpiredGoods(arr)
  }

  const handleProfit = (today, week, total) => {
    const todayP = (today/total) * 100
    const weekP = (week/total) * 100
    setTodayPercent(todayP)
    setWeekPercent(weekP)
  }

  useEffect(()=>{
    const getData = async () => {
      try {
        setStockIsLoading(true)
        await axios.get('/api/inventory/dashboard')
        .then(res=>{
          console.log(res)
          handleExpiry(res.data.expired, res.data.total)
          handleProfit(res.data.today, res.data.week, res.data.total)
          setMonthRevenue(res.data.month)
          setYearRevenue(res.data.year)
          setCardPrice({
            ...cardPrice,
            todayProfit: res.data.today,
            weekProfit: res.data.week
          })
          setAvailableStock(res.data.stock)
          setStockIsLoading(false)
        })
        .catch(err=>{
          console.log(err)
          setStockIsLoading(false)
        })
      } catch (error) {
        console.log(error)
        setStockIsLoading(false)
      }
    }
    getData()
  }, [])

  return (
    <main>
      <TopNav />
      <SideNav />
      <div className={`fixed w-full h-full bg-slate-900/90 z-50 p-6 flex justify-center items-center ${isExpiryModalOpen ? '' : 'hidden'}`}>
        <div className='w-3/5 p-6 rounded-lg bg-white'>
          <button onClick={()=>setIsExpiryModalOpen(false)} className='bg-blue-600 text-white p-2 rounded-lg'>close</button>
          <div className='h-72 overflow-scroll p-6'>
            <table className='w-full table-auto'>
              <thead className='bg-gray-800 text-gray-400'>
                <tr>
                  <th>Item Name</th>
                  <th>Unit Price</th>
                  <th>Expiry Date</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {
                  expiredGoods.map((item,idx)=>{
                    return (
                      <tr className='p-2 border border-slate-900' key={idx}>
                        <td className='p-2 border border-slate-900'>{item.item.item_name}</td>
                        <td className='p-2 border border-slate-900'>{item.unit_price}</td>
                        <td className='p-2 border border-slate-900'>{item.expiry}</td>
                        <td className='p-2 border border-slate-900'>{item.stock}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className='absolute z-1 w-4/5 right-0 top-20 p-6 space-y-2'>
        <div className='flex gap-2'>
          <div className='w-1/3 rounded-lg shadow-md p-6 bg-red-800/80 text-white'>
            <p className='text-center text-xl font-bold font-sans'>Expired Items</p>
            <div className='flex justify-between'>
              <div>
                <p className='flex'><TbCurrencyPeso className='w-6 h-6' />{expiredTotal.toFixed(2)}</p>
                {
                  expiredPercent && <p className='text-xs'>{expiredPercent.toFixed(2)}% of total stocks</p>
                }
              </div>
              <BsExclamationTriangleFill className='w-10 h-10' />
            </div>
            <a onClick={()=>setIsExpiryModalOpen(true)} className='block text-xs hover:underline cursor-pointer mt-5'>see information</a>
          </div>
          <div className='w-1/3 rounded-lg shadow-md p-6 bg-purple-800/80 text-white'>
            <p className='text-center text-xl font-bold font-sans'>Today Profit</p>
            <div className='flex justify-between'>
              <div>
                <p className='flex'><TbCurrencyPeso className='w-6 h-6' />{cardPrice.todayProfit.toFixed(2)}</p>
                {
                  todayPercent == 0 || !todayPercent ? <p className='text-xs'>No sales</p> : <p className='text-xs'>{todayPercent.toFixed(2)}% increase</p>
                }
              </div>
              <GiReceiveMoney className='w-10 h-10' />
            </div>
          </div>
          <div className='w-1/3 rounded-lg shadow-md p-6 bg-blue-800/80 text-white'>
            <p className='text-center text-xl font-bold font-sans'>Weekly Profit</p>
            <div className='flex justify-between'>
              <div>
                <p className='flex'><TbCurrencyPeso className='w-6 h-6' />{cardPrice.weekProfit.toFixed(2)}</p>
                {
                  weekPercent == 0 || !weekPercent ? <p className='text-xs'>No sales</p> : <p className='text-xs'>{weekPercent.toFixed(2)}% increase</p>
                }
              </div>
              <GiReceiveMoney className='w-10 h-10' />
            </div>
          </div>
        </div>
        <div className='flex gap-2'>
          <SalesOverview className='w-3/5 p-6 bg-white rounded-lg' />
          <div className='w-2/5 space-y-4'>
            <HeaderCard 
              className={'w-full h-36 rounded-lg shadow-md py-6 px-10 space-y-3 bg-teal-500/80 text-white'} 
              title={'Monthly Revenue'}
              amount={monthRevenue.toFixed(2)}
            />
            <HeaderCard 
              className={'w-full h-36 rounded-lg shadow-md py-6 px-10 space-y-3 bg-cyan-600/80 text-white'} 
              title={'Yearly Breakup'}
              amount={yearRevenue.toFixed(2)}
            />
          </div>
        </div>
        <div className='w-full rounded-lg shadow-md bg-slate-900/80 stocks p-6'>
          <p className='text-center text-xl text-cyan-400 font-bold backdrop-blur-sm'>Available Stocks</p>
          <div className='w-full h-96 overflow-y-scroll relative'>
            <table className='w-full table-fixed'>
              <thead className='bg-slate-900 backdrop-blur-sm text-gray-400'>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Expiry</th>
                </tr>
              </thead>
              <tbody>
                {
                  stockIsLoading ?
                  <div className='absolute w-full h-full bg-slate-900/80 flex justify-center items-center'>
                    <ImSpinner3 className='w-5 h-5 animate-spin text-cyan-400' />
                  </div>
                  :
                  availableStock.map((element,id)=>{
                    return(
                      <tr key={id} className='bg-slate-900/40 hover:bg-slate-900/80 border-b border-gray-400 text-gray-200'>
                        <td className='p-2'>{element?.item?.item_name}</td>
                        <td className='p-2'>{element?.unit_price}</td>
                        <td className='p-2'>{element?.stock}</td>
                        <td className='p-2'><DateExpiry date={element?.expiry} /></td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
