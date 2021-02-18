<template>
    <div class="main">
        <transition :name="transitionName" mode="out-in">
            <keep-alive :exclude="NOT_KEEP_ALIVE_ROUTE">
                <router-view class="position-div"></router-view>
            </keep-alive>
        </transition>
        <footer v-show="$store.state.isShowBottom">
            <bottom></bottom>
        </footer>
    </div>

</template>

<script>
    import bottom from '@/components/common/bottom'
    import {getUserInfo,getWsConnect} from '@/api/user'
    import {getToken,logout,EVENT_MAP,NOT_KEEP_ALIVE_ROUTE,MSG_STATUS_MAP} from '@/utils/global'
    import {setLatelyDialog,init as openLocalDb} from '@/components/store/indexedDb'
    import communicate from '@/utils/communicate'
    const HEART_WAIT=3000
    const RETRY_RATE=1000
    const HEART_RATE=60000
    const MSG_MAX_RETRY_TIME=5000 //失败消息最大重试时间
    export default {
        data() {
            return {
                NOT_KEEP_ALIVE_ROUTE:NOT_KEEP_ALIVE_ROUTE,
                transitionName: '',
                socket:null,
                token:'',
                isConnecting:false,
                waitAckMsgList:[],
                ackMsgListTimer:null,
                heartTimer:null,
                reConnectTimer:null,
                lastOfflineMsg:null
            }
        },
        created() {
            communicate.$on('onLogin', (data) => {
                this.token=data.access_token
                this.init(data)
            })
            communicate.$on('pushWaitAckMsg', (data) => {
                data.event=EVENT_MAP.RETRY
                this.waitAckMsgList.push(data)
                if(this.ackMsgListTimer){
                    return
                }
                this.ackMsgListTimer=setTimeout(this.filterWaitAckMsgList, RETRY_RATE)
            })
            this.token=getToken()
            if(!this.token){
                return
            }
            getUserInfo().then(data=>{
                this.init(data)
            })
        },
        methods: {
             init(data){
                //data.lately_dialog.length>0?this.setLastOfflineMsg(data.lately_dialog[0]):null
                this.setSocket()
                this.$store.commit('setUserInfo',data.user_info)
                this.$store.commit('setFriendList',data.friend_list)
                openLocalDb().then(()=>{
                    setLatelyDialog(data.lately_dialog).then(()=>{
                        this.$store.commit('finishInit')
                    })
                })
                data.lately_dialog.length>0?this.setLastOfflineMsg(data.lately_dialog[0]):null     
            },
            setLastOfflineMsg(data){
                let ackMsg={
                    msg_id:data.id,
                    user_id:data.target_id,
                    src_type:data.src_type,
                    target_id:data.user_id,
                    event:EVENT_MAP.ACK,
                    time:data.send_time,
                    created_at:data.created_at
                }
                this.lastOfflineMsg=ackMsg
            },
            filterWaitAckMsgList(){
                if(this.waitAckMsgList.length==0){
                    clearInterval(this.ackMsgListTimer)
                    this.ackMsgListTimer=null
                    return
                }
                let curTime=new Date().getTime()
                for(let i in this.waitAckMsgList){
                    if(curTime-this.waitAckMsgList[i]['time']>MSG_MAX_RETRY_TIME){
                        //剔除掉15秒内没重发成功的消息
                        let msg={
                            user_id:this.waitAckMsgList[i]['user_id'],
                            src_type:this.waitAckMsgList[i]['src_type'],
                            target_id:this.waitAckMsgList[i]['target_id'],
                            time:this.waitAckMsgList[i]['time'],
                            is_self:1,
                            status:MSG_STATUS_MAP.FAIL
                        }
                        this.$store.commit('confirmMsgStatus',msg)
                        this.waitAckMsgList.splice(i,1)
                    }
                    if(this.waitAckMsgList[i]){//splice删除后可能不存在
                        this.$store.state.socket.send(JSON.stringify(this.waitAckMsgList[i]))
                    }
                }
                setTimeout(this.filterWaitAckMsgList, RETRY_RATE)
            },
            remWaitAckMsgList(time){
                let left=0
                let right=this.waitAckMsgList.length-1
                let mid
                while(left<=right){
                    mid=left+((right-left)>>1)
                    if(this.waitAckMsgList[mid]['time']==time){
                        this.waitAckMsgList.splice(mid,1)
                        return
                    }else if(this.waitAckMsgList[mid]['time']<time){
                        left=mid+1
                    }else{
                        right=mid-1
                    }
                }
            },
            setSocket(){
                this.$store.commit('setSocket',getWsConnect(this.token))
                this.$store.state.socket.onmessage=this.onmessage
                this.$store.state.socket.onopen=this.onopen
                this.$store.state.socket.onerror=this.onerror
            },
            onmessage(res){
                let data=JSON.parse(res.data)
                let msg
                switch(data.event){
                    case EVENT_MAP.MSG:
                        this.$store.commit('pushMsg',{...data,is_self:0})
                        //ack确保消息必达
                        let ackMsg={
                            msg_id:data.msg_id,
                            user_id:data.target_id,
                            src_type:data.src_type,
                            target_id:data.user_id,
                            event:EVENT_MAP.ACK,
                            time:data.time,
                            created_at:data.created_at
                        }
                        this.$store.state.socket.send(JSON.stringify(ackMsg))
                        communicate.$emit('alterScrollTop')
                        break
                    case EVENT_MAP.ACK:
                        msg={
                            user_id:data.user_id,
                            target_id:data.target_id,
                            src_type:data.src_type,
                            time:data.time,
                            is_self:0,
                            status:MSG_STATUS_MAP.SUCCESS
                        }
                        this.$store.commit('confirmMsgStatus',msg)
                        this.remWaitAckMsgList(data.time)
                        break
                    case EVENT_MAP.NOT_LOGIN:
                        logout()
                        break
                    case EVENT_MAP.PING:
                        this.heart()
                        break
                }
            },
            onopen(){
                this.heart()
                if(this.lastOfflineMsg){
                    this.$store.state.socket.send(JSON.stringify(this.lastOfflineMsg))
                    this.lastOfflineMsg=null
                }
            },
            onerror(e){
                console.log(e)
                this.reConnect()
            },
            heart(){
                this.heartTimer && clearTimeout(this.heartTimer)
                this.reConnectTimer && clearTimeout(this.reConnectTimer)
                this.heartTimer = setTimeout(()=>{
                    let data={
                        event:EVENT_MAP.PING,
                        user_id:this.$store.state.userInfo['user_id'],
                    }
                    this.$store.state.socket.send(JSON.stringify(data))
                    this.reConnectTimer=setTimeout(()=>{
                        this.$store.state.socket.close()
                        this.reConnect()
                    },HEART_WAIT)
                },HEART_RATE)
            },
            reConnect(){
                console.log('reConnect')
                if (this.isConnecting) {
                    return
                }
                this.isConnecting = true
                this.setSocket()
                this.isConnecting = false
                
            },
            
        },
        components: {
            bottom
        },
        // watch: {
        //     $route(to, from) {
        //         let arr=to.path.split('/')
        //         if(arr[arr.length-1]=='msgList' || arr[arr.length-1]=='friendList'){
        //             this.$store.commit('setShowBottomFlag', true)
        //         }else{
        //             this.$store.commit('setShowBottomFlag', false)
        //         }
        //         if (to.meta > from.meta) {
        //             this.transitionName = "slide-left"
        //         } else {
        //             this.transitionName = "slide-right"
        //         }
        //     }
        // }
    }
</script>


<style lang="stylus">
    .main {
        height: 100%;
        width: 100%;
        margin: 0 auto;
        overflow: hidden;
        position: absolute;
    }

    footer {
        width: 100%;
        position: fixed;
        bottom: -1px;
        z-index: 99;
        background-color: #f7f7f7;
    }

    /* .slide-right-enter-active,
    .slide-right-leave-active,
    .slide-left-enter-active,
    .slide-left-leave-active {
        transition: all 300ms;
    }

    .slide-right-enter {
        opacity: 0;
        transform: translate3d(-100%, 0, 0);
    }

    .slide-right-leave-to {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
    }

    .slide-left-enter {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
    }

    .slide-left-leave-to {
        opacity: 0;
        transform: translate3d(-100%, 0, 0);
    }

    .position-div {
        position: absolute !important;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    } */
</style>