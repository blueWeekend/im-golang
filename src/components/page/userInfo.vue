<template>
    <div style="line-height: 36px;background-color: #f7f7f7;height: 100%;">
        <div style="padding:36px 0 30px 66px;border-bottom: 1px white solid;position: relative;">
            <i class="cubeic-back" @click="$router.go(-1)" style="position: absolute;top: 3px;left: 8px;"></i>
            <div style="float: left;width: 72px;">
                <img src="./avatar.png" width="72">
            </div>
            <ul style="margin-left: 90px;">
                <li style="font-size: 25px;font-weight: 800;">{{nickname}}</li>
                <li>昵称:{{username}}</li>
            </ul>
        </div>
        
        <div style="text-align: center;color:#6D7E93;line-height: 46px;height: 46px;border-bottom: 1px white solid;">
            <span v-if="$store.state.friendList[userId]" @click="toSendMsg"><i class="cubeic-message"></i>发消息</span>
            <span v-else @click="relationApply">添加到通讯录</span>
        </div>
    </div>
</template>

<script>
    import {COMMON_UNIT_TAB,SRC_MAP,toast} from '@/utils/global'
    import {relationApply} from '@/api/user'
    export default {
        name:'im-userInfo',
        data() {
            return {
               userId:this.$route.params.userId,
               username:this.$route.params.username,
               nickname:'',
            }
        },
        created(){
            if(this.$store.state.friendList[this.userId]){
                this.nickname=this.$store.state.friendList[this.userId]['nickname']
            }else{
                this.nickname=this.username
            }
        },
        methods: {
            toSendMsg() {
                this.$router.push('/home/friendList/dialog/'+this.userId+'/'+SRC_MAP.FRIEND)
            },
            relationApply(){
                relationApply({
                    user_id:this.$store.state.userInfo.user_id,
                    src_type:SRC_MAP.FRIEND,
                    target_id:parseInt(this.userId)
                }).then(()=>{
                    toast('已发送')
                })
            }
        }
    }
</script>


<style>

</style>