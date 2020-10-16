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
