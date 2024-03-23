'use client';

import { useEffect, useState } from "react";
import Profile from "./profile";
import { ImSpinner3 } from "react-icons/im";
import { BiBell } from "react-icons/bi";
import axios from "@/app/lib/axios";
import DateFrame from "../dateFrame";

export default function TopNav ()
{
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)
    const [newNotification, setNewNotification] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [notificationLoading, setNotificationLoading] = useState([])

    const processNotification = arr => {
        setNotifications(arr)
        const loadingArr = new Array(arr.length).fill(false)
        setNotificationLoading(loadingArr)
    }

    const getData = async () => {
        try {
            await axios.post('/api/notifications', {user_id:localStorage.getItem('uid')})
            .then(res=>{
                processNotification(res.data.data)
                checkNewNotification(res.data.data)
            })
            .catch(err=>{
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        if (typeof window !== 'undefined' && window.localStorage) {
            setTimeout(()=>{
                getData()
            }, 2000)
        }
    }, [notifications])

    const checkNewNotification = arr => {
        let result = false
        arr.forEach(element=>{
            if(element.status == 'unread') {
                result = true
            }
        })
        setNewNotification(result)
    }

    const readNotification = async () => {
        try {
            setIsNotificationOpen(!isNotificationOpen)
            await axios.post('/api/notification/read', {user_id: localStorage.getItem('uid')})
            .then(res=>setNewNotification(false))
        } catch (error) {
            console.log(error)
        }
    }

    const loadBeforeDelete = index => {
        const loadingArr = [...notificationLoading]
        loadingArr[index] = true
        setNotificationLoading(loadingArr)
    }

    const deleteNotification = async (id, index) => {
        try {
            loadBeforeDelete(index)
            await axios.post('/api/notification/delete', {id:id,user_id:localStorage.getItem('uid')})
            .then(res=>{
                processNotification(res.data.data)
                checkNewNotification(res.data.data)
            })
            .catch(err=>{
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="fixed flex bg-white z-50 justify-end w-4/5 top-0 right-0 p-4 no-print">
            <button
                onClick={readNotification}
            >
                <BiBell className={`w-5 h-5 ${newNotification ? 'text-red-600' : ''}`} />
            </button>
            <Profile />
            <div 
                className={`fixed w-1/5 top-20 bottom-0 right-0 bg-blue-600 text-gray-300 p-6 
                    ${isNotificationOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <p className="text-center text-xl font-bold">Notifications</p>
                <ul className="space-y-2 p-6">
                    {
                        notifications.map((item,index)=>{
                            return (
                                <li key={index} className={`relative text-gray-300 border-b border-gray-300`}>
                                    {
                                        notificationLoading[index] && (
                                            <div className="absolute w-full h-full bg-slate-900/60 flex justify-center items-center">
                                                <ImSpinner3 className="animate-spin w-5 h-5" />
                                            </div>
                                        )
                                    }
                                    <p>{item.message}</p>
                                    <p className="flex justify-between">
                                        <span className="text-xs font-bold"><DateFrame dateStr={item.created_at} /></span>
                                        <button
                                            onClick={()=>deleteNotification(item.id,index)}
                                            className="text-red-600 text-xs hover:font-bold hover:underline"
                                        >
                                            delete
                                        </button>
                                    </p>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}