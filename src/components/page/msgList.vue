<template>
    <div class="swipe-wrapper">
        <cube-scroll>
            <cube-swipe>
                <li class="swipe-item-wrapper" v-for="(data,index) in swipeData">
                    <div @click="onItemClick(data, index)" class="item-inner">
                        <div class="icon">
                            <img width="45" height="45" :src="data.avatar">
                        </div>
                        <div class="text">
                            <h2 class="target-name" v-html="data.text"></h2>
                            <h3 class="last-msg">sadfasdfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa</h3>
                        </div>
                    </div>
                </li>
            </cube-swipe>
        </cube-scroll>
    </div>
</template>

<script>
    export default {
        data() {
            return {
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
            onItemClick(item) {
                console.log('click item:', item)
                this.$router.push('/home/friendList/dialog')
            },
        },
        computed: {
            listData() {
                return this.$store.state.msgList
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