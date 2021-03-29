import axios from 'axios'
import { Toast } from 'cube-ui'
import {logout,toast} from '@/utils/global'
const CODE_OK = 200
// if (process.env.NODE_ENV === 'production') {
//   ConfigBaseURL = window.location.protocol + "//" + window.location.host
// } else {
//   ConfigBaseURL = process.env.VUE_APP_BASE_URL
// }
let ConfigBaseURL="http://127.0.0.1:70/" 
const CODE_NOT_LOGIN = 401
const Service = axios.create({
  timeout: 15000,
  baseURL: ConfigBaseURL,
  method: 'post',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

Service.interceptors.request.use(config => {
  let token=localStorage.getItem('im:access_token')
  config.headers.Authorization = 'Bearer '+token
  return config
})

Service.interceptors.response.use(response => {
  const res = response.data
  if (res.code === CODE_NOT_LOGIN) {
    logout()
  }  else if (res.code !== CODE_OK) {
    toast(res.msg,'error')
    return Promise.reject(new Error(res.msg))
  }else{
    return res.data
  } 
}, error => {
  console.log(error)
  const msg = error.Message !== undefined ? error.Message : ''
  toast('网络错误'+msg,'error')
  return Promise.reject(error)
})

export default Service
export { ConfigBaseURL }