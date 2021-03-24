<template>
    <div style="text-align:center;height:36px;line-height: 36px;background-color: #f7f7f7;position: relative;">
        <span>{{tab[$store.state.bottomLabel]?tab[$store.state.bottomLabel]['label']:''}}</span>
        <span @click="showAlert" style="position: absolute;right: 10px;">添加朋友</span>
    </div>
</template>

<script>
    import {COMMON_UNIT_TAB} from '@/utils/global'
    import {GetUserPanel} from '@/api/user'
    export default {
        
        data() {
            return {
               tab:COMMON_UNIT_TAB
            }
        },
        created(){
            
        },
        methods: {
            showAlert() {
                this.dialog = this.$createDialog({
                        type: 'prompt',
                        title: '添加朋友',
                        prompt: {
                        value: '',
                        placeholder: '请输入邮箱'
                    },
                    onConfirm: (e, value) => {
                        GetUserPanel({email:value}).then(data=>{
                            this.$router.push({
                                path:'/home/userInfo/'+data.user_id,
                                params:{
                                    userName:data.username
                                }
                            })
                        })
                    }
                }).show()
            }
        }
    }
</script>


<style>

</style>