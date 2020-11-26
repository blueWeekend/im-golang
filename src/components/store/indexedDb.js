let db = indexedDB || webkitIndexedDB || mozIndexedDB || null
if (db) {
    init()
}

export function addMsg(data) {
    if (!db) return
    let objectStore = db.transaction(["private_msg"], "readwrite").objectStore('private_msg')
    delete data.event
    objectStore.add(data)
}
export function confirmMsgStatus(time, status) {
    if (!db) return
    let objectStore = db.transaction(["private_msg"], "readwrite").objectStore('private_msg')
    var index = objectStore.index("time")
    //发消息毫秒时间戳唯一  time,is_self
    index.openCursor(IDBKeyRange.only([time,1])).onsuccess = function (event) {
        var data = event.target.result.value
        data.status = status
        objectStore.put(data)
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
            let objectStore = db.createObjectStore('private_msg', { autoIncrement: true })
            objectStore.createIndex('user_id', 'user_id', { unique: false })
            objectStore.createIndex('target_id', 'target_id', { unique: false })
            objectStore.createIndex('time', ['time','is_self'], { unique: false })
            //let objectStore = db.createObjectStore('private_msg', { keyPath: 'time' })
            console.log(objectStore)
        }

    }
}