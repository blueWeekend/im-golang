<template>
    <div class="main">
        <transition :name="transitionName" mode="out-in">
            <router-view class="position-div"></router-view>
        </transition>
        <footer v-show="$store.state.isShowBottom">
            <bottom></bottom>
        </footer>
    </div>

</template>

<script>
    import friendList from '@/components/page/friendList'
    import bottom from '@/components/common/bottom'
    export default {
        data() {
            return {
                currentTab: 'msg',
                transitionName: ''
            }
        },
        created() {
            let route=this.$route.path
            var socket = new WebSocket("ws://127.0.0.1:70/ws/connect","qwerasdf");
            if(route.split('/').pop()=='home'){
                this.$router.push('/home/msgList')
            }
        },
        methods: {
            
        },
        components: {
            bottom, friendList
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