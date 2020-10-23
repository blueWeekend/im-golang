export const EVENT_MAP={NOT_LOGIN:401,PING:201,MSG:200}
export function getToken() {
    return localStorage.getItem("im:access_token")
}
export function logout(){
    localStorage.removeItem('im:access_token')
    location.reload()
}

