'use client';

import axios from "axios";
import { useRouter } from "next/navigation";

export const LoginRedirect = ({url}) => {
    const router = useRouter()
    const login = async ({user}) => {
        try {
            await axios.post('/api/login', {user: user})
            .then(res=>{
                const role = localStorage.getItem('role')
                if(role == 'admin') {
                    router.push('/')
                } else {
                    router.push('/inventory')
                }
            })
            .catch(err=>{
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return {login}
}  