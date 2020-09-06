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
            login(){
                localStorage.userInfo=1
                let path=this.$route.query.redirect || '/home/msgList'
                this.$router.push(path)
            },
            loginByPwd(){
                //this.$router.push('/home')
                loginByPwd({email:this.email,password:this.password}).then(data=>{
                    localStorage.setItem("im:access_token",data.access_token)
                    this.$store.commit('setUserInfo',data.user_info)
                    let path=this.$route.query.redirect || '/home/msgList'
                    this.$router.push(path)
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