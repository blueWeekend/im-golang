import Vue from 'vue'
import Vuex from 'vuex'
import {MSG_STATUS_MAP} from '@/utils/global'
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
        waitAckMsgList:[],
        ackMsgListTimer:null
    },
    mutations: {
        finishInit(state){
            state.isInit=true
        },
        setSocket(state,payload){
            state.socket=payload
        },
        pushMsg(state, payload) {
            console.log(state)
            if(state.latelyMsgList[payload['key']]){
                if(!payload['content']){
                    return
                }
                if(payload['isSelf']===0){
                    //确保消息不重
                    let left=0
                    let right=state.latelyMsgList[payload['key']].length-1
                    let mid
                    while(left<=right){
                        mid=left+((right-left)>>1)
                        if(state.latelyMsgList[payload['key']][mid]['time']==payload['time']){
                            return
                        }else if(state.latelyMsgList[payload['key']][mid]['time']<payload['time']){
                            left=mid+1
                        }else{
                            right=mid-1
                        }
                    }
                }
                
                state.latelyMsgList[payload['key']].push({status:MSG_STATUS_MAP.SENDING,content:payload['content'],time:payload['time'],isSelf:payload['isSelf']})
                // state.latelyMsgIndex.splice(i,1)
                // state.latelyMsgIndex.unshift(payload['key'])
                for(let i in state.latelyMsgIndex){
                    if(state.latelyMsgIndex[i]==payload['key']){
                        for(let j=i;j>0;j--){
                            state.latelyMsgIndex[j]=state.latelyMsgIndex[j-1]
                        }
                        state.latelyMsgIndex[0]=payload['key']
                        return
                    }
                }

            }else{
                state.latelyMsgIndex.unshift(payload['key'])
                Vue.set(state.latelyMsgList, payload['key'], payload['content']?[{status:MSG_STATUS_MAP.SENDING,content:payload['content'],time:payload['time'],isSelf:payload['isSelf']}]:[])
            }
           
        },
        confirmMsgArrive(state, payload){
            let left=0
            let right=state.latelyMsgList[payload['key']].length-1
            let mid
            while(left<=right){
                mid=left+((right-left)>>1)
                if(state.latelyMsgList[payload['key']][mid]['time']==payload['time']){
                    state.latelyMsgList[payload['key']][mid]['status']=MSG_STATUS_MAP.SUCCESS
                    return
                }else if(state.latelyMsgList[payload['key']][mid]['time']<payload['time']){
                    left=mid+1
                }else{
                    right=mid-1
                }
            }
        },
        setShowBottomFlag(state, flag) {
            state.isShowBottom = flag
        },
        setBottomLabel(state, label) {
            state.bottomLabel = label
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