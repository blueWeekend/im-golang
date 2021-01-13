import Vue from 'vue'
import Vuex from 'vuex'
import {MSG_STATUS_MAP} from '@/utils/global'
import {addMsg,confirmMsgStatus} from '@/components/store/indexedDb'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        isInit:false,
        userInfo:{},
        latelyMsgList: {},
        latelyMsgIndex:[],
        isShowBottom: true,
        bottomLabel:'msgList',
        friendList:{},
        socket:null,
        msgNumMap:{},//未读消息与离线消息数量
        isInitPrivateMsgMap:{}
    },
    mutations: {
        finishInit(state){
            state.isInit=true
        },
        finishPrivateMsgInit(state,payload){
            state.isInitPrivateMsgMap[payload]=true
        },
        setSocket(state,payload){
            state.socket=payload
        },
        pushMsg(state, payload) {
            console.log(state)
            let key=payload['src_type']+'-'+(payload['is_self']===1?payload['target_id']:payload['user_id'])
            if(state.latelyMsgList[key]){
                if(!payload['content']){
                    return
                }
                if(payload['is_self']!=1){
                    //确保消息不重
                    let left=0
                    let right=state.latelyMsgList[key].length-1
                    let mid
                    while(left<=right){
                        mid=left+((right-left)>>1)
                        if(state.latelyMsgList[key][mid]['time']==payload['time']){
                            return
                        }else if(state.latelyMsgList[key][mid]['time']<payload['time']){
                            left=mid+1
                        }else{
                            right=mid-1
                        }
                    }
                }
                let msg={
                    status:MSG_STATUS_MAP.SENDING,
                    content:payload['content'],
                    time:payload['time'],
                    is_self:payload['is_self'],
                    user_id:payload['user_id'],
                    target_id:payload['target_id'],
                }
                addMsg({...payload,status:MSG_STATUS_MAP.SENDING})
                state.latelyMsgList[key].push(msg)
                // state.latelyMsgIndex.splice(i,1)
                // state.latelyMsgIndex.unshift(key)
                for(let i in state.latelyMsgIndex){
                    if(state.latelyMsgIndex[i]==key){
                        for(let j=i;j>0;j--){
                            state.latelyMsgIndex[j]=state.latelyMsgIndex[j-1]
                        }
                        state.latelyMsgIndex[0]=key
                        return
                    }
                }

            }else{
                state.latelyMsgIndex.unshift(key)
                if(payload['content']){
                    let msg={
                        status:MSG_STATUS_MAP.SENDING,
                        content:payload['content'],
                        time:payload['time'],
                        is_self:payload['is_self'],
                        user_id:payload['user_id'],
                        target_id:payload['target_id'],
                    }
                    addMsg({...payload,status:MSG_STATUS_MAP.SENDING})
                    Vue.set(state.latelyMsgList, key, [msg])
                }else{
                    Vue.set(state.latelyMsgList, key,[])
                }
                
            }
           
        },
        confirmMsgStatus(state, payload){
            let fromId,targetId
            if(payload['is_self']===1){
                fromId=payload['user_id']
                targetId=payload['target_id']
            }else{
                fromId=payload['target_id']
                targetId=payload['user_id']
            }
            confirmMsgStatus(payload['time'],fromId,payload['status'])
            let key=payload['src_type']+'-'+targetId
            let left=0
            let right=state.latelyMsgList[key].length-1
            let mid
            while(left<=right){
                mid=left+((right-left)>>1)
                if(state.latelyMsgList[key][mid]['time']==payload['time']){
                    state.latelyMsgList[key][mid]['status']=payload['status']
                    return
                }else if(state.latelyMsgList[key][mid]['time']<payload['time']){
                    left=mid+1
                }else{
                    right=mid-1
                }
            }
        },
        setLatelyDialog(state,payload){
            console.log(payload)
            let isExistFlag={}
            for(let item of payload['new_dialog']){
                state.offlineMsgNumMap
                let key=item['src_type']+'-'+item['user_id']
                Vue.set(state.msgNumMap, key,{'offline_msg_num':item['total'],'not_read_msg_num':item['total']})
                state.latelyMsgIndex.push(key)
                isExistFlag[key]=true
                let msg={
                    user_id:item['user_id'],
                    target_id:item['target_id'],
                    content:item['content'],
                    time:item['send_time'],
                    is_self:0,
                    msg_id:item['id'],
                    created_at:item['created_at']
                }
                Vue.set(state.latelyMsgList, key, [msg])
            }
            for(let item of payload['old_dialog']){
                if(isExistFlag[item['src_type_target_id']]){
                    continue
                }
                state.latelyMsgIndex.push(item['src_type_target_id'])
                Vue.set(state.latelyMsgList, item['src_type_target_id'], item.content?[item]:[])
            }
        },
        setPrivateMsgList(state,payload){
            let key=payload['type']+'-'+payload['target_id']
            payload['msg_list'].push(...state.latelyMsgList[key])
            state.latelyMsgList[key]=payload['msg_list']
            
        },
        setShowBottomFlag(state, payload) {
            state.isShowBottom = payload
        },
        setBottomLabel(state, payload) {
            state.bottomLabel = payload
        },
        setUserInfo(state,payload){
            state.userInfo=payload
        },
        setFriendList(state,payload){
            //state.friendList=payload
            for(let item of payload){
                state.friendList[item['friend_id']]=item
            }
        }

    }
})
export default store