import request from '@/utils/request'

export function loginByPwd(data) {
  return request({
    url: 'user/loginByPwd',
    method: 'post',
    data: data
  })
}
