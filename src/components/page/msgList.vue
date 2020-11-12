<template>
    <div class="swipe-wrapper">
        <cube-scroll>
            <cube-swipe>
                <li class="swipe-item-wrapper" v-for="(data,index) in $store.state.latelyMsgIndex" :key="index">
                    <div @click="onItemClick(data)" class="item-inner">
                        <div class="icon">
                            <img width="45" height="45" :src="avatar">
                        </div>
                        <div class="text">
                            <h2 class="target-name" v-html="friendIdnicknameMap[index]"></h2>
                            <h3 class="last-msg">{{$store.state.latelyMsgList[data].length>0?$store.state.latelyMsgList[data][$store.state.latelyMsgList[data].length-1]['content']:''}}</h3>
                        </div>
                    </div>
                </li>
            </cube-swipe>
        </cube-scroll>
    </div>
</template>

<script>
    import {SRC_MAP} from '@/utils/global'
    export default {
        name:'im-msgList',
        data() {
            return {
                avatar:require('./avatar.png'),
                swipeData: [{
                        text: '测试1',
                        avatar: require('./avatar.png'),
                        value: 1
                    }, {
                        text: '测试2',
                        avatar: require('./avatar.png'),
                        value: 2
                    }, {
                        text: '测试3',
                        avatar: require('./avatar.png'),
                        value: 3
                    }
                ]
            }
        },
        created(){
           
        },
        methods: {
            onItemClick(typeAndFriendkey) {
                let arr=typeAndFriendkey.split('-')
                let msg={
                    key:typeAndFriendkey,
                    content:'',
                }
                this.$store.commit('pushMsg',msg)
                this.$router.push('/home/friendList/dialog/'+arr[1]+'/'+SRC_MAP.FRIEND)
            },
        },
        computed: {
            friendIdnicknameMap() {
                return this.$store.state.latelyMsgIndex.map(item => {
                    let friendId=item.split('-')[1]
                    return this.$store.state.friendList[friendId]['nickname']
                })
            }
        },
    }
</script>


<style lang="stylus" rel="stylesheet/stylus">
    .swipe-wrapper
      background: #fff
      .swipe-item-wrapper
        overflow: hidden
      .item-inner
        display: flex
        box-sizing: border-box
        align-items: center
        padding: 0 10px
        height: 60px
        border-bottom: 1px solid #ebebeb;
        .icon
          flex: 0 0 60px
          width: 60px
        .text
          display: flex
          flex-direction: column
          justify-content: center
          flex: 1
          line-height: 20px
          overflow: hidden
          .target-name,.last-msg
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
          .target-name
            font-size:16px
          .last-msg
            font-size:14px
            color:#999
</style>