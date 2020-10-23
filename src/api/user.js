import request from '@/utils/request'

export function loginByPwd(data) {
  return request({
    url: 'user/loginByPwd',
    method: 'post',
    data: data
  })
}
export function getUserInfo(data) {
  return request({
    url: 'user/getUserInfo',
    method: 'post',
    data: data
  })
}
export function getWsConnect(token){
  return new WebSocket("ws://127.0.0.1:70/ws/connect",token)
}
