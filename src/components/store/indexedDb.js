import store from '@/components/store/store'
let dbHandle = indexedDB || webkitIndexedDB || mozIndexedDB || null
let db = null
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
    let index = objectStore.index("time")
    //同一用户发消息毫秒时间戳唯一  time,is_self
    index.openCursor(IDBKeyRange.only(time)).onsuccess = function (event) {
        let cursor = event.target.result
        if(cursor){
            let data=cursor.value
            if(data.is_self==1){
                data.status=status
                objectStore.put(data)
            }else{
                cursor.continue()
            } 
        }
        
        
    }
}
export function saveLatelyDialog(){
    if (!db) return
    let list=[]
    for(let item of store.state.latelyMsgIndex){
        let data={}
        let len=store.state.latelyMsgList[item].length
        if(len>0){
            data=store.state.latelyMsgList[item][len-1]
        }
        list.push({
            type_target_id:item,
            ...data
        })
    }
    if(list.length==0){
        return
    }
    let objectStore = db.transaction(["lately_dialog"], "readwrite").objectStore('lately_dialog')
    objectStore.put(list,1)
}
export function setPrivateMsgList(type,targetId,limit=20,start=0){
    if (!db) return
    // if(state.NewMsgNumMap.hasOwnProperty(payload['type']+'-'+payload['target_id'])){
    //     todo getMsgList
    // }
    let dialogKey=store.state.userInfo['user_id']<targetId?store.state.userInfo['user_id']+'-'+targetId:targetId+'-'+store.state.userInfo['user_id']
    let objectStore = db.transaction(["private_msg"], "readwrite").objectStore('private_msg')
    let index = objectStore.index("dialog_key")
    let i=0
    let data=[]
    index.openCursor(IDBKeyRange.only(dialogKey),'prev').onsuccess = function (event) {
        let cursor = event.target.result
        if(i==limit || !cursor){
            data.reverse()
            if(start==0 && data.length>0){
                data.splice(data.length-1,1)
            }
            store.commit('setPrivateMsgList',{msg_list:data,type:type,target_id:targetId})
            return
        }
        if(i==0 && start>0){
            cursor.continue(start)
        }
        data.push(cursor.value)
        i++
        cursor.continue()
    }
}
export function setLatelyDialog(newDialog){
    return new Promise((resolve, reject) => {
        if(!db){
            store.commit('setLatelyDialog',{'newDialog':newDialog,'oldDialog':[]})
            resolve('浏览器不支持indexeddb')
            return
        }
        let transaction = db.transaction(["lately_dialog"],"readwrite")
        let objectStore = transaction.objectStore("lately_dialog")
        let request = objectStore.get(1)
        request.onsuccess = (event)=>{
            if(event.target.result instanceof Array && event.target.result.length>0){
                store.commit('setLatelyDialog',{'newDialog':newDialog,'oldDialog':event.target.result})
            }
            resolve()
        }
        request.onerror=(event)=>{
            console.log(event)
            reject(event)
        }
    })
    
}
export function init() {
    return new Promise((resolve, reject) => {
        if(!dbHandle){
            resolve('该浏览器不支持indexeddb')
            return
        }
        let request = dbHandle.open("im")
        request.onsuccess = ()=> {
            db = request.result
            console.log(db)
            resolve()
        }
        request.onerror = (event)=> {
            console.log(event)
            reject(event)
        }
        request.onupgradeneeded =  (event)=>{
            db = event.target.result
            if (!db.objectStoreNames.contains('private_msg')) {
                let objectStore = db.createObjectStore('private_msg', { autoIncrement: true,keyPath: "id" })
                // objectStore.createIndex('user_id', 'user_id', { unique: false })
                // objectStore.createIndex('target_id', 'target_id', { unique: false })
                objectStore.createIndex('time', 'time', { unique: false })
                objectStore.createIndex('dialog_key', 'dialog_key', { unique: false })
            }                                
            if (!db.objectStoreNames.contains('lately_dialog')) {
                let objectStore = db.createObjectStore('lately_dialog',{autoIncrement: true})
            }
        }
    })
    
}