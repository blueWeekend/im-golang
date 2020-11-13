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
    import {getToken,logout,EVENT_MAP,SRC_MAP,NOT_KEEP_ALIVE_ROUTE} from '@/utils/global'
    import communicate from '@/utils/communicate'
    export default {
        data() {
            return {
                NOT_KEEP_ALIVE_ROUTE:NOT_KEEP_ALIVE_ROUTE,
                transitionName: '',
                socket:null,
                token:'',
                isConnecting:false,
                waitAckMsgList:[],
                ackMsgListTimer:null
            }
        },
        created() {
            let route=this.$route.path
            if(route.split('/').pop()=='home'){
                this.$router.push('/home/msgList')
            }
            this.token=getToken()
            if(!this.token){
                return
            }
            communicate.$on('pushMsg', (data) => {
                console.log(data)
                this.waitAckMsgList.push(data)
                this.ackMsgListTimer=setInterval(this.filterWaitAckMsgList(), 3000);
            })
            getUserInfo().then(data=>{
                this.init(data)
            })
        },
        methods: {
            init(data,token){
                this.setSocket()
                this.$store.commit('setUserInfo',data.user_info)
                this.$store.commit('setFriendList',data.friend_list)
                this.$store.commit('finishInit')
            },
            filterWaitAckMsgList(){
                console.log(this.waitAckMsgList)
                if(this.waitAckMsgList.length==0){
                    clearInterval(this.ackMsgListTimer)
                }
                let curTime=new Date().getTime()
                for(let i in this.waitAckMsgList){
                    if(curTime-this.waitAckMsgList[i]['time']>15000){
                        //剔除掉15秒内没重发成功的消息
                        this.waitAckMsgList.splice(i,1)
                    }
                    if(this.waitAckMsgList[i]){
                        this.$store.state.socket.send(JSON.stringify(data))
                    }
                }
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
                        msg={
                            key:data.src_type+'-'+data.user_id,
                            content:data.content,
                            time:data.time,
                            isSelf:0
                        }
                        this.$store.commit('pushMsg',msg)
                        //ack确保消息必达
                        let ackMsg={
                            user_id:data.target_id,
                            src_type:data.src_type,
                            target_id:data.user_id,
                            event:EVENT_MAP.ACK,
                            time:data.time
                        }
                        this.$store.state.socket.send(JSON.stringify(ackMsg))
                        break
                    case EVENT_MAP.ACK:
                        msg={
                            key:data.src_type+'-'+data.user_id,
                            time:data.time,
                        }
                        this.$store.commit('confirmMsgArrive',msg)
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
            },
            onerror(e){
                console.log(e)
                this.reConnect()
            },
            heart(){
                let that=this
                this.timeObj && clearTimeout(this.timeObj)
                this.serverTimeObj && clearTimeout(this.serverTimeObj)
                this.timeObj = setTimeout(function(){
                    let data={
                        event:EVENT_MAP.PING,
                        user_id:that.$store.state.userInfo['user_id'],
                    }
                    that.$store.state.socket.send(JSON.stringify(data))
                    that.serverTimeObj=setTimeout(function(){
                        that.$store.state.socket.close()
                        that.reConnect()
                    },3000)
                },60000)
            },
            reConnect(){
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