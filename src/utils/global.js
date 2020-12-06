export const EVENT_MAP={NOT_LOGIN:401,PING:201,MSG:200,ACK:202}
export const SRC_MAP={FRIEND:1,GROUP:2}
export const CNT_MAP={TEXT:1,MSG:2,FILE:3}
export const MSG_STATUS_MAP={SENDING:0,SUCCESS:1,FAIL:-1}
export const NOT_KEEP_ALIVE_ROUTE=[
    'im-dialog',
    'im-msgList',
]
export function getToken() {
    return localStorage.getItem("im:access_token")
}
export function logout(){
    localStorage.removeItem('im:access_token')
    location.reload()
}
export function formatTime (value) {
    value = value ? value : new Date().getTime()
    let date = new Date(value);
    let y = date.getFullYear();
    let MM = date.getMonth() + 1;
    MM = MM < 10 ? "0" + MM : MM;
    let d = date.getDate();
    d = d < 10 ? "0" + d : d;
    let h = date.getHours();
    h = h < 10 ? "0" + h : h;
    let m = date.getMinutes();
    m = m < 10 ? "0" + m : m;
    let s = date.getSeconds();
    s = s < 10 ? "0" + s : s;
    return y + "-" + MM + "-" + d + " " + h + ":" + m;
}

