import axios from 'axios'
import config from './config'

const axiosInstace = axios.create({
    baseURL: config.env.baseUrl
}) 

export default axiosInstace