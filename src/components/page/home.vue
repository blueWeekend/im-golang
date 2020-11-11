<template>
    <div class="main">
        <transition :name="transitionName" mode="out-in">
            <keep-alive>
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
    import {getToken,logout,EVENT_MAP,SRC_MAP} from '@/utils/global'
    export default {
        data() {
            return {
                currentTab: 'msg',
                transitionName: '',
                socket:null,
            }
        },
        created() {
            let route=this.$route.path
            if(route.split('/').pop()=='home'){
                this.$router.push('/home/msgList')
            }
            let token=getToken()
            if(!token){
                return
            }
            getUserInfo().then(data=>{
                this.init(data,token)
            })
        },
        methods: {
            init(data,token){
                this.$store.commit('setUserInfo',data.user_info)
                this.$store.commit('setFriendList',data.friend_list)
                this.$store.commit('setSocket',getWsConnect(token))
                this.$store.commit('finishInit')
               
                this.$store.state.socket.onmessage=this.onmessage
            },
            onmessage(res){
                let data=JSON.parse(res.data)
                switch(data.event){
                    case EVENT_MAP.MSG:
                        let msg={
                            key:data.src_type+'-'+data.user_id,
                            content:data.content,
                            time:new Date().getTime(),
                            isSelf:0
                        }
                        console.log(msg)
                        this.$store.commit('pushMsg',msg)
                        break
                    case EVENT_MAP.NOT_LOGIN:
                        logout()
                        break
                    case EVENT_MAP.PING:;break
                }
            }
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