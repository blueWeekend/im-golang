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
            if(state.latelyMsgList[payload['key']]){
                if(!payload['content']){
                    return
                }
                state.latelyMsgList[payload['key']].push({status:0,content:payload['content'],time:payload['time'],isSelf:payload['isSelf']})
                for(let i in state.latelyMsgIndex){
                    if(state.latelyMsgIndex[i]==payload['key']){
                        for(let j=i;j>0;j--){
                            state.latelyMsgIndex[j]=state.latelyMsgIndex[j-1]
                        }
                        state.latelyMsgIndex[0]=payload['key']
                        console.log(state.latelyMsgList)
                        return
                    }
                }

            }else{
                state.latelyMsgIndex.unshift(payload['key'])
                state.latelyMsgList[payload['key']]=payload['content']?[{status:0,content:payload['content'],time:payload['time'],isSelf:payload['isSelf']}]:[]
            }
            console.log(state.latelyMsgList)
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
            localStorage.setItem('im:friend_list',JSON.stringify(payload))
        }

    }
})
export default store