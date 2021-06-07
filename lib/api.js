import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  headers: {
    'Accept': 'application/json',
 }
});

export default api;

export const fetcher = url => api.get(url).then(res => res.data);
