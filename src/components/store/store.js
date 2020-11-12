import Vue from 'vue'
import Vuex from 'vuex'
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
                state.latelyMsgList[payload['key']].push({status:0,content:payload['content'],time:payload['time'],isSelf:payload['isSelf']})
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
                Vue.set(state.latelyMsgList, payload['key'], payload['content']?[{status:0,content:payload['content'],time:payload['time'],isSelf:payload['isSelf']}]:[])
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