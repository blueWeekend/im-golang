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
            <div v-for="(data,index) in list" :key="index" :class="data.class" @click="handleClick(data)">
                <div class="avatar" :style="{backgroundImage: 'url(' + (data.avatar || '') + ')'}"></div>
                <div class="bubble">
                    <p>{{ data.msg }}</p>
                    <div class="meta">
                        <time class="posted-date">{{ data.time }}</time>
                    </div>
                </div>
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

    export default {
        data() {
            return {
                id: 0,
                chatContent: '',
                list: [],
                friendId:'',
                nickname:'',
            }
        },
        created() {
            for (let i = 0; i < 5; i++) {
                this.list.push(this.getItem(this.id++))
            }
            this.friendId=this.$route.params.friendId
            this.nickname=this.$store.state.friendList[this.friendId]['nickname']
        },
        methods: {
            getItem(id) {
                return {
                    avatar: require('./avatar.png'),
                    msg: id,
                    class:'item-left',
                    time: this.formatTime()
                }
            },
            handleClick(data) {
                console.log(data)
            },
            sendMsg() {
                this.list.push({
                    avatar: require('./avatar.png'),
                    msg: this.chatContent,
                    class:'item-right',
                    time: this.formatTime()
                })
                this.chatContent = ''
                this.$nextTick(() => {
                    this.$refs.list.scrollTop = this.$refs.list.scrollHeight;
                    console.log(this.$refs.msg)
                    this.$refs.msg.focus();
                })
                
            },
            back(){
                this.$router.go(-1)
            },
            formatTime (value) {
                value = value ? value : new Date().getTime()
                let date = new Date(value);
                let y = date.getFullYear();
                let MM = date.getMonth() + 1;
                MM = MM < 10 ? "0" + MM : MM;
                let d = date.getDate();
                d = d < 10 ? "0" + d : d;
                let h = date.getHours();
                h = h < 10 ? "0" + h : h;
                let m = date.getMinutes();
                m = m < 10 ? "0" + m : m;
                let s = date.getSeconds();
                s = s < 10 ? "0" + s : s;
                return y + "-" + MM + "-" + d + " " + h + ":" + m;
            }
        },
    }
</script>


<style lang="stylus" rel="stylesheet/stylus">
    header{
        position: absolute;
        background-color: #eee;
        width: 100%;
        height: 40px;
        line-height: 40px;
        border-bottom: 0.5px solid #E2E2E2;
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
        height: 94%;
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