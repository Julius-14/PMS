import axios from "../lib/axios";

export const csrf = () => axios.get('/sanctum/csrf-cookie')