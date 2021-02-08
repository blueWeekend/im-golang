<template>
    <div class="login-panel">
        <cube-input v-model="email" autofocus :maxlength="30">
            
            <template slot="prepend">
                邮箱:
            </template>
        </cube-input>
        <cube-input v-model="password" type="password" autofocus :maxlength="30">
            <template slot="prepend">
                密码:
            </template>
        </cube-input>
        <cube-button @click="loginByPwd">登录</cube-button>
    </div>
</template>

<script>
    import {loginByPwd} from '@/api/user'
    import {setToken} from '@/utils/global'
    import communicate from '@/utils/communicate'
    export default {
        data() {
            return {
                email: '',
                password: '',
               
               
            }
        },
        created(){

        },
        methods: {
            loginByCode(){
                
            },
            loginByPwd(){
                loginByPwd({email:this.email,password:this.password}).then(data=>{
                    setToken(data.access_token)
                    let path=this.$route.query.redirect || '/home/msgList'
                    this.$router.push(path)
                    communicate.$emit('onLogin',data)
                })
            }
        }
    }
</script>


<style lang="stylus">
    .login-panel{
        width: 80%;
        margin:160px auto;
        
    }
</style>