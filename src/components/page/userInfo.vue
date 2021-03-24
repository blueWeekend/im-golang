<template>
    <div style="line-height: 36px;background-color: #f7f7f7;height: 100%;">
        <div style="padding:36px 0 30px 66px;border-bottom: 1px white solid;">
            <div style="float: left;width: 72px;">
                <img src="./avatar.png" width="72">
            </div>
            <ul style="margin-left: 90px;">
                <li style="font-size: 25px;font-weight: 800;">{{nickname?nickname:userName}}</li>
                <li>昵称:{{userName}}</li>
            </ul>
        </div>
        
        <div style="text-align: center;color:#6D7E93;line-height: 46px;height: 46px;border-bottom: 1px white solid;">
            <span v-if="$store.state.friendList[userId]"><i class="cubeic-message"></i>发消息</span>
            <span v-else>添加到通讯录</span>
        </div>
    </div>
</template>

<script>
    import {COMMON_UNIT_TAB} from '@/utils/global'
    export default {
        
        data() {
            return {
               userId:this.$route.params.userId,
               userName:this.$route.params.userName,
               nickname:this.$route.params.nickname,
            }
        },
        created(){
            console.log(this.userId)
            console.log(this.userName)
            if(this.userName==''){

            }
        },
        methods: {
            
        }
    }
</script>


<style>

</style>