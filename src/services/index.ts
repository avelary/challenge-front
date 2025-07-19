import axios from 'axios'

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    'https://business-api-production-3d5b.up.railway.app',
})

export { api }
