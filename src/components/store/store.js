import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        isInit:false,
        latelyMsgList: [],
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
            for(let i in state.latelyMsgList){
                if(state.latelyMsgList[i]['key']==payload['key'] && state.latelyMsgList[i]['type']==payload['type']){
                    state.latelyMsgList[i]['list'].push({status:0,content:payload['content']})
                    return
                }
            }
            state.latelyMsgList.unshift({key:payload['key'],type:payload['type'],list:[{status:0,content:payload['content']}]})
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