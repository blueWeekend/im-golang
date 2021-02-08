<template>
    <div style="height:100%">
        <!-- <cube-recycle-list class="list" :size="size" :on-fetch="onFetch" :offset="offset">
            <template slot="item" slot-scope="{ data }">
                <div :id="data.id" class="item" @click="handleClick(data)">
                    <div class="avatar" :style="{backgroundImage: 'url(' + (data.avatar || '') + ')'}"></div>
                    <div class="bubble">
                        <p>{{ data.msg }}</p>
                        <div class="meta">
                            <time class="posted-date">{{ data.time }}</time>
                        </div>
                    </div>
                </div>
            </template>
        </cube-recycle-list> -->
        <header><i class="cubeic-back" @click="back()"></i>&nbsp;&nbsp;&nbsp;{{nickname}}</header>
        <div class="list" ref="list">  
            <div v-for="(data,index) in $store.state.latelyMsgList[msgKey]" :key="index" :class="dialogClass[data.is_self]" @click="handleClick(data)">
                <div class="avatar" :style="{backgroundImage: 'url(' + avatar + ')'}"></div>
                <div class="bubble">
                    <p>{{ data.content }}</p>
                    <div class="meta">
                        <time class="posted-date">{{ formatTime(data.time) }}</time>
                    </div>
                </div>
                <cube-loading v-if="data.status==MSG_STATUS_MAP.SENDING && data.is_self==1" :size="28" style="padding-top:8px"></cube-loading>
                <i v-if="data.status==MSG_STATUS_MAP.FAIL && data.is_self==1" style="font-size:28px;padding-top:8px" class="cubeic-warn"></i>
            </div>  
        </div>

        <div style="height: 6%;">
            <cube-textarea v-model="chatContent" :maxlength="200" style="height: 100%;width: 80%;float: left;"
                :rows="100" ref="msg">
            </cube-textarea>
            <cube-button @click="sendMsg" :primary="true" style="width: 20%;">发送</cube-button>
        </div>

    </div>

</template>

<script>
    import {EVENT_MAP,SRC_MAP,CNT_MAP,MSG_STATUS_MAP,formatTime} from '@/utils/global'
    import communicate from '@/utils/communicate'
    import {setPrivateMsgList} from '@/components/store/indexedDb'
    export default {
        name: "im-dialog",
        data() {
            return {
                id: 0,
                chatContent: '',
                list:[],
                targetId:'',
                srcType:'',
                msgKey:'',
                nickname:'',
                page:1,
                avatar: require('./avatar.png'),
                dialogClass:['item-left','item-right'],
                MSG_STATUS_MAP:MSG_STATUS_MAP
            }
        },
        created() {
            console.log(1)
            this.alterScrollTop()
            communicate.$on('alterScrollTop', () => {
                this.alterScrollTop()
            })
            this.targetId=parseInt(this.$route.params.targetId)
            this.srcType=this.$route.params.srcType
            this.msgKey=this.srcType+'-'+this.targetId
            if(this.$store.state.isInit){
                this.init()
            }
        },
        methods: {
            init(){
                this.nickname=this.$store.state.friendList[this.targetId]['nickname']
                //vue双向绑定需初始化
                let msg={
                    src_type:this.srcType,
                    target_id  :this.targetId,
                    content:'',
                    is_self:1
                }
                this.$store.commit('pushMsg',msg)
                if(!this.$store.state.isInitPrivateMsgMap.hasOwnProperty(this.msgKey)){
                    setPrivateMsgList(this.srcType,this.targetId)
                    this.$store.commit('finishPrivateMsgInit',this.msgKey)
                }
            },
            getItem(id) {
                return {
                   
                    msg: id,
                    class:'item-left',
                    time: formatTime()
                }
            },
            handleClick(data) {
                console.log(data)
            },
            sendMsg() {
                //毫秒时间戳
                let curTime=(new Date()).getTime()
                let msg={
                    event:EVENT_MAP.MSG,
                    user_id:this.$store.state.userInfo['user_id'],
                    src_type:SRC_MAP.FRIEND,
                    cnt_type:CNT_MAP.TEXT,
                    content:this.chatContent,
                    target_id:this.targetId,
                    time:curTime,
                    is_self:1
                }
                this.$store.commit('pushMsg',msg)
                delete msg.is_self
                this.$store.state.socket.send(JSON.stringify(msg))
                communicate.$emit('pushWaitAckMsg',msg)
                this.chatContent = ''
                this.alterScrollTop()  
            },
            alterScrollTop(){
                
                this.$nextTick(() => {
                    if(!this.$refs.list){
                        return
                    }
                    this.$refs.list.scrollTop = this.$refs.list.scrollHeight
                    this.$refs.msg.focus()
                })
            },
            back(){
                this.$router.go(-1)
            },
            formatTime,
        },
        watch:{
            "$store.state.isInit":function(val){
                if(!val){
                    return
                }
                this.init()
            }
            
        }
    }
</script>


<style lang="stylus" rel="stylesheet/stylus">
    header{
        //position: absolute;
        background-color: #eee;
        width: 100%;
        height: 40px;
        line-height: 40px;
        //border-bottom: 0.5px solid #E2E2E2;
        z-index: 99;
        padding-left: 15px;
        
    }
    .list {
        margin: 0 auto;
        padding: 0;
        border: 1px solid #ddd;
        list-style-type: none;
        text-align: center;
        background: #eee;
        height: 89%;
        overflow-y: auto;
        .item-left {
            display: flex;
            padding: 10px 0;
            width: 100%;
            text-align: left;
            .bubble {
                padding: 7px 10px;
                color: #333;
                background: #fff;
                box-shadow: 0 3px 2px rgba(0, 0, 0, 0.1);
                position: relative;
                max-width: 420px;
                min-width: 80px;
                margin: 0 20px 0 5px;
                &:before {
                    content: '';
                    border-style: solid;
                    border-width: 0 10px 10px 0;
                    border-color: transparent #fff transparent transparent;
                    position: absolute;
                    top: 0;
                    left: -10px;
                }

            }

        }
        
        .item-right {
            display: flex;
            flex-direction:row-reverse;
            padding: 10px 0;
            width: 100%;
            text-align: left;
            .bubble {
                padding: 7px 10px;
                color: #333;
                background: #fff;
                box-shadow: 0 3px 2px rgba(0, 0, 0, 0.1);
                position: relative;
                max-width: 420px;
                min-width: 80px;
                margin: 0 5px 0 5px;
                &:after {
                    content: '';
                    border-style: solid;
                    border-width: 0 0 10px 10px;
                    border-color: transparent transparent transparent #fff;
                    position: absolute;
                    top: 0;
                    right: -10px;
                }

            }

        }
        .item-left .avatar {
            border-radius: 50%;
            margin-left: 15px;
            margin-right: 6px;
            min-width: 48px;
            width: 48px;
            height: 48px;
            background-image: url('./avatar.png');
            background-size: cover;
            outline: none;
        }
        .item-right .avatar {
            border-radius: 50%;
            margin-left: 6px;
            margin-right: 15px;
            min-width: 48px;
            width: 48px;
            height: 48px;
            background-image: url('./avatar.png');
            background-size: cover;
            outline: none;
        }
        .item-left p,.item-right p {
            margin: 0;
            word-wrap: break-word;
            font-size: 14px;
        }
        .item-left .meta,.item-right .meta {
            font-size: 0.8rem;
            color: #999;
            margin-top: 3px;
        }

    }
</style>