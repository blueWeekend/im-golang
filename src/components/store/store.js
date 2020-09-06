import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        msgList: [],
        isShowBottom: true,
        bottomLabel:'msgList'
    },
    mutations: {
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
            state.userId=payload.user_id
            state.username=payload.username
            state.email=payload.email
        }
    }
})
export default store