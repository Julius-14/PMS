'use client';

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import { csrf } from "@/app/hooks/csrf";
import axios from "@/app/lib/axios";
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Create () {

    const [userForm, setUserForm] = useState({
        name: '',
        email: '',
        password: generatePassword()
    })

    function generatePassword() {
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numberChars = '0123456789';
        const specialChars = '!@#$%^&*()_-+=<>?';
      
        const part1 = getRandomChar(uppercaseChars);
        const part2 = getRandomChar(specialChars);
        const part3 = getRandomChars(lowercaseChars + numberChars, 13);
      
        const password = part1 + part2 + part3;
      
        return shuffleString(password); 
    }

    function getRandomChar(characters) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        return characters.charAt(randomIndex);
    }
      
    function getRandomChars(characters, length) {
        let result = '';
        for (let i = 0; i < length; i++) {
          result += getRandomChar(characters);
        }
        return result;
    }
      
    function shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    const handleUserChange = e => {
        const {name, value} = e.target
        setUserForm({
            ...userForm,
            [name]: value
        })
    }

    const submitUser = async () => {
        try {
            await csrf()
            await axios.post('/api/user/register', {
                name: userForm.name,
                email: userForm.email,
                password: userForm.password,
                password_confirmation: userForm.password
            })
            .then(res=>{
                console.log(res)
                setUserForm({
                    name: '',
                    email: '',
                    password: generatePassword()
                })
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-4/5 top-20 right-0 p-6 flex justify-center">
                <div className="w-3/5 rounded-lg bg-white shadow-md p-6 space-y-2">
                    <p className="text-2xl text-center font-bold">Create User</p>
                    <div>
                        <label className="text-xs font-bold">Name</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded-lg border hover:border-black"
                            name="name"
                            onChange={handleUserChange}
                            value={userForm.name}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold">Email</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded-lg border hover:border-black"
                            name="email"
                            onChange={handleUserChange}
                            value={userForm.email}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold">Password</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded-lg border hover:border-black"
                            name="password"
                            onChange={handleUserChange}
                            value={userForm.password}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={'/user'}
                            className="block w-1/3 p-2 bg-slate-900 hover:bg-slate-900/80 hover:font-bold text-white rounded-lg text-center"
                        >
                            back
                        </Link>
                        <button
                            onClick={submitUser}
                            className="w-1/3 p-2 bg-blue-500 hover:bg-blue-500/80 hover:font-bold text-white rounded-lg"
                        >
                            create
                        </button>
                        <button
                            onClick={()=>setUserForm({...userForm,password:generatePassword()})}
                            className="w-1/3 p-2 bg-teal-500 hover:bg-teal-500/80 hover:font-bold text-white rounded-lg"
                        >
                            new password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}