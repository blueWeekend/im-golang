export const EVENT_MAP={NOT_LOGIN:401,PING:201,MSG:200}
export const SRC_MAP={FRIEND:1,GROUP:2}
export const CNT_MAP={TEXT:1,MSG:2,FILE:3}
export const NOT_KEEP_ALIVE_ROUTE=['im-dialog','im-msgList']
export function getToken() {
    return localStorage.getItem("im:access_token")
}
export function logout(){
    localStorage.removeItem('im:access_token')
    location.reload()
}

