import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        isInit:false,
        msgList: [],
        isShowBottom: true,
        bottomLabel:'msgList',
        friendList:[]
    },
    mutations: {
        finishInit(state){
            state.isInit=true
        },
        pushMsg(state, payload) {
            //state.msgList[payload['targetId']].push(payload)
            state.msgList.push(payload)
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