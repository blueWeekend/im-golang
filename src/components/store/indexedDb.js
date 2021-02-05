import store from '@/components/store/store'
import {getOfflineMsgList} from '@/api/user'
import {PER_LOAD_MSG_LIMIT,SRC_MAP} from '@/utils/global'
let dbHandle = indexedDB || webkitIndexedDB || mozIndexedDB || null
let db = null
export function addMsg(data) {
    if (!db) return
    let objectStore = db.transaction(["private_msg"], "readwrite").objectStore('private_msg')
    delete data.event
    //冗余索引字段便于indexeddb查询本地记录
    data.dialog_key=data.user_id<data.target_id?data.user_id+'-'+data.target_id:data.target_id+'-'+data.user_id

    objectStore.add(data)
}
export function confirmMsgStatus(time, userId,status) {
    if (!db) return
    let objectStore = db.transaction(["private_msg"], "readwrite").objectStore('private_msg')
    let index = objectStore.index("time_uid")
    //同一用户发消息毫秒时间戳唯一 
    index.openCursor(IDBKeyRange.only([time,userId])).onsuccess = function (event) {
        let cursor = event.target.result
        if(cursor){
            let data=cursor.value
            data.status=status
            objectStore.put(data)
        }
        
        
    }
}
function alterMsgById(id,obj){
    return new Promise((resolve, reject) => {
        if (!db) resolve(1)
        let objectStore = db.transaction(["private_msg"], "readwrite").objectStore('private_msg')
        let request=objectStore.get(id)
        request.onsuccess=function(event){
            if(event.target.result){
                objectStore.put(obj)
            }
            resolve(1)
        } 
    })
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
            src_type_target_id:item,
            ...data
        })
    }
    if(list.length==0){
        return
    }
    let objectStore = db.transaction(["lately_dialog"], "readwrite").objectStore('lately_dialog')
    objectStore.put(list,1)
}
export function setPrivateMsgList(type,targetId,limit=PER_LOAD_MSG_LIMIT){
    if (!db) return
    let key=type+'-'+targetId
    getDialogLastLocalMsg(store.state.latelyMsgList[key]).then(data=>{
        getLocalPrivateMsgList(type,targetId,data,limit)
    })
}
function getLastActiveTime(){
    return new Promise((resolve, reject) => {
        if (!db) resolve(0)
        let transaction = db.transaction(["lately_dialog"],"readwrite")
        let objectStore = transaction.objectStore("lately_dialog")
        let request = objectStore.get(1)
        request.onsuccess = (event)=>{
            if(event.target.result instanceof Array && event.target.result.length>0){
                resolve(event.target.result[0]['time'])
                return
            }
            resolve(0)
        }
    })
    
}
function getLocalPrivateMsgList(type,targetId,dialogLastLocalMsg,limit){
    console.log(dialogLastLocalMsg)
    let dialogKey=store.state.userInfo['user_id']<targetId?store.state.userInfo['user_id']+'-'+targetId:targetId+'-'+store.state.userInfo['user_id']
    let objectStore = db.transaction(["private_msg"], "readwrite").objectStore('private_msg')
    let index = objectStore.index("dialog_key")
    let i=0
    let data=[]
    let item
    index.openCursor(IDBKeyRange.lowerBound(dialogKey),'prev').onsuccess = function (event) {
        let cursor = event.target.result
        if(i>=limit || !cursor){
            console.log(data)
            data.reverse()
            store.commit('setPrivateMsgList',{msg_list:data,type:type,target_id:targetId})
            return
        }
        //减少.value懒加载性能消耗
        item=cursor.value
        if(dialogLastLocalMsg && dialogLastLocalMsg['time']<item.time){
            cursor.continue([dialogLastLocalMsg['dialog_key'],dialogLastLocalMsg['time']])
        }else{
            
            if(!dialogLastLocalMsg || dialogLastLocalMsg['id']!=item.id){
                data.push(item)
                i++
            }
          
            if(item['total']>1){
                i+=item['total']
                getOfflineMsgList({
                    user_id:targetId,
                    id:item['msg_id'] || 0,
                    end_time:item['created_at'],
                    begin_time:item['begin_time'],
                    limit:item['total']-1,
                }).then(offlineMsgList=>{
                    for(let _item of offlineMsgList){
                        _item['msg_id']=_item['id']
                        _item['time']=_item['send_time']
                        _item['is_self']=0
                        _item['src_type']=SRC_MAP.FRIEND
                        delete _item['id']
                        data.push(_item)
                        addMsg(_item)
                    }
                   
                    data.reverse()
                    store.commit('setPrivateMsgList',{msg_list:data,type:type,target_id:targetId})
                    store.commit('alterMsgNum',{
                        key:type+'-'+targetId,
                        offline_msg_num:0,
                        not_read_msg_num:0
                    })
                    delete item['total']
                    delete item['begin_time']
                    alterMsgById(item['id'],item).then(()=>{
                        if(store.state.latelyMsgList[type+'-'+targetId].length<limit){
                            setPrivateMsgList(type,targetId)
                        }
                    })
                })
            }else{
                cursor.continue()
            }
            
        }
        
    }
}
function getDialogLastLocalMsg(msgList){
    return new Promise((resolve, reject) => {
        if(msgList.length==0){
            resolve(false)
            return
        }
        let objectStore = db.transaction(["private_msg"], "readwrite").objectStore('private_msg')
        let index = objectStore.index("time_uid")
        //同一用户发消息毫秒时间戳唯一  
        console.log(msgList[0])
        index.openCursor(IDBKeyRange.only([msgList[0]['time'],msgList[0]['user_id']])).onsuccess = function (event) {
            let cursor = event.target.result
            if(cursor){
                let key=cursor.value.user_id<cursor.value.target_id?cursor.value.user_id+'-'+cursor.value.target_id:cursor.value.target_id+'-'+cursor.value.user_id
                resolve({'dialog_key':key,'time':cursor.value.time,'id':cursor.value.id})
            }else{
                resolve(false)
            }
        }
    })
    
}
export function setLatelyDialog(newDialog){
    return new Promise((resolve, reject) => {
        if(!db){
            store.commit('setLatelyDialog',{'new_dialog':newDialog,'old_dialog':[]})
            resolve('该浏览器不支持indexeddb')
            return
        }
        let transaction = db.transaction(["lately_dialog"],"readwrite")
        let objectStore = transaction.objectStore("lately_dialog")
        let request = objectStore.get(1)
        for(let item of newDialog){
            item.msg_id=item.id
            item.time=item.send_time
            item.is_self=0
            delete item.id
            delete item.send_time
            addMsg(item)
        }
        request.onsuccess = (event)=>{
            let oldDialog=[]
            if(event.target.result instanceof Array && event.target.result.length>0){
                oldDialog=event.target.result
            }
            store.commit('setLatelyDialog',{'new_dialog':newDialog,'old_dialog':oldDialog})
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
                objectStore.createIndex('time_uid', ['time','user_id'], { unique: true })
                objectStore.createIndex('dialog_key', ['dialog_key','time'], { unique: false })
            }                                
            if (!db.objectStoreNames.contains('lately_dialog')) {
                let objectStore = db.createObjectStore('lately_dialog',{autoIncrement: true})
            }
        }
    })
    
}