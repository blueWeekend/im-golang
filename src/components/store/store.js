import Vue from 'vue'
import Vuex from 'vuex'
import {MSG_STATUS_MAP} from '@/utils/global'
import {addMsg,confirmMsgStatus,saveLatelyDialog} from '@/components/store/indexedDb'
import communicate from '@/utils/communicate'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        isInit:false,
        userInfo:{},
        latelyMsgList: {},
        latelyMsgIndex:[],
        isShowCommonUnit: true,
        bottomLabel:'msgList',
        friendList:{},
        socket:null,
        msgNumMap:{},
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
                    //防止消息重复
                    let left=0
                    let right=state.latelyMsgList[key].length-1
                    let mid
                    while(left<=right){
                        mid=left+((right-left)>>1)
                        if(state.latelyMsgList[key][mid]['time']==payload['time'] && state.latelyMsgList[key][mid]['is_self']==0){
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
                    ...payload,
                }
                addMsg({...payload,status:MSG_STATUS_MAP.FAIL})
                state.latelyMsgList[key].push(msg)
                // state.latelyMsgIndex.splice(i,1)
                // state.latelyMsgIndex.unshift(key)
                for(let i in state.latelyMsgIndex){
                    if(state.latelyMsgIndex[i]==key){
                        for(let j=i;j>0;j--){
                            state.latelyMsgIndex[j]=state.latelyMsgIndex[j-1]
                        }
                        state.latelyMsgIndex[0]=key
                        saveLatelyDialog()
                        return
                    }
                }

            }else{
                state.latelyMsgIndex.unshift(key)
                if(payload['content']){
                    let msg={
                        status:MSG_STATUS_MAP.SENDING,
                        ...payload,
                    }
                    addMsg({...payload,status:MSG_STATUS_MAP.FAIL})
                    Vue.set(state.latelyMsgList, key, [msg])
                    saveLatelyDialog()
                }else{
                    Vue.set(state.latelyMsgList, key,[])
                }
                
            }
           
        },
        alterMsgNum(state,payload){
            state.msgNumMap[payload['key']]['not_read_msg_num']=payload['not_read_msg_num']
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
            for(let item of payload['new_dialog']){
                state.offlineMsgNumMap
                let key=item['src_type']+'-'+item['user_id']
                Vue.set(state.msgNumMap, key,{'not_read_msg_num':item['total']})
                state.latelyMsgIndex.push(key)
                Vue.set(state.latelyMsgList, key, [item])
            }
            for(let item of payload['old_dialog']){
                if(state.latelyMsgList[item['src_type_target_id']]){
                    continue
                }
                Vue.set(state.msgNumMap, item['src_type_target_id'],{'not_read_msg_num':0})
                state.latelyMsgIndex.push(item['src_type_target_id'])
                Vue.set(state.latelyMsgList, item['src_type_target_id'], item.content?[item]:[])
            }
        },
        setPrivateMsgList(state,payload){
            let key=payload['type']+'-'+payload['target_id']
            payload['msg_list'].push(...state.latelyMsgList[key])
            state.latelyMsgList[key]=payload['msg_list']
            if(state.isInitPrivateMsgMap[key]){
                communicate.$emit('alterScrollTop')
            }
        },
        setShowCommonUnitFlag(state, payload) {
            state.isShowCommonUnit = payload
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