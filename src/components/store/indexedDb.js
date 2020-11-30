import store from '@/components/store/store'
let db = indexedDB || webkitIndexedDB || mozIndexedDB || null
if (db) {
    init()
}
export function addMsg(data) {
    if (!db) return
    let objectStore = db.transaction(["private_msg"], "readwrite").objectStore('private_msg')
    delete data.event
    //冗余字段便于indexeddb查询本地记录
    data.dialog_key=data.user_id<data.target_id?data.user_id+'-'+data.target_id:data.target_id+'-'+data.user_id
    objectStore.add(data)
}
export function confirmMsgStatus(time, status) {
    if (!db) return
    let objectStore = db.transaction(["private_msg"], "readwrite").objectStore('private_msg')
    var index = objectStore.index("time")
    //发消息毫秒时间戳唯一  time,is_self
    index.openCursor(IDBKeyRange.only(time)).onsuccess = function (event) {
        let cursor = event.target.result
        if(cursor){
            let data=cursor.value
            if(data.is_self==1){
                data.status=status
                objectStore.put(data)
            }
            
        }else{
            cursor.continue()
        }
        
        
    }
}
export function saveLatelyDialog(){
    let list=[]
    for(let i in store.state.latelyMsgIndex){
        list[i]=store.state.latelyMsgList[i]
    }
}
function init() {
    let request = db.open("im")
    request.onsuccess = function () {
        db = request.result
        console.log(db)
    }
    request.onupgradeneeded = function (event) {
        db = event.target.result
        if (!db.objectStoreNames.contains('private_msg')) {
            let objectStore = db.createObjectStore('private_msg', { autoIncrement: true,keyPath: "id" })
            objectStore.createIndex('user_id', 'user_id', { unique: false })
            objectStore.createIndex('target_id', 'target_id', { unique: false })
            objectStore.createIndex('time', 'time', { unique: false })
            objectStore.createIndex('dialog_key', 'dialog_key', { unique: false })
            console.log(objectStore)
        }                                
        if (!db.objectStoreNames.contains('lately_dialog')) {
            let objectStore = db.createObjectStore('lately_dialog', { autoIncrement: true })
        }

    }
}