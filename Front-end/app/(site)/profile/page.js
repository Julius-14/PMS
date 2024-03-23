'use client'

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";

export default function Profile () 
{
    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-4/5 top-20 right-0 p-6 flex justify-center">
                <div className="w-3/5 bg-white rounded-lg shadow-md p-6 space-y-2">
                    <p className="text-center text-2xl font-bold">Profile</p>
                    <div className="w-full">
                        <label className="text-xs font-bold">Full Name</label>
                        <input 
                            type="text"
                            className="w-full rounded-lg p-2 border hover:border-black"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold">Email</label>
                        <input 
                            type="text"
                            className="w-full rounded-lg p-2 border hover:border-black"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold">Password</label>
                        <input 
                            type="password"
                            className="w-full rounded-lg p-2 border hover:border-black mb-2"
                            placeholder="Current Password"
                        />
                        <input 
                            type="password"
                            className="w-full rounded-lg p-2 border hover:border-black mb-2"
                            placeholder="New Password"
                        />
                        <input 
                            type="password"
                            className="w-full rounded-lg p-2 border hover:border-black mb-2"
                            placeholder="Confirm Password"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="w-1/2 rounded-lg p-2 bg-slate-900 hover:bg-slate-900/80 hover:font-bold text-white"
                        >
                            save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}